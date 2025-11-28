// Dashboard.jsx
import React from 'react';
import { Package, AlertCircle, FolderTree, Truck, DollarSign } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import '../styles/dashboard.css';

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

  // Sample data for inventory value trend
  const inventoryTrendData = [
    { month: 'Jan', value: 65000 },
    { month: 'Feb', value: 68500 },
    { month: 'Mar', value: 72000 },
    { month: 'Apr', value: 75200 },
    { month: 'May', value: 79800 },
    { month: 'Jun', value: 84789 }
  ];

  // Sample data for stock levels by category
  const stockByCategory = [
    { category: 'Medications', stock: 450 },
    { category: 'Vaccines', stock: 280 },
    { category: 'Surgical', stock: 180 },
    { category: 'Lab Supplies', stock: 320 },
    { category: 'Food/Treats', stock: 520 },
    { category: 'Equipment', stock: 95 }
  ];

  // Sample data for product distribution
  const productDistribution = [
    { name: 'Medications', value: 35, color: '#3b82f6' },
    { name: 'Vaccines', value: 20, color: '#10b981' },
    { name: 'Surgical', value: 15, color: '#8b5cf6' },
    { name: 'Lab Supplies', value: 12, color: '#f59e0b' },
    { name: 'Food/Treats', value: 10, color: '#ef4444' },
    { name: 'Equipment', value: 8, color: '#06b6d4' }
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Dashboard</h1>
        <p className="dashboard-subtitle">Welcome back! Here's what's happening with your inventory.</p>
      </div>

      {/* Top Stats Grid */}
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

      {/* Total Inventory Value Card */}
      <div className="dashboard-card dashboard-card-large">
        <div className="dashboard-card-large-header">
          <div className="dashboard-card-icon icon-green">
            <DollarSign className="icon" />
          </div>
          <span className="dashboard-card-title">Total Inventory Value</span>
        </div>
        <div className="dashboard-card-value-large">$84,789.00</div>
        <p className="dashboard-card-subtitle">Based on cost price of all products in stock</p>
      </div>

      {/* Charts Grid */}
      <div className="dashboard-charts-grid">
        {/* Inventory Value Trend */}
        <div className="dashboard-card chart-card">
          <h3 className="chart-title">Inventory Value Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={inventoryTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
                formatter={(value) => `$${value.toLocaleString()}`}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#10b981" 
                strokeWidth={3}
                dot={{ fill: '#10b981', r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Stock Levels by Category */}
        <div className="dashboard-card chart-card">
          <h3 className="chart-title">Stock Levels by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stockByCategory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="category" 
                stroke="#6b7280" 
                angle={-45} 
                textAnchor="end" 
                height={80} 
              />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="stock" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Product Distribution Pie Chart */}
      <div className="dashboard-card chart-card">
        <h3 className="chart-title">Product Distribution by Category</h3>
        <ResponsiveContainer width="100%" height={350}>
          <PieChart>
            <Pie
              data={productDistribution}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
            >
              {productDistribution.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px'
              }}
              formatter={(value) => `${value}%`}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}