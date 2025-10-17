// login.js
import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import "../css/login.css"; 

const Login = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const validatePassword = (pwd) => {
    const regex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{15,}$/;
    return regex.test(pwd);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validatePassword(password)) {
      setError("Password must be at least 15 characters long and include a number and a special character.");
      return;
    }
    setError("");
    console.log("Login submitted:", { email, username, password });
    try  {
      const response = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          email,
          password
        }),
      });
      const data = await response.json();
      console.log('Server Response: ', data);
      if (response.ok) {
        navigate('/home');
      } else {
        setError(data?.error || 'Invalid credentials');
      }
    } catch(err) {
      console.error("Error during login", err);
      setError('Network error or server unavailable');
    }

  };

  return (
      <div className="login-card shadow-lg rounded-3">
        <h2 className="text-center mb-4">Log in</h2>

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
              required
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
              required
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

          {/* Submit button */}
          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>
        </form>

        {/* Links */}
        <div className="text-center mt-3 small-text">
          <a href="/forgot-password" className="d-block mb-2">
            Forgot Password?
          </a>
          <span>
            Don’t have an account?{" "}
            <Link to="/register" className="text-primary fw-bold">
              Register
            </Link>
          </span>
        </div>
      </div>
  );
};

export default Login;
