import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit2, Trash2, ChevronDown, ChevronUp, ArrowUpRight, ArrowDownLeft, Calendar } from 'lucide-react';
import './TransactionList.css';

const TransactionList = ({ transactions, onEdit, onDelete, loading }) => {
  const [sortBy, setSortBy] = useState('date');
  const [filterType, setFilterType] = useState('all');
  const [expandedId, setExpandedId] = useState(null);

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

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading transactions...</p>
      </div>
    );
  }

  return (

    <div className="transaction-list-container">
      <div className="list-controls glass-panel-premium mb-6 p-4">
        <div className="controls-wrapper flex flex-wrap gap-4 items-center justify-between">
          <div className="filter-group flex gap-2 items-center">
            <label htmlFor="type-filter" className="text-secondary">Type:</label>
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

          <div className="filter-group flex gap-2 items-center">
            <label htmlFor="sort-by" className="text-secondary">Sort:</label>
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

          <div className="results-count text-secondary text-sm">
            {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      <motion.div
        className="transactions-grid flex flex-col gap-3"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <AnimatePresence>
          {sortedTransactions.map((transaction) => (
            <motion.div
              key={transaction.id}
              variants={itemVariants}
              exit={{ opacity: 0, x: -20 }}
              className={`transaction-card glass-panel hover-glow p-4 rounded-xl relative overflow-hidden ${expandedId === transaction.id ? 'expanded' : ''}`}
            >
              <div
                className="card-main-content"
                onClick={() => setExpandedId(expandedId === transaction.id ? null : transaction.id)}
              >
                {/* Left: Icon + Date + Description */}
                <div className="transaction-left-group">
                  <div
                    className={`icon-box ${transaction.type === 'income' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                      }`}
                  >
                    {transaction.type === 'income' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                  </div>
                  <div className="transaction-info">
                    <h4>{transaction.description}</h4>
                    <span className="date-text">
                      <Calendar size={12} />
                      {formatDate(transaction.date)}
                    </span>
                  </div>
                </div>

                {/* Center: Category */}
                <div className="transaction-center-group">
                  <span
                    className="category-pill"
                    style={{ backgroundColor: `${getCategoryColor(transaction.category)}20`, color: getCategoryColor(transaction.category) }}
                  >
                    {transaction.category}
                  </span>
                </div>

                {/* Right: Amount */}
                <div className="transaction-right-group">
                  <span className={`amount ${transaction.type === 'income' ? 'text-emerald-400' : 'text-white'
                    }`}>
                    {transaction.type === 'income' ? '+' : '-'}₹{parseFloat(transaction.amount).toFixed(2)}
                  </span>
                  <div className="chevron text-gray-500">
                    {expandedId === transaction.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </div>
              </div>

              <AnimatePresence>
                {expandedId === transaction.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="expanded-details mt-4 pt-4 border-t border-white/5"
                  >
                    <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                      <div>
                        <span className="block text-gray-500 mb-1">Transaction ID</span>
                        <span className="text-gray-300 font-mono text-xs">{transaction.id}</span>
                      </div>
                      <div>
                        <span className="block text-gray-500 mb-1">Created At</span>
                        <span className="text-gray-300">
                          {new Date(transaction.createdAt).toLocaleString()}
                        </span>
                      </div>
                      {transaction.notes && (
                        <div className="col-span-2">
                          <span className="block text-gray-500 mb-1">Notes</span>
                          <p className="text-gray-300 italic">{transaction.notes}</p>
                        </div>
                      )}
                    </div>

                    <div className="actions flex justify-end gap-2">
                      <button
                        className="btn-glass px-4 py-2 rounded-lg flex items-center gap-2 text-sm hover:bg-white/10 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(transaction);
                        }}
                      >
                        <Edit2 size={16} /> Edit
                      </button>
                      <button
                        className="btn-glass px-4 py-2 rounded-lg flex items-center gap-2 text-sm hover:bg-rose-500/20 text-rose-400 border-rose-500/30 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm('Are you sure you want to delete this transaction?')) {
                            onDelete(transaction.id);
                          }
                        }}
                      >
                        <Trash2 size={16} /> Delete
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>

        {sortedTransactions.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            No transactions found matching your filters.
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default TransactionList;
