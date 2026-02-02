import express from "express";
import { getSessionById, getSessions, getUserSessions, recordSession } from "../controllers/session.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * @swagger
 * /session:
 *   get:
 *     summary: Get all sessions for the authenticated user
 *     tags: [Sessions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of sessions retrieved successfully
 *       401:
 *         description: Not authorized
 */
router.get("/", protect, getSessions);

/**
 * @swagger
 * /session/user/{userId}:
 *   get:
 *     summary: Get all sessions for a user
 *     tags: [Sessions]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     responses:
 *       200:
 *         description: Sessions retrieved successfully
 *       500:
 *         description: Server error
 */
router.get("/user/:userId", getUserSessions);

/**
 * @swagger
 * /session/{sessionId}:
 *   get:
 *     summary: Get session by ID
 *     tags: [Sessions]
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: string
 *         description: The session ID
 *     responses:
 *       200:
 *         description: Session data retrieved successfully
 *       404:
 *         description: Session not found
 */
router.get("/:sessionId", getSessionById);

/**
 * @swagger
 * /session/record/{userId}:
 *   post:
 *     summary: Record session events
 *     tags: [Sessions]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The project owner ID
 *       - in: query
 *         name: fp
 *         required: true
 *         schema:
 *           type: string
 *         description: The visitor fingerprint
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - metadata
 *               - events
 *             properties:
 *               metadata:
 *                 type: object
 *                 properties:
 *                   sessionId:
 *                     type: string
 *               events:
 *                 type: array
 *                 items:
 *                   type: object
 *     responses:
 *       200:
 *         description: Session recorded successfully
 *       400:
 *         description: Invalid request
 */
router.post("/record/:userId", recordSession);

export default router;
