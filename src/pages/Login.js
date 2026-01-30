import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/api";

export default function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [busy, setBusy] = useState(false);
    async function handleSubmit(e) {
        e.preventDefault();
        setBusy(true);
        setError("");
        try {
            const res = await login({ username, password });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            localStorage.setItem("token", data.token);
            navigate("/cars/new");
        } catch (e2) {
            console.error(e2);
            setError("Login failed");
        } finally {
            setBusy(false);
        }
    }
    return (
        <main>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <p>Username:</p>
                <input value={username} onChange={(e) => setUsername(e.target.value)} />
                <p>Password:</p>
                <input value={password} onChange={(e) => setPassword(e.target.value)}
                    type="password" />
                {error ? <p style={{ color: "crimson" }}>{error}</p> : null}
                <button disabled={busy} type="submit">{busy ? "Logging in..." : "Login"}</button>
            </form>
        </main>
    );
}