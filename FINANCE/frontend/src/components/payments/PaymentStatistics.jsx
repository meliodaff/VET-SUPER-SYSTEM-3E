import React from 'react';
import { BarChart3, Coins, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { formatCurrency } from '../../utils/helpers';

const PaymentStatistics = ({ statistics }) => {
  if (!statistics) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  const stats = [
    {
      title: "Total Payments",
      value: statistics.total_payments || 0,
      icon: BarChart3,
      iconColor: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Total Amount",
      value: formatCurrency(statistics.total_amount || 0),
      icon: Coins,
      iconColor: "text-yellow-600",
      bgColor: "bg-yellow-50"
    },
    {
      title: "Paid",
      value: statistics.paid_count || 0,
      icon: CheckCircle,
      iconColor: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Pending",
      value: statistics.pending_count || 0,
      icon: Clock,
      iconColor: "text-orange-600",
      bgColor: "bg-orange-50"
    },
    {
      title: "Overdue",
      value: statistics.overdue_count || 0,
      icon: AlertTriangle,
      iconColor: "text-red-600",
      bgColor: "bg-red-50"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div key={index} className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-2">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <Icon className={`h-6 w-6 ${stat.iconColor}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PaymentStatistics;
