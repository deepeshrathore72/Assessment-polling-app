// Poll detail page. Subscribes to real-time updates and allows voting (auth required).
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:5000");

export default function PollPage() {
    const { id } = useParams();
    const [poll, setPoll] = useState(null);
    const [hasVoted, setHasVoted] = useState(false);

    // Fetch poll data and subscribe to real-time updates for this poll
    useEffect(() => {
        axios.get(`http://localhost:5000/api/polls/${id}`)
            .then(res => setPoll(res.data));

        socket.emit("joinPoll", id);

        socket.on("updatePoll", updatedPoll => {
            setPoll(updatedPoll);
        });

        return () => socket.off("updatePoll");
    }, [id]);

    // Cast a vote for a specific option using the JWT in headers
    const vote = (optionId) => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("Please login first");
            return;
        }
        axios.post(
            "http://localhost:5000/api/votes",
            { optionId },
            { headers: { Authorization: `Bearer ${token}` } }
        ).then(() => {
            setHasVoted(true);
        }).catch(err => {
            const status = err?.response?.status;
            if (status === 409) {
                // Backend enforces one vote per poll per user
                setHasVoted(true);
                alert("You have already voted in this poll.");
            } else {
                alert(err?.response?.data?.error || err.message);
            }
        });
    };

    if (!poll) return <div className="container-page">Loading...</div>;

    return (
        <div className="container-page">
            <div className="card p-6">
                <h2 className="text-2xl font-semibold mb-4">{poll.question}</h2>
                <div className="grid gap-3">
                    {poll.options.map(option => (
                        <button
                            key={option.id}
                            className={`btn-primary text-left ${hasVoted ? 'opacity-60 cursor-not-allowed' : ''}`}
                            onClick={() => !hasVoted && vote(option.id)}
                        >
                            <div className="flex justify-between">
                                <span>{option.text}</span>
                                <span className="opacity-90">{Array.isArray(option.votes) ? option.votes.length : (option._count ? option._count.votes : 0)}</span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}