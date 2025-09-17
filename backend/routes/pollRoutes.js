// Poll routes map HTTP endpoints to controller functions. Create is protected by JWT.
import express from "express";
import { authMiddleware } from "../utils/jwt.js";
import { listPolls, createPoll, getPoll } from "../controllers/pollController.js";

const router = express.Router();

router.get("/", listPolls);
router.post("/", authMiddleware, createPoll);
router.get("/:id", getPoll);

export default router;