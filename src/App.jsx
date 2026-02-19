import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { onAuthChange, logoutUser } from './services/authService';
import { ThemeProvider } from './context/ThemeContext';
import Sidebar from './components/Sidebar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import BudgetPage from './pages/BudgetPage';
import GoalsPage from './pages/GoalsPage';
import ReportsPage from './pages/ReportsPage';
import SubscriptionsPage from './pages/SubscriptionsPage';
import PageTransition from './components/PageTransition';
import SnowBackground from './components/SnowBackground'; // Updated background
import FrostyCursor from './components/FrostyCursor';
import SmoothScroll from './components/SmoothScroll';
import { useTransactions } from './hooks/useTransactions';
import './styles/global.css';
import './App.css';

const PrivateRoute = ({ user, children }) => {
  return user ? children : <Navigate to="/login" />;
};

const AuthRoute = ({ user, children }) => {
  return user ? <Navigate to="/" /> : children;
};

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthChange((authUser) => {
      setUser(authUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await logoutUser();
    setUser(null);
  };

  if (loading) {
    return (
      <div className="app-loading">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <SnowBackground /> {/* Infinite Snow Loop */}
      <FrostyCursor />
      <Router>
        <Sidebar user={user} onLogout={handleLogout} />
        <MainContent user={user}>
          <SmoothScroll>
            <AnimatedRoutes user={user} />
          </SmoothScroll>
        </MainContent>
      </Router>
    </ThemeProvider>
  );
}

// Wrapper for main content to handle sidebar layout
const MainContent = ({ user, children }) => {
  return (
    <div
      className="app-main with-sidebar"
      style={{
        paddingLeft: '260px',
        width: '100%',
        boxSizing: 'border-box',
        position: 'relative',
        minHeight: '100vh'
      }}
    >
      {children}
    </div>
  );
};

// Budget Route Component
const BudgetRoute = ({ user }) => {
  const { transactions } = useTransactions(user?.uid);
  return <BudgetPage transactions={transactions} user={user} />;
};

// Goals Route Component  
const GoalsRoute = ({ user }) => {
  return <GoalsPage user={user} />;
};

// Reports Route Component
const ReportsRoute = ({ user }) => {
  return <ReportsPage user={user} />;
};

// Subscriptions Route Component
const SubscriptionsRoute = ({ user }) => {
  return <SubscriptionsPage user={user} />;
};

// Separate component to use useLocation hook
const AnimatedRoutes = ({ user }) => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/budget"
          element={
            <PrivateRoute user={user}>
              <PageTransition>
                <BudgetRoute user={user} />
              </PageTransition>
            </PrivateRoute>
          }
        />
        <Route
          path="/goals"
          element={
            <PrivateRoute user={user}>
              <PageTransition>
                <GoalsRoute user={user} />
              </PageTransition>
            </PrivateRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <PrivateRoute user={user}>
              <PageTransition>
                <ReportsRoute user={user} />
              </PageTransition>
            </PrivateRoute>
          }
        />
        <Route
          path="/subscriptions"
          element={
            <PrivateRoute user={user}>
              <PageTransition>
                <SubscriptionsRoute user={user} />
              </PageTransition>
            </PrivateRoute>
          }
        />
        <Route
          path="/login"
          element={
            <AuthRoute user={user}>
              <PageTransition>
                <LoginPage />
              </PageTransition>
            </AuthRoute>
          }
        />
        <Route
          path="/register"
          element={
            <AuthRoute user={user}>
              <PageTransition>
                <RegisterPage />
              </PageTransition>
            </AuthRoute>
          }
        />
        <Route
          path="/"
          element={
            <PageTransition>
              <Dashboard user={user} />
            </PageTransition>
          }
        />
        <Route
          path="/transactions"
          element={
            <PrivateRoute user={user}>
              <PageTransition>
                <Dashboard user={user} />
              </PageTransition>
            </PrivateRoute>
          }
        />
        <Route
          path="/add-transaction"
          element={
            <PrivateRoute user={user}>
              <PageTransition>
                <Dashboard user={user} />
              </PageTransition>
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </AnimatePresence>
  );
};

export default App;
