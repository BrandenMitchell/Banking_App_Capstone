// profile.js
import React, { useState, useEffect } from "react";
import { FaPencilAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../css/profile.css";

const Profile = () => {
  const navigate = useNavigate();

  // State to hold user profile data
  const [user, setUser] = useState({
    fullName: "",
    email: "",
    phone: "",
  });

  // Account details (static for now)
  const [accounts] = useState([
    { id: 1, number: "XXXX XXXX XXXX 4321", type: "Checking", balance: "$5,460.75", status: "Active" },
    { id: 2, number: "XXXX XXXX XXXX 9876", type: "Savings", balance: "$12,890.25", status: "Active" },
    { id: 3, number: "XXXX XXXX XXXX 1234", type: "Credit", balance: "$2,540.00", status: "Active" },
    { id: 4, number: "XXXX XXXX XXXX 4567", type: "Loan", balance: "$8,000.00", status: "Closed" },
  ]);

  const [showAccounts, setShowAccounts] = useState(false);
  const [editField, setEditField] = useState("");

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) setUser(storedUser);

    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (isLoggedIn !== "true") {
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleEditClick = (field) => {
    setEditField(editField === field ? "" : field);
  };

  const handleSave = () => {
    setEditField("");
    localStorage.setItem("user", JSON.stringify(user));
  };

  const handleLogout = () => {
    localStorage.setItem("isLoggedIn", "false");
    navigate("/");
  };

  const goBack = () => {
    navigate("/dashboard");
  };

  return (
    <div className="container py-5 profile-page">
      <div className="card shadow-lg rounded-3 p-4 profile-card">
        {/* Back Button */}
        <button className="btn btn-secondary mb-3" onClick={goBack}>
          &larr; Back to Dashboard
        </button>

        {/* Profile Heading */}
        <h2 className="text-center mb-4 text-success fw-bold fs-3">
          My Profile
        </h2>

        {/* Profile Info */}
        <div className="mb-4">
          {["fullName", "email", "phone"].map((field) => (
            <div
              key={field}
              className="d-flex justify-content-between align-items-center mb-3 profile-row"
            >
              <div className="flex-grow-1">
                <strong className="me-2 text-muted">
                  {field === "fullName"
                    ? "Full Name:"
                    : field === "email"
                    ? "Email:"
                    : "Phone:"}
                </strong>
                {editField === field ? (
                  <input
                    type={field === "email" ? "email" : "text"}
                    name={field}
                    className="form-control d-inline w-auto"
                    value={user[field]}
                    onChange={handleChange}
                  />
                ) : (
                  <span>{user[field] || "—"}</span>
                )}
              </div>
              <FaPencilAlt
                className="text-success ms-3 edit-icon"
                onClick={() => handleEditClick(field)}
              />
            </div>
          ))}

          {editField && (
            <div className="text-end mt-3">
              <button className="btn btn-success" onClick={handleSave}>
                Save Changes
              </button>
            </div>
          )}
        </div>

        {/* Account Section */}
        <hr />
        <div className="accounts-section">
          <button
            className="btn btn-outline-success w-100 mb-3"
            onClick={() => setShowAccounts(!showAccounts)}
          >
            {showAccounts ? "Hide Account Details" : "View Account Details"}
          </button>

          {showAccounts && (
            <div className="account-list">
              {accounts.map((acc) => (
                <div key={acc.id} className="account-box">
                  <p><strong>Account Number:</strong> {acc.number}</p>
                  <p><strong>Type:</strong> {acc.type}</p>
                  <p><strong>Balance:</strong> {acc.balance}</p>
                  <p><strong>Status:</strong> {acc.status}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <hr />

        {/* Settings Section */}
        <h4 className="text-success fw-bold fs-5 mb-3 text-center">
          Settings
        </h4>

        <div className="d-flex justify-content-center mt-3">
          <button className="btn logout-btn px-4 py-2" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
