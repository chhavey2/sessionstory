import Session from "../models/Session.js";
import Visitor from "../models/Visitor.js";
import { getVisitorDetails } from "./ipApi.service.js";
import mongoose from "mongoose";
import { decodeZon } from "./zon.service.js";
import { compress, decompress } from "./compression.service.js";

export async function hitSession(sessionId, fp, userId, events, ip, url) {
  try {
    let visitorObj = await Visitor.findOne({ fp });

    if (!visitorObj) {
      const details = await getVisitorDetails(ip);
      visitorObj = await Visitor.create({
        fp,
        ip,
        ...details,
      });
    }

    const session = await Session.findOne({ sessionId });
    const compressedBatch = await compress(events);

    if (session) {
      // Append events if session exists
      session.events.push(compressedBatch);
      session.eventCount = (session.eventCount || 0) + events.length;
      await session.save();
      return session;
    } else {
      // Create new session if it doesn't exist
      const newSession = await Session.create({
        sessionId,
        visitor: visitorObj._id,
        user: userId,
        url,
        events: [compressedBatch],
        eventCount: events.length,
      });
      return newSession;
    }
  } catch (error) {
    console.error("Error in hitSession:", error);
    throw error;
  }
}

export async function getSession(sessionId) {
  try {
    const session = await Session.findOne({ sessionId }).populate("visitor");

    if (!session) return null;

    const decodedEvents = [];
    
    for (const item of session.events) {
      if (Buffer.isBuffer(item) || (item && item.buffer)) {
        // Gzip compressed batch
        const batch = await decompress(item);
        if (Array.isArray(batch)) decodedEvents.push(...batch);
      } else if (typeof item === "string") {
        // Old Zon format
        try {
          const decoded = decodeZon(item);
          if (decoded) decodedEvents.push(decoded);
        } catch (e) {
          console.error("Failed to decode Zon event:", e);
        }
      } else if (typeof item === "object" && item !== null) {
        // Raw JSON object (short period where we stored raw)
        decodedEvents.push(item);
      }
    }

    // Create a new object to avoid mutating the Mongoose document
    const sessionObj = session.toObject();
    sessionObj.events = decodedEvents;

    return sessionObj;

  } catch (error) {
    console.error("Error in getSession:", error);
    throw error;
  }
}

export async function getSessionsByUser(userId) {
  try {
    const sessions = await Session.find({ user: userId })
      .populate("visitor")
      .select("-events") // Exclude events for list view (too large)
      .sort({ createdAt: -1 });
    return sessions;
  } catch (error) {
    console.error("Error in getSessionsByUser:", error);
    throw error;
  }
}

export async function getSessionsByUser2(userId) {
  try {
    const aggregatedSessions = await Session.aggregate([
      { 
        $match: { 
          user: new mongoose.Types.ObjectId(userId),
          $expr: { 
            $gt: [{ $ifNull: ["$eventCount", { $size: "$events" }] }, 5] 
          }
        } 
      },
      { $sort: { createdAt: -1 } },
      {
        $lookup: {
          from: "visitors",
          localField: "visitor",
          foreignField: "_id",
          as: "visitor",
        },
      },
      { $unwind: "$visitor" },
      {
        $project: {
          sessionId: 1,
          url: 1,
          createdAt: 1,
          updatedAt: 1,
          eventsLength: { $ifNull: ["$eventCount", { $size: "$events" }] },
          visitor: {
            _id: "$visitor._id",
            fp: "$visitor.fp",
            country: "$visitor.country",
            city: "$visitor.city",
          },
        },
      },
    ]);

    return aggregatedSessions;
  } catch (error) {
    console.error("Error in getSessionsByUser:", error);
    throw error;
  }
}
