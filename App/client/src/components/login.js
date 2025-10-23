import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import '../css/login.css'

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const validatePassword = (pwd) => /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{15,}$/.test(pwd);
  const validateEmail = (mail) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Must fill either email or username
    if (!email && !username) {
      setError("Please enter either your email or username.");
      return;
    }

    // Validate email if filled
    if (email && !validateEmail(email)) {
      setError("Invalid email format.");
      return;
    }

    if (!validatePassword(password)) {
      setError("Password must be at least 15 characters long and include a number and a special character.");
      return;
    }

    setError("");

    try {
      await login({ username, email, password }); // context handles which one is filled
      alert("Logged in successfully!");
      navigate("/dashboard"); // redirect to dashboard
    } catch (err) {
      console.error(err);
      setError(err.message || "Login failed");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card shadow-lg rounded-3">
        <h2 className="text-center mb-4">Commerce Bank Login</h2>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div className="mb-3">
            <label className="form-label small-label">Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>

          {/* Username */}
          <div className="mb-3">
            <label className="form-label small-label">Username</label>
            <input
              type="text"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
            />
          </div>

          {/* Password */}
          <div className="mb-3">
            <label className="form-label small-label">Password</label>
            <input
              type="password"
              className={`form-control ${error ? "is-invalid" : ""}`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div className="form-text small-text">
              Must be 15+ characters, include a number and special character.
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-100">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
