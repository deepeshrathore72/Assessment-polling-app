import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Auth() {
    const [mode, setMode] = useState("login");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const toggleMode = () => {
        setMode(prev => prev === "login" ? "register" : "login");
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setError("");
            if (mode === "register") {
                await axios.post("http://localhost:5000/api/auth/register", { name, email, password });
            }
            const res = await axios.post("http://localhost:5000/api/auth/login", { email, password });
            localStorage.setItem("token", res.data.token);
            navigate("/");
        } catch (err) {
            const msg = err?.response?.data?.error || err.message;
            setError(msg);
        }
    };

    return (
        <div className="container-page">
            <div className="card p-6 max-w-md mx-auto">
                <h1 className="text-2xl font-bold mb-4">{mode === "login" ? "Login" : "Register"}</h1>
                <form onSubmit={handleSubmit}>
                    {mode === "register" && (
                        <input
                            type="text"
                            placeholder="Name"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            className="input w-full mb-2"
                            required
                        />
                    )}
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="input w-full mb-2"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="input w-full mb-4"
                        required
                    />
                    {error && <div className="text-red-400 mb-2">{error}</div>}
                    <div className="flex gap-2">
                        <button type="submit" className="btn-primary">
                            {mode === "login" ? "Login" : "Register"}
                        </button>
                        <button type="button" onClick={toggleMode} className="btn-secondary">
                            {mode === "login" ? "Need an account? Register" : "Have an account? Login"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
