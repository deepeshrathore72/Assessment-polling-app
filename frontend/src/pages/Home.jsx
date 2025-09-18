// Home page lists polls and provides a form to create a new poll (auth required).
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Home() {
    const [polls, setPolls] = useState([]);
    const [question, setQuestion] = useState("");
    const [options, setOptions] = useState(["", ""]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchPolls();
    }, []);

    // Load existing polls from the API
    const fetchPolls = () => {
        axios.get("https://assessment-polling-app.onrender.com/api/polls")
            .then(res => setPolls(res.data));
    };

    // Controlled inputs for poll options
    const handleOptionChange = (index, value) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    const addOption = () => {
        setOptions([...options, ""]);
    };

    // Submit creates a new poll via the API with the JWT in headers
    const handleSubmit = (e) => {
        e.preventDefault();
        const filteredOptions = options.filter(opt => opt.trim() !== "");
        const token = localStorage.getItem("token");
        if (!token) {
            alert("Please login first");
            return;
        }
        axios.post(
            "https://assessment-polling-app.onrender.com/api/polls",
            {
                question,
                options: filteredOptions
            },
            { headers: { Authorization: `Bearer ${token}` } }
        ).then(res => {
            navigate(`/poll/${res.data.id}`);
        });
    };

    return (
        <div className="container-page">
            <div className="grid md:grid-cols-2 gap-6">
                <div className="card p-5">
                    <h2 className="text-xl font-semibold mb-3">Create a Poll</h2>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            placeholder="Question"
                            value={question}
                            onChange={e => setQuestion(e.target.value)}
                            className="input w-full mb-3"
                            required
                        />
                        {options.map((opt, idx) => (
                            <input
                                key={idx}
                                type="text"
                                placeholder={`Option ${idx + 1}`}
                                value={opt}
                                onChange={e => handleOptionChange(idx, e.target.value)}
                                className="input w-full mb-3"
                                required
                            />
                        ))}
                        <div className="flex gap-2 mb-2">
                            <button type="button" onClick={addOption} className="btn-secondary">Add Option</button>
                            <button type="submit" className="btn-primary">Create Poll</button>
                        </div>
                    </form>
                </div>

                <div className="card p-5">
                    <h2 className="text-xl font-semibold mb-3">Existing Polls</h2>
                    {polls.length === 0 ? (
                        <p className="text-sm text-slate-300">No polls available.</p>
                    ) : (
                        <ul className="space-y-2">
                            {polls.map(poll => (
                                <li key={poll.id}>
                                    <Link to={`/poll/${poll.id}`} className="card p-3 flex items-center justify-between hover:opacity-90">
                                        <span>{poll.question}</span>
                                        <span className="text-slate-300">View →</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}
