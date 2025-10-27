// Dashboard.js
import React from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import "../css/dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();

  const goToProfile = () => {
    navigate("/profile");
  };

  return (
    <div className="dashboard-page">
      <nav className="navbar navbar-light bg-light shadow-sm px-4">
        <span className="navbar-brand mb-0 h1">Dashboard</span>
        <div className="ms-auto">
          <FaUserCircle
            className="profile-icon"
            onClick={goToProfile}
            title="Go to Profile"
          />
        </div>
      </nav>

      <div className="container mt-5">
        <h3>Welcome to your Dashboard!</h3>
        <p>This is a placeholder dashboard page.</p>
      </div>
    </div>
  );
};

export default Dashboard;
