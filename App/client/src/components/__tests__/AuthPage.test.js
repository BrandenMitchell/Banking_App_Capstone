import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AuthPage from '../AuthPage';
import api from '../../services/api';

// Mock the API service
jest.mock('../../services/api');

describe('AuthPage Component', () => {
  const mockOnLogin = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render login form by default', () => {
      render(<AuthPage onLogin={mockOnLogin} />);
      
      expect(screen.getByText('Sign In')).toBeInTheDocument();
      expect(screen.getByText('Sign Up')).toBeInTheDocument();
      expect(screen.getByText('Welcome Back')).toBeInTheDocument();
      expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
      expect(screen.getByLabelText('Password')).toBeInTheDocument();
    });

    it('should render registration form when sign up tab is clicked', () => {
      render(<AuthPage onLogin={mockOnLogin} />);
      
      const signUpTab = screen.getAllByRole('button', { name: 'Sign Up' })[0]; // Get the tab button, not the toggle link
      fireEvent.click(signUpTab);
      
      expect(screen.getByRole('heading', { name: 'Create Account' })).toBeInTheDocument();
      expect(screen.getByLabelText('First Name')).toBeInTheDocument();
      expect(screen.getByLabelText('Last Name')).toBeInTheDocument();
      expect(screen.getByLabelText('Phone Number')).toBeInTheDocument();
      expect(screen.getByLabelText('Social Security Number')).toBeInTheDocument();
      expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
    });
  });

  describe('Form Validation', () => {
    it('should show validation errors for empty required fields', async () => {
      render(<AuthPage onLogin={mockOnLogin} />);
      
      const submitButton = screen.getAllByRole('button', { name: 'Sign In' })[1]; // Get the submit button, not the tab
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('Email is required')).toBeInTheDocument();
        expect(screen.getByText('Password is required')).toBeInTheDocument();
      });
    });

    it('should show validation error for invalid email format', async () => {
      render(<AuthPage onLogin={mockOnLogin} />);
      
      const emailInput = screen.getByLabelText('Email Address');
      fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
      
      const submitButton = screen.getAllByRole('button', { name: 'Sign In' })[1]; // Get the submit button, not the tab
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('Email is invalid')).toBeInTheDocument();
      });
    });

    it('should show validation error for short password', async () => {
      render(<AuthPage onLogin={mockOnLogin} />);
      
      const passwordInput = screen.getByLabelText('Password');
      fireEvent.change(passwordInput, { target: { value: '123' } });
      
      const submitButton = screen.getAllByRole('button', { name: 'Sign In' })[1]; // Get the submit button, not the tab
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('Password must be at least 8 characters')).toBeInTheDocument();
      });
    });

    it('should validate registration form fields', async () => {
      render(<AuthPage onLogin={mockOnLogin} />);
      
      // Switch to registration form
      const signUpTab = screen.getAllByRole('button', { name: 'Sign Up' })[0]; // Get the tab button, not the toggle link
      fireEvent.click(signUpTab);
      
      const submitButton = screen.getByRole('button', { name: 'Create Account' });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('First name is required')).toBeInTheDocument();
        expect(screen.getByText('Last name is required')).toBeInTheDocument();
        expect(screen.getByText('Phone number is required')).toBeInTheDocument();
        expect(screen.getByText('SSN is required')).toBeInTheDocument();
      });
    });

    it('should validate phone number format in registration', async () => {
      render(<AuthPage onLogin={mockOnLogin} />);
      
      // Switch to registration form
      const signUpTab = screen.getAllByRole('button', { name: 'Sign Up' })[0]; // Get the tab button, not the toggle link
      fireEvent.click(signUpTab);
      
      const phoneInput = screen.getByLabelText('Phone Number');
      fireEvent.change(phoneInput, { target: { value: '123' } });
      
      const submitButton = screen.getByRole('button', { name: 'Create Account' });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('Phone number must be 10 digits')).toBeInTheDocument();
      });
    });

    it('should validate SSN format in registration', async () => {
      render(<AuthPage onLogin={mockOnLogin} />);
      
      // Switch to registration form
      const signUpTab = screen.getAllByRole('button', { name: 'Sign Up' })[0]; // Get the tab button, not the toggle link
      fireEvent.click(signUpTab);
      
      const ssnInput = screen.getByLabelText('Social Security Number');
      fireEvent.change(ssnInput, { target: { value: '123' } });
      
      const submitButton = screen.getByRole('button', { name: 'Create Account' });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('SSN must be 9 digits')).toBeInTheDocument();
      });
    });

    it('should validate password confirmation match', async () => {
      render(<AuthPage onLogin={mockOnLogin} />);
      
      // Switch to registration form
      const signUpTab = screen.getAllByRole('button', { name: 'Sign Up' })[0]; // Get the tab button, not the toggle link
      fireEvent.click(signUpTab);
      
      const passwordInput = screen.getByLabelText('Password');
      const confirmPasswordInput = screen.getByLabelText('Confirm Password');
      
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'different123' } });
      
      const submitButton = screen.getByRole('button', { name: 'Create Account' });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
      });
    });
  });

  describe('Form Submission', () => {
    it('should handle successful login', async () => {
      const mockUser = {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com'
      };

      api.login.mockResolvedValueOnce({
        message: 'Login successful',
        user: mockUser
      });

      render(<AuthPage onLogin={mockOnLogin} />);
      
      const emailInput = screen.getByLabelText('Email Address');
      const passwordInput = screen.getByLabelText('Password');
      const submitButton = screen.getAllByRole('button', { name: 'Sign In' })[1]; // Get the submit button, not the tab
      
      fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(api.login).toHaveBeenCalledWith('john@example.com', 'password123');
        expect(mockOnLogin).toHaveBeenCalledWith(mockUser);
      });
    });

    it('should handle login error', async () => {
      api.login.mockRejectedValueOnce(new Error('Invalid credentials'));

      render(<AuthPage onLogin={mockOnLogin} />);
      
      const emailInput = screen.getByLabelText('Email Address');
      const passwordInput = screen.getByLabelText('Password');
      const submitButton = screen.getAllByRole('button', { name: 'Sign In' })[1]; // Get the submit button, not the tab
      
      fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(api.login).toHaveBeenCalledWith('john@example.com', 'wrongpassword');
        expect(mockOnLogin).not.toHaveBeenCalled();
      });
    });

    it('should handle successful registration', async () => {
      api.register.mockResolvedValueOnce({
        message: 'Registration successful'
      });

      render(<AuthPage onLogin={mockOnLogin} />);
      
      // Switch to registration form
      const signUpTab = screen.getAllByRole('button', { name: 'Sign Up' })[0]; // Get the tab button, not the toggle link
      fireEvent.click(signUpTab);
      
      const firstNameInput = screen.getByLabelText('First Name');
      const lastNameInput = screen.getByLabelText('Last Name');
      const emailInput = screen.getByLabelText('Email Address');
      const phoneInput = screen.getByLabelText('Phone Number');
      const ssnInput = screen.getByLabelText('Social Security Number');
      const passwordInput = screen.getByLabelText('Password');
      const confirmPasswordInput = screen.getByLabelText('Confirm Password');
      const submitButton = screen.getByRole('button', { name: 'Create Account' });
      
      fireEvent.change(firstNameInput, { target: { value: 'John' } });
      fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
      fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
      fireEvent.change(phoneInput, { target: { value: '1234567890' } });
      fireEvent.change(ssnInput, { target: { value: '123456789' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(api.register).toHaveBeenCalledWith({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          password: 'password123',
          phone: '1234567890',
          ssn: '123456789'
        });
      });
    });

    it('should show loading state during submission', async () => {
      api.login.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 1000)));

      render(<AuthPage onLogin={mockOnLogin} />);
      
      const emailInput = screen.getByLabelText('Email Address');
      const passwordInput = screen.getByLabelText('Password');
      const submitButton = screen.getAllByRole('button', { name: 'Sign In' })[1]; // Get the submit button, not the tab
      
      fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);
      
      expect(screen.getAllByRole('button', { disabled: true })).toHaveLength(1);
    });
  });

  describe('Tab Switching', () => {
    it('should switch between login and registration forms', () => {
      render(<AuthPage onLogin={mockOnLogin} />);
      
      // Initially on login form
      expect(screen.getByText('Welcome Back')).toBeInTheDocument();
      
      // Switch to registration
      const signUpTab = screen.getAllByRole('button', { name: 'Sign Up' })[0]; // Get the tab button, not the toggle link
      fireEvent.click(signUpTab);
      expect(screen.getByRole('heading', { name: 'Create Account' })).toBeInTheDocument();
      
      // Switch back to login
      const signInTab = screen.getAllByRole('button', { name: 'Sign In' })[0]; // Get the tab button, not the submit button
      fireEvent.click(signInTab);
      expect(screen.getByText('Welcome Back')).toBeInTheDocument();
    });

    it('should clear form data when switching tabs', () => {
      render(<AuthPage onLogin={mockOnLogin} />);
      
      const emailInput = screen.getByLabelText('Email Address');
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      
      // Switch to registration and back
      const signUpTab = screen.getAllByRole('button', { name: 'Sign Up' })[0]; // Get the tab button, not the toggle link
      fireEvent.click(signUpTab);
      const signInTab = screen.getAllByRole('button', { name: 'Sign In' })[0]; // Get the tab button, not the submit button
      fireEvent.click(signInTab);
      
      expect(emailInput.value).toBe('');
    });
  });
});
