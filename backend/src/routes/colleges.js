import express from "express";
const router = express.Router();
import { list, create } from "../controllers/collegesController.js";

router.get("/", list);
router.post("/", create);

export default router;
