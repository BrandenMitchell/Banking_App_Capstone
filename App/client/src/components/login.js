// login.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "../css/login.css";

const Login = () => {
  const [identifier, setIdentifier] = useState(""); // username or email
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
    console.log("Login submitted:", { identifier, password });

    try {
      // Temporary fake login using localStorage
      const existingUser = JSON.parse(localStorage.getItem("user"));
      if(!existingUser){
        localStorage.setItem(
          "user",
          JSON.stringify({ fullName: "", email: identifier, phone: "" })
        );
      }
      
      localStorage.setItem("isLoggedIn", "true");
      navigate("/dashboard");

      // FUTURE: Replace with backend login API
      /*
      const response = await fetch('http://localhost:3001/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("user", JSON.stringify({ fullName: identifier, email: identifier }));
        localStorage.setItem("isLoggedIn", "true");
        navigate("/dashboard");
      } else {
        setError(data.message || "Login failed");
      }
      */
    } catch (err) {
      console.error("Login error:", err);
      setError("Login failed");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card shadow-lg rounded-3">
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

          {/* Submit button */}
          <button type="submit" className="btn btn-primary w-100 mt-2">
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
            <a href="/register" className="text-primary fw-bold">
              Register
            </a>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;
