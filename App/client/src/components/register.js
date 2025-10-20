import React, { useState } from "react";

export default function Register() {
  const [emailInput, setEmailInput] = useState("");
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [rePasswordInput, setRePasswordInput] = useState("");

  return (
    <div className="login-container">
      <div className="login-card shadow-lg rounded-3">
        <h2 className="text-center mb-4">Commerce Bank Register</h2>
    {/* <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl p-6 w-80">
        <h2 className="text-xl font-semibold mb-4 text-center">Register</h2> */}

        <div className="space-y-4">

        <label className="block text-gray-700 mb-3">Email</label>
          <input
            type="text"
            style= {{ display: "block", marginBottom: "10px" }}
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            placeholder="email"
            className="form-control"
          />
        <label className="block text-gray-700 mb-3">Username</label>
          <input
            type="text"
            style= {{ display: "block", marginBottom: "10px" }}
            value={usernameInput}
            onChange={(e) => setUsernameInput(e.target.value)}
            placeholder="username"
            className="form-control"
          />
          
          <label className="block text-gray-700 mb-3">Password</label>
          <input
            type="text"
            style= {{ display: "block", marginBottom: "10px" }}
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            placeholder="password"
            className="form-control"
          />
          <label className="block text-gray-700 mb-3">Retype Password</label>
          <input
            type="text"
            style= {{ display: "block", marginBottom: "10px" }}
            value={rePasswordInput}
            onChange={(e) => setRePasswordInput(e.target.value)}
            placeholder="Retype password"
            className="form-control"
          />
          <div className="form-text small-text">
              Must be 15+ characters, include a number and special character.
            </div>

          <button type="submit" className="btn btn-primary w-100">
            Register
          </button>
        </div>
      </div>
    </div>
  );
}