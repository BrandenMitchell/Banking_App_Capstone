import React, { useState, useEffect, useCallback } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import axios from 'axios';

const PlaidLink = ({ onSuccess, onExit }) => {
  const [linkToken, setLinkToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch link token from backend
  useEffect(() => {
    const fetchLinkToken = async () => {
      try {
        const token = localStorage.getItem('token');
        
        console.log('PlaidLink: Checking authentication...');
        if (!token) {
          console.error('PlaidLink: No auth token found in localStorage');
          setError('Not authenticated. Please log in.');
          setLoading(false);
          return;
        }

        console.log('PlaidLink: Fetching link token from backend...');
        const response = await axios.post(
          'http://localhost:5000/api/plaid/create_link_token',
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log('PlaidLink: Successfully received link token!');
        setLinkToken(response.data.link_token);
        setLoading(false);
      } catch (error) {
        console.error('PlaidLink: Error fetching link token:', error);
        console.error('PlaidLink: Error response:', error.response?.data);
        const errorMsg = error.response?.data?.error || 'Failed to connect to Plaid. Check server configuration.';
        setError(errorMsg);
        setLoading(false);
      }
    };

    fetchLinkToken();
  }, []);

  // Exchange public token for access token
  const onSuccessCallback = useCallback(
    async (public_token, metadata) => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.post(
          'http://localhost:5000/api/plaid/exchange_public_token',
          { public_token, metadata },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          onSuccess(response.data.accounts);
        }
      } catch (error) {
        console.error('Error exchanging public token:', error);
      }
    },
    [onSuccess]
  );

  const config = {
    token: linkToken,
    onSuccess: onSuccessCallback,
    onExit: onExit || (() => {}),
  };

  const { open, ready } = usePlaidLink(config);

  if (loading) {
    return (
      <button className="plaid-link-button" disabled style={{
        backgroundColor: '#588157',
        color: '#fff',
        padding: '12px 24px',
        border: 'none',
        borderRadius: '8px',
        fontSize: '16px',
        fontWeight: '600',
        cursor: 'not-allowed',
        opacity: 0.6,
      }}>
        Loading...
      </button>
    );
  }

  if (error) {
    return (
      <button 
        className="plaid-link-button" 
        disabled 
        title={error}
        style={{
          backgroundColor: '#d32f2f',
          color: '#fff',
          padding: '12px 24px',
          border: 'none',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: '600',
          cursor: 'not-allowed',
          opacity: 0.8,
        }}
      >
        ⚠ Setup Required
      </button>
    );
  }

  return (
    <button
      onClick={() => open()}
      disabled={!ready}
      className="plaid-link-button"
      title={!ready ? 'Initializing Plaid Link...' : 'Click to link your bank account'}
      style={{
        backgroundColor: '#588157',
        color: '#fff',
        padding: '12px 24px',
        border: 'none',
        borderRadius: '8px',
        fontSize: '16px',
        fontWeight: '600',
        cursor: ready ? 'pointer' : 'not-allowed',
        opacity: ready ? 1 : 0.6,
        transition: 'all 0.3s ease',
      }}
      onMouseOver={(e) => {
        if (ready) e.target.style.backgroundColor = '#3a5a40';
      }}
      onMouseOut={(e) => {
        if (ready) e.target.style.backgroundColor = '#588157';
      }}
    >
      Link Bank Account
    </button>
  );
};

export default PlaidLink;

