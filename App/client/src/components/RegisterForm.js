import React, { useState } from 'react';

const RegisterForm = () => {
  // State to hold the form input values
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  // State to hold the status message from the API call
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // Handle input changes and update the state
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    try {
      // Make a POST request to your backend registration endpoint
      const response = await fetch('http://localhost:3001/api/users/', { // Adjust URL if needed
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSuccess(true);
        setMessage(data.message);
        // Optionally, clear the form after a successful registration
        setFormData({ username: '', email: '', password: '' });
      } else {
        setIsSuccess(false);
        setMessage(data.message || 'Registration failed');
      }
    } catch (error) {
      setIsSuccess(false);
      setMessage('Network error or server unavailable');
      console.error('Error during registration:', error);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h2>Register a New User</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>
        <button type="submit" style={{ padding: '10px 15px', cursor: 'pointer' }}>Register</button>
      </form>
      {message && (
        <p style={{ color: isSuccess ? 'green' : 'red', marginTop: '15px' }}>
          {message}
        </p>
      )}
    </div>
  );
};

export default RegisterForm;