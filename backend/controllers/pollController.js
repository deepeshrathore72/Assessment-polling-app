// Poll controller: list, create, and fetch a single poll with options.
import { prisma } from "../utils/db.js";

export const listPolls = async (req, res) => {
    try {
        const polls = await prisma.poll.findMany({
            include: { options: { include: { _count: { select: { votes: true } } } }, createdBy: true }
        });
        res.json(polls);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const createPoll = async (req, res) => {
    try {
        const { question, options } = req.body;
        const userId = req.user.userId;
        if (!question || !Array.isArray(options) || options.length < 2) {
            return res.status(400).json({ error: "Question and at least two options are required" });
        }
        const poll = await prisma.poll.create({
            data: {
                question,
                isPublished: true,
                createdById: userId,
                options: { create: options.map(text => ({ text })) }
            },
            include: { options: true }
        });
        res.status(201).json(poll);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getPoll = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (!Number.isInteger(id)) return res.status(400).json({ error: "Invalid poll id" });
        const poll = await prisma.poll.findUnique({
            where: { id },
            include: { options: { include: { votes: true } } }
        });
        if (!poll) return res.status(404).json({ error: "Poll not found" });
        res.json(poll);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

