import React, { useState } from "react";

export default function Register() {
  const [emailInput, setEmailInput] = useState("");
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [rePasswordInput, setRePasswordInput] = useState("");

  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [shake, setShake] = useState(false);

  // // Password strength check
  // const getPasswordStrength = (pwd) => {
  //   if (pwd.length < 8) return "Weak";
  //   if (pwd.length < 12) return "Medium";
  //   if (pwd.length >= 15 && /[0-9]/.test(pwd) && /[!@#$%^&*]/.test(pwd)) return "Strong";
  //   return "Medium";
  // };

  const validatePassword = (pwd) => {
    const regex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{15,}$/;
    return regex.test(pwd);
  };

   const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPasswordInput(value);

    if (!validatePassword(value)) {
      setPasswordError("Password must be at least 15 characters long and include a number and a special character.");
    } else {
      setPasswordError("");
    }

    // Check if confirm matches
    if (passwordInput && value !== rePasswordInput) {
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

  const handleSubmit = (e) => {
    e.preventDefault();

    if (passwordError || confirmPasswordError || !passwordInput || !rePasswordInput) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    alert("Form successfully submitted!");
  }

  const isFormValid = !passwordError && !confirmPasswordError && passwordInput && rePasswordInput;

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();

  //   //Password validation
  //   if (!validatePassword(passwordInput)) {
  //     setPasswordError("Password must be at least 15 characters long and include a number and a special character.");
  //     return;
  //   }else {
  //     setPasswordError("");
  //   }


  //   // Confirm password validation
  //   if (passwordInput !== rePasswordInput) {
  //     setConfirmPasswordError("Passwords do not match.");
  //     return;
  //   } else {
  //     setConfirmPasswordError("");
  //   }

  //   console.log("test2");
  //   if (!validateEmail(emailInput)) {
  //     console.error("/bad email");
  //     //return;
  //   }

  //   console.log("Form submitted successfully!");
  // };

  return (
    <div className="login-container">
      <div className="login-card shadow-lg rounded-3">
        <h2 className="text-center mb-4">Commerce Bank Register</h2>
    {/* <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl p-6 w-80">
        <h2 className="text-xl font-semibold mb-4 text-center">Register</h2> */}

        <div className="space-y-4">

        <form onSubmit={handleSubmit}>

          <label className="block text-gray-700 mb-3">Email</label>
            <input
              type="text"
              style= {{ display: "block", marginBottom: "10px" }}
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="email"
              className="form-control"
              required
            />
          <label className="block text-gray-700 mb-3">Username</label>
            <input
              type="text"
              style= {{ display: "block", marginBottom: "10px" }}
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
              placeholder="username"
              className="form-control"
              required
            />
            
            {/* Password */}
            <label className="block text-gray-700 mb-3">Password</label>
            <div className={`relative ${shake ? "animate-shake" : ""}`}>
            <input
              type={showPassword ? "text" : "password"}
              style= {{ display: "block", marginBottom: "10px" }}
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
            {/* {passwordInput && (
        <p className={`text-sm ${
          getPasswordStrength(passwordInput) === "Strong"
            ? "text-green-500"
            : getPasswordStrength(passwordInput) === "Medium"
            ? "text-yellow-500"
            : "text-red-500"
        }`}>
          Strength: {getPasswordStrength(passwordInput)}
        </p>
      )} */}
      {passwordError && <p className="text-red-500 font-bold" style={{ color: "red" }}>  
      {passwordError}</p>}


            {/* Retype password*/}
            <label className="block text-gray-700 mb-3">Retype Password</label>
            <div className={`relative ${shake ? "animate-shake" : ""}`}>
            <input
              type={showConfirmPassword ? "text" : "password"}
              style= {{ display: "block", marginBottom: "10px" }}
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
            {confirmPasswordError && <p className="text-red-500 font-bold" style={{ color: "red" }}>  
            {confirmPasswordError}</p>}
            {!confirmPasswordError && rePasswordInput && (
            <p className="text-green-500" style={{ color: "green" }}>Passwords matched</p>
            )}

            <button 
            type="submit" 
            className="btn btn-primary w-100">
              Register
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}