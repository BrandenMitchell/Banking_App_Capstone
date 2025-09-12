import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import App from '../App';
import api from '../services/api';

// Mock the API service
jest.mock('../services/api');

// Mock the components
jest.mock('../components/HomePage', () => {
  return function MockHomePage({ user, onLogout }) {
    return (
      <div data-testid="homepage">
        <div>HomePage Component</div>
        <div>User: {user ? `${user.firstName} ${user.lastName}` : 'No User'}</div>
        <button onClick={onLogout}>Logout</button>
      </div>
    );
  };
});

jest.mock('../components/AuthPage', () => {
  return function MockAuthPage({ onLogin }) {
    return (
      <div data-testid="authpage">
        <div>AuthPage Component</div>
        <button onClick={() => onLogin({ firstName: 'Test', lastName: 'User' })}>
          Mock Login
        </button>
      </div>
    );
  };
});

describe('App Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn(),
      },
      writable: true,
    });
  });

  describe('Initial Load', () => {
    it('should show loading state initially', () => {
      render(<App />);
      
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('should show AuthPage when not authenticated', async () => {
      api.getToken.mockReturnValue(null);
      
      render(<App />);
      
      await waitFor(() => {
        expect(screen.getByTestId('authpage')).toBeInTheDocument();
        expect(screen.getByText('AuthPage Component')).toBeInTheDocument();
      });
    });

    it('should show HomePage when authenticated', async () => {
      const mockUser = {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com'
      };

      api.getToken.mockReturnValue('valid-token');
      api.getCurrentUser.mockResolvedValue({ user: mockUser });
      
      render(<App />);
      
      await waitFor(() => {
        expect(screen.getByTestId('homepage')).toBeInTheDocument();
        expect(screen.getByText('HomePage Component')).toBeInTheDocument();
        expect(screen.getByText('User: John Doe')).toBeInTheDocument();
      });
    });

    it('should handle authentication check error', async () => {
      api.getToken.mockReturnValue('invalid-token');
      api.getCurrentUser.mockRejectedValue(new Error('Invalid token'));
      
      render(<App />);
      
      await waitFor(() => {
        expect(screen.getByTestId('authpage')).toBeInTheDocument();
        expect(api.logout).toHaveBeenCalled();
      });
    });
  });

  describe('Authentication Flow', () => {
    it('should switch to HomePage after successful login', async () => {
      api.getToken.mockReturnValue(null);
      
      render(<App />);
      
      await waitFor(() => {
        expect(screen.getByTestId('authpage')).toBeInTheDocument();
      });
      
      const loginButton = screen.getByText('Mock Login');
      fireEvent.click(loginButton);
      
      await waitFor(() => {
        expect(screen.getByTestId('homepage')).toBeInTheDocument();
        expect(screen.getByText('User: Test User')).toBeInTheDocument();
      });
    });

    it('should switch to AuthPage after logout', async () => {
      const mockUser = {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com'
      };

      api.getToken.mockReturnValue('valid-token');
      api.getCurrentUser.mockResolvedValue({ user: mockUser });
      
      render(<App />);
      
      await waitFor(() => {
        expect(screen.getByTestId('homepage')).toBeInTheDocument();
      });
      
      const logoutButton = screen.getByText('Logout');
      fireEvent.click(logoutButton);
      
      await waitFor(() => {
        expect(screen.getByTestId('authpage')).toBeInTheDocument();
        expect(api.logout).toHaveBeenCalled();
      });
    });
  });

  describe('Loading States', () => {
    it('should show loading while checking authentication', () => {
      api.getToken.mockReturnValue('token');
      api.getCurrentUser.mockImplementation(() => new Promise(() => {})); // Never resolves
      
      render(<App />);
      
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should handle API errors gracefully', async () => {
      api.getToken.mockReturnValue('token');
      api.getCurrentUser.mockRejectedValue(new Error('Network error'));
      
      render(<App />);
      
      await waitFor(() => {
        expect(screen.getByTestId('authpage')).toBeInTheDocument();
        expect(api.logout).toHaveBeenCalled();
      });
    });
  });
});
