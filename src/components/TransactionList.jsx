import React, { useState } from 'react';
import { Edit2, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import './TransactionList.css';

const TransactionList = ({ transactions, onEdit, onDelete, loading }) => {
  const [sortBy, setSortBy] = useState('date');
  const [filterType, setFilterType] = useState('all');
  const [expandedId, setExpandedId] = useState(null);

  const CATEGORIES = {
    income: [
      'Salary',
      'Freelance',
      'Bonus',
      'Investment',
      'Gift',
      'Other Income'
    ],
    expense: [
      'Food & Dining',
      'Transportation',
      'Shopping',
      'Entertainment',
      'Bills & Utilities',
      'Health & Fitness',
      'Education',
      'Other'
    ]
  };

  const getCategoryColor = (category) => {
    const colorMap = {
      'Salary': '#10b981',
      'Freelance': '#3b82f6',
      'Bonus': '#f59e0b',
      'Investment': '#8b5cf6',
      'Gift': '#ec4899',
      'Food & Dining': '#f97316',
      'Transportation': '#06b6d4',
      'Shopping': '#ec4899',
      'Entertainment': '#a855f7',
      'Bills & Utilities': '#6366f1',
      'Health & Fitness': '#14b8a6',
      'Education': '#3b82f6',
      'Other Income': '#64748b',
      'Other': '#64748b'
    };
    return colorMap[category] || '#6366f1';
  };

  const filteredTransactions = transactions.filter(
    t => filterType === 'all' || t.type === filterType
  );

  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.date) - new Date(a.date);
      case 'amount':
        return parseFloat(b.amount) - parseFloat(a.amount);
      case 'category':
        return a.category.localeCompare(b.category);
      default:
        return 0;
    }
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading transactions...</p>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📊</div>
        <h3>No Transactions Yet</h3>
        <p>Start by adding your first income or expense transaction.</p>
      </div>
    );
  }

  return (
    <div className="transaction-list">
      <div className="list-controls">
        <div className="filter-group">
          <label htmlFor="type-filter">Type:</label>
          <select
            id="type-filter"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="sort-by">Sort By:</label>
          <select
            id="sort-by"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="filter-select"
          >
            <option value="date">Date (Newest)</option>
            <option value="amount">Amount (Highest)</option>
            <option value="category">Category</option>
          </select>
        </div>

        <div className="results-count">
          {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? 's' : ''}
        </div>
      </div>

      <div className="table-container">
        <table className="transaction-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Category</th>
              <th>Description</th>
              <th>Amount</th>
              <th>Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedTransactions.map((transaction) => (
              <React.Fragment key={transaction.id}>
                <tr className={`transaction-row ${transaction.type}`}>
                  <td>{formatDate(transaction.date)}</td>
                  <td>
                    <span
                      className="category-badge"
                      style={{ backgroundColor: getCategoryColor(transaction.category) }}
                    >
                      {transaction.category}
                    </span>
                  </td>
                  <td className="description-cell">{transaction.description}</td>
                  <td className={`amount-cell ${transaction.type}`}>
                    {transaction.type === 'income' ? '+' : '-'}${parseFloat(transaction.amount).toFixed(2)}
                  </td>
                  <td>
                    <span className={`transaction-badge ${transaction.type}`}>
                      {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <button
                      className="action-btn edit-btn"
                      onClick={() => onEdit(transaction)}
                      title="Edit"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      className="action-btn delete-btn"
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this transaction?')) {
                          onDelete(transaction.id);
                        }
                      }}
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                    <button
                      className="toggle-details"
                      onClick={() => setExpandedId(expandedId === transaction.id ? null : transaction.id)}
                    >
                      {expandedId === transaction.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                  </td>
                </tr>
                {expandedId === transaction.id && (
                  <tr className="details-row">
                    <td colSpan="6">
                      <div className="transaction-details">
                        <div className="detail-item">
                          <span className="detail-label">Transaction ID:</span>
                          <span className="detail-value">{transaction.id}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Created:</span>
                          <span className="detail-value">
                            {new Date(transaction.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                        {transaction.notes && (
                          <div className="detail-item">
                            <span className="detail-label">Notes:</span>
                            <span className="detail-value">{transaction.notes}</span>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionList;
