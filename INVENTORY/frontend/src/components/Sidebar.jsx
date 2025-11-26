import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  FolderTree, 
  Truck, 
  Users, 
  ShoppingCart, 
  TrendingUp, 
  FileText, 
  Settings,
  Box
} from 'lucide-react';
import './Sidebar.css';

export default function Sidebar({ onNavigate, currentPage }) {
  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, component: 'Dashboard' },
    { name: 'Products', icon: Package, component: 'Products' },
    { name: 'Categories', icon: FolderTree, component: 'Categories' },
    { name: 'Suppliers', icon: Truck, component: 'Suppliers' },
  ];

  const handleClick = (componentName) => {
    if (onNavigate) {
      onNavigate(componentName);
    }
  };

  return (
    <aside className="sidebar">
      {/* Logo Section */}
      <div className="sidebar-logo">
        <Box className="sidebar-logo-icon" />
        <span className="sidebar-logo-text">FUR EVER CARE</span>
      </div>

      {/* Menu Items */}
      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.component;
          return (
            <button
              key={item.name}
              className={`sidebar-item ${isActive ? 'active' : ''}`}
              onClick={() => handleClick(item.component)}
            >
              <Icon className="sidebar-item-icon" />
              <span className="sidebar-item-text">{item.name}</span>
            </button>
          );
        })}
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