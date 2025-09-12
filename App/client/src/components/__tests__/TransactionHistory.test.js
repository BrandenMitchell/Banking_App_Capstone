import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TransactionHistory from '../TransactionHistory';

// Mock user data with accounts
const mockUser = {
  firstName: 'John',
  lastName: 'Doe',
  accounts: [
    { type: 'checking', accountNumber: '1234567890', balance: 1250.50 },
    { type: 'savings', accountNumber: '0987654321', balance: 5000.00 },
    { type: 'credit', accountNumber: '1122334455', balance: 250.75 },
  ],
};

const mockOnBack = jest.fn();

describe('TransactionHistory Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Rendering tests
  it('should render the transaction history page with header and filters', () => {
    render(<TransactionHistory user={mockUser} onBack={mockOnBack} />);

    expect(screen.getByText('Transaction History')).toBeInTheDocument();
    expect(screen.getByText('Back to Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Export')).toBeInTheDocument();
    expect(screen.getByText('Filters')).toBeInTheDocument();
    expect(screen.getByLabelText('Account')).toBeInTheDocument();
    expect(screen.getByLabelText('Type')).toBeInTheDocument();
    expect(screen.getByLabelText('Date Range')).toBeInTheDocument();
    expect(screen.getByLabelText('Search')).toBeInTheDocument();
  });

  it('should display a list of transactions', async () => {
    render(<TransactionHistory user={mockUser} onBack={mockOnBack} />);

    // Check for some mock transactions
    await waitFor(() => {
      expect(screen.getByText('Whole Foods Market')).toBeInTheDocument();
      expect(screen.getByText('Direct Deposit - Salary')).toBeInTheDocument();
      expect(screen.getByText('Transfer to Checking')).toBeInTheDocument();
    });
  });

  it('should display correct account options in the filter', () => {
    render(<TransactionHistory user={mockUser} onBack={mockOnBack} />);

    expect(screen.getByRole('option', { name: 'All Accounts' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Checking Account (****7890)' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Savings Account (****4321)' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Credit Card (****4455)' })).toBeInTheDocument();
  });

  // Filtering tests
  it('should filter transactions by account type', async () => {
    render(<TransactionHistory user={mockUser} onBack={mockOnBack} />);

    fireEvent.change(screen.getByLabelText('Account'), { target: { value: 'checking' } });

    await waitFor(() => {
      expect(screen.getByText('Whole Foods Market')).toBeInTheDocument();
      expect(screen.queryByText('Direct Deposit - Salary')).not.toBeInTheDocument();
    });
  });

  it('should filter transactions by transaction type (credit/debit)', async () => {
    render(<TransactionHistory user={mockUser} onBack={mockOnBack} />);

    fireEvent.change(screen.getByLabelText('Type'), { target: { value: 'credit' } });

    await waitFor(() => {
      expect(screen.getByText('Direct Deposit - Salary')).toBeInTheDocument();
      expect(screen.queryByText('Whole Foods Market')).not.toBeInTheDocument();
    });
  });

  it('should filter transactions by search term', async () => {
    render(<TransactionHistory user={mockUser} onBack={mockOnBack} />);

    fireEvent.change(screen.getByLabelText('Search'), { target: { value: 'whole foods' } });

    await waitFor(() => {
      expect(screen.getByText('Whole Foods Market')).toBeInTheDocument();
      expect(screen.queryByText('Direct Deposit - Salary')).not.toBeInTheDocument();
    });
  });

  // Sorting tests
  it('should sort transactions by amount in ascending order', async () => {
    render(<TransactionHistory user={mockUser} onBack={mockOnBack} />);

    fireEvent.click(screen.getByRole('button', { name: 'Amount' })); // Click once for asc

    await waitFor(() => {
      // Check that the sort button shows active state
      expect(screen.getByRole('button', { name: 'Amount' })).toHaveClass('active');
    });
  });

  it('should sort transactions by date in descending order by default', async () => {
    render(<TransactionHistory user={mockUser} onBack={mockOnBack} />);

    // By default, it should be sorted by date desc
    await waitFor(() => {
      // Check that the date sort button shows active state
      expect(screen.getByRole('button', { name: 'Date' })).toHaveClass('active');
    });
  });

  // Pagination tests
  it('should not display pagination controls when there are 10 or fewer transactions', async () => {
    render(<TransactionHistory user={mockUser} onBack={mockOnBack} />);

    await waitFor(() => {
      expect(screen.queryByRole('button', { name: 'Next' })).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'Previous' })).not.toBeInTheDocument();
    });
  });

  // Empty State
  it('should show no transactions message when filtered results are empty', async () => {
    render(<TransactionHistory user={mockUser} onBack={mockOnBack} />);

    const searchInput = screen.getByLabelText('Search');
    fireEvent.change(searchInput, { target: { value: 'nonexistent' } });

    await waitFor(() => {
      expect(screen.getByText('No transactions found')).toBeInTheDocument();
      expect(screen.getByText('Try adjusting your filters to see more results.')).toBeInTheDocument();
    });
  });

  // User Interaction
  it('should call onBack when "Back to Dashboard" button is clicked', () => {
    render(<TransactionHistory user={mockUser} onBack={mockOnBack} />);

    fireEvent.click(screen.getByText('Back to Dashboard'));
    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });

  // Transaction Display
  it('should display transaction amounts correctly', () => {
    render(<TransactionHistory user={mockUser} onBack={mockOnBack} />);

    // Check for credit amounts (positive)
    expect(screen.getByText('+$3,500.00')).toBeInTheDocument();

    // Check for debit amounts (negative)
    expect(screen.getByText('-$45.67')).toBeInTheDocument();
    expect(screen.getByText('-$200.00')).toBeInTheDocument();
  });

  it('should display transaction categories', () => {
    render(<TransactionHistory user={mockUser} onBack={mockOnBack} />);

    expect(screen.getByText('Groceries')).toBeInTheDocument();
    expect(screen.getByText('Salary')).toBeInTheDocument();
    expect(screen.getByText('Transfer')).toBeInTheDocument();
  });

  it('should display account numbers', () => {
    render(<TransactionHistory user={mockUser} onBack={mockOnBack} />);

    expect(screen.getAllByText('****7890')).toHaveLength(6); // Multiple transactions on checking account
    expect(screen.getAllByText('****4321')).toHaveLength(2); // Multiple transactions on savings account
    expect(screen.getByText('****4455')).toBeInTheDocument();
  });
});
