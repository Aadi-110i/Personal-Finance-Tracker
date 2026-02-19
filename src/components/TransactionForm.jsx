import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import './TransactionForm.css';

const TransactionForm = ({ onSubmit, onCancel, initialData }) => {
  const [formData, setFormData] = useState({
    type: 'expense',
    category: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    notes: ''
  });

  const [errors, setErrors] = useState({});

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

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        date: initialData.date ? initialData.date.split('T')[0] : new Date().toISOString().split('T')[0]
      });
    }
  }, [initialData]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.type) {
      newErrors.type = 'Type is required';
    }
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'type') {
      setFormData({
        ...formData,
        [name]: value,
        category: '' // Reset category when type changes
      });
      setErrors({ ...errors, [name]: '' });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit({
        ...formData,
        amount: parseFloat(formData.amount)
      });
    }
  };

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="form-modal" onClick={(e) => e.stopPropagation()}>
        <div className="form-header">
          <h2>{initialData ? 'Edit Transaction' : 'Add New Transaction'}</h2>
          <button className="close-btn" onClick={onCancel} aria-label="Close">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="transaction-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="type">Type *</label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                className={errors.type ? 'input-error' : ''}
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
              {errors.type && <span className="error-message">{errors.type}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="amount">Amount *</label>
              <input
                type="number"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="Enter amount"
                step="0.01"
                min="0"
                className={errors.amount ? 'input-error' : ''}
              />
              {errors.amount && <span className="error-message">{errors.amount}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category">Category *</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={errors.category ? 'input-error' : ''}
              >
                <option value="">Select a category</option>
                {CATEGORIES[formData.type].map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {errors.category && <span className="error-message">{errors.category}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="date">Date *</label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className={errors.date ? 'input-error' : ''}
              />
              {errors.date && <span className="error-message">{errors.date}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <input
              type="text"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="e.g., Weekly groceries"
              className={errors.description ? 'input-error' : ''}
            />
            {errors.description && <span className="error-message">{errors.description}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="notes">Notes (Optional)</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Add any additional notes..."
              rows="3"
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {initialData ? 'Update Transaction' : 'Add Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionForm;
