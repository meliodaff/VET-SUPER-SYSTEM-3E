import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { TrendingUp, Package, Calendar } from 'lucide-react';
import { formatCurrency } from '../../utils/helpers';

const SuppliesExpenses = ({ data }) => {
  const [lastRefresh, setLastRefresh] = useState(new Date());

  useEffect(() => {
    setLastRefresh(new Date());
  }, [data]);

  if (!data) {
    return (
      <div>
        <div className="flex items-center space-x-2 mb-6">
          <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
            <Package className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Supplies Expenses Analytics</h3>
            <p className="text-sm text-gray-500">Track and analyze supply expenses in real-time</p>
          </div>
        </div>
        <div className="h-64 flex items-center justify-center">
          <p className="text-gray-500">No expenses data available</p>
        </div>
      </div>
    );
  }

  const formatTime = (date) => {
    return date.toLocaleString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  const formatMonth = (monthStr) => {
    const [year, month] = monthStr.split('-');
    const date = new Date(year, month - 1);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  // Prepare data for charts
  const monthlyTrend = data.monthly_trend || [];
  const categoryBreakdown = data.category_breakdown || [];
  const summary = data.summary || {};
  const recentExpenses = data.recent_expenses || [];

  // Colors for pie chart
  const COLORS = ['#8b5cf6', '#6366f1', '#3b82f6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];

  // Custom tooltip for line chart
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm font-semibold text-gray-900 mb-1">
            {formatMonth(payload[0].payload.month)}
          </p>
          <p className="text-sm text-purple-600">
            Expenses: {formatCurrency(payload[0].value)}
          </p>
          <p className="text-xs text-gray-500">
            Items: {payload[0].payload.items_count}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
            <Package className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Supplies Expenses Analytics</h3>
            <p className="text-sm text-gray-500">Track and analyze supply expenses in real-time</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-xs text-gray-500">
          <Calendar className="h-4 w-4" />
          <span>Last refresh: {formatTime(lastRefresh)}</span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-purple-600 mb-1">Total Expenses</p>
              <p className="text-xl font-bold text-purple-900">
                {formatCurrency(summary.total_expenses || 0)}
              </p>
            </div>
            <div className="h-8 w-8 flex items-center justify-center text-purple-400 text-2xl font-bold">
              ₱
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-blue-600 mb-1">Monthly</p>
              <p className="text-xl font-bold text-blue-900">
                {formatCurrency(summary.monthly_expenses || 0)}
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-blue-400" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-green-600 mb-1">Total Items</p>
              <p className="text-xl font-bold text-green-900">
                {summary.total_items || 0}
              </p>
            </div>
            <Package className="h-8 w-8 text-green-400" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-orange-600 mb-1">Weekly</p>
              <p className="text-xl font-bold text-orange-900">
                {formatCurrency(summary.weekly_expenses || 0)}
              </p>
            </div>
            <Calendar className="h-8 w-8 text-orange-400" />
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Monthly Trend Line Chart */}
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <h4 className="text-sm font-semibold text-gray-700 mb-4">Monthly Expenses Trend</h4>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={monthlyTrend} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="month" 
                stroke="#6b7280"
                fontSize={11}
                tickFormatter={formatMonth}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis 
                stroke="#6b7280"
                fontSize={11}
                tickFormatter={(value) => `₱${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="total_expenses" 
                stroke="#8b5cf6" 
                strokeWidth={2}
                dot={{ fill: '#8b5cf6', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Category Breakdown Pie Chart */}
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <h4 className="text-sm font-semibold text-gray-700 mb-4">Expenses by Category</h4>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={categoryBreakdown.slice(0, 8)}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ category, percent }) => `${category}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="total_expenses"
              >
                {categoryBreakdown.slice(0, 8).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Bar Chart and Recent Expenses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Bar Chart */}
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <h4 className="text-sm font-semibold text-gray-700 mb-4">Top Categories</h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={categoryBreakdown.slice(0, 6)} margin={{ top: 5, right: 10, left: 0, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="category" 
                stroke="#6b7280"
                fontSize={11}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                stroke="#6b7280"
                fontSize={11}
                tickFormatter={(value) => `₱${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Bar 
                dataKey="total_expenses" 
                fill="#8b5cf6" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Expenses Table */}
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <h4 className="text-sm font-semibold text-gray-700 mb-4">Recent Expenses</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 font-semibold text-gray-700">Item</th>
                  <th className="text-left py-2 font-semibold text-gray-700">Category</th>
                  <th className="text-right py-2 font-semibold text-gray-700">Cost</th>
                </tr>
              </thead>
              <tbody>
                {recentExpenses.slice(0, 8).map((expense, index) => (
                  <tr key={expense.id || index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-2 font-medium text-gray-900 text-xs">
                      {expense.item}
                    </td>
                    <td className="py-2 text-gray-600 text-xs">
                      {expense.category}
                    </td>
                    <td className="py-2 text-right font-semibold text-purple-600 text-xs">
                      {formatCurrency(expense.total_cost)}
                    </td>
                  </tr>
                ))}
                {recentExpenses.length === 0 && (
                  <tr>
                    <td colSpan="3" className="py-4 text-center text-gray-500 text-xs">
                      No recent expenses
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuppliesExpenses;

