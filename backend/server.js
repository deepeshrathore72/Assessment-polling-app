// Entry point for the backend server. Sets up Express, Socket.IO, routes, and DB connection.
// Load .env as a side-effect before importing modules that rely on environment
// variables (Prisma client is created at module import time in utils/db.js).
import 'dotenv/config';
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { connectDB } from "./utils/db.js";
import pollRoutes from "./routes/pollRoutes.js";
import voteRoutes from "./routes/voteRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { setIo } from "./utils/socket.js";
import cors from "cors";


const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: { origin: "*" }
});
// Make the Socket.IO instance available to other modules (e.g., controllers)
setIo(io);

connectDB();

app.use(cors());
app.use(express.json());
// REST API routes
app.use("/api/auth", authRoutes);
app.use("/api/polls", pollRoutes);
app.use("/api/votes", voteRoutes);

// Socket.IO lifecycle events
io.on("connection", (socket) => {
    console.log("New client connected");

    socket.on("joinPoll", (pollId) => {
        // Join a room specific to a poll so we can broadcast updates only to viewers of that poll
        socket.join(pollId);
    });

    socket.on("voteCast", ({ pollId, updatedPoll }) => {
        // Fallback emitter if a client wants to optimistically broadcast; controllers also emit authoritative updates
        io.to(String(pollId)).emit("updatePoll", updatedPoll);
    });

    socket.on("disconnect", () => {
        console.log("Client disconnected");
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));