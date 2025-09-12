import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProfilePage from '../ProfilePage';

describe('ProfilePage Component', () => {
  const mockUser = {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phone: '1234567890',
    address: '123 Main St',
    city: 'Anytown',
    state: 'CA',
    zipCode: '12345',
    dateOfBirth: '1990-01-01',
    ssn: '123456789',
    accounts: [
      {
        type: 'checking',
        accountNumber: '1234567890',
        balance: 1250.50,
        isActive: true
      },
      {
        type: 'savings',
        accountNumber: '0987654321',
        balance: 5000.00,
        isActive: true
      }
    ]
  };

  const mockOnBack = jest.fn();
  const mockOnLogout = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render profile page with user data', () => {
      render(<ProfilePage user={mockUser} onBack={mockOnBack} onLogout={mockOnLogout} />);
      
      expect(screen.getByText('Profile & Settings')).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: 'Personal Information' })).toBeInTheDocument();
      expect(screen.getByText('Security & Password')).toBeInTheDocument();
      expect(screen.getByText('Preferences')).toBeInTheDocument();
    });

    it('should render with default values when user data is minimal', () => {
      const minimalUser = { id: '1', email: 'test@example.com' };
      render(<ProfilePage user={minimalUser} onBack={mockOnBack} onLogout={mockOnLogout} />);
      
      expect(screen.getByText('Profile & Settings')).toBeInTheDocument();
      expect(screen.getByText('User')).toBeInTheDocument();
    });

    it('should render sidebar navigation', () => {
      render(<ProfilePage user={mockUser} onBack={mockOnBack} onLogout={mockOnLogout} />);
      
      expect(screen.getByText('Account')).toBeInTheDocument();
      expect(screen.getByText('Banking')).toBeInTheDocument();
      expect(screen.getAllByText('Personal Information')).toHaveLength(2); // Nav item and content header
      expect(screen.getByText('Security & Password')).toBeInTheDocument();
      expect(screen.getByText('Preferences')).toBeInTheDocument();
      expect(screen.getByText('Account Settings')).toBeInTheDocument();
      expect(screen.getByText('Notifications')).toBeInTheDocument();
    });
  });

  describe('Navigation', () => {
    it('should call onBack when back button is clicked', () => {
      render(<ProfilePage user={mockUser} onBack={mockOnBack} onLogout={mockOnLogout} />);
      
      const backButton = screen.getByText('Back to Dashboard');
      fireEvent.click(backButton);
      
      expect(mockOnBack).toHaveBeenCalledTimes(1);
    });

    it('should call onLogout when logout button is clicked', () => {
      render(<ProfilePage user={mockUser} onBack={mockOnBack} onLogout={mockOnLogout} />);
      
      const logoutButton = screen.getByText('Logout');
      fireEvent.click(logoutButton);
      
      expect(mockOnLogout).toHaveBeenCalledTimes(1);
    });

    it('should switch between tabs when navigation items are clicked', () => {
      render(<ProfilePage user={mockUser} onBack={mockOnBack} onLogout={mockOnLogout} />);
      
      // Initially on Personal Information tab - check content header
      expect(screen.getByRole('heading', { name: 'Personal Information' })).toBeInTheDocument();
      
      // Click Security tab
      const securityTab = screen.getByText('Security & Password');
      fireEvent.click(securityTab);
      
      expect(screen.getByRole('heading', { name: 'Security & Password' })).toBeInTheDocument();
      expect(screen.getByText('Change Password')).toBeInTheDocument();
      
      // Click Preferences tab
      const preferencesTab = screen.getByText('Preferences');
      fireEvent.click(preferencesTab);
      
      expect(screen.getByRole('heading', { name: 'Preferences' })).toBeInTheDocument();
      expect(screen.getByText('Display Preferences')).toBeInTheDocument();
    });
  });

  describe('Personal Information Tab', () => {
    it('should display user information in form fields', () => {
      render(<ProfilePage user={mockUser} onBack={mockOnBack} onLogout={mockOnLogout} />);
      
      expect(screen.getByDisplayValue('John')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Doe')).toBeInTheDocument();
      expect(screen.getByDisplayValue('john@example.com')).toBeInTheDocument();
      expect(screen.getByDisplayValue('1234567890')).toBeInTheDocument();
    });

    it('should update form fields when user types', () => {
      render(<ProfilePage user={mockUser} onBack={mockOnBack} onLogout={mockOnLogout} />);
      
      const firstNameInput = screen.getByDisplayValue('John');
      fireEvent.change(firstNameInput, { target: { value: 'Jane' } });
      
      expect(firstNameInput.value).toBe('Jane');
    });

    it('should validate required fields', async () => {
      render(<ProfilePage user={mockUser} onBack={mockOnBack} onLogout={mockOnLogout} />);
      
      const firstNameInput = screen.getByDisplayValue('John');
      fireEvent.change(firstNameInput, { target: { value: '' } });
      
      const updateButton = screen.getByText('Update Profile');
      fireEvent.click(updateButton);
      
      await waitFor(() => {
        expect(screen.getByText('First name is required')).toBeInTheDocument();
      });
    });

    it('should format phone number input', () => {
      render(<ProfilePage user={mockUser} onBack={mockOnBack} onLogout={mockOnLogout} />);
      
      const phoneInput = screen.getByDisplayValue('1234567890');
      fireEvent.change(phoneInput, { target: { value: '5551234567' } });
      
      expect(phoneInput.value).toBe('(555) 123-4567');
    });

    it('should show success message after form submission', async () => {
      render(<ProfilePage user={mockUser} onBack={mockOnBack} onLogout={mockOnLogout} />);
      
      const updateButton = screen.getByText('Update Profile');
      fireEvent.click(updateButton);
      
      await waitFor(() => {
        expect(screen.getByText('Profile updated successfully!')).toBeInTheDocument();
      });
    });
  });

  describe('Security Tab', () => {
    beforeEach(() => {
      render(<ProfilePage user={mockUser} onBack={mockOnBack} onLogout={mockOnLogout} />);
      
      const securityTab = screen.getByText('Security & Password');
      fireEvent.click(securityTab);
    });

    it('should display password change form', () => {
      expect(screen.getByText('Change Password')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter your current password')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter your new password')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Confirm your new password')).toBeInTheDocument();
    });

    it('should validate password fields', async () => {
      const updateButton = screen.getByText('Update Password');
      fireEvent.click(updateButton);
      
      await waitFor(() => {
        expect(screen.getByText('Current password is required')).toBeInTheDocument();
        expect(screen.getByText('New password is required')).toBeInTheDocument();
      });
    });

    it('should validate password confirmation', async () => {
      const newPasswordInput = screen.getByPlaceholderText('Enter your new password');
      const confirmPasswordInput = screen.getByPlaceholderText('Confirm your new password');
      
      fireEvent.change(newPasswordInput, { target: { value: 'newpassword123' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'differentpassword' } });
      
      const updateButton = screen.getByText('Update Password');
      fireEvent.click(updateButton);
      
      await waitFor(() => {
        expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
      });
    });

    it('should display security features', () => {
      expect(screen.getByText('Two-Factor Authentication')).toBeInTheDocument();
      expect(screen.getByText('Login Activity')).toBeInTheDocument();
    });
  });

  describe('Preferences Tab', () => {
    beforeEach(() => {
      render(<ProfilePage user={mockUser} onBack={mockOnBack} onLogout={mockOnLogout} />);
      
      const preferencesTab = screen.getByText('Preferences');
      fireEvent.click(preferencesTab);
    });

    it('should display preference options', () => {
      expect(screen.getByText('Display Preferences')).toBeInTheDocument();
      expect(screen.getByText('Enable Dark Mode')).toBeInTheDocument();
      expect(screen.getByText('Language')).toBeInTheDocument();
      expect(screen.getByText('Notification Preferences')).toBeInTheDocument();
      expect(screen.getByText('Email Notifications')).toBeInTheDocument();
      expect(screen.getByText('SMS Notifications')).toBeInTheDocument();
    });

    it('should toggle checkboxes', () => {
      const darkModeCheckbox = screen.getByLabelText('Enable Dark Mode');
      expect(darkModeCheckbox.checked).toBe(false);
      
      fireEvent.click(darkModeCheckbox);
      expect(darkModeCheckbox.checked).toBe(true);
    });

    it('should change language selection', () => {
      const languageSelect = screen.getByDisplayValue('English');
      fireEvent.change(languageSelect, { target: { value: 'es' } });
      
      expect(languageSelect.value).toBe('es');
    });
  });

  describe('Account Settings Tab', () => {
    beforeEach(() => {
      render(<ProfilePage user={mockUser} onBack={mockOnBack} onLogout={mockOnLogout} />);
      
      const accountsTab = screen.getByText('Account Settings');
      fireEvent.click(accountsTab);
    });

    it('should display user accounts', () => {
      expect(screen.getByText('Checking Account')).toBeInTheDocument();
      expect(screen.getByText('Savings Account')).toBeInTheDocument();
      expect(screen.getAllByText('****7890')).toHaveLength(2); // Account number appears twice
      expect(screen.getAllByText('****4321')).toHaveLength(2); // Account number appears twice
    });

    it('should display account balances', () => {
      expect(screen.getByText('$1,250.50')).toBeInTheDocument();
      expect(screen.getByText('$5,000.00')).toBeInTheDocument();
    });

    it('should display account actions', () => {
      expect(screen.getAllByText('View Statements')).toHaveLength(2);
      expect(screen.getAllByText('Account Details')).toHaveLength(2);
    });
  });

  describe('Notifications Tab', () => {
    beforeEach(() => {
      render(<ProfilePage user={mockUser} onBack={mockOnBack} onLogout={mockOnLogout} />);
      
      const notificationsTab = screen.getByText('Notifications');
      fireEvent.click(notificationsTab);
    });

    it('should display notification categories', () => {
      expect(screen.getByText('Transaction Notifications')).toBeInTheDocument();
      expect(screen.getByText('Security Notifications')).toBeInTheDocument();
    });

    it('should display notification options', () => {
      expect(screen.getByText('Large Transactions')).toBeInTheDocument();
      expect(screen.getByText('Account Balance Alerts')).toBeInTheDocument();
      expect(screen.getByText('Login Attempts')).toBeInTheDocument();
      expect(screen.getByText('Password Changes')).toBeInTheDocument();
    });

    it('should have toggle switches for notifications', () => {
      const toggleSwitches = screen.getAllByRole('checkbox');
      expect(toggleSwitches.length).toBeGreaterThan(0);
    });
  });

  describe('Form Validation', () => {
    it('should validate email format', async () => {
      render(<ProfilePage user={mockUser} onBack={mockOnBack} onLogout={mockOnLogout} />);
      
      const emailInput = screen.getByDisplayValue('john@example.com');
      fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
      
      const updateButton = screen.getByText('Update Profile');
      fireEvent.click(updateButton);
      
      await waitFor(() => {
        expect(screen.getByText('Email is invalid')).toBeInTheDocument();
      });
    });

    it('should validate phone number format', async () => {
      render(<ProfilePage user={mockUser} onBack={mockOnBack} onLogout={mockOnLogout} />);
      
      const phoneInput = screen.getByDisplayValue('1234567890');
      fireEvent.change(phoneInput, { target: { value: '123' } });
      
      const updateButton = screen.getByText('Update Profile');
      fireEvent.click(updateButton);
      
      await waitFor(() => {
        expect(screen.getByText('Phone number must be 10 digits')).toBeInTheDocument();
      });
    });

    it('should validate password length', async () => {
      render(<ProfilePage user={mockUser} onBack={mockOnBack} onLogout={mockOnLogout} />);
      
      const securityTab = screen.getByText('Security & Password');
      fireEvent.click(securityTab);
      
      const newPasswordInput = screen.getByPlaceholderText('Enter your new password');
      fireEvent.change(newPasswordInput, { target: { value: '123' } });
      
      const updateButton = screen.getByText('Update Password');
      fireEvent.click(updateButton);
      
      await waitFor(() => {
        expect(screen.getByText('Password must be at least 8 characters')).toBeInTheDocument();
      });
    });
  });

  describe('Loading States', () => {
    it('should show loading state during form submission', async () => {
      render(<ProfilePage user={mockUser} onBack={mockOnBack} onLogout={mockOnLogout} />);
      
      const updateButton = screen.getByText('Update Profile');
      fireEvent.click(updateButton);
      
      await waitFor(() => {
        expect(screen.getByText('Updating...')).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper labels for form inputs', () => {
      render(<ProfilePage user={mockUser} onBack={mockOnBack} onLogout={mockOnLogout} />);
      
      expect(screen.getByLabelText('First Name')).toBeInTheDocument();
      expect(screen.getByLabelText('Last Name')).toBeInTheDocument();
      expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
      expect(screen.getByLabelText('Phone Number')).toBeInTheDocument();
    });

    it('should have proper button roles', () => {
      render(<ProfilePage user={mockUser} onBack={mockOnBack} onLogout={mockOnLogout} />);
      
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    });
  });
});
