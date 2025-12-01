import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import ExpenseChart, { spendingData } from "../components/ExpenseChart";
import { AuthContext } from "../context/authContext";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import "../css/dashboard.css";
import "../css/sidebar.css";



const Dashboard = () => {
  const navigate = useNavigate();
  const {user: authUser, logout, loading} = useContext(AuthContext);
  const [user, setUser] = useState({
      fullName: "",
      email: "",
      phone: "",
    });
  
  const [selectedAccount, setSelectedAccount] = useState(1);
  const [activePanel, setActivePanel] = useState("overview");
  const [chatMessages, setChatMessages] = useState([
    {
      id: "assistant-welcome",
      sender: "assistant",
      content: "Hi! I'm your local AI assistant. Ask me anything about your finances.",
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [chatError, setChatError] = useState(null);

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
      { id: 2, date: "2025-10-26", description: "Withdrawal", amount: 400 }
    ],
    3: [{ id: 1, date: "2025-10-25", description: "Payment", amount: -540 },
      { id: 1, date: "2025-10-29", description: "Deposit", amount: -836 },
      { id: 2, date: "2025-10-28", description: "Withdrawal", amount: -160 },
      { id: 3, date: "2025-10-27", description: "Deposit", amount: 340 },
      { id: 4, date: "2025-10-26", description: "Deposit", amount: 565 },
      
    ],
  };

  const chartData = transactions[selectedAccount]?.map((tx) => ({
    date: tx.date,
    balance:
      accounts.find((acc) => acc.id === selectedAccount)?.balance +
      tx.amount * (Math.random() > 0.5 ? 1 : -1),
  }));
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
  const buildPayload = (messages) =>
    messages.map((msg) => ({
      role: msg.sender === "assistant" ? "assistant" : "user",
      content: msg.content,
    }));

  const handleChatSubmit = async (event) => {
    event.preventDefault();
    if (!chatInput.trim() || chatLoading) return;

    const newMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      content: chatInput.trim(),
    };

    const nextMessages = [...chatMessages, newMessage];
    setChatMessages(nextMessages);
    setChatInput("");
    setChatLoading(true);
    setChatError(null);

    try {
      const response = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: buildPayload(nextMessages) }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Chat service unavailable");
      }

      const assistantReply = data.reply?.trim();
      if (assistantReply) {
        setChatMessages((prev) => [
          ...prev,
          {
            id: `assistant-${Date.now()}`,
            sender: "assistant",
            content: assistantReply,
          },
        ]);
      }
    } catch (err) {
      setChatError(err.message || "Something went wrong");
    } finally {
      setChatLoading(false);
    }
  };
if (loading) {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh",
      backgroundColor: "#001219",
      color: "#dad7cd",
      fontFamily: "Inter, sans-serif",
      fontSize: "18px",
      letterSpacing: "0.5px"
    }}>
      Loading...
    </div>
  );
}
  return (
    <div className="dashboard-container">
      <Sidebar
        onSelectOverview={() => setActivePanel("overview")}
        onNavigateAccounts={() => {
          setActivePanel("accounts");
          navigate("/accounts");
        }}
        onNavigateProfile={() => {
          setActivePanel("profile");
          navigate("/profile");
        }}
        onLogout={handleLogout}
        active={activePanel}
      />

      <main className="main-content">
        <header className="dashboard-header">
          <h1 className="dashboard-title">{user.fullName}'s Dashboard Overview</h1>
          <div className="banner-line"></div>
        </header>

        {/* Accounts Section */}
        <section className="accounts-section">
          <h3 className="section-title">Active Accounts</h3>
          <div className="accounts-list">
  {accounts
    .filter((acc) => acc.type === "Active")
    .slice(0, 3)
    .map((acc) => (
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
      </div>
    ))}

  {/* ADD NEW ACCOUNT BUTTON */}
  <div
    className="account-card add-account-card"
  >
    <p className="add-account-plus">
  <span>Add Account</span>
  <span>+</span>
</p>

  </div>
</div>

        </section>

        {/* Chart Section */}
        <section className="chart-section">
          <h3 className="section-title">Account Balance Trend</h3>
          {chartData && chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={chartData}>
                <CartesianGrid stroke="rgba(255, 236, 209, 0.15)" />
                <XAxis dataKey="date" stroke="#ffecd1" />
                <YAxis stroke="#ffecd1" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#001219",
                    border: "1px solid #001219",
                    color: "#dad7cd",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="balance"
                  stroke="#e5eaf3ff"
                  strokeWidth={3}
                  dot={{ fill: "#15616d", r: 5 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p>No chart data available.</p>
          )}
        </section>


{/* Spending Budget Section */}
<section className="spending-section">
  <h3 className="section-title">Spending Budget</h3>
  <ExpenseChart data={spendingData} />
</section>




        {/* Transactions Section */}
        <section className="transactions-section">
          <div className="transactions-header">
            <h3 className="section-title">Recent Transactions</h3>
            <button className="view-all-btn">View All</button>
          </div>
          {transactions[selectedAccount] ? (
            <div className="transactions-list">
              {transactions[selectedAccount].map((tx) => {
                const isNegative = tx.amount < 0;
                const transactionType = tx.description.toLowerCase();
                let iconType = "transfer";
                
                if (transactionType.includes("deposit")) {
                  iconType = "deposit";
                } else if (transactionType.includes("withdrawal")) {
                  iconType = "withdrawal";
                } else if (transactionType.includes("payment")) {
                  iconType = "payment";
                }

                return (
                  <div key={tx.id} className="transaction-item">
                    <div className="transaction-icon">
                      <span className={`icon-circle ${isNegative ? "negative-icon" : "positive-icon"} icon-${iconType}`}></span>
                    </div>
                    <div className="transaction-details">
                      <p className="transaction-description">{tx.description}</p>
                      <p className="transaction-date">{new Date(tx.date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}</p>
                    </div>
                    <div className="transaction-amount">
                      <p className={`amount ${isNegative ? "negative" : "positive"}`}>
                        {isNegative ? "-" : "+"}${Math.abs(tx.amount).toLocaleString()}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="no-transactions">
              <p>No transactions available.</p>
            </div>
          )}
        </section>

        {/* Chat Section */}
        <section className="chat-section">
          <div className="chat-header">
            <h3 className="section-title">AI Banking Assistant</h3>
            <span className={`chat-status ${chatLoading ? "chat-status--thinking" : "chat-status--idle"}`}>
              {chatLoading ? "Thinking..." : "Online"}
            </span>
          </div>
          <div className="chat-window">
            {chatMessages.map((msg) => (
              <div key={msg.id} className={`chat-message ${msg.sender}`}>
                <span className="chat-message-label">{msg.sender === "assistant" ? "Assistant" : "You"}</span>
                <p>{msg.content}</p>
              </div>
            ))}
          </div>
          {chatError && <p className="chat-error">{chatError}</p>}
          <form className="chat-input-row" onSubmit={handleChatSubmit}>
            <input
              type="text"
              className="chat-input"
              placeholder="Ask about spending insights, saving tips..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              disabled={chatLoading}
            />
            <button type="submit" className="chat-send-btn" disabled={chatLoading}>
              {chatLoading ? "Sending..." : "Send"}
            </button>
          </form>
          <p className="chat-helper-text">Responses are generated locally. No data leaves your device.</p>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;

