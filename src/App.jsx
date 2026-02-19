import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { onAuthChange, logoutUser } from './services/authService';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import MarketPage from './pages/MarketPage';
import PageTransition from './components/PageTransition';
import StarBackground from './components/StarBackground';
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
      <StarBackground />
      <Router>
        {user && <Navbar user={user} onLogout={handleLogout} />}
        <AnimatedRoutes user={user} />
      </Router>
    </ThemeProvider>
  );
}

// Separate component to use useLocation hook
const AnimatedRoutes = ({ user }) => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/market" element={
          <PageTransition>
            <MarketPage />
          </PageTransition>
        } />
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
