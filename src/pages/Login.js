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
      const data = await res.json();

      console.log("Response status:", res.status);
      console.log("Response data:", data);

      if (!res.ok) {
        throw new Error(data.error || `HTTP ${res.status}`);
      }

      localStorage.setItem("token", data.token);
      navigate("/spaces");
    } catch (e2) {
      console.error("Login error:", e2);
      setError(e2.message || "Login failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <div className="page-header">
        <h2>Login</h2>
        <p>Sign in to manage study spaces</p>
      </div>

      <div className="form-page">
        <div className="container">
          <form onSubmit={handleSubmit} className="car-form">
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={busy}
                placeholder="Enter your username"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={busy}
                placeholder="Enter your password"
                required
              />
            </div>

            {error && (
              <div className="error-message" style={{ marginBottom: 'var(--space-md)' }}>
                {error}
              </div>
            )}

            <div className="form-actions">
              <button 
                type="submit" 
                disabled={busy} 
                className="btn btn-primary"
              >
                {busy ? "Logging in..." : "Login"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}