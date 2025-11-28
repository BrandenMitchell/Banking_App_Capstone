import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { AuthContext } from "../context/authContext";
import "../css/accounts.css";
import "../css/sidebar.css";

const AccountsPage = () => {
  const navigate = useNavigate();
  const { user: authUser, logout, loading } = useContext(AuthContext);
  const [user, setUser] = useState({
    fullName: "",
    email: "",
    phone: "",
  });

  const [selectedAccount, setSelectedAccount] = useState(1);

  const accounts = [
    { id: 1, name: "Checking", balance: 5460.75, type: "Active" },
    { id: 2, name: "Savings", balance: 12890.25, type: "Active" },
    { id: 3, name: "Credit Card", balance: 2540.0, type: "Active" },
    { id: 4, name: "Investments", balance: 8000.0, type: "Closed" },
  ];

  const transactions = {
    1: [
      { id: 1, date: "2025-10-29", description: "Deposit", amount: 2000 },
      { id: 2, date: "2025-10-28", description: "Withdrawal", amount: -100 },
      { id: 3, date: "2025-10-27", description: "Deposit", amount: 300 },
      { id: 4, date: "2025-10-26", description: "Deposit", amount: 500 },
    ],
    2: [
      { id: 1, date: "2025-10-27", description: "Deposit", amount: 5000 },
      { id: 2, date: "2025-10-26", description: "Withdrawal", amount: -200 },
    ],
    3: [{ id: 1, date: "2025-10-25", description: "Payment", amount: -540 }],
  };

  useEffect(() => {
    if (!loading) {
      if (!authUser) {
        navigate("/"); // redirect to login
      } else {
        setUser({
          fullName: authUser.username || "",
          email: authUser.email || "",
          phone: authUser.phoneNumber || "",
        });
      }
    }
  }, [authUser, loading, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          backgroundColor: "#344e41",
          color: "#dad7cd",
          fontFamily: "Inter, sans-serif",
          fontSize: "18px",
          letterSpacing: "0.5px",
        }}
      >
        Loading...
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <Sidebar
        onSelectOverview={() => navigate("/dashboard")}
        onNavigateAccounts={() => navigate("/accounts")}
        onNavigateProfile={() => navigate("/profile")}
        onLogout={handleLogout}
        active="accounts"
      />

      <main className="main-content">
        <header className="dashboard-header">
          <h1 className="dashboard-title">{user.fullName}'s Accounts</h1>
          <div className="banner-line"></div>
        </header>

        {/* Accounts Section */}
        <section className="accounts-section">
          <h3 className="section-title">All Accounts</h3>
          <div className="accounts-list spacious">
            {accounts.map((acc) => (
              <div
                key={acc.id}
                className={`account-card ${
                  selectedAccount === acc.id ? "selected" : ""
                }`}
                onClick={() => setSelectedAccount(acc.id)}
              >
                <p className="account-name">{acc.name}</p>
                <p className="account-balance">
                  ${acc.balance.toLocaleString()}
                </p>
                <p className="account-type">{acc.type}</p>
                <button className="transfer-btn">Transfer Money</button>
              </div>
            ))}
          </div>
        </section>

        {/* Transactions Section */}
        <section className="transactions-section">
          <h3 className="section-title">Transaction History</h3>
          {transactions[selectedAccount] ? (
            <table className="transactions-table large">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {transactions[selectedAccount].map((tx) => (
                  <tr key={tx.id}>
                    <td>{tx.date}</td>
                    <td>{tx.description}</td>
                    <td
                      className={tx.amount < 0 ? "negative" : "positive"}
                    >
                      ${Math.abs(tx.amount).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No transactions available.</p>
          )}
        </section>
      </main>
    </div>
  );
};

export default AccountsPage;
