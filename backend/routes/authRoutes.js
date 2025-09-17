// Auth routes for register, login, and current user info.
import express from "express";
import { register, login, me } from "../controllers/authController.js";
import { authMiddleware } from "../utils/jwt.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authMiddleware, me);

export default router;

