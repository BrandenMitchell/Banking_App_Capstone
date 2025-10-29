import React, { useState,useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { AuthContext } from "../context/authContext";

const Dashboard = () => {
  // State to hold money values
  const [accounts, setAccounts] = useState({
    checking: 0,
    savings: 0,
    creditCard: 0,
    investments: 0,
  });

  // Helper to format as USD currency
  const formatCurrency = (value) =>
    value.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });

  return (
    <div className="login-container">
      <div className="login-card shadow-lg rounded-3 p-4">
        <h2 className="text-center mb-4">Commerce Bank Dashboard</h2>

        <div className="space-y-4">
          <div className="account-field">
            <strong>Checking:</strong> {formatCurrency(accounts.checking)}
          </div>
          <div className="account-field">
            <strong>Savings:</strong> {formatCurrency(accounts.savings)}
          </div>
          <div className="account-field">
            <strong>Credit Card:</strong> {formatCurrency(accounts.creditCard)}
          </div>
          <div className="account-field">
            <strong>Investments:</strong> {formatCurrency(accounts.investments)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;