import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import "../css/login.css";

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    phoneNumber: '',
    street: '',
    city: '',
    state: '',
    zip: ''
  });

  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // Update field values
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Front-end field validation
    for (let key in formData) {
      if (!formData[key]) {
        setMessage(`Please fill out the ${key} field.`);
        setIsSuccess(false);
        return;
      }
    }

    try {
      const response = await fetch('http://localhost:5000/api/users/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSuccess(true);
        setMessage('Registration successful!');
        setFormData({
          fullName: '',
          username: '',
          email: '',
          password: '',
          phoneNumber: '',
          street: '',
          city: '',
          state: '',
          zip: ''
        });
      } else {
        setIsSuccess(false);
        setMessage(data.errors || 'Registration failed');
      }
    } catch (error) {
      setIsSuccess(false);
      setMessage('Network error or server unavailable');
      console.error('Error during registration:', error);
    }
  };

  return (
      <div className="login-card shadow-lg rounded-3">
        <h2 className="text-center mb-4">Create Account</h2>
        <form onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="mb-3">
            <label className="form-label small-label">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="form-control"
              placeholder="John Doe"
            />
          </div>

          {/* Username */}
          <div className="mb-3">
            <label className="form-label small-label">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="form-control"
              placeholder="johndoe123"
            />
          </div>

          {/* Email */}
          <div className="mb-3">
            <label className="form-label small-label">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-control"
              placeholder="you@example.com"
            />
          </div>

          {/* Password */}
          <div className="mb-3">
            <label className="form-label small-label">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form-control"
              placeholder="••••••••"
            />
          </div>

          {/* Phone */}
          <div className="mb-3">
            <label className="form-label small-label">Phone Number</label>
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="form-control"
              placeholder="+1 (555) 123-4567"
            />
          </div>


          <div className="mb-3">
            <label className="form-label small-label">Street</label>
            <input
              type="text"
              name="street"
              value={formData.street}
              onChange={handleChange}
              className="form-control"
              placeholder="123 Ocean Avenue"
            />
          </div>

          <div className="address-row">
            <div style={{ flex: 2 }} className="mb-3">
              <label className="form-label small-label">City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="form-control"
                placeholder="Neptune City"
              />
            </div>
            <div style={{ flex: 1 }} className="mb-3">
              <label className="form-label small-label">State</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="form-control"
                placeholder="NJ"
              />
            </div>
            <div style={{ flex: 1 }} className="mb-3">
              <label className="form-label small-label">ZIP</label>
              <input
                type="text"
                name="zip"
                value={formData.zip}
                onChange={handleChange}
                className="form-control"
                placeholder="07753"
              />
            </div>
          </div>

          {/* Submit */}
          <button type="submit" className="btn btn-primary w-100">Register</button>
        </form>

        {/* Links */}
        <div className="text-center mt-3 small-text login-links">
          <span>
            Already have an account? <Link to="/login" className="text-primary fw-bold">Login here</Link>
          </span>
        </div>

        {/* Status Message */}
        {message && (
          <p style={{ textAlign: 'center', marginTop: '20px', fontWeight: 500, color: isSuccess ? 'green' : 'red' }}>
            {message}
          </p>
        )}
      </div>
  );
};

export default RegisterForm;
