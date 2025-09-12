import React, { useState } from 'react';
import './HomePage.css';
import TransactionHistory from './TransactionHistory';
import ProfilePage from './ProfilePage';

const HomePage = ({ user, onLogout }) => {
  const [showTransactionHistory, setShowTransactionHistory] = useState(false);
  const [showProfilePage, setShowProfilePage] = useState(false);

  if (showTransactionHistory) {
    return <TransactionHistory user={user} onBack={() => setShowTransactionHistory(false)} />;
  }

  if (showProfilePage) {
    return <ProfilePage user={user} onBack={() => setShowProfilePage(false)} onLogout={onLogout} />;
  }

  return (
    <div className="homepage">
      {/* Navigation Header */}
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <h1>SecureBank</h1>
          </div>
          <nav className="nav">
            <button 
              className="nav-link nav-button"
              onClick={() => setShowTransactionHistory(true)}
            >
              Transactions
            </button>
            <button 
              className="nav-link nav-button"
              onClick={() => setShowProfilePage(true)}
            >
              Profile
            </button>
          </nav>
          <div className="user-menu">
            <span className="user-name">Welcome, {user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User' : 'User'}</span>
            <button className="logout-btn" onClick={onLogout}>Logout</button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {/* Hero Section */}
        <section className="hero">
          <div className="hero-content">
            <h2>Welcome to Your Digital Banking</h2>
            <p>Manage your finances with confidence and security</p>
            <div className="hero-actions">
              <button className="btn btn-primary">View Accounts</button>
              <button className="btn btn-secondary">Make Transfer</button>
            </div>
          </div>
        </section>

        {/* Account Overview */}
        <section className="account-overview">
          <h3>Account Overview</h3>
          <div className="account-cards">
            {user && user.accounts && user.accounts.length > 0 ? (
              user.accounts.map((account, index) => (
                <div key={index} className="account-card">
                  <div className="account-header">
                    <h4>{account.type.charAt(0).toUpperCase() + account.type.slice(1)} Account</h4>
                    <span className="account-number">****{account.accountNumber.slice(-4)}</span>
                  </div>
                  <div className="account-balance">
                    <span className="balance-amount">
                      ${account.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    <span className="balance-label">
                      {account.type === 'credit' ? 'Current Balance' : 'Available Balance'}
                    </span>
                  </div>
                  <div className="account-actions">
                    <button className="action-btn">View Details</button>
                    {account.type === 'credit' ? (
                      <button className="action-btn">Pay Bill</button>
                    ) : (
                      <button className="action-btn">Transfer</button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="account-card">
                <div className="account-header">
                  <h4>No Accounts Found</h4>
                </div>
                <div className="account-balance">
                  <span className="balance-amount">$0.00</span>
                  <span className="balance-label">Please contact support</span>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Quick Actions */}
        <section className="quick-actions">
          <h3>Quick Actions</h3>
          <div className="action-grid">
            <div className="action-item">
              <div className="action-icon"></div>
              <span>Send Money</span>
            </div>
            <div className="action-item">
              <div className="action-icon"></div>
              <span>View Reports</span>
            </div>
            <div className="action-item">
              <div className="action-icon"></div>
              <span>Manage Cards</span>
            </div>
            <div className="action-item clickable" onClick={() => setShowProfilePage(true)}>
              <div className="action-icon"></div>
              <span>Settings</span>
            </div>
            <div className="action-item">
              <div className="action-icon"></div>
              <span>Mobile App</span>
            </div>
            <div className="action-item">
              <div className="action-icon"></div>
              <span>Security</span>
            </div>
          </div>
        </section>

       

      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>Banking Services</h4>
            <ul>
              <li><a href="#checking">Checking Accounts</a></li>
              <li><a href="#savings">Savings Accounts</a></li>
              <li><a href="#loans">Loans & Mortgages</a></li>
              <li><a href="#credit">Credit Cards</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Support</h4>
            <ul>
              <li><a href="#help">Help Center</a></li>
              <li><a href="#contact">Contact Us</a></li>
              <li><a href="#security">Security Center</a></li>
              <li><a href="#privacy">Privacy Policy</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Connect</h4>
            <ul>
              <li><a href="#mobile">Mobile Banking</a></li>
              <li><a href="#online">Online Banking</a></li>
              <li><a href="#locations">Branch Locations</a></li>
              <li><a href="#atms">ATM Finder</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 SecureBank. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
