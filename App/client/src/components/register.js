import React, { useState } from "react";

export default function Register() {
  const [firstInput, setFirstInput] = useState("");
  const [secondInput, setSecondInput] = useState("");

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl p-6 w-80">
        <h2 className="text-xl font-semibold mb-4 text-center">Register</h2>

        <div className="space-y-4">
        <label className="block text-gray-700 mb-1">Username</label>
          <input
            type="text"
            style= {{ display: "block", marginBottom: "10px" }}
            value={firstInput}
            onChange={(e) => setFirstInput(e.target.value)}
            placeholder="username"
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <label className="block text-gray-700 mb-1">Password</label>
          <input
            type="text"
            style= {{ display: "block", marginBottom: "10px" }}
            value={secondInput}
            onChange={(e) => setSecondInput(e.target.value)}
            placeholder="password"
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
}