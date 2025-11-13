import React from 'react';
import { CheckCircle } from 'lucide-react';
import { formatCurrency } from '../../utils/helpers';

const RecentPayments = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div>
        <div className="flex items-center space-x-2 mb-6">
          <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
            <CheckCircle className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Recent Payments</h3>
            <p className="text-sm text-gray-500">Latest payment transactions and status</p>
          </div>
        </div>
        <div className="h-64 flex items-center justify-center">
          <p className="text-gray-500">No recent payments</p>
        </div>
      </div>
    );
  }

  const formatPaymentMethod = (method) => {
    if (!method) return 'cash';
    return method.toLowerCase().replace(/_/g, ' ').replace(/\s+/g, '_');
  };

  return (
    <div>
      <div className="flex items-center space-x-2 mb-6">
        <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
          <CheckCircle className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Recent Payments</h3>
          <p className="text-sm text-gray-500">Latest payment transactions and status</p>
        </div>
      </div>
      
      <div className="space-y-0">
        {data.slice(0, 5).map((payment, index) => (
          <div 
            key={index} 
            className={`flex items-center justify-between py-3 px-4 ${
              index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
            }`}
          >
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">
                {data.length - index}
              </span>
              <span className="text-gray-400">•</span>
              <span className="text-sm text-gray-700">
                {formatPaymentMethod(payment.payment_method || payment.method)}
              </span>
            </div>
            
            <div className="text-right">
              <p className="text-sm font-semibold text-purple-600">
                {formatCurrency(payment.amount || 0).replace('₱', 'P')}
              </p>
              <p className="text-xs text-orange-500 font-medium">
                {payment.status || 'Pending'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentPayments;
