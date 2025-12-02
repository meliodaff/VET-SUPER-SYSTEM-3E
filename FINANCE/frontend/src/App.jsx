import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Components
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import Invoices from './pages/Invoices';
import MonitorPayment from './pages/MonitorPayment';
import SupplierPayments from './pages/SupplierPayments';
import EmployeePortal from './pages/EmployeePortal';
import InventoryPortal from './pages/InventoryPortal';
import StockTracking from './pages/StockTracking';
import Layout from './components/layout/Layout';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  // Authentication removed: all routes are public.
  // Keep a noop admin and handlers so Layout receives props safely.
  const admin = null;
  const noop = () => {};

  return (
    <ErrorBoundary>
      <Router>
        <div className="App">
          <Routes>
          {/* Public Routes (authentication removed) */}
          <Route path="/login" element={<Navigate to="/finance-dashboard" replace />} />
          <Route path="/create-account" element={<Navigate to="/finance-dashboard" replace />} />

          <Route
            path="/finance-dashboard"
            element={
              <Layout admin={admin} onLogout={noop}>
                <Dashboard />
              </Layout>
            }
          />
          <Route
            path="/employee-portal"
            element={
              <Layout admin={admin} onLogout={noop}>
                <EmployeePortal />
              </Layout>
            }
          />
          <Route
            path="/employees"
            element={
              <Layout admin={admin} onLogout={noop}>
                <Employees />
              </Layout>
            }
          />
          <Route
            path="/invoices"
            element={
              <Layout admin={admin} onLogout={noop}>
                <Invoices />
              </Layout>
            }
          />
          <Route
            path="/payments"
            element={
              <Layout admin={admin} onLogout={noop}>
                <MonitorPayment />
              </Layout>
            }
          />
          <Route
            path="/supplier-payments"
            element={
              <Layout admin={admin} onLogout={noop}>
                <SupplierPayments />
              </Layout>
            }
          />
          <Route
            path="/stock-tracking"
            element={
              <Layout admin={admin} onLogout={noop}>
                <StockTracking />
              </Layout>
            }
          />
          <Route
            path="/inventory-portal"
            element={
              <Layout admin={admin} onLogout={noop}>
                <InventoryPortal />
              </Layout>
            }
          />

          {/* Default Route */}
          <Route path="/" element={<Navigate to="/finance-dashboard" replace />} />
          </Routes>
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
