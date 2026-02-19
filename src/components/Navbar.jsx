import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, Moon, Sun, Wallet, CreditCard, Target } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import './Navbar.css';

const Navbar = ({ user, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await onLogout();
      navigate('/login');
      setIsMenuOpen(false);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <Link to="/">
            <span className="logo-icon"><Wallet className="text-purple-400" size={28} /></span>
            <span className="logo-text">FinanceTracker</span>
          </Link>
        </div>

        <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          <div className="nav-links">
            <Link to="/" className="nav-link">Dashboard</Link>
            {user && (
              <>
                <Link to="/budget" className="nav-link"><div style={{ display: 'inline-flex', verticalAlign: 'middle', marginRight: '4px' }}><CreditCard size={16} /></div> Budget</Link>
                <Link to="/goals" className="nav-link"><div style={{ display: 'inline-flex', verticalAlign: 'middle', marginRight: '4px' }}><Target size={16} /></div> Goals</Link>
                <Link to="/transactions" className="nav-link">Transactions</Link>
                <Link to="/add-transaction" className="nav-link btn btn-primary">
                  + Add Transaction
                </Link>
              </>
            )}
          </div>

          <div className="navbar-actions">
            {user ? (
              <div className="user-menu">
                <span className="user-name" style={{ color: 'var(--primary-glow)' }}>{user.displayName || user.email}</span>
                <button className="btn btn-danger btn-small" onClick={handleLogout}>
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            ) : (
              <div className="auth-buttons" style={{ display: 'flex', gap: '1rem' }}>
                <Link to="/login" className="btn btn-ghost">Login</Link>
                <Link to="/register" className="btn btn-primary">Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
