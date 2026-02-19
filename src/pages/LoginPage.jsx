import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import { loginUser } from '../services/authService';
import './AuthPages.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!email.trim() || !password.trim()) {
        throw new Error('Please fill in all fields');
      }

      await loginUser(email, password);
      navigate('/');
    } catch (err) {
      let errorMessage = 'Failed to login';

      if (err.code === 'auth/user-not-found') {
        errorMessage = 'User not found. Please register first.';
      } else if (err.code === 'auth/wrong-password') {
        errorMessage = 'Wrong password. Please try again.';
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address.';
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">💰</div>
          <h1>FinanceTracker</h1>
          <p>Sign in to your account</p>
        </div>

        {error && (
          <div className="alert alert-danger" style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <div className="input-wrapper">
              <Mail size={20} className="input-icon" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <Lock size={20} className="input-icon" />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                disabled={loading}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary auth-btn"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Don't have an account?{' '}
            <Link to="/register">Sign up here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
