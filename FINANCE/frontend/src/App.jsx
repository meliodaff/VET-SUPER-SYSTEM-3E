import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { authAPI } from './services/api';

// Components
import AdminLogin from './components/auth/AdminLogin';
import CreateAccount from './components/auth/CreateAccount';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import Invoices from './pages/Invoices';
import MonitorPayment from './pages/MonitorPayment';
import Layout from './components/layout/Layout';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const storedAdmin = localStorage.getItem('admin');
      if (storedAdmin) {
        const adminData = JSON.parse(storedAdmin);
        setAdmin(adminData);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      localStorage.removeItem('admin');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (loginData) => {
    try {
      const response = await authAPI.login(loginData);
      if (response.data.success) {
        const adminData = response.data.data.admin;
        setAdmin(adminData);
        setIsAuthenticated(true);
        localStorage.setItem('admin', JSON.stringify(adminData));
        return { success: true };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const handleLogout = async () => {
    try {
      setIsAuthenticated(false);
      setAdmin(null);
      localStorage.removeItem('admin');
      await authAPI.logout().catch(err => {
        // Ignore logout API errors, we've already cleared local state
        console.warn('Logout API call failed:', err);
      });
      // Redirect to login
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error);
      // Even if there's an error, clear local state and redirect
      setIsAuthenticated(false);
      setAdmin(null);
      localStorage.removeItem('admin');
      window.location.href = '/login';
    }
  };

  const handleCreateAccount = async (accountData) => {
    try {
      const response = await authAPI.createAccount(accountData);
      if (response.data.success) {
        return { success: true };
      } else {
        return { 
          success: false, 
          message: response.data.message || 'Account creation failed' 
        };
      }
    } catch (error) {
      console.error('Create account error:', error);
      console.error('Error response:', error.response);
      
      // Handle 504 Gateway Timeout
      if (error.response?.status === 504 || error.code === 'ECONNABORTED') {
        return { 
          success: false, 
          message: 'Request timeout. The backend server is not responding. Please ensure:\n1. XAMPP/WAMP Apache is running\n2. MySQL is running\n3. Backend files are in the correct location (C:\\xampp\\htdocs\\fur-ever-care\\backend\\)' 
        };
      }
      
      // Handle network errors
      if (error.code === 'ERR_NETWORK' || !error.response) {
        return { 
          success: false, 
          message: 'Cannot connect to backend server. Please ensure XAMPP/WAMP Apache is running and accessible at http://localhost' 
        };
      }
      
      // Handle different error scenarios
      if (error.response?.data?.message) {
        return { 
          success: false, 
          message: error.response.data.message 
        };
      } else if (error.response?.data?.error) {
        return { 
          success: false, 
          message: error.response.data.error 
        };
      } else if (error.message) {
        return { 
          success: false, 
          message: error.message 
        };
      } else {
        return { 
          success: false, 
          message: 'Account creation failed. Please check your browser console for details.' 
        };
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto"></div>
          <p className="text-white text-xl mt-4">Loading Fur-Ever Care...</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <Router>
        <div className="App">
          <Routes>
          {/* Public Routes */}
          <Route 
            path="/login" 
            element={
              !isAuthenticated ? (
                <AdminLogin onLogin={handleLogin} />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            } 
          />
          <Route 
            path="/create-account" 
            element={
              !isAuthenticated ? (
                <CreateAccount onCreateAccount={handleCreateAccount} />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            } 
          />
          
          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={
              isAuthenticated ? (
                <Layout admin={admin} onLogout={handleLogout}>
                  <Dashboard />
                </Layout>
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
          <Route 
            path="/employees" 
            element={
              isAuthenticated ? (
                <Layout admin={admin} onLogout={handleLogout}>
                  <Employees />
                </Layout>
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
          <Route 
            path="/invoices" 
            element={
              isAuthenticated ? (
                <Layout admin={admin} onLogout={handleLogout}>
                  <Invoices />
                </Layout>
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
          <Route 
            path="/payments" 
            element={
              isAuthenticated ? (
                <Layout admin={admin} onLogout={handleLogout}>
                  <MonitorPayment />
                </Layout>
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
          
          {/* Default Route */}
          <Route 
            path="/" 
            element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} 
          />
          </Routes>
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
