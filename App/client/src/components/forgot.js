import React, { useState } from "react";
import "../css/login.css";
import { useNavigate } from "react-router-dom";

export default function Forgot() {
  const [step, setStep] = useState(1);
  const [emailInput, setEmailInput] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [confirmPasswordInput, setConfirmPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [shake, setShake] = useState(false);

  const navigate = useNavigate();

  const validatePassword = (pwd) => {
    const regex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{15,}$/;
    return regex.test(pwd);
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (!emailInput || !/\S+@\S+\.\S+/.test(emailInput)) {
      setEmailError("Please enter a valid email address.");
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }
    setEmailError("");
    setStep(2);
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPasswordInput(value);
    if (!validatePassword(value)) {
      setPasswordError(
        "Password must be at least 15 characters long and include a number and a special character."
      );
    } else {
      setPasswordError("");
    }
    if (value !== confirmPasswordInput) {
      setConfirmPasswordError("Passwords do not match.");
    } else {
      setConfirmPasswordError("");
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPasswordInput(value);
    if (value !== passwordInput) {
      setConfirmPasswordError("Passwords do not match.");
    } else {
      setConfirmPasswordError("");
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    if (
      passwordError ||
      confirmPasswordError ||
      !passwordInput ||
      !confirmPasswordInput
    ) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setMessage("Please fill out all fields correctly.");
      setIsSuccess(false);
      return;
    }
    // TODO: Implement actual API call for password reset
    setIsSuccess(true);
    setMessage("Password reset successfully! Back to login to use your new password.");
    setPasswordInput("");
    setConfirmPasswordInput("");
  };

  return (
    <div className="login-container">
      <div className={`login-card forgot-card${shake ? " animate-shake" : ""}`}>
        <h2>Forgot Password</h2>
        {step === 1 && (
          <form onSubmit={handleEmailSubmit} className="form-grid">
            <div className="col-full">
              <label className="small-label mb-2">Enter your email</label>
              <input
                type="email"
                className="form-control mb-2"
                placeholder="Email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
              />
              {emailError && <p className="error-text">{emailError}</p>}
            </div>
            <div className="col-full d-flex justify-center mt-3">
              <button type="submit" className="btn-primary w-100">
                Next
              </button>
            </div>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleResetSubmit} className="form-grid">
            <div className="col-full">
              <label className="small-label mb-2">New Password</label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control"
                  value={passwordInput}
                  onChange={handlePasswordChange}
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              {passwordError && <p className="error-text">{passwordError}</p>}

              <label className="small-label mb-2">Confirm New Password</label>
              <div className="password-wrapper">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className="form-control"
                  value={confirmPasswordInput}
                  onChange={handleConfirmPasswordChange}
                  placeholder="Retype new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>
              </div>
              {confirmPasswordError && (
                <p className="error-text">{confirmPasswordError}</p>
              )}
            </div>
            <div className="col-full d-flex justify-center mt-3">
              <button
                type="submit"
                className="btn-primary w-100"
                disabled={
                  !passwordInput ||
                  !confirmPasswordInput ||
                  !!passwordError ||
                  !!confirmPasswordError
                }
              >
                Reset Password
              </button>
            </div>
            {message && (
              <div
                className="alert text-center mt-3"
                style={{
                  color: isSuccess ? "#2e7d32" : "#c62828",
                }}
              >
                {message}
              </div>
            )}
          </form>
        )}

        <div className="text-center mt-3 small-text">
          <a
            href="/"
            className="text-primary fw-bold"
            onClick={(e) => {
              e.preventDefault();
              navigate("/");
            }}
          >
            Back to Login
          </a>
        </div>
      </div>
    </div>
  );
}
