import React, { useState } from 'react';
import './ProfilePage.css';

const ProfilePage = ({ user, onBack, onLogout }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || '',
    state: user?.state || '',
    zipCode: user?.zipCode || '',
    dateOfBirth: user?.dateOfBirth || '',
    ssn: user?.ssn ? '***-**-' + user.ssn.slice(-4) : ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [preferences, setPreferences] = useState({
    emailNotifications: user?.emailNotifications !== false,
    smsNotifications: user?.smsNotifications !== false,
    twoFactorAuth: user?.twoFactorAuth || false,
    darkMode: user?.darkMode || false,
    language: user?.language || 'en'
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handlePreferenceChange = (e) => {
    const { name, checked, value } = e.target;
    setPreferences(prev => ({
      ...prev,
      [name]: e.target.type === 'checkbox' ? checked : value
    }));
  };

  const validateProfileForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Phone number must be 10 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePasswordForm = () => {
    const newErrors = {};

    if (!passwordData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }
    if (!passwordData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateProfileForm()) {
      return;
    }

    setIsLoading(true);
    setSuccessMessage('');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      alert('Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (!validatePasswordForm()) {
      return;
    }

    setIsLoading(true);
    setSuccessMessage('');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccessMessage('Password updated successfully!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      alert('Failed to update password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreferencesSubmit = async (e) => {
    e.preventDefault();
    
    setIsLoading(true);
    setSuccessMessage('');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccessMessage('Preferences updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      alert('Failed to update preferences. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatPhoneNumber = (value) => {
    const phoneNumber = value.replace(/\D/g, '');
    if (phoneNumber.length <= 3) return phoneNumber;
    if (phoneNumber.length <= 6) return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
  };

  const handlePhoneChange = (e) => {
    const formatted = formatPhoneNumber(e.target.value);
    setFormData(prev => ({
      ...prev,
      phone: formatted
    }));
  };

  return (
    <div className="profile-page">
      {/* Header */}
      <header className="profile-header">
        <div className="header-content">
          <h1>Profile & Settings</h1>
          <div className="header-right">
            <button className="back-btn" onClick={onBack}>
Back to Dashboard
            </button>
            <span className="user-name">
              {user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User' : 'User'}
            </span>
            <button className="logout-btn" onClick={onLogout}>Logout</button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="profile-main">
        <div className="profile-container">
          {/* Sidebar Navigation */}
          <nav className="profile-sidebar">
            <div className="nav-section">
              <h3>Account</h3>
              <button 
                className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={() => setActiveTab('profile')}
              >
                <span className="nav-icon"></span>
                Personal Information
              </button>
              <button 
                className={`nav-item ${activeTab === 'security' ? 'active' : ''}`}
                onClick={() => setActiveTab('security')}
              >
                <span className="nav-icon"></span>
                Security & Password
              </button>
              <button 
                className={`nav-item ${activeTab === 'preferences' ? 'active' : ''}`}
                onClick={() => setActiveTab('preferences')}
              >
                <span className="nav-icon"></span>
                Preferences
              </button>
            </div>
            <div className="nav-section">
              <h3>Banking</h3>
              <button 
                className={`nav-item ${activeTab === 'accounts' ? 'active' : ''}`}
                onClick={() => setActiveTab('accounts')}
              >
                <span className="nav-icon"></span>
                Account Settings
              </button>
              <button 
                className={`nav-item ${activeTab === 'notifications' ? 'active' : ''}`}
                onClick={() => setActiveTab('notifications')}
              >
                <span className="nav-icon"></span>
                Notifications
              </button>
            </div>
          </nav>

          {/* Content Area */}
          <div className="profile-content">
            {successMessage && (
              <div className="success-message">
                {successMessage}
              </div>
            )}

            {/* Personal Information Tab */}
            {activeTab === 'profile' && (
              <div className="tab-content">
                <div className="content-header">
                  <h2>Personal Information</h2>
                  <p>Update your personal details and contact information</p>
                </div>
                
                <form className="profile-form" onSubmit={handleProfileSubmit}>
                  <div className="form-section">
                    <h3>Basic Information</h3>
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="firstName">First Name</label>
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className={errors.firstName ? 'error' : ''}
                          placeholder="Enter your first name"
                        />
                        {errors.firstName && <span className="error-message">{errors.firstName}</span>}
                      </div>
                      <div className="form-group">
                        <label htmlFor="lastName">Last Name</label>
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className={errors.lastName ? 'error' : ''}
                          placeholder="Enter your last name"
                        />
                        {errors.lastName && <span className="error-message">{errors.lastName}</span>}
                      </div>
                    </div>
                    
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className={errors.email ? 'error' : ''}
                          placeholder="Enter your email address"
                        />
                        {errors.email && <span className="error-message">{errors.email}</span>}
                      </div>
                      <div className="form-group">
                        <label htmlFor="phone">Phone Number</label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handlePhoneChange}
                          className={errors.phone ? 'error' : ''}
                          placeholder="(555) 123-4567"
                          maxLength="14"
                        />
                        {errors.phone && <span className="error-message">{errors.phone}</span>}
                      </div>
                    </div>
                  </div>

                  <div className="form-section">
                    <h3>Address Information</h3>
                    <div className="form-group">
                      <label htmlFor="address">Street Address</label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="Enter your street address"
                      />
                    </div>
                    
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="city">City</label>
                        <input
                          type="text"
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          placeholder="Enter your city"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="state">State</label>
                        <input
                          type="text"
                          id="state"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          placeholder="Enter your state"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="zipCode">ZIP Code</label>
                        <input
                          type="text"
                          id="zipCode"
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleInputChange}
                          placeholder="12345"
                          maxLength="5"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-section">
                    <h3>Identity Information</h3>
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="dateOfBirth">Date of Birth</label>
                        <input
                          type="date"
                          id="dateOfBirth"
                          name="dateOfBirth"
                          value={formData.dateOfBirth}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="ssn">Social Security Number</label>
                        <input
                          type="text"
                          id="ssn"
                          name="ssn"
                          value={formData.ssn}
                          disabled
                          className="disabled-field"
                        />
                        <small className="field-note">SSN cannot be changed for security reasons</small>
                      </div>
                    </div>
                  </div>

                  <div className="form-actions">
                    <button 
                      type="submit" 
                      className={`btn btn-primary ${isLoading ? 'loading' : ''}`}
                      disabled={isLoading}
                    >
                      {isLoading ? 'Updating...' : 'Update Profile'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="tab-content">
                <div className="content-header">
                  <h2>Security & Password</h2>
                  <p>Manage your password and security settings</p>
                </div>
                
                <form className="profile-form" onSubmit={handlePasswordSubmit}>
                  <div className="form-section">
                    <h3>Change Password</h3>
                    <div className="form-group">
                      <label htmlFor="currentPassword">Current Password</label>
                      <input
                        type="password"
                        id="currentPassword"
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        className={errors.currentPassword ? 'error' : ''}
                        placeholder="Enter your current password"
                      />
                      {errors.currentPassword && <span className="error-message">{errors.currentPassword}</span>}
                    </div>
                    
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="newPassword">New Password</label>
                        <input
                          type="password"
                          id="newPassword"
                          name="newPassword"
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                          className={errors.newPassword ? 'error' : ''}
                          placeholder="Enter your new password"
                        />
                        {errors.newPassword && <span className="error-message">{errors.newPassword}</span>}
                      </div>
                      <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm New Password</label>
                        <input
                          type="password"
                          id="confirmPassword"
                          name="confirmPassword"
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordChange}
                          className={errors.confirmPassword ? 'error' : ''}
                          placeholder="Confirm your new password"
                        />
                        {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
                      </div>
                    </div>
                  </div>

                  <div className="form-section">
                    <h3>Security Features</h3>
                    <div className="security-features">
                      <div className="security-item">
                        <div className="security-info">
                          <h4>Two-Factor Authentication</h4>
                          <p>Add an extra layer of security to your account</p>
                        </div>
                        <button className="btn btn-secondary">Enable 2FA</button>
                      </div>
                      <div className="security-item">
                        <div className="security-info">
                          <h4>Login Activity</h4>
                          <p>View recent login attempts and device activity</p>
                        </div>
                        <button className="btn btn-secondary">View Activity</button>
                      </div>
                    </div>
                  </div>

                  <div className="form-actions">
                    <button 
                      type="submit" 
                      className={`btn btn-primary ${isLoading ? 'loading' : ''}`}
                      disabled={isLoading}
                    >
                      {isLoading ? 'Updating...' : 'Update Password'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Preferences Tab */}
            {activeTab === 'preferences' && (
              <div className="tab-content">
                <div className="content-header">
                  <h2>Preferences</h2>
                  <p>Customize your banking experience</p>
                </div>
                
                <form className="profile-form" onSubmit={handlePreferencesSubmit}>
                  <div className="form-section">
                    <h3>Display Preferences</h3>
                    <div className="preference-group">
                      <label className="checkbox-container">
                        <input 
                          type="checkbox" 
                          name="darkMode"
                          checked={preferences.darkMode}
                          onChange={handlePreferenceChange}
                        />
                        <span className="checkmark"></span>
                        Enable Dark Mode
                      </label>
                      <p className="preference-description">Switch to dark theme for better viewing in low light</p>
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="language">Language</label>
                      <select 
                        id="language"
                        name="language"
                        value={preferences.language}
                        onChange={handlePreferenceChange}
                      >
                        <option value="en">English</option>
                        <option value="es">Español</option>
                        <option value="fr">Français</option>
                        <option value="de">Deutsch</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-section">
                    <h3>Notification Preferences</h3>
                    <div className="preference-group">
                      <label className="checkbox-container">
                        <input 
                          type="checkbox" 
                          name="emailNotifications"
                          checked={preferences.emailNotifications}
                          onChange={handlePreferenceChange}
                        />
                        <span className="checkmark"></span>
                        Email Notifications
                      </label>
                      <p className="preference-description">Receive important account updates via email</p>
                    </div>
                    
                    <div className="preference-group">
                      <label className="checkbox-container">
                        <input 
                          type="checkbox" 
                          name="smsNotifications"
                          checked={preferences.smsNotifications}
                          onChange={handlePreferenceChange}
                        />
                        <span className="checkmark"></span>
                        SMS Notifications
                      </label>
                      <p className="preference-description">Receive security alerts and transaction notifications via SMS</p>
                    </div>
                  </div>

                  <div className="form-actions">
                    <button 
                      type="submit" 
                      className={`btn btn-primary ${isLoading ? 'loading' : ''}`}
                      disabled={isLoading}
                    >
                      {isLoading ? 'Saving...' : 'Save Preferences'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Accounts Tab */}
            {activeTab === 'accounts' && (
              <div className="tab-content">
                <div className="content-header">
                  <h2>Account Settings</h2>
                  <p>Manage your banking accounts and preferences</p>
                </div>
                
                <div className="accounts-section">
                  {user && user.accounts && user.accounts.length > 0 ? (
                    user.accounts.map((account, index) => (
                      <div key={index} className="account-settings-card">
                        <div className="account-header">
                          <h3>{account.type.charAt(0).toUpperCase() + account.type.slice(1)} Account</h3>
                          <span className="account-number">****{account.accountNumber.slice(-4)}</span>
                        </div>
                        <div className="account-details">
                          <div className="detail-item">
                            <span className="label">Account Number:</span>
                            <span className="value">****{account.accountNumber.slice(-4)}</span>
                          </div>
                          <div className="detail-item">
                            <span className="label">Balance:</span>
                            <span className="value">
                              ${account.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                          </div>
                          <div className="detail-item">
                            <span className="label">Status:</span>
                            <span className="value status-active">Active</span>
                          </div>
                        </div>
                        <div className="account-actions">
                          <button className="btn btn-secondary">View Statements</button>
                          <button className="btn btn-secondary">Account Details</button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="no-accounts">
                      <p>No accounts found. Please contact support.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="tab-content">
                <div className="content-header">
                  <h2>Notification Settings</h2>
                  <p>Configure how you receive notifications</p>
                </div>
                
                <div className="notifications-section">
                  <div className="notification-category">
                    <h3>Transaction Notifications</h3>
                    <div className="notification-options">
                      <div className="notification-item">
                        <div className="notification-info">
                          <h4>Large Transactions</h4>
                          <p>Get notified for transactions over $500</p>
                        </div>
                        <div className="notification-controls">
                          <label className="toggle-switch">
                            <input type="checkbox" defaultChecked />
                            <span className="slider"></span>
                          </label>
                        </div>
                      </div>
                      <div className="notification-item">
                        <div className="notification-info">
                          <h4>Account Balance Alerts</h4>
                          <p>Receive alerts when balance falls below threshold</p>
                        </div>
                        <div className="notification-controls">
                          <label className="toggle-switch">
                            <input type="checkbox" defaultChecked />
                            <span className="slider"></span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="notification-category">
                    <h3>Security Notifications</h3>
                    <div className="notification-options">
                      <div className="notification-item">
                        <div className="notification-info">
                          <h4>Login Attempts</h4>
                          <p>Get notified of new login attempts</p>
                        </div>
                        <div className="notification-controls">
                          <label className="toggle-switch">
                            <input type="checkbox" defaultChecked />
                            <span className="slider"></span>
                          </label>
                        </div>
                      </div>
                      <div className="notification-item">
                        <div className="notification-info">
                          <h4>Password Changes</h4>
                          <p>Receive confirmation when password is changed</p>
                        </div>
                        <div className="notification-controls">
                          <label className="toggle-switch">
                            <input type="checkbox" defaultChecked />
                            <span className="slider"></span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
