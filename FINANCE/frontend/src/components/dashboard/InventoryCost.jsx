import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BarChart3, Activity } from 'lucide-react';
import { formatCurrency } from '../../utils/helpers';
import InventoryTransactionModal from './InventoryTransactionModal';

const InventoryCost = ({ data }) => {
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setLastRefresh(new Date());
  }, [data]);

  if (!data) {
    return (
      <div>
        <div className="flex items-center space-x-2 mb-6">
          <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
            <BarChart3 className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Inventory & Supplies Cost</h3>
            <p className="text-sm text-gray-500">Current stock quantities and cost impact</p>
          </div>
        </div>
        <div className="h-64 flex items-center justify-center">
          <p className="text-gray-500">No inventory data available</p>
        </div>
      </div>
    );
  }

  // Prepare chart data from inventory items
  const chartData = data.inventory_data ? data.inventory_data.map(item => ({
    name: item.product_name || item.item_name || item.name,
    cost: parseFloat(item.total_cost || item.cost || 0),
    category: item.category || 'Unknown'
  })) : [];

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

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
            <BarChart3 className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Inventory & Supplies Cost</h3>
            <p className="text-sm text-gray-500">Current stock quantities and cost impact</p>
          </div>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Activity className="h-4 w-4 mr-2" />
          Track Transactions
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData.slice(0, 6)} margin={{ top: 20, right: 10, left: 0, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="name" 
                stroke="#6b7280"
                fontSize={11}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                stroke="#6b7280"
                fontSize={11}
                tickFormatter={(value) => `P${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip 
                formatter={(value) => formatCurrency(value)}
                contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '6px' }}
              />
              <Bar 
                dataKey="cost" 
                fill="#3b82f6" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
          <p className="text-xs text-gray-500 mt-2">Last refresh: {formatTime(lastRefresh)}</p>
        </div>

        {/* Data Table */}
        <div>
          <table className="min-w-full text-sm">
            <thead>
              <tr>
                <th className="text-left py-2 font-semibold text-gray-700">Item</th>
                <th className="text-left py-2 font-semibold text-gray-700">Category</th>
                <th className="text-right py-2 font-semibold text-gray-700">Qty</th>
              </tr>
            </thead>
            <tbody>
              {(data.inventory_data || []).slice(0, 4).map((item, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-2 font-medium text-gray-900">
                    {item.product_name || item.item_name || item.name}
                  </td>
                  <td className="py-2 text-gray-600">
                    {item.category || 'N/A'}
                  </td>
                  <td className="py-2 text-right text-gray-900">
                    {item.quantity || item.qty || 0}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inventory Transaction Modal */}
      <InventoryTransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default InventoryCost;
