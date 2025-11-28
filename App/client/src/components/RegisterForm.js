import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/authContext';

const RegisterForm = () => {
  const { login } = useContext(AuthContext); // We can auto-login after registration
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

  // Update form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Validate password strength
  const validatePassword = (pwd) => {
    const regex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{15,}$/;
    return regex.test(pwd);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check all fields are filled
    for (let key in formData) {
      if (!formData[key]) {
        setMessage(`Please fill out the ${key} field.`);
        setIsSuccess(false);
        return;
      }
    }

    if (!validatePassword(formData.password)) {
      setMessage('Password must be at least 15 characters long and include a number and a special character.');
      setIsSuccess(false);
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || 'Registration failed');
        setIsSuccess(false);
        return;
      }

      setIsSuccess(true);
      setMessage('Registration successful! Logging in...');

      // Auto-login user after registration
      await login({ username: formData.username, email: formData.email, password: formData.password });

      // Clear form
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

    } catch (err) {
      console.error('Registration error:', err);
      setMessage('Network error or server unavailable');
      setIsSuccess(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Create Your Neptune Account 🌊</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        {/* Full Name */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Full Name</label>
          <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} style={styles.input} placeholder="John Doe"/>
        </div>

        {/* Username */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Username</label>
          <input type="text" name="username" value={formData.username} onChange={handleChange} style={styles.input} placeholder="johndoe123"/>
        </div>

        {/* Email */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} style={styles.input} placeholder="you@example.com"/>
        </div>

        {/* Password */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Password</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} style={styles.input} placeholder="••••••••"/>
          <div className="form-text small-text">
            Must be 15+ characters, include a number and special character.
          </div>
        </div>

        {/* Phone */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Phone Number</label>
          <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} style={styles.input} placeholder="+1 (555) 123-4567"/>
        </div>

        {/* Address */}
        <h3 style={{ marginTop: '25px', color: '#1a237e' }}>Address Information</h3>
        <div style={styles.formGroup}>
          <label style={styles.label}>Street</label>
          <input type="text" name="street" value={formData.street} onChange={handleChange} style={styles.input} placeholder="123 Ocean Avenue"/>
        </div>

        <div style={styles.addressRow}>
          <div style={{ ...styles.formGroup, flex: 2 }}>
            <label style={styles.label}>City</label>
            <input type="text" name="city" value={formData.city} onChange={handleChange} style={styles.input} placeholder="Neptune City"/>
          </div>
          <div style={{ ...styles.formGroup, flex: 1, marginLeft: '10px' }}>
            <label style={styles.label}>State</label>
            <input type="text" name="state" value={formData.state} onChange={handleChange} style={styles.input} placeholder="NJ"/>
          </div>
          <div style={{ ...styles.formGroup, flex: 1, marginLeft: '10px' }}>
            <label style={styles.label}>ZIP</label>
            <input type="text" name="zip" value={formData.zip} onChange={handleChange} style={styles.input} placeholder="07753"/>
          </div>
        </div>

        {/* Submit */}
        <button type="submit" style={styles.button}>Register</button>
      </form>

      {/* Message */}
      {message && (
        <p style={{ ...styles.message, color: isSuccess ? 'green' : 'red' }}>
          {message}
        </p>
      )}
    </div>
  );
};

export default RegisterForm;

const styles = {
  container: {
    maxWidth: '600px',
    margin: '50px auto',
    padding: '30px',
    borderRadius: '10px',
    backgroundColor: '#f9fbfd',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
    fontFamily: 'Inter, sans-serif',
  },
  heading: {
    textAlign: 'center',
    color: '#1a237e',
    marginBottom: '25px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  formGroup: {
    marginBottom: '15px',
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    marginBottom: '5px',
    color: '#333',
    fontWeight: '500',
  },
  input: {
    padding: '10px 12px',
    border: '1px solid #ccc',
    borderRadius: '6px',
    fontSize: '14px',
  },
  addressRow: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: '#1a73e8',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    padding: '12px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '10px',
    transition: '0.2s',
  },
  message: {
    textAlign: 'center',
    marginTop: '20px',
    fontWeight: '500',
  },
};
