import Session from "../models/Session.js";
import Visitor from "../models/Visitor.js";
import { getVisitorDetails } from "./ipApi.service.js";
import mongoose from "mongoose";

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

    if (session) {
      // Append events if session exists
      session.events.push(...events);
      await session.save();
      return session;
    } else {
      // Create new session if it doesn't exist
      const newSession = await Session.create({
        sessionId,
        visitor: visitorObj._id,
        user: userId,
        url,
        events,
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
    return session;
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
          $expr: { $gt: [{ $size: "$events" }, 5] }
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
          eventsLength: { $size: "$events" },
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
