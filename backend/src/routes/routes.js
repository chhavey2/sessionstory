import express from "express";
import authRoutes from "./auth.routes.js";
import sessionRoutes from "./session.routes.js";
import { decodeZon, encodeZon } from "../services/zon.service.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/session", sessionRoutes);
router.get("/zon", (req, res) => {

    const text = encodeZon({ name: "John", age: 30 });
    const json = decodeZon(text);
    res.send(json);

});

export default router;