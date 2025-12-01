import React, { useState, useEffect } from "react";
import {
  Package,
  AlertCircle,
  FolderTree,
  Truck,
  DollarSign,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "../styles/dashboard.css";

const API_URL = "http://localhost/inventory-system/backend/api.php";

export default function Dashboard() {
  const [stats, setStats] = useState({
    total_stock: 0,
    low_stock: 0,
    total_categories: 0,
    total_suppliers: 0,
    total_value: 0,
  });

  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  console.log(document.cookie);
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  }

  const userCookie = getCookie("user");

  const user = JSON.parse(decodeURIComponent(userCookie));

  localStorage.setItem("user", JSON.stringify(user));

  const storedUser = JSON.parse(localStorage.getItem("user"));
  console.log(storedUser);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch(`${API_URL}?action=dashboard`);
      const data = await response.json();

      if (data.success) {
        setStats(data.stats);
        setChartData(data.chartData); // Data for Bar and Pie charts
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
    setLoading(false);
  };

  // Stats Card Configuration
  const topStats = [
    {
      title: "Total Stock Quantity", // Changed title to be clear
      value: stats.total_stock, // Sum of all quantities
      icon: Package,
      iconClass: "icon-blue",
    },
    {
      title: "Low Stock Alert",
      value: stats.low_stock, // Items with 0 quantity
      icon: AlertCircle,
      iconClass: "icon-red",
    },
    {
      title: "Categories",
      value: stats.total_categories, // Count of categories
      icon: FolderTree,
      iconClass: "icon-green",
    },
    {
      title: "Suppliers",
      value: stats.total_suppliers, // Count of suppliers
      icon: Truck,
      iconClass: "icon-purple",
    },
  ];

  // Static Data for Trend (Since we don't have a history table yet)
  const inventoryTrendData = [
    { month: "Jan", value: 45000 },
    { month: "Feb", value: 52000 },
    { month: "Mar", value: 48000 },
    { month: "Apr", value: 61000 },
    { month: "May", value: 55000 },
    { month: "Jun", value: Number(stats.total_value) }, // Connect current value to the trend
  ];

  // Helper to format currency to Peso
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(amount);
  };

  if (loading) {
    return (
      <div
        className="dashboard"
        style={{ padding: "2rem", textAlign: "center" }}
      >
        Loading Dashboard...
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Dashboard</h1>
        <p className="dashboard-subtitle">
          Welcome back! Here's what's happening with your inventory.
        </p>
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
            {/* Peso Sign is represented by P usually, or DollarSign icon stylistically */}
            <span style={{ fontSize: "1.5rem", fontWeight: "bold" }}>₱</span>
          </div>
          <span className="dashboard-card-title">Total Inventory Value</span>
        </div>
        <div className="dashboard-card-value-large">
          {formatCurrency(stats.total_value)}
        </div>
        <p className="dashboard-card-subtitle">
          Calculated based on (Cost × Quantity) of all products
        </p>
      </div>

      {/* Charts Grid */}
      <div className="dashboard-charts-grid">
        {/* Chart 1: Stock Levels by Category (Dynamic) */}
        <div className="dashboard-card chart-card">
          <h3 className="chart-title">Stock Levels by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="name"
                stroke="#6b7280"
                angle={-45}
                textAnchor="end"
                height={70}
                interval={0}
                tick={{ fontSize: 12 }}
              />
              <YAxis stroke="#6b7280" />
              <Tooltip
                cursor={{ fill: "transparent" }}
                contentStyle={{
                  backgroundColor: "white",
                  borderRadius: "8px",
                  border: "1px solid #e5e7eb",
                }}
              />
              <Bar
                dataKey="value"
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
                name="Stock Quantity"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color || "#3b82f6"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Chart 2: Product Distribution Pie (Dynamic) */}
        <div className="dashboard-card chart-card">
          <h3 className="chart-title">Category Distribution</h3>
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  percent > 0 ? `${(percent * 100).toFixed(0)}%` : ""
                }
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color || "#8884d8"} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  borderRadius: "8px",
                  border: "1px solid #e5e7eb",
                }}
              />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Chart 3: Inventory Trend (Static/Hybrid) */}
        {/* Kept as a visual element, but with the last data point being real */}
        <div
          className="dashboard-card chart-card"
          style={{ gridColumn: "1 / -1" }}
        >
          <h3 className="chart-title">Estimated Value Trend (6 Months)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={inventoryTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  borderRadius: "8px",
                  border: "1px solid #e5e7eb",
                }}
                formatter={(value) => formatCurrency(value)}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ fill: "#10b981", r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
