import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import HomePage from '../HomePage';

describe('HomePage Component', () => {
  const mockUser = {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phone: '1234567890',
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
      },
      {
        type: 'credit',
        accountNumber: '1122334455',
        balance: 250.75,
        isActive: true
      }
    ]
  };

  const mockOnLogout = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render homepage with user data', () => {
      render(<HomePage user={mockUser} onLogout={mockOnLogout} />);
      
      expect(screen.getByText('SecureBank')).toBeInTheDocument();
      expect(screen.getByText('Welcome, John Doe')).toBeInTheDocument();
      expect(screen.getByText('Account Overview')).toBeInTheDocument();
      expect(screen.getByText('Quick Actions')).toBeInTheDocument();
      expect(screen.getByText('Recent Transactions')).toBeInTheDocument();
    });

    it('should render account cards with user data', () => {
      render(<HomePage user={mockUser} onLogout={mockOnLogout} />);
      
      expect(screen.getByText('Checking Account')).toBeInTheDocument();
      expect(screen.getByText('Savings Account')).toBeInTheDocument();
      expect(screen.getByText('Credit Account')).toBeInTheDocument();
      expect(screen.getByText('****7890')).toBeInTheDocument();
      expect(screen.getByText('****4321')).toBeInTheDocument();
      expect(screen.getByText('****4455')).toBeInTheDocument();
    });

    it('should display account balances correctly', () => {
      render(<HomePage user={mockUser} onLogout={mockOnLogout} />);
      
      expect(screen.getByText('$1,250.50')).toBeInTheDocument();
      expect(screen.getByText('$5,000.00')).toBeInTheDocument();
      expect(screen.getByText('$250.75')).toBeInTheDocument();
    });

    it('should render quick action items', () => {
      render(<HomePage user={mockUser} onLogout={mockOnLogout} />);
      
      expect(screen.getByText('Send Money')).toBeInTheDocument();
      expect(screen.getByText('View Reports')).toBeInTheDocument();
      expect(screen.getByText('Manage Cards')).toBeInTheDocument();
      expect(screen.getByText('Settings')).toBeInTheDocument();
      expect(screen.getByText('Mobile App')).toBeInTheDocument();
      expect(screen.getByText('Security')).toBeInTheDocument();
    });

    it('should render recent transactions', () => {
      render(<HomePage user={mockUser} onLogout={mockOnLogout} />);
      
      expect(screen.getByText('Grocery Store Purchase')).toBeInTheDocument();
      expect(screen.getByText('Salary Deposit')).toBeInTheDocument();
      expect(screen.getByText('Online Transfer')).toBeInTheDocument();
      expect(screen.getByText('-$45.67')).toBeInTheDocument();
      expect(screen.getByText('+$3,500.00')).toBeInTheDocument();
      expect(screen.getByText('-$200.00')).toBeInTheDocument();
    });

    it('should render footer sections', () => {
      render(<HomePage user={mockUser} onLogout={mockOnLogout} />);
      
      expect(screen.getByText('Banking Services')).toBeInTheDocument();
      expect(screen.getAllByText('Support')).toHaveLength(2); // Nav and footer
      expect(screen.getByText('Connect')).toBeInTheDocument();
      expect(screen.getByText('© 2024 SecureBank. All rights reserved.')).toBeInTheDocument();
    });
  });

  describe('User Interaction', () => {
    it('should call onLogout when logout button is clicked', () => {
      render(<HomePage user={mockUser} onLogout={mockOnLogout} />);
      
      const logoutButton = screen.getByText('Logout');
      fireEvent.click(logoutButton);
      
      expect(mockOnLogout).toHaveBeenCalledTimes(1);
    });

    it('should handle account action buttons', () => {
      render(<HomePage user={mockUser} onLogout={mockOnLogout} />);
      
      const viewDetailsButtons = screen.getAllByText('View Details');
      const transferButtons = screen.getAllByText('Transfer');
      const payBillButton = screen.getByText('Pay Bill');
      
      expect(viewDetailsButtons).toHaveLength(3); // All three accounts
      expect(transferButtons).toHaveLength(2); // Checking and Savings
      expect(payBillButton).toBeInTheDocument(); // Credit card
    });

    it('should handle quick action items', () => {
      render(<HomePage user={mockUser} onLogout={mockOnLogout} />);
      
      const sendMoneyAction = screen.getByText('Send Money');
      const viewReportsAction = screen.getByText('View Reports');
      
      // These should be clickable (though no functionality implemented yet)
      expect(sendMoneyAction).toBeInTheDocument();
      expect(viewReportsAction).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle user with no accounts', () => {
      const userWithNoAccounts = {
        ...mockUser,
        accounts: []
      };
      
      render(<HomePage user={userWithNoAccounts} onLogout={mockOnLogout} />);
      
      expect(screen.getByText('No Accounts Found')).toBeInTheDocument();
      expect(screen.getByText('Please contact support')).toBeInTheDocument();
    });

    it('should handle user with null accounts', () => {
      const userWithNullAccounts = {
        ...mockUser,
        accounts: null
      };
      
      render(<HomePage user={userWithNullAccounts} onLogout={mockOnLogout} />);
      
      expect(screen.getByText('No Accounts Found')).toBeInTheDocument();
    });

    it('should handle user with undefined accounts', () => {
      const userWithUndefinedAccounts = {
        ...mockUser,
        accounts: undefined
      };
      
      render(<HomePage user={userWithUndefinedAccounts} onLogout={mockOnLogout} />);
      
      expect(screen.getByText('No Accounts Found')).toBeInTheDocument();
    });

    it('should handle user with missing name', () => {
      const userWithMissingName = {
        ...mockUser,
        firstName: null,
        lastName: null
      };
      
      render(<HomePage user={userWithMissingName} onLogout={mockOnLogout} />);
      
      expect(screen.getByText('Welcome, User')).toBeInTheDocument();
    });

    it('should handle user with partial name', () => {
      const userWithPartialName = {
        ...mockUser,
        firstName: 'John',
        lastName: null
      };
      
      render(<HomePage user={userWithPartialName} onLogout={mockOnLogout} />);
      
      expect(screen.getByText('Welcome, John')).toBeInTheDocument();
    });
  });

  describe('Account Type Handling', () => {
    it('should display correct labels for different account types', () => {
      render(<HomePage user={mockUser} onLogout={mockOnLogout} />);
      
      // Use getAllByText since "Available Balance" appears multiple times
      expect(screen.getAllByText('Available Balance')).toHaveLength(2);
      expect(screen.getByText('Current Balance')).toBeInTheDocument();
    });

    it('should show correct action buttons for credit accounts', () => {
      render(<HomePage user={mockUser} onLogout={mockOnLogout} />);
      
      // Credit card should have "Pay Bill" instead of "Transfer"
      expect(screen.getByText('Pay Bill')).toBeInTheDocument();
      // Note: "View Statement" is not in the current implementation
    });
  });

  describe('Navigation', () => {
    it('should render navigation links', () => {
      render(<HomePage user={mockUser} onLogout={mockOnLogout} />);
      
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Accounts')).toBeInTheDocument();
      expect(screen.getByText('Transfers')).toBeInTheDocument();
      // Use getAllByText since "Support" appears in both nav and footer
      expect(screen.getAllByText('Support')).toHaveLength(2);
    });
  });
});
