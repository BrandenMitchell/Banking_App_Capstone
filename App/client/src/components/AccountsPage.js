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
  const [accounts, setAccounts] = useState([
    { id: 1, name: "Checking", balance: 5460.75, type: "Active" },
    { id: 2, name: "Savings", balance: 12890.25, type: "Active" },
    { id: 3, name: "Credit Card", balance: 2540.0, type: "Active" },
    { id: 4, name: "Investments", balance: 8000.0, type: "Closed" },
  ]);

  const [showPopup, setShowPopup] = useState(false);
  const [recipientAccount, setRecipientAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [showToast, setShowToast] = useState(false);

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
      { id: 2, date: "2025-10-26", description: "Withdrawal", amount: 400 }
    ],
    3: [{ id: 1, date: "2025-10-25", description: "Payment", amount: -540 },
      { id: 1, date: "2025-10-29", description: "Deposit", amount: -836 },
      { id: 2, date: "2025-10-28", description: "Withdrawal", amount: -160 },
      { id: 3, date: "2025-10-27", description: "Deposit", amount: 340 },
      { id: 4, date: "2025-10-26", description: "Deposit", amount: 565 },
      
    ],
  };

  useEffect(() => {
    if (!loading) {
      if (!authUser) {
        navigate("/");
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

  const handleSend = () => {
    const amt = parseFloat(amount);
    if (!recipientAccount || isNaN(amt) || amt <= 0) return;

    setAccounts((prev) =>
      prev.map((acc) => {
        if (acc.id === selectedAccount) {
          return { ...acc, balance: acc.balance - amt };
        }
        if (acc.id === parseInt(recipientAccount)) {
          return { ...acc, balance: acc.balance + amt };
        }
        return acc;
      })
    );

    setShowPopup(false);
    setAmount("");
    setRecipientAccount("");

    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
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
          fontSize: "18px",
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
                <button
                  className="transfer-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowPopup(true);
                  }}
                >
                  Transfer Money
                </button>
              </div>
            ))}
          </div>
        </section>

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
                    <td className={tx.amount < 0 ? "negative" : "positive"}>
                      ${Math.abs(tx.amount).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : null}
        </section>
      </main>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h2>Send Money</h2>

            <label>Recipient Account</label>
            <select
              value={recipientAccount}
              onChange={(e) => setRecipientAccount(e.target.value)}
              className="popup-input"
            >
              <option value="">Select Account</option>
              {accounts
                .filter((a) => a.id !== selectedAccount)
                .map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
            </select>

            <label>Amount (USD)</label>
            <input
              type="number"
              className="popup-input"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />

            <button className="send-btn" onClick={handleSend}>
              Send
            </button>
            <button className="close-btn" onClick={() => setShowPopup(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {showToast && <div className="toast show">Money sent</div>}
    </div>
  );
};

export default AccountsPage;
