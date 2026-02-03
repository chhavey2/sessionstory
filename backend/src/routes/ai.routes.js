import express from "express";
import { createEventsPrompt, runAi } from "../services/ai.service.js";
import { getSession } from "../services/session.service.js";
import { LingoDotDevEngine } from "lingo.dev/sdk";

const router = express.Router();

// Lazy initialization of Lingo.dev to ensure env vars are loaded
let lingoDotDev = null;

function getLingoDotDev() {
  if (!lingoDotDev) {
    const apiKey = process.env.LINGODOTDEV_API_KEY || "";
    console.log("[Lingo.dev] Initializing with API key:", apiKey ? `Yes (length: ${apiKey.length})` : "No");
    lingoDotDev = new LingoDotDevEngine({ apiKey });
  }
  return lingoDotDev;
}

/**
 * @swagger
 * /ai/summary/{sessionId}:
 *   get:
 *     summary: Get AI-generated summary of a session
 *     tags: [AI]
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: string
 *         description: The session ID
 *     responses:
 *       200:
 *         description: AI summary generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 reply:
 *                   type: string
 *       500:
 *         description: AI service error
 */
router.get("/summary/:sessionId", async (req, res) => {
  try {
    const sessionId = req.params.sessionId;
    const session = await getSession(sessionId);
    const prompt = createEventsPrompt(session.events);
    const reply = await runAi(prompt);
    res.json({ reply });
  } catch (err) {
    console.error("Bedrock error:", err);
    res.status(500).json({ error: "Bedrock call failed" });
  }
});

/**
 * @swagger
 * /ai/translate:
 *   post:
 *     summary: Translate text using Lingo.dev
 *     tags: [AI]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - text
 *               - targetLocale
 *             properties:
 *               text:
 *                 type: string
 *                 description: Text to translate
 *               sourceLocale:
 *                 type: string
 *                 default: en
 *                 description: Source language code
 *               targetLocale:
 *                 type: string
 *                 description: Target language code
 *     responses:
 *       200:
 *         description: Translation successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 translated:
 *                   type: string
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Translation service error
 */
router.post("/translate", async (req, res) => {
  try {
    const { text, sourceLocale = "en", targetLocale } = req.body;

    if (!text || !targetLocale) {
      return res.status(400).json({ error: "Missing text or targetLocale" });
    }

    // If source and target are the same, return original text
    if (sourceLocale === targetLocale) {
      return res.json({ translated: text });
    }

    console.log(`[Translate] Translating from ${sourceLocale} to ${targetLocale}: "${text.substring(0, 50)}..."`);
    
    const engine = getLingoDotDev();
    const translated = await engine.localizeText(text, {
      sourceLocale,
      targetLocale,
    });

    console.log(`[Translate] Success: "${translated.substring(0, 50)}..."`);
    res.json({ translated });
  } catch (err) {
    console.error("Translation error:", err.message || err);
    res.status(500).json({ error: "Translation failed", details: err.message });
  }
});

export default router;
