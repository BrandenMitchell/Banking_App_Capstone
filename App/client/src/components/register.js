import React, { useState, useContext } from "react";
import { AuthContext } from "../context/authContext";

export default function Register() {
  const { login } = useContext(AuthContext); // auto-login after registration

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

    // Basic validation
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

      if (!res.ok) {
        setMessage(data.message || "Registration failed");
        setIsSuccess(false);
        return;
      }

      setIsSuccess(true);
      setMessage("Registration successful! Logging you in...");

      // Automatically log the user in after successful registration
      await login({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      // Reset form
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
      <div className="login-card shadow-lg rounded-3">
        <h2 className="text-center mb-4">Commerce Bank Register</h2>
        <div className="space-y-4">
          <form onSubmit={handleSubmit}>
            {/* Full Name */}
            <label className="block text-gray-700 mb-3">Full Name</label>
            <input
              type="text"
              value={fullNameInput}
              onChange={(e) => setFullNameInput(e.target.value)}
              placeholder="Full name"
              className="form-control"
              style={{ display: "block", marginBottom: "10px" }}
              required
            />

            {/* Username */}
            <label className="block text-gray-700 mb-3">Username</label>
            <input
              type="text"
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
              placeholder="Username"
              className="form-control"
              style={{ display: "block", marginBottom: "10px" }}
              required
            />

            {/* Email */}
            <label className="block text-gray-700 mb-3">Email</label>
            <input
              type="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="Email"
              className="form-control"
              style={{ display: "block", marginBottom: "10px" }}
              required
            />

            {/* Phone */}
            <label className="block text-gray-700 mb-3">Phone Number</label>
            <input
              type="text"
              value={phoneNumberInput}
              onChange={(e) => setPhoneNumberInput(e.target.value)}
              placeholder="(123) 456-7890"
              className="form-control"
              style={{ display: "block", marginBottom: "10px" }}
              required
            />

            {/* Address */}
            <h4 className="text-gray-700 mt-4 mb-2">Address Information</h4>

            <label className="block text-gray-700 mb-3">Street</label>
            <input
              type="text"
              value={streetInput}
              onChange={(e) => setStreetInput(e.target.value)}
              placeholder="123 Main St"
              className="form-control"
              style={{ display: "block", marginBottom: "10px" }}
              required
            />

            <label className="block text-gray-700 mb-3">City</label>
            <input
              type="text"
              value={cityInput}
              onChange={(e) => setCityInput(e.target.value)}
              placeholder="City"
              className="form-control"
              style={{ display: "block", marginBottom: "10px" }}
              required
            />

            <label className="block text-gray-700 mb-3">State</label>
            <input
              type="text"
              value={stateInput}
              onChange={(e) => setStateInput(e.target.value)}
              placeholder="State"
              className="form-control"
              style={{ display: "block", marginBottom: "10px" }}
              required
            />

            <label className="block text-gray-700 mb-3">ZIP Code</label>
            <input
              type="text"
              value={zipInput}
              onChange={(e) => setZipInput(e.target.value)}
              placeholder="ZIP"
              className="form-control"
              style={{ display: "block", marginBottom: "10px" }}
              required
            />

            {/* Password */}
            <label className="block text-gray-700 mb-3">Password</label>
            <div className={`relative ${shake ? "animate-shake" : ""}`}>
              <input
                type={showPassword ? "text" : "password"}
                value={passwordInput}
                onChange={handlePasswordChange}
                placeholder="Enter password"
                className={`w-full p-2 border rounded mb-1 ${
                  passwordError
                    ? "border-red-500"
                    : passwordInput
                    ? "border-green-500"
                    : "border-gray-300"
                }`}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-2 text-sm text-gray-600"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            {passwordError && (
              <p className="text-red-500 font-bold">{passwordError}</p>
            )}

            {/* Confirm Password */}
            <label className="block text-gray-700 mb-3">Retype Password</label>
            <div className={`relative ${shake ? "animate-shake" : ""}`}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={rePasswordInput}
                onChange={handleConfirmPasswordChange}
                placeholder="Retype password"
                className={`w-full p-2 border rounded mb-1 ${
                  confirmPasswordError
                    ? "border-red-500"
                    : rePasswordInput
                    ? "border-green-500"
                    : "border-gray-300"
                }`}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-2 top-2 text-sm text-gray-600"
              >
                {showConfirmPassword ? "Hide" : "Show"}
              </button>
            </div>

            {confirmPasswordError && (
              <p className="text-red-500 font-bold">{confirmPasswordError}</p>
            )}
            {!confirmPasswordError && rePasswordInput && (
              <p className="text-green-500">Passwords matched</p>
            )}

            <button
              type="submit"
              className="btn btn-primary w-100 mt-3"
              disabled={!isFormValid}
            >
              Register
            </button>
          </form>

          {message && (
            <p
              className="text-center mt-3"
              style={{ color: isSuccess ? "green" : "red", fontWeight: "500" }}
            >
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
