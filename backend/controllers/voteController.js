// Vote controller: cast a vote and broadcast updated poll to connected clients.
import { prisma } from "../utils/db.js";
import { getIo } from "../utils/socket.js";

export const castVote = async (req, res) => {
    try {
        const { optionId: optionIdRaw } = req.body;
        const optionId = parseInt(optionIdRaw, 10);
        if (!Number.isInteger(optionId)) return res.status(400).json({ error: "Invalid optionId" });
        const userId = req.user.userId;
        const option = await prisma.pollOption.findUnique({ where: { id: optionId }, include: { poll: true } });
        if (!option) return res.status(404).json({ error: "Option not found" });

        // Enforce single-vote-per-poll per user
        const existing = await prisma.vote.findFirst({
            where: { userId, option: { pollId: option.pollId } },
            include: { option: true }
        });
        if (existing) return res.status(409).json({ error: "User already voted in this poll" });

        const vote = await prisma.vote.create({ data: { userId, optionId } });

        // Return updated poll with counts
        const poll = await prisma.poll.findUnique({
            where: { id: option.pollId },
            include: { options: { include: { _count: { select: { votes: true } } } } }
        });
        const io = getIo();
        if (io) {
            io.to(String(option.pollId)).emit("updatePoll", poll);
        }
        res.status(201).json({ voteId: vote.id, poll });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

