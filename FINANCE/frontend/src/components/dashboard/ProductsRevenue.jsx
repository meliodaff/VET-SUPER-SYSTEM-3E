import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { PieChart as PieChartIcon } from 'lucide-react';
import { formatCurrency } from '../../utils/helpers';

const ProductsRevenue = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div>
        <div className="flex items-center space-x-2 mb-6">
          <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
            <PieChartIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Products & Services Revenue</h3>
            <p className="text-sm text-gray-500">Veterinary services breakdown</p>
          </div>
        </div>
        <div className="h-64 flex items-center justify-center">
          <p className="text-gray-500">No revenue data available</p>
        </div>
      </div>
    );
  }

  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length && payload[0] && payload[0].value != null) {
      const data = payload[0];
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{data.name}</p>
          <p className="text-blue-600">
            Amount: {formatCurrency(data.value)}
          </p>
          <p className="text-gray-600">
            Percentage: {data.payload?.percentage ?? 0}%
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }) => {
    return (
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center">
            <div 
              className="w-3 h-3 rounded-full mr-2" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-gray-600">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      <div className="flex items-center space-x-2 mb-6">
        <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
          <PieChartIcon className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Products & Services Revenue</h3>
          <p className="text-sm text-gray-500">Veterinary services breakdown</p>
        </div>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={80}
              paddingAngle={5}
              dataKey="amount"
              nameKey="category"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ProductsRevenue;
