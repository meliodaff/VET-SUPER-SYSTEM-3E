import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { Menu, X } from 'lucide-react';

const Layout = ({ children, admin, onLogout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Ensure onLogout is defined
  const handleLogout = onLogout || (() => {
    console.warn('onLogout is not defined');
    localStorage.removeItem('admin');
    window.location.href = '/login';
  });

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-navy-900 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <Sidebar onLogout={handleLogout} />
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Header */}
        <Header 
          admin={admin} 
          onToggleSidebar={toggleSidebar}
          sidebarOpen={sidebarOpen}
          onLogout={handleLogout}
        />

        {/* Page content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
