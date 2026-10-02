import { useState } from "react";

function AdminLogin({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
  "https://accounts-finance.vercel.app/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            username,
            password
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Login failed"
        );
      }

      localStorage.setItem(
        "adminToken",
        data.token
      );

      onLogin();

    } catch (error) {
      setError(
        error.message || "Unable to login"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">

      <div className="admin-login-card">

        <img
        src="./images/logo.png"
        alt="Abhishek Gore & Associates"
        className="header-logo"
      />

        <div className="admin-login-label">
          ADMINISTRATION
        </div>

        <h1>
          Admin Login
        </h1>

        <p className="admin-login-description">
          Sign in to manage customer enquiries.
        </p>

        {error && (
          <div className="admin-login-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <div className="admin-login-group">
            <label>
              Username
            </label>

            <input
              type="text"
              value={username}
              onChange={(e) =>
                setUsername(e.target.value)
              }
              placeholder="Enter username"
              required
            />
          </div>

          <div className="admin-login-group">
            <label>
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              placeholder="Enter password"
              required
            />
          </div>

          <button
            type="submit"
            className="admin-login-button"
            disabled={loading}
          >
            {loading
              ? "Signing in..."
              : "Sign In →"}
          </button>

        </form>

        <a
          href="/"
          className="back-to-website"
        >
          ← Back to website
        </a>

      </div>

    </div>
  );
}

export default AdminLogin;