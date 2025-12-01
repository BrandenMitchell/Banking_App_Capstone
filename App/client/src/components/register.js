import React, { useState, useContext } from "react";
import { AuthContext } from "../context/authContext";
import "../css/login.css";
import { useNavigate } from "react-router-dom"; // for redirect

export default function Register() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [emailInput, setEmailInput] = useState("");
  const [usernameInput, setUsernameInput] = useState("");
  const [fullNameInput, setFullNameInput] = useState("");
  const [phoneNumberInput, setPhoneNumberInput] = useState("");
  const [streetInput, setStreetInput] = useState("");
  const [cityInput, setCityInput] = useState("");
  const [stateInput, setStateInput] = useState("");
  const [zipInput, setZipInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [rePasswordInput, setRePasswordInput] = useState("");

  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [shake, setShake] = useState(false);

  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const validatePassword = (pwd) => {
    const regex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{15,}$/;
    return regex.test(pwd);
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

    if (value !== rePasswordInput) {
      setConfirmPasswordError("Passwords do not match.");
    } else {
      setConfirmPasswordError("");
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setRePasswordInput(value);

    if (value !== passwordInput) {
      setConfirmPasswordError("Passwords do not match.");
    } else {
      setConfirmPasswordError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      passwordError ||
      confirmPasswordError ||
      !passwordInput ||
      !rePasswordInput ||
      !emailInput ||
      !usernameInput ||
      !fullNameInput ||
      !phoneNumberInput ||
      !streetInput ||
      !cityInput ||
      !stateInput ||
      !zipInput
    ) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setMessage("Please fill out all fields correctly.");
      setIsSuccess(false);
      return;
    }

    const formData = {
      fullName: fullNameInput,
      username: usernameInput,
      email: emailInput,
      password: passwordInput,
      phoneNumber: phoneNumberInput,
      street: streetInput,
      city: cityInput,
      state: stateInput,
      zip: zipInput,
    };

    try {
      const res = await fetch("http://localhost:3001/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      console.log("Registration response:", data);

      if (!res.ok) {
        setMessage(data.message || "Registration failed");
        setIsSuccess(false);
        return;
      }

      setIsSuccess(true);
      setMessage("Registration successful! Logging you in...");

      try {
        await login({
          identifier: usernameInput || emailInput,
          password: passwordInput,
        });

        // redirect to dashboard
        navigate("/dashboard");

        // clear form fields
        setEmailInput("");
        setUsernameInput("");
        setFullNameInput("");
        setPhoneNumberInput("");
        setStreetInput("");
        setCityInput("");
        setStateInput("");
        setZipInput("");
        setPasswordInput("");
        setRePasswordInput("");
      } catch (err) {
        console.error("Auto-login failed:", err.message);
        setMessage(
          "Registration succeeded, but login failed. Please login manually."
        );
        setIsSuccess(false);
      }
    } catch (err) {
      console.error("Registration error:", err);
      setMessage("Network error or server unavailable");
      setIsSuccess(false);
    }
  };

  const isFormValid =
    !passwordError &&
    !confirmPasswordError &&
    passwordInput &&
    rePasswordInput &&
    emailInput &&
    usernameInput &&
    fullNameInput &&
    phoneNumberInput &&
    streetInput &&
    cityInput &&
    stateInput &&
    zipInput;

  return (
    <div className="login-container">
      <div className={`login-card register-card ${shake ? "animate-shake" : ""}`}>
        <h2>Commerce Bank Register</h2>

        <form onSubmit={handleSubmit} className="form-grid">

          {/* LEFT COLUMN */}
          <div className="col">
            <label className="small-label mb-2">Full Name</label>
            <input type="text" className="form-control mb-2" value={fullNameInput} onChange={(e) => setFullNameInput(e.target.value)} placeholder="Full name" />

            <label className="small-label mb-2">Username</label>
            <input type="text" className="form-control mb-2" value={usernameInput} onChange={(e) => setUsernameInput(e.target.value)} placeholder="Username" />

            <label className="small-label mb-2">Email</label>
            <input type="email" className="form-control mb-2" value={emailInput} onChange={(e) => setEmailInput(e.target.value)} placeholder="Email" />

            <label className="small-label mb-2">Phone Number</label>
            <input type="text" className="form-control mb-2" value={phoneNumberInput} onChange={(e) => setPhoneNumberInput(e.target.value)} placeholder="(123) 456-7890" />
          </div>

          {/* RIGHT COLUMN */}
          <div className="col">
            <label className="small-label mb-2">Street</label>
            <input type="text" className="form-control mb-2" value={streetInput} onChange={(e) => setStreetInput(e.target.value)} placeholder="123 Main St" />

            <label className="small-label mb-2">City</label>
            <input type="text" className="form-control mb-2" value={cityInput} onChange={(e) => setCityInput(e.target.value)} placeholder="City" />

            <label className="small-label mb-2">State</label>
            <input type="text" className="form-control mb-2" value={stateInput} onChange={(e) => setStateInput(e.target.value)} placeholder="State" />

            <label className="small-label mb-2">ZIP Code</label>
            <input type="text" className="form-control mb-2" value={zipInput} onChange={(e) => setZipInput(e.target.value)} placeholder="ZIP" />
          </div>

          {/* FULL WIDTH PASSWORD SECTION */}
          <div className="col-full">
            <label className="small-label mb-2">Password</label>
            <div className="password-wrapper">
              <input type={showPassword ? "text" : "password"} className="form-control" value={passwordInput} onChange={handlePasswordChange} placeholder="Enter password" />
              <button type="button" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            {passwordError && <p className="error-text">{passwordError}</p>}

            <label className="small-label mb-2">Retype Password</label>
            <div className="password-wrapper">
              <input type={showConfirmPassword ? "text" : "password"} className="form-control" value={rePasswordInput} onChange={handleConfirmPasswordChange} placeholder="Retype password" />
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                {showConfirmPassword ? "Hide" : "Show"}
              </button>
            </div>

            {confirmPasswordError && <p className="error-text">{confirmPasswordError}</p>}
          </div>

          <div className="col-full d-flex justify-center mt-3">
            <button
              type="submit"
              className="btn-primary w-100 mt-3"
              disabled={!isFormValid}
            >
              Register
            </button>
          </div>


          {message && (
            <div className="alert text-center mt-3" style={{ 
              color: isSuccess ? "#2a9d8f" : "#ff6b6b",
              backgroundColor: isSuccess ? "rgba(42, 157, 143, 0.2)" : "rgba(255, 107, 107, 0.2)",
              border: `1px solid ${isSuccess ? "rgba(42, 157, 143, 0.5)" : "rgba(255, 107, 107, 0.5)"}`,
              fontWeight: "500"
            }}>
              {message}
            </div>
          )}
        </form>

        <div className="text-center mt-3 small-text">
          <span>
            Have an account?{" "}
            <a href="/" className="text-primary fw-bold">
              Back to Login
            </a>
          </span>
        </div>
      </div>
    </div>
  );
}
