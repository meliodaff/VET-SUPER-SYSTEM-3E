import React from 'react';
import { formatCurrency } from '../../utils/helpers';

const SalesMetrics = ({ data }) => {
  if (!data) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow-md border-2 border-gray-200 p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  const metrics = [
    {
      title: "Today's Sales",
      value: formatCurrency(data.today_sales || 0),
      borderColor: "border-blue-500",
      iconBg: "bg-blue-500",
      icon: "P"
    },
    {
      title: "Total Revenue",
      value: formatCurrency(data.total_revenue || 0),
      borderColor: "border-green-500",
      iconBg: "bg-green-500",
      icon: "Σ"
    },
    {
      title: "Pending Invoices",
      value: formatCurrency(data.pending_amount || data.pending_invoices || 0),
      borderColor: "border-orange-500",
      iconBg: "bg-orange-500",
      icon: "⏰"
    },
    {
      title: "Paid Revenue",
      value: formatCurrency(data.paid_revenue || 0),
      borderColor: "border-green-500",
      iconBg: "bg-green-500",
      icon: "✓"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => (
        <div 
          key={index} 
          className={`bg-white rounded-lg shadow-md border-2 ${metric.borderColor} p-6`}
        >
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold text-gray-700">{metric.title}</p>
            <div className={`w-8 h-8 ${metric.iconBg} rounded-md flex items-center justify-center text-white font-bold text-sm`}>
              {metric.icon}
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
        </div>
      ))}
    </div>
  );
};

export default SalesMetrics;
