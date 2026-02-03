import { getSession, hitSession, getSessionsByUser, getSessionsByUser2 } from "../services/session.service.js";

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

// @desc    Record session events
// @route   POST /api/sessions/record/:fp
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

    const session = await hitSession(metadata.sessionId, fp, userId, events, ip, metadata.url);

    if (!session) {
      return res.status(500).json({ message: "Error recording session" });
    }

    return res.status(200).json(session);
  } catch (error) {
    console.error("Error in recordSession:", error);
    return res.status(500).json({ message: "Error recording session" });
  }
};
