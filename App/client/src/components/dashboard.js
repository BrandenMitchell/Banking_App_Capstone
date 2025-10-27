import React from "react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <div style={{ padding: "40px", position: "relative" }}>
      {/* Profile link at the top-right */}
      <div style={{ position: "absolute", top: "20px", right: "20px" }}>
        <Link
          to="/profile"
          style={{
            textDecoration: "none",
            color: "white",
            backgroundColor: "#007bff",
            padding: "8px 12px",
            borderRadius: "5px",
          }}
        >
          Profile
        </Link>
      </div>

      {/* Main dashboard content */}
      <div style={{ textAlign: "center" }}>
        <h1>Welcome to Your Dashboard!</h1>
        <p>This is a test dashboard after login.</p>
      </div>
    </div>
  );
};

export default Dashboard;
