import React, { useState,useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { AuthContext } from "../context/authContext";
import { PieChart, Pie, Cell, Legend } from "recharts";

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

  const spendingData = [
  { name: "Grocery", value: 320 },
  { name: "Food", value: 180 },
  { name: "Utilities", value: 240 },
  { name: "Shopping", value: 400 },
  { name: "Entertainment", value: 150 },
  { name: "Health", value: 190 },
  { name: "Other", value: 95 },
];

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
if (loading) {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh",
      backgroundColor: "#558faeff",
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
                <CartesianGrid stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="date" stroke="#dad7cd" />
                <YAxis stroke="#dad7cd" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#3a5a40",
                    border: "1px solid #588157",
                    color: "#dad7cd",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="balance"
                  stroke="#14213D"
                  strokeWidth={3}
                  dot={{ fill: "#023047", r: 5 }}
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

  <div style={{ width: "100%", height: 400 }}>
    <ResponsiveContainer>
      <PieChart>
        <Pie
          data={spendingData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={110}
          label
        >
          {spendingData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={["#81f57fff", "#fe9449ff", "#4089b6ff", "#cfbb4eff", "#DAD7CD", "#d96161ff", "#707070ff"][index % 7]}
            />
          ))}
        </Pie>

        <Legend
          verticalAlign="bottom"
          height={35}
          wrapperStyle={{ color: "#dad7cd" }}
        />
      </PieChart>
    </ResponsiveContainer>
  </div>
</section>




        {/* Transactions Section */}
        <section className="transactions-section">
          <h3 className="section-title">Recent Transactions</h3>
          {transactions[selectedAccount] ? (
            <table className="transactions-table">
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
          ) : (
            <p>No transactions available.</p>
          )}
        </section>
      </main>
    </div>
  );
};

export default Dashboard;

