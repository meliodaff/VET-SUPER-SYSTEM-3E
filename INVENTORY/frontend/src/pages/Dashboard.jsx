import React from 'react';
import { Package, AlertCircle, FolderTree, Truck, DollarSign } from 'lucide-react';
import './Dashboard.css';

export default function Dashboard() {
  const topStats = [
    {
      title: 'Total Products',
      value: '26',
      icon: Package,
      iconClass: 'icon-blue'
    },
    {
      title: 'Low Stock Alert',
      value: '0',
      icon: AlertCircle,
      iconClass: 'icon-red'
    },
    {
      title: 'Categories',
      value: '25',
      icon: FolderTree,
      iconClass: 'icon-green'
    },
    {
      title: 'Suppliers',
      value: '25',
      icon: Truck,
      iconClass: 'icon-purple'
    }
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Dashboard</h1>
        <p className="dashboard-subtitle">Welcome back! Here's what's happening with your inventory.</p>
      </div>

      <div className="dashboard-grid-top">
        {topStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="dashboard-card">
              <div className="dashboard-card-header">
                <span className="dashboard-card-title">{stat.title}</span>
                <div className={`dashboard-card-icon ${stat.iconClass}`}>
                  <Icon className="icon" />
                </div>
              </div>
              <div className="dashboard-card-value">{stat.value}</div>
            </div>
          );
        })}
      </div>

      <div className="dashboard-card dashboard-card-large">
        <div className="dashboard-card-large-header">
          <div className={`dashboard-card-icon icon-green`}>
            <DollarSign className="icon" />
          </div>
          <span className="dashboard-card-title">Total Inventory Value</span>
        </div>
        <div className="dashboard-card-value-large">$84,789.00</div>
        <p className="dashboard-card-subtitle">Based on cost price of all products in stock</p>
      </div>
    </div>
  );
}