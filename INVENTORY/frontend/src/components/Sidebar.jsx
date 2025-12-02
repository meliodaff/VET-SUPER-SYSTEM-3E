// Sidebar.jsx
import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  FolderTree, 
  Truck,
  User,
  LogOut
} from 'lucide-react';
import '../styles/sidebar.css';
import logo from '../assets/VETERINARY_LOGO_SYSTEM 1.PNG';

export default function Sidebar({ onNavigate, currentPage }) {
  const menuItems = [
    { id: 'Dashboard', label: 'Dashboard', icon: LayoutDashboard, component: 'Dashboard' },
    { id: 'Products', label: 'Products', icon: Package, component: 'Products' },
    { id: 'Categories', label: 'Categories', icon: FolderTree, component: 'Categories' },
    { id: 'Suppliers', label: 'Suppliers', icon: Truck, component: 'Suppliers' },
    { id: 'Employee Portal', label: 'Employee Portal', icon: User, component: '' },
  ];

  const handleClick = (componentName) => {
    if (onNavigate) {
      onNavigate(componentName);
    }
  };

  const handleLogout = () => {
    // Add your logout logic here
    localStorage.clear();
    console.log('Logging out...');
    // You might want to redirect to login page or call onNavigate
  };

  return (
    <aside className="sidebar">
      {/* Logo Section */}
      <div className="sidebar-header">
        <div className="sidebar-logo-container">
          <img
            src={logo}
            alt="Fur Ever Care Logo"
            className="sidebar-logo-img"
          />
          <div className="sidebar-logo-text-container">
            <h1 className="sidebar-logo-title">FUR EVER</h1>
            <p className="sidebar-logo-subtitle">Inventory System</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="sidebar-nav">
        <ul className="sidebar-menu">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.component;

            return (
              <li key={item.id} className="sidebar-menu-item">
                <button
                  onClick={() => handleClick(item.component)}
                  className={`sidebar-btn ${isActive ? 'sidebar-btn-active' : ''}`}
                >
                  <Icon size={20} className="sidebar-icon" />
                  <span className="sidebar-label">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
      
      {/* Bottom User Section */}
      <div className="sidebar-user">
        <div className="sidebar-user-avatar">C</div>
        <div className="sidebar-user-info">
          <p className="sidebar-user-name">Christian</p>
          <p className="sidebar-user-role">Admin</p>
        </div>
      </div>
    </aside>
  );
}