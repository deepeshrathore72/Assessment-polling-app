// Vote route exposes a protected endpoint to cast a vote.
import express from "express";
import { authMiddleware } from "../utils/jwt.js";
import { castVote } from "../controllers/voteController.js";

const router = express.Router();

router.post("/", authMiddleware, castVote);

export default router;