import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { formatCurrency } from '../../utils/helpers';

const SalesTrend = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="text-center">
          <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No sales data available</p>
        </div>
      </div>
    );
  }

  // Format data for chart
  const chartData = data.map(item => ({
    month: item.month,
    sales: parseFloat(item.total_sales || 0)
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length && payload[0] && payload[0].value != null) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{label}</p>
          <p className="text-blue-600">
            Sales: {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      <div className="flex items-center space-x-2 mb-6">
        <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
          <TrendingUp className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Sales Trend (6 Months)</h3>
          <p className="text-sm text-gray-500">Monthly performance overview</p>
        </div>
      </div>
      
      <div className="h-64">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="month" 
                stroke="#9ca3af"
                fontSize={11}
                tickFormatter={(value) => {
                  if (typeof value === 'string' && value.includes('-')) {
                    const date = new Date(value + '-01');
                    return date.toLocaleDateString('en-US', { month: 'short' });
                  }
                  return value;
                }}
              />
              <YAxis 
                stroke="#9ca3af"
                fontSize={11}
                tickFormatter={(value) => `P${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="sales" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center border border-gray-200 rounded">
            <div className="text-center text-gray-400">
              <p>No data available</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SalesTrend;
