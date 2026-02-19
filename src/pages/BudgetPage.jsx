import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import ScrollReveal from '../components/ScrollReveal';
import { Plus, Trash2, Edit2, TrendingUp, AlertCircle, DollarSign, PieChart, Wallet } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './BudgetPage.css';

const BudgetPage = ({ transactions }) => {
  const [budgets, setBudgets] = useState([
    { id: 1, category: 'Food & Dining', limit: 400, color: '#FF6B6B' },
    { id: 2, category: 'Transportation', limit: 200, color: '#4ECDC4' },
    { id: 3, category: 'Entertainment', limit: 150, color: '#FFE66D' },
    { id: 4, category: 'Shopping', limit: 300, color: '#95E1D3' },
    { id: 5, category: 'Bills', limit: 500, color: '#C7CEEA' }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [newBudget, setNewBudget] = useState({ category: '', limit: '' });

  const categorySpending = useMemo(() => {
    const spending = {};
    transactions?.filter(t => t.type === 'expense').forEach(t => {
      spending[t.category] = (spending[t.category] || 0) + parseFloat(t.amount);
    });
    return spending;
  }, [transactions]);

  const budgetData = budgets.map(budget => {
    const spent = categorySpending[budget.category] || 0;
    const remaining = budget.limit - spent;
    const percentage = Math.min((spent / budget.limit) * 100, 100);

    return {
      ...budget,
      spent: Math.round(spent),
      remaining: Math.max(remaining, 0),
      percentage,
      status: percentage >= 100 ? 'over' : percentage >= 80 ? 'warning' : 'good'
    };
  });

  const chartData = budgetData.map(b => ({
    category: b.category,
    spent: b.spent,
    limit: b.limit
  }));

  const handleAddBudget = () => {
    if (newBudget.category && newBudget.limit) {
      const budget = {
        id: Date.now(),
        category: newBudget.category,
        limit: parseFloat(newBudget.limit),
        color: `hsl(${Math.random() * 360}, 70%, 60%)`
      };
      setBudgets([...budgets, budget]);
      setNewBudget({ category: '', limit: '' });
      setShowForm(false);
    }
  };

  const handleDeleteBudget = (id) => {
    setBudgets(budgets.filter(b => b.id !== id));
  };

  const totalBudget = budgets.reduce((sum, b) => sum + b.limit, 0);
  const totalSpent = Object.values(categorySpending).reduce((sum, val) => sum + val, 0);
  const totalRemaining = totalBudget - totalSpent;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="budget-page">
      <motion.div
        className="budget-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="header-content">
          <h1 className="neon-text">Your Spending Limits</h1>
          <p className="subtitle">Keep your finances on track, one goal at a time.</p>
        </div>
        <button
          className="btn btn-primary add-budget-btn"
          onClick={() => setShowForm(!showForm)}
        >
          <Plus size={20} />
          <span>New Budget</span>
        </button>
      </motion.div>

      {/* Summary Cards */}
      <motion.div
        className="budget-summary"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <motion.div className="summary-card budget-total" variants={itemVariants}>
          <div className="summary-icon-container">
            <Wallet size={24} />
          </div>
          <div className="summary-content">
            <p className="summary-label">Total Planned</p>
            <p className="summary-value">₹{totalBudget.toLocaleString()}</p>
          </div>
        </motion.div>

        <motion.div className="summary-card budget-spent" variants={itemVariants}>
          <div className="summary-icon-container">
            <DollarSign size={24} />
          </div>
          <div className="summary-content">
            <p className="summary-label">Actually Spent</p>
            <p className="summary-value">₹{totalSpent.toLocaleString()}</p>
          </div>
        </motion.div>

        <motion.div
          className={`summary-card budget-remaining ${totalRemaining < 0 ? 'negative' : ''}`}
          variants={itemVariants}
        >
          <div className="summary-icon-container">
            <PieChart size={24} />
          </div>
          <div className="summary-content">
            <p className="summary-label">Left to Spend</p>
            <p className="summary-value">₹{Math.max(totalRemaining, 0).toLocaleString()}</p>
          </div>
        </motion.div>
      </motion.div>

      {/* Add Budget Form */}
      {showForm && (
        <motion.div
          className="add-budget-form glass-panel"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <div className="form-row">
            <div className="form-group">
              <label>Category Name</label>
              <select
                value={newBudget.category}
                onChange={(e) => setNewBudget({ ...newBudget, category: e.target.value })}
              >
                <option value="">Choose a category...</option>
                <option>Food & Dining</option>
                <option>Transportation</option>
                <option>Shopping</option>
                <option>Entertainment</option>
                <option>Bills</option>
                <option>Health</option>
                <option>Education</option>
                <option>Travel</option>
                <option>Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>Monthly Limit</label>
              <div className="input-with-icon">
                <span className="currency-symbol">₹</span>
                <input
                  type="number"
                  value={newBudget.limit}
                  onChange={(e) => setNewBudget({ ...newBudget, limit: e.target.value })}
                  placeholder="0.00"
                />
              </div>
            </div>
            <div className="form-actions">
              <button className="btn btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleAddBudget}>Save Budget</button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Budget Chart */}
      <motion.div
        className="budget-chart-container glass-panel"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="chart-header">
          <h3>Spending Breakdown</h3>
        </div>
        <div className="chart-wrapper">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" vertical={false} />
              <XAxis
                dataKey="category"
                stroke="var(--text-secondary)"
                tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="var(--text-secondary)"
                tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `₹${value}`}
              />
              <Tooltip
                cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                contentStyle={{
                  background: 'rgba(15, 23, 42, 0.9)',
                  border: '1px solid var(--border-glass)',
                  borderRadius: 'var(--radius-md)',
                  color: '#fff',
                  boxShadow: 'var(--shadow-lg)'
                }}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <Bar name="Spent" dataKey="spent" fill="#FF6B6B" radius={[4, 4, 0, 0]} maxBarSize={50} />
              <Bar name="Limit" dataKey="limit" fill="#4ECDC4" radius={[4, 4, 0, 0]} maxBarSize={50} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Budget Cards */}
      <motion.div
        className="budget-cards-grid"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {budgetData.map((budget, index) => (
          <ScrollReveal key={budget.id} delay={index * 0.1} direction="up">
            <motion.div className="budget-card glass-panel-premium hover-glow" variants={itemVariants}>
              <div className="budget-card-header">
                <div className="budget-info">
                  <h3 className="text-lg font-semibold text-white">{budget.category}</h3>
                  <span className="budget-limit-badge text-xs px-2 py-1 rounded bg-white/5 border border-white/10">Limit: ₹{budget.limit}</span>
                </div>
                <div className="budget-actions">
                  <button className="icon-btn hover:text-white transition-colors" title="Edit Budget">
                    <Edit2 size={16} />
                  </button>
                  <button
                    className="icon-btn delete hover:text-rose-400 transition-colors"
                    onClick={() => handleDeleteBudget(budget.id)}
                    title="Remove Budget"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="budget-progress-container">
                <div className="progress-labels">
                  <span className="spent-label" style={{ color: budget.color }}>₹{budget.spent} spent</span>
                  <span className="remaining-label">₹{budget.remaining} left</span>
                </div>
                <div className="progress-bar-track">
                  <div
                    className={`progress-fill ${budget.status}`}
                    style={{
                      width: `${budget.percentage}%`,
                      backgroundColor: budget.color
                    }}
                  />
                </div>
              </div>

              <div className="budget-card-footer">
                <div className="percentage-container">
                  <span className="percentage-value">{Math.round(budget.percentage)}%</span>
                  <span className="percentage-label">used</span>
                </div>

                <div className={`status-badge-container ${budget.status}`}>
                  {budget.status === 'over' && (
                    <span className="status-badge over">
                      <AlertCircle size={14} /> Over Limit
                    </span>
                  )}
                  {budget.status === 'warning' && (
                    <span className="status-badge warning">
                      <AlertCircle size={14} /> Near Limit
                    </span>
                  )}
                  {budget.status === 'good' && (
                    <span className="status-badge good">
                      <TrendingUp size={14} /> On Track
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          </ScrollReveal>
        ))}
      </motion.div>
    </div>
  );
};

export default BudgetPage;
