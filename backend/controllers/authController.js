// Authentication controller: register, login, and return current user.
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../utils/db.js";

const signToken = (user) => {
    return jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) return res.status(409).json({ error: "Email already in use" });
        const passwordHash = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({ data: { name, email, passwordHash } });
        const token = signToken(user);
        res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return res.status(401).json({ error: "Invalid credentials" });
        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) return res.status(401).json({ error: "Invalid credentials" });
        const token = signToken(user);
        res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const me = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({ where: { id: req.user.userId }, select: { id: true, name: true, email: true } });
        res.json({ user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

