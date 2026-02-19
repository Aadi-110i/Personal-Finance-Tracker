import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import SummaryCards from '../components/SummaryCards';
import TransactionList from '../components/TransactionList';
import Charts from '../components/Charts';
import TransactionForm from '../components/TransactionForm';
import AIInsights from '../components/AIInsights';
import ScrollReveal from '../components/ScrollReveal';
import { useTransactions } from '../hooks/useTransactions';
import './Dashboard.css';

const Dashboard = ({ user }) => {
  const { transactions, loading, error, createTransaction, editTransaction, removeTransaction } = useTransactions(user?.uid);
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const location = useLocation();
  const isDashboardView = location.pathname === '/';

  const handleAddTransaction = async (formData) => {
    try {
      await createTransaction(formData);
      setShowForm(false);
      setEditingTransaction(null);
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };

  const handleEditTransaction = async (formData) => {
    try {
      await editTransaction(editingTransaction.id, formData);
      setEditingTransaction(null);
      setShowForm(false);
    } catch (error) {
      console.error('Error updating transaction:', error);
    }
  };

  const handleDeleteTransaction = async (id) => {
    try {
      await removeTransaction(id);
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  const handleEditClick = (transaction) => {
    setEditingTransaction(transaction);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingTransaction(null);
    if (window.location.pathname === '/add-transaction') {
      window.history.pushState({}, '', '/');
    }
  };

  const filteredTransactions = transactions.filter(t =>
    t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Dummy data for guest view
  const guestTransactions = [
    { id: '1', description: 'Freelance Project', amount: 1200, type: 'income', category: 'Income', date: new Date().toISOString() },
    { id: '2', description: 'Grocery Shopping', amount: 150, type: 'expense', category: 'Food', date: new Date().toISOString() },
    { id: '3', description: 'Netflix Subscription', amount: 15, type: 'expense', category: 'Entertainment', date: new Date().toISOString() },
    { id: '4', description: 'Gym Membership', amount: 50, type: 'expense', category: 'Health', date: new Date().toISOString() },
    { id: '5', description: 'Stock Dividend', amount: 45, type: 'income', category: 'Investment', date: new Date().toISOString() },
  ];

  const displayTransactions = user ? filteredTransactions : guestTransactions;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1 className="neon-text">
            {user ? `Hey, ${user.displayName || 'User'}!` : 'Welcome to FinanceTracker!'}
          </h1>
          <p className="header-subtitle" style={{ color: 'var(--text-secondary)' }}>
            {user ? "Let's check your financial pulse." : "Explore our premium dashboard features (Guest View)"}
          </p>
        </div>
        {user ? (
          <button
            className="btn btn-primary add-btn"
            onClick={() => setShowForm(true)}
          >
            <Plus size={20} /> Add Transaction
          </button>
        ) : (
          <div className="guest-badge" style={{
            padding: '0.5rem 1rem',
            background: 'var(--bg-glass)',
            border: '1px solid var(--accent-primary)',
            borderRadius: 'var(--radius-full)',
            color: 'var(--accent-primary)',
            fontSize: '0.875rem'
          }}>
            Guest Mode
          </div>
        )}
      </div>

      {user && error && (
        <div className="alert alert-danger">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Guest Call-to-Action */}
      {!user && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{
            position: 'relative',
            borderRadius: 'var(--radius-xl)',
            padding: '4rem 2rem',
            marginBottom: '4rem',
            textAlign: 'center',
            overflow: 'hidden',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            background: 'rgba(255, 255, 255, 0.01)',
            backdropFilter: 'blur(30px)',
            WebkitBackdropFilter: 'blur(30px)',
            boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)'
          }}
        >
          <div style={{ position: 'relative', zIndex: 10 }}>
            <h2 className="neon-text" style={{ fontSize: '3.5rem', marginBottom: '1.5rem', lineHeight: 1.1 }}>
              Your Money, Your Rules. <br />
              <span style={{ color: 'var(--accent-cyan)' }}>Style Your Future.</span>
            </h2>
            <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto 2rem' }}>
              Ditch the spreadsheets. Experience finance that flows as smooth as you do.
              AI insights, premium aesthetics, and total control.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <a href="/register" className="btn btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem', borderRadius: '100px' }}>Get Started</a>
              <a href="/login" className="btn btn-ghost" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem', borderRadius: '100px', border: '1px solid rgba(255,255,255,0.1)' }}>Login</a>
            </div>
          </div>
        </motion.div>
      )
      }

      <ScrollReveal width="100%">
        <div className="search-section">
          <input
            type="text"
            placeholder="Search transactions by description or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
            disabled={!user}
          />
          <Search className="search-icon" size={20} />
        </div>
      </ScrollReveal>

      <motion.div
        className="dashboard-grid"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <motion.div className="grid-item-summary" variants={itemVariants}>
          <SummaryCards transactions={displayTransactions} />
        </motion.div>

        {user && (
          <>
            <motion.div className="grid-item-charts" variants={itemVariants}>
              <Charts transactions={displayTransactions} />
            </motion.div>
            {isDashboardView && (
              <motion.div className="grid-item-recent" variants={itemVariants}>
                <h3 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Recent History</h3>
                <TransactionList
                  transactions={displayTransactions}
                  onEdit={user ? handleEditClick : () => { }}
                  onDelete={user ? handleDeleteTransaction : () => { }}
                  loading={user ? loading : false}
                />
              </motion.div>
            )}
          </>
        )}

        {!user && (
          <motion.div className="grid-item-recent" style={{ gridColumn: 'span 12' }} variants={itemVariants}>
            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Demo Data Preview</h3>
            <TransactionList
              transactions={displayTransactions}
              onEdit={() => { }}
              onDelete={() => { }}
              loading={false}
            />
          </motion.div>
        )}
      </motion.div>

      {/* Guest Features - Premium Glass */}
      {
        !user && (
          <motion.div
            className="features-section"
            style={{ marginTop: '6rem' }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <ScrollReveal direction="up" delay={0.2}>
              <h2 className="neon-text" style={{ textAlign: 'center', marginBottom: '3rem', fontSize: '2.5rem' }}>
                Why FinanceTracker?
              </h2>
            </ScrollReveal>
            <div className="features-grid" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '2rem',
              padding: '0 1rem'
            }}>
              {[
                { title: 'Advanced Analytics', desc: 'Visualize your spending habits with interactive charts and real-time data analysis. Gain insights that help you save more.' },
                { title: 'Bank-Grade Security', desc: 'Your financial data is encrypted and stored securely. We prioritize your privacy with state-of-the-art protection.' },
                { title: 'Real-time Sync', desc: 'Add transactions instantly and see your balance update in real-time across all your devices.' }
              ].map((feature, index) => (
                <ScrollReveal key={index} delay={index * 0.2} direction="up">
                  <div
                    className="glass-panel-premium hover-glow"
                    style={{ padding: '2.5rem', height: '100%' }}
                  >
                    <h3 style={{ marginBottom: '1rem', color: '#fff', fontSize: '1.5rem' }}>{feature.title}</h3>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8', fontSize: '1.1rem' }}>
                      {feature.desc}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </motion.div>
        )
      }

      {
        showForm && (
          <div className="modal-overlay">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="modal-content glass-panel-premium"
            >
              <TransactionForm
                onSubmit={editingTransaction ? handleEditTransaction : handleAddTransaction}
                initialData={editingTransaction}
                onCancel={handleCloseForm}
              />
            </motion.div>
          </div>
        )
      }
    </div >
  );
};

export default Dashboard;
