import React, { useState, useEffect, useContext, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import PlaidLink from "../components/PlaidLink";
import { AuthContext } from "../context/authContext";
import axios from "axios";
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

  const [selectedAccount, setSelectedAccount] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState({});

  const [showPopup, setShowPopup] = useState(false);
  const [recipientAccount, setRecipientAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [syncing, setSyncing] = useState(false);

  // Fetch accounts from backend
  const fetchAccounts = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/plaid/accounts', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAccounts(response.data);
      if (response.data.length > 0 && !selectedAccount) {
        setSelectedAccount(response.data[0]._id);
      }
    } catch (error) {
      console.error('Error fetching accounts:', error);
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

  // Sync accounts with Plaid
  const handleSync = async () => {
    setSyncing(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/plaid/sync_accounts',
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAccounts(response.data.accounts);
      setToastMessage('Accounts synced successfully');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    } catch (error) {
      console.error('Error syncing accounts:', error);
      setToastMessage('Failed to sync accounts');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    } finally {
      setSyncing(false);
    }
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
        fetchAccounts();
      }
    }
  }, [authUser, loading, navigate, fetchAccounts]);

  // Fetch transactions when account is selected
  useEffect(() => {
    if (selectedAccount) {
      fetchTransactions(selectedAccount);
    }
  }, [selectedAccount]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleSend = () => {
    const amt = parseFloat(amount);
    if (!recipientAccount || isNaN(amt) || amt <= 0) return;

    setAccounts((prev) =>
      prev.map((acc) => {
        if (acc._id === selectedAccount) {
          return { ...acc, balance: acc.balance - amt };
        }
        if (acc._id === recipientAccount) {
          return { ...acc, balance: acc.balance + amt };
        }
        return acc;
      })
    );

    setShowPopup(false);
    setAmount("");
    setRecipientAccount("");

    setToastMessage("Money sent");
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const handlePlaidSuccess = (newAccounts) => {
    setToastMessage(`Successfully linked ${newAccounts.length} account(s)`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
    fetchAccounts(); // Refresh accounts list
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 className="section-title">All Accounts</h3>
            <div style={{ display: 'flex', gap: '10px' }}>
              <PlaidLink onSuccess={handlePlaidSuccess} />
              <button
                onClick={handleSync}
                disabled={syncing || accounts.length === 0}
                style={{
                  backgroundColor: '#3a5a40',
                  color: '#fff',
                  padding: '12px 24px',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: syncing || accounts.length === 0 ? 'not-allowed' : 'pointer',
                  opacity: syncing || accounts.length === 0 ? 0.6 : 1,
                }}
              >
                {syncing ? 'Syncing...' : 'Sync Accounts'}
              </button>
            </div>
          </div>
          
          {accounts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#dad7cd' }}>
              <p>No accounts linked yet. Click "Link Bank Account" to get started.</p>
            </div>
          ) : (
            <div className="accounts-list spacious">
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
                  <p className="account-type">
                    {acc.mask ? `••••${acc.mask}` : acc.accountType}
                  </p>
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
          )}
        </section>

        <section className="transactions-section">
          <h3 className="section-title">Transaction History</h3>
          {selectedAccount && transactions[selectedAccount] && transactions[selectedAccount].length > 0 ? (
            <table className="transactions-table large">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {transactions[selectedAccount].map((tx) => (
                  <tr key={tx._id}>
                    <td>{new Date(tx.date || tx.timestamp).toLocaleDateString()}</td>
                    <td>
                      {tx.merchantName || tx.name || tx.description}
                      {tx.pending && <span style={{ color: '#a98467', marginLeft: '8px' }}>(Pending)</span>}
                    </td>
                    <td>{tx.category || 'Other'}</td>
                    <td className={tx.amount < 0 ? "positive" : "negative"}>
                      ${Math.abs(tx.amount).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : selectedAccount ? (
            <div style={{ textAlign: 'center', padding: '20px', color: '#dad7cd' }}>
              <p>No transactions available for this account.</p>
            </div>
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
                .filter((a) => a._id !== selectedAccount)
                .map((a) => (
                  <option key={a._id} value={a._id}>
                    {a.institutionName} - {a.officialName || a.subtype}
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

      {showToast && <div className="toast show">{toastMessage}</div>}
    </div>
  );
};

export default AccountsPage;
