import express from "express";
const router = express.Router();

// Health check
router.get("/health", (req, res) => res.json({ status: "ok" }));

import authRouter from "./auth.js";
import collegesRouter from "./colleges.js";
import usersRouter from "./users.js";

router.use("/auth", authRouter);
router.use("/colleges", collegesRouter);
router.use("/users", usersRouter);

export default router;
