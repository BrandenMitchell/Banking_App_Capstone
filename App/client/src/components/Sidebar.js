import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/sidebar.css";

const Sidebar = ({ onSelectOverview, onNavigateProfile, onNavigateAccounts, onLogout, active }) => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const toggle = () => setCollapsed(!collapsed);

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar-top">
        <button className="collapse-btn" onClick={toggle} aria-label="Toggle sidebar">
          {collapsed ? "»" : "«"}
        </button>

        <div className="brand" onClick={() => { if (!collapsed) onSelectOverview(); }}>
          <span className="brand-short">NB</span>
          <span className="brand-full">Neptune Banking</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <ul className="sidebar-links">
          <li
            className={`sidebar-item ${active === "overview" ? "active" : ""}`}
            onClick={() => onSelectOverview()}
          >
            <span className="nav-text">Overview</span>
          </li>

          <li
            className={`sidebar-item ${active === "accounts" ? "active" : ""}`}
            onClick={() => onNavigateAccounts()}
          >
            <span className="nav-text">Accounts</span>
          </li>

          <li
            className={`sidebar-item ${active === "profile" ? "active" : ""}`}
            onClick={() => onNavigateProfile()}
          >
            <span className="nav-text">Profile</span>
          </li>
        </ul>
      </nav>

      <div className="sidebar-bottom">
        <button className="logout-btn" onClick={() => onLogout()}>
          <span className="nav-text">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
