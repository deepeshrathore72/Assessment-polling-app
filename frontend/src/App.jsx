// App router sets up routes and a simple navigation with login/logout.
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import PollPage from "./pages/PollPage";
import Home from "./pages/Home";
import Auth from "./pages/Auth";

function Nav() {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const logout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };
    return (
        <div className="mb-6">
            <div className="container-page">
                <div className="card p-4 flex items-center gap-4">
                    <Link to="/" className="text-xl font-bold tracking-wide">🗳️ Polling App</Link>
                    <div className="ml-auto flex gap-2">
                        {token ? (
                            <button onClick={logout} className="btn-secondary">Logout</button>
                        ) : (
                            <Link to="/auth" className="btn-primary">Login / Register</Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function App() {
    return (
        <Router>
            <Nav />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/poll/:id" element={<PollPage />} />
                <Route path="/auth" element={<Auth />} />
            </Routes>
        </Router>
    );
}

export default App;