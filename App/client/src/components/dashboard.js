import React, { useState, useEffect, useContext, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import ExpenseChart, { spendingData } from "../components/ExpenseChart";
import { AuthContext } from "../context/authContext";
import axios from "axios";

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
  
  const [selectedAccount, setSelectedAccount] = useState(null);
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

  // Real data from Plaid
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState({});
  const [dataLoading, setDataLoading] = useState(true);
  const [totalBalance, setTotalBalance] = useState(0);

  // Fetch accounts from Plaid API
  const fetchAccounts = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/plaid/accounts', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAccounts(response.data);
      
      // Calculate total balance
      const total = response.data.reduce((sum, acc) => sum + (acc.currentBalance || acc.balance || 0), 0);
      setTotalBalance(total);
      
      // Set first account as selected if none selected
      if (response.data.length > 0 && !selectedAccount) {
        setSelectedAccount(response.data[0]._id);
      }
      setDataLoading(false);
    } catch (error) {
      console.error('Error fetching accounts:', error);
      setDataLoading(false);
    }
  }, [selectedAccount]);

  // Fetch transactions for selected account
  const fetchTransactions = useCallback(async (accountId) => {
    if (!accountId) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://localhost:5000/api/plaid/transactions/${accountId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTransactions((prev) => ({
        ...prev,
        [accountId]: response.data.transactions,
      }));
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  }, []);

  // Calculate chart data from real transactions
  const chartData = React.useMemo(() => {
    if (!selectedAccount || !transactions[selectedAccount]) return [];
    
    const txns = transactions[selectedAccount] || [];
    if (txns.length === 0) return [];
    
    const selectedAcc = accounts.find(acc => acc._id === selectedAccount);
    const currentBalance = selectedAcc?.currentBalance || selectedAcc?.balance || 0;
    
    // Sort transactions oldest to newest
    const sortedTxns = [...txns].sort((a, b) => 
      new Date(a.date || a.timestamp) - new Date(b.date || b.timestamp)
    );
    
    // Calculate starting balance by working backwards from current balance
    // Sum all transaction amounts (Plaid: positive = spent, negative = received)
    const totalChange = sortedTxns.reduce((sum, tx) => sum + tx.amount, 0);
    let runningBalance = currentBalance + totalChange;
    
    // Now work forward through transactions to build the chart
    const chartPoints = sortedTxns.map((tx) => {
      // Apply transaction: positive amount = money out, negative = money in
      runningBalance -= tx.amount;
      
      return {
        date: new Date(tx.date || tx.timestamp).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        }),
        balance: Math.round(runningBalance * 100) / 100,
      };
    });
    
    return chartPoints;
  }, [selectedAccount, transactions, accounts]);
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
          fetchAccounts();
        }
      }
    }, [authUser, loading, navigate, fetchAccounts]);

  // Fetch transactions when account is selected
  useEffect(() => {
    if (selectedAccount) {
      fetchTransactions(selectedAccount);
    }
  }, [selectedAccount, fetchTransactions]);
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
if (loading || dataLoading) {
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
          <h3 className="section-title">Active Accounts {accounts.length > 0 && `(Total: $${totalBalance.toLocaleString()})`}</h3>
          <div className="accounts-list">
  {accounts.length > 0 ? (
    <>
      {accounts.map((acc) => (
        <div
          key={acc._id}
          className={`account-card ${
            selectedAccount === acc._id ? "selected" : ""
          }`}
          onClick={() => setSelectedAccount(acc._id)}
        >
          <p className="account-name">
            {acc.institutionName} - {acc.officialName || acc.subtype}
          </p>
          <p className="account-balance">
            ${(acc.currentBalance || acc.balance || 0).toLocaleString()}
          </p>
          {acc.mask && (
            <p style={{ fontSize: '12px', color: '#a98467', marginTop: '4px' }}>
              ••••{acc.mask}
            </p>
          )}
        </div>
      ))}
    </>
  ) : (
    <div style={{ 
      padding: '20px', 
      textAlign: 'center', 
      color: '#dad7cd',
      gridColumn: '1 / -1'
    }}>
      <p>No accounts linked yet.</p>
      <p style={{ fontSize: '14px', marginTop: '8px', color: '#a98467' }}>
        Go to Accounts page to link your bank account with Plaid.
      </p>
    </div>
  )}
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
            <button className="view-all-btn" onClick={() => navigate("/accounts")}>View All</button>
          </div>
          {selectedAccount && transactions[selectedAccount] && transactions[selectedAccount].length > 0 ? (
            <div className="transactions-list">
              {transactions[selectedAccount].slice(0, 5).map((tx) => {
                // Plaid: positive amount = money out, negative = money in
                const isNegative = tx.amount > 0; // spending/withdrawal
                const transactionName = (tx.merchantName || tx.name || tx.description || 'Transaction').toLowerCase();
                let iconType = "transfer";
                
                if (transactionName.includes("deposit") || transactionName.includes("credit")) {
                  iconType = "deposit";
                } else if (transactionName.includes("withdrawal") || transactionName.includes("atm")) {
                  iconType = "withdrawal";
                } else if (transactionName.includes("payment") || transactionName.includes("purchase")) {
                  iconType = "payment";
                }

                return (
                  <div key={tx._id} className="transaction-item">
                    <div className="transaction-icon">
                      <span className={`icon-circle ${isNegative ? "negative-icon" : "positive-icon"} icon-${iconType}`}></span>
                    </div>
                    <div className="transaction-details">
                      <p className="transaction-description">
                        {tx.merchantName || tx.name || tx.description || 'Transaction'}
                      </p>
                      <p className="transaction-date">
                        {new Date(tx.date || tx.timestamp).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                        {tx.category && ` • ${tx.category}`}
                      </p>
                    </div>
                    <div className="transaction-amount">
                      <p className={`amount ${isNegative ? "negative" : "positive"}`}>
                        {isNegative ? "-" : "+"}${Math.abs(tx.amount).toFixed(2)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="no-transactions">
              <p>
                {!selectedAccount 
                  ? "Select an account to view transactions." 
                  : accounts.length === 0
                  ? "Link a bank account to see your transactions."
                  : "No transactions available for this account."}
              </p>
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


