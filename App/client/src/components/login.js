// login.js
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "../css/login.css";
import backgroundImage from "../assets/images/background.jpg";
import { AuthContext } from "../context/authContext";


const Login = () => {
  const { login } = useContext(AuthContext);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const togglePassword = () => setShowPassword(!showPassword);

  const validatePassword = (pwd) => {
    const regex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{15,}$/;
    return regex.test(pwd);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validatePassword(password)) {
      setError(
        "Password must be at least 15 characters long and include a number and a special character."
      );
      return;
    }

    setError("");
    try {
      await login({ identifier, password });
      alert("Logged in successfully!");
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      setError("Login failed");
    }
  };

  return (
    <div style = {{position:"relative", width:"100vw", height:"100vh"}}>
      <div
      style ={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 0,
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        opacity: 0.22,
        pointerEvents: "none",
      }}
      />
    <div className="login-container">
      <div className = "login-card shadow-lg rounded-3">
        <h2 className="text-center mb-4">Neptune Login</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        
        <form onSubmit={handleSubmit}>
            {/* Username or Email */}
            <div className="mb-2">
              <label className="form-label small-label">Username or Email</label>
              <input
                type="text"
                className="form-control"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Enter your username or email"
                required
              />
            </div>
            {/* Password */}
            <div className="mb-2">
              <label className="form-label small-label">Password</label>
              <div className="password-input-wrapper" style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  className={`form-control ${error ? "is-invalid" : ""}`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
                <span
                  className="password-toggle-icon"
                  onClick={togglePassword}
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    cursor: "pointer",
                    color: "#2e7d32",
                    fontSize: "1.1rem",
                  }}
                  title={showPassword ? "Hide Password" : "Show Password"}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              <div className="form-text small-text">
                Must be 15+ characters, include a number and special character.
              </div>
            </div>
            <button type="submit" className="btn btn-primary w-100 mt-2">
              Login
            </button>
          </form>
          <div className="text-center mt-3 small-text">
            <a href="/forgot" className="d-block mb-2">
              Forgot Password?
            </a>
            <span>
              Don’t have an account?{" "}
              <a href="/register" className="text-primary fw-bold">
                Register
              </a>
            </span>
          </div>
        </div>
      </div>
      </div>
  );
};

export default Login;

