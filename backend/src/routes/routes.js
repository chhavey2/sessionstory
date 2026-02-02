import express from "express";
import authRoutes from "./auth.routes.js";
import sessionRoutes from "./session.routes.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/session", sessionRoutes);

export default router;