import React, { useState, useEffect } from 'react';
import './TransactionHistory.css';

const TransactionHistory = ({ user, onBack }) => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [filters, setFilters] = useState({
    account: 'all',
    type: 'all',
    dateRange: 'all',
    search: ''
  });
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const itemsPerPage = 10;

  // Mock transaction data - in a real app, this would come from an API
  const mockTransactions = [
    {
      id: '1',
      accountId: 'checking',
      accountNumber: '****7890',
      type: 'debit',
      category: 'Groceries',
      description: 'Whole Foods Market',
      amount: -45.67,
      date: '2024-01-15T14:30:00Z',
      status: 'completed',
      reference: 'TXN001234567',
      location: 'San Francisco, CA',
      merchant: 'Whole Foods Market'
    },
    {
      id: '2',
      accountId: 'checking',
      accountNumber: '****7890',
      type: 'credit',
      category: 'Salary',
      description: 'Direct Deposit - Salary',
      amount: 3500.00,
      date: '2024-01-14T09:00:00Z',
      status: 'completed',
      reference: 'DD001234567',
      location: 'Direct Deposit',
      merchant: 'Tech Corp Inc'
    },
    {
      id: '3',
      accountId: 'savings',
      accountNumber: '****4321',
      type: 'debit',
      category: 'Transfer',
      description: 'Transfer to Checking',
      amount: -200.00,
      date: '2024-01-13T16:15:00Z',
      status: 'completed',
      reference: 'TXN001234568',
      location: 'Online Banking',
      merchant: 'Internal Transfer'
    },
    {
      id: '4',
      accountId: 'credit',
      accountNumber: '****4455',
      type: 'debit',
      category: 'Entertainment',
      description: 'Netflix Subscription',
      amount: -15.99,
      date: '2024-01-12T00:00:00Z',
      status: 'completed',
      reference: 'TXN001234569',
      location: 'Online',
      merchant: 'Netflix Inc'
    },
    {
      id: '5',
      accountId: 'checking',
      accountNumber: '****7890',
      type: 'debit',
      category: 'Utilities',
      description: 'Electric Bill Payment',
      amount: -125.50,
      date: '2024-01-11T10:30:00Z',
      status: 'completed',
      reference: 'TXN001234570',
      location: 'Online Banking',
      merchant: 'Pacific Gas & Electric'
    },
    {
      id: '6',
      accountId: 'checking',
      accountNumber: '****7890',
      type: 'credit',
      category: 'Refund',
      description: 'Amazon Refund',
      amount: 89.99,
      date: '2024-01-10T15:45:00Z',
      status: 'completed',
      reference: 'TXN001234571',
      location: 'Online',
      merchant: 'Amazon.com'
    },
    {
      id: '7',
      accountId: 'savings',
      accountNumber: '****4321',
      type: 'credit',
      category: 'Interest',
      description: 'Monthly Interest',
      amount: 12.45,
      date: '2024-01-09T00:00:00Z',
      status: 'completed',
      reference: 'INT001234567',
      location: 'Bank',
      merchant: 'SecureBank'
    },
    {
      id: '8',
      accountId: 'credit',
      accountNumber: '****4455',
      type: 'debit',
      category: 'Gas',
      description: 'Shell Gas Station',
      amount: -52.30,
      date: '2024-01-08T18:20:00Z',
      status: 'completed',
      reference: 'TXN001234572',
      location: 'Oakland, CA',
      merchant: 'Shell Oil'
    },
    {
      id: '9',
      accountId: 'checking',
      accountNumber: '****7890',
      type: 'debit',
      category: 'Dining',
      description: 'Starbucks Coffee',
      amount: -6.75,
      date: '2024-01-07T08:15:00Z',
      status: 'completed',
      reference: 'TXN001234573',
      location: 'San Francisco, CA',
      merchant: 'Starbucks'
    },
    {
      id: '10',
      accountId: 'checking',
      accountNumber: '****7890',
      type: 'debit',
      category: 'ATM',
      description: 'ATM Withdrawal',
      amount: -100.00,
      date: '2024-01-06T20:30:00Z',
      status: 'completed',
      reference: 'ATM001234567',
      location: 'ATM - Market St',
      merchant: 'SecureBank ATM'
    }
  ];

  useEffect(() => {
    setTransactions(mockTransactions);
    setFilteredTransactions(mockTransactions);
  }, []);

  useEffect(() => {
    let filtered = [...transactions];

    // Filter by account
    if (filters.account !== 'all') {
      filtered = filtered.filter(t => t.accountId === filters.account);
    }

    // Filter by type
    if (filters.type !== 'all') {
      filtered = filtered.filter(t => t.type === filters.type);
    }

    // Filter by date range
    if (filters.dateRange !== 'all') {
      const now = new Date();
      const daysAgo = parseInt(filters.dateRange);
      const cutoffDate = new Date(now.getTime() - (daysAgo * 24 * 60 * 60 * 1000));
      filtered = filtered.filter(t => new Date(t.date) >= cutoffDate);
    }

    // Filter by search term
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(t => 
        t.description.toLowerCase().includes(searchTerm) ||
        t.merchant.toLowerCase().includes(searchTerm) ||
        t.category.toLowerCase().includes(searchTerm)
      );
    }

    // Sort transactions
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'date':
          aValue = new Date(a.date);
          bValue = new Date(b.date);
          break;
        case 'amount':
          aValue = Math.abs(a.amount);
          bValue = Math.abs(b.amount);
          break;
        case 'description':
          aValue = a.description.toLowerCase();
          bValue = b.description.toLowerCase();
          break;
        default:
          aValue = new Date(a.date);
          bValue = new Date(b.date);
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredTransactions(filtered);
    setCurrentPage(1);
  }, [transactions, filters, sortBy, sortOrder]);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleSortChange = (newSortBy) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('desc');
    }
  };

  const handleTransactionClick = (transaction) => {
    setSelectedTransaction(transaction);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedTransaction(null);
  };

  const getAccountName = (accountId) => {
    const accountMap = {
      'checking': 'Checking Account',
      'savings': 'Savings Account',
      'credit': 'Credit Card'
    };
    return accountMap[accountId] || accountId;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatAmount = (amount) => {
    return amount.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return '#10B981';
      case 'pending':
        return '#F59E0B';
      case 'failed':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };


  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTransactions = filteredTransactions.slice(startIndex, endIndex);

  return (
    <div className="transaction-history">
      <div className="transaction-header">
        <div className="header-content">
          <h1>Transaction History</h1>
          <button className="back-btn" onClick={onBack}>
Back to Dashboard
          </button>
        </div>
      </div>

      <div className="transaction-content">
        {/* Filters */}
        <div className="filters-section">
          <div className="filters-grid">
            <div className="filter-group">
              <label htmlFor="account-filter">Account</label>
              <select 
                id="account-filter"
                value={filters.account} 
                onChange={(e) => handleFilterChange('account', e.target.value)}
              >
                <option value="all">All Accounts</option>
                {user?.accounts?.map(account => (
                  <option key={account.type} value={account.type}>
                    {getAccountName(account.type)} (****{account.accountNumber.slice(-4)})
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="type-filter">Type</label>
              <select 
                id="type-filter"
                value={filters.type} 
                onChange={(e) => handleFilterChange('type', e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="credit">Credits</option>
                <option value="debit">Debits</option>
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="date-range-filter">Date Range</label>
              <select 
                id="date-range-filter"
                value={filters.dateRange} 
                onChange={(e) => handleFilterChange('dateRange', e.target.value)}
              >
                <option value="all">All Time</option>
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 90 days</option>
                <option value="365">Last year</option>
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="search-input">Search</label>
              <input
                id="search-input"
                type="text"
                placeholder="Search transactions..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="results-summary">
          <p>
            Showing {currentTransactions.length} of {filteredTransactions.length} transactions
          </p>
          <div className="sort-controls">
            <span>Sort by:</span>
            <button 
              className={sortBy === 'date' ? 'active' : ''}
              onClick={() => handleSortChange('date')}
            >
              Date {sortBy === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}
            </button>
            <button 
              className={sortBy === 'amount' ? 'active' : ''}
              onClick={() => handleSortChange('amount')}
            >
              Amount {sortBy === 'amount' && (sortOrder === 'asc' ? '↑' : '↓')}
            </button>
            <button 
              className={sortBy === 'description' ? 'active' : ''}
              onClick={() => handleSortChange('description')}
            >
              Description {sortBy === 'description' && (sortOrder === 'asc' ? '↑' : '↓')}
            </button>
          </div>
        </div>

        {/* Transaction List */}
        <div className="transactions-list">
          {currentTransactions.length === 0 ? (
            <div className="no-transactions">
              <div className="no-transactions-icon"></div>
              <h3>No transactions found</h3>
              <p>Try adjusting your filters to see more results.</p>
            </div>
          ) : (
            currentTransactions.map(transaction => (
              <div 
                key={transaction.id} 
                className="transaction-item"
                onClick={() => handleTransactionClick(transaction)}
              >
                <div className="transaction-details">
                  <div className="transaction-main">
                    <h4>{transaction.description}</h4>
                    <p className="transaction-merchant">{transaction.merchant}</p>
                  </div>
                  <div className="transaction-meta">
                    <span className="transaction-category">{transaction.category}</span>
                    <span className="transaction-account">{transaction.accountNumber}</span>
                  </div>
                </div>
                <div className="transaction-amount">
                  <div className={`amount ${transaction.type}`}>
                    {transaction.type === 'credit' ? '+' : ''}{formatAmount(transaction.amount)}
                  </div>
                  <div className="transaction-date">
                    {formatDate(transaction.date)}
                  </div>
                </div>
                <div className="transaction-status">
                  <div 
                    className="status-dot"
                    style={{ backgroundColor: getStatusColor(transaction.status) }}
                  ></div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span className="page-info">
              Page {currentPage} of {totalPages}
            </span>
            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Transaction Detail Modal */}
      {showModal && selectedTransaction && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Transaction Details</h2>
              <button className="close-btn" onClick={closeModal}>×</button>
            </div>
            <div className="modal-body">
              <div className="transaction-detail-grid">
                <div className="detail-item">
                  <label>Description</label>
                  <p>{selectedTransaction.description}</p>
                </div>
                <div className="detail-item">
                  <label>Merchant</label>
                  <p>{selectedTransaction.merchant}</p>
                </div>
                <div className="detail-item">
                  <label>Amount</label>
                  <p className={`amount ${selectedTransaction.type}`}>
                    {selectedTransaction.type === 'credit' ? '+' : ''}{formatAmount(selectedTransaction.amount)}
                  </p>
                </div>
                <div className="detail-item">
                  <label>Account</label>
                  <p>{getAccountName(selectedTransaction.accountId)} ({selectedTransaction.accountNumber})</p>
                </div>
                <div className="detail-item">
                  <label>Date & Time</label>
                  <p>{formatDate(selectedTransaction.date)} at {formatTime(selectedTransaction.date)}</p>
                </div>
                <div className="detail-item">
                  <label>Category</label>
                  <p>{selectedTransaction.category}</p>
                </div>
                <div className="detail-item">
                  <label>Reference</label>
                  <p>{selectedTransaction.reference}</p>
                </div>
                <div className="detail-item">
                  <label>Location</label>
                  <p>{selectedTransaction.location}</p>
                </div>
                <div className="detail-item">
                  <label>Status</label>
                  <p>
                    <span 
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(selectedTransaction.status) }}
                    >
                      {selectedTransaction.status}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;
