import { getSession, getSessionsByUser, getSessionsByUser2, getHeatmapPoints } from "../services/session.service.js";
import { addSessionJob } from "../services/queue.service.js";

// @desc    Get all sessions for a user
// @route   GET /api/session
// @access  Private
export const getSessions = async (req, res) => {
  try {
    const sessions = await getSessionsByUser2(req.user._id);
    return res.status(200).json(sessions);
  } catch (error) {
    console.error("Error in getSessions:", error);
    return res.status(500).json({ message: "Error getting sessions" });
  }
};


// @desc    Get all sessions for a user
// @route   GET /api/sessions/user/:userId
// @access  Private
export const getUserSessions = async (req, res) => {
  try {
    const { userId } = req.params;
    const sessions = await getSessionsByUser2(userId);
    return res.status(200).json(sessions);
  } catch (error) {
    console.error("Error in getUserSessions:", error);
    return res.status(500).json({ message: "Error getting user sessions" });
  }
};

// @desc    Get session by ID
// @route   GET /api/sessions/:sessionId
// @access  Public (or Private depending on requirements)
export const getSessionById = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = await getSession(sessionId);
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }
    return res.status(200).json(session);
  } catch (error) {
    console.error("Error in getSessionById:", error);
    return res.status(500).json({ message: "Error getting session" });
  }
};

// @desc    Record session events (Queued)
// @route   POST /api/sessions/record/:userId
// @access  Public
export const recordSession = async (req, res) => {
  try {
    const { userId } = req.params;
    const { fp } = req.query;
    const ip = req.clientIp || req.ip || "127.0.0.1";
    const { metadata, events } = req.body;

    if (!metadata?.sessionId || !userId || !events || !fp) {
      return res.status(400).json({ message: "Invalid request" });
    }

    // Push the heavy database/compression work to the background queue
    await addSessionJob({
      sessionId: metadata.sessionId,
      fp,
      userId,
      events,
      ip,
      url: metadata.url
    });

    // Respond immediately to the client
    return res.status(202).json({ 
      message: "Session recording queued",
      sessionId: metadata.sessionId
    });
  } catch (error) {
    console.error("Error in recordSession:", error);
    return res.status(500).json({ message: "Error queueing session" });
  }
};

// @desc    Get heatmap data points
// @route   GET /api/session/heatmap
// @access  Private
export const getHeatmapData = async (req, res) => {
  try {
    const userId = req.user._id;
    const { url } = req.query;

    const points = await getHeatmapPoints(userId, url);
    return res.status(200).json(points);
  } catch (error) {
    console.error("Error in getHeatmapData:", error);
    return res.status(500).json({ message: "Error getting heatmap data" });
  }
};
