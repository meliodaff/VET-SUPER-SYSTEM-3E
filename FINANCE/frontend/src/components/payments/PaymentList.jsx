import React, { useState } from 'react';
import { Eye, CheckCircle, Clock, AlertTriangle, CreditCard } from 'lucide-react';
import { formatCurrency } from '../../utils/helpers';
import ViewInvoiceModal from '../invoices/ViewInvoiceModal';

const PaymentList = ({ payments, pagination, onUpdatePaymentStatus, onPageChange, loading }) => {
  const [updatingPayment, setUpdatingPayment] = useState(null);
  const [viewingInvoice, setViewingInvoice] = useState(null);
  const currentPage = pagination?.current_page || 1;

  const handleStatusUpdate = async (paymentId, status, paymentMethod = null) => {
    setUpdatingPayment(paymentId);
    try {
      const result = await onUpdatePaymentStatus(paymentId, status, paymentMethod);
      if (result.success) {
        // Success - data will be refreshed by parent component
      } else {
        alert(result.message || 'Failed to update payment status');
      }
    } catch (error) {
      console.error('Status update error:', error);
      const errorMsg = error?.response?.data?.message || 'An unexpected error occurred';
      alert(errorMsg);
    } finally {
      setUpdatingPayment(null);
    }
  };

  const handleViewInvoice = (payment) => {
    // Create invoice object from payment data for ViewInvoiceModal
    if (payment.invoice_id) {
      setViewingInvoice({
        id: payment.invoice_id,
        invoice_number: payment.invoice_number,
        client_name: payment.client_name
      });
    } else {
      alert('Invoice ID not found for this payment');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Paid':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'Pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'Overdue':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  if (loading && payments.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (payments.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No payments found</h3>
        <p className="text-gray-500">No payments match your current filters.</p>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    const statusLower = status?.toLowerCase() || '';
    if (statusLower === 'paid') {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle className="h-3 w-3 mr-1" />
          paid
        </span>
      );
    } else if (statusLower === 'pending') {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <Clock className="h-3 w-3 mr-1" />
          pending
        </span>
      );
    } else if (statusLower === 'overdue') {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <AlertTriangle className="h-3 w-3 mr-1" />
          overdue
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
        {status || 'Unknown'}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Invoice ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Client
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {payments.map((payment) => (
              <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {payment.invoice_number || payment.invoice_id || payment.id}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {payment.client_name || 'Unknown Client'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(payment.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    {/* View Invoice Button */}
                    <button
                      onClick={() => handleViewInvoice(payment)}
                      className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors"
                      title="View Invoice"
                    >
                      <Eye className="h-3.5 w-3.5 mr-1" />
                      View Invoice
                    </button>
                    
                    {/* Mark Paid Button */}
                    <button
                      onClick={() => handleStatusUpdate(payment.id, 'Paid', payment.payment_method)}
                      disabled={updatingPayment === payment.id || payment.status?.toLowerCase() === 'paid' || payment.raw_status === 'paid'}
                      className="inline-flex items-center px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Mark Paid"
                    >
                      <CheckCircle className="h-3.5 w-3.5 mr-1" />
                      Mark Paid
                    </button>
                    
                    {/* Mark Pending Button */}
                    <button
                      onClick={() => handleStatusUpdate(payment.id, 'Pending')}
                      disabled={updatingPayment === payment.id || payment.status?.toLowerCase() === 'pending' || payment.raw_status === 'pending'}
                      className="inline-flex items-center px-3 py-1.5 bg-orange-500 text-white text-xs font-medium rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Mark Pending"
                    >
                      <Clock className="h-3.5 w-3.5 mr-1" />
                      Mark Pending
                    </button>
                    
                    {/* Mark Overdue Button */}
                    <button
                      onClick={() => handleStatusUpdate(payment.id, 'Overdue')}
                      disabled={updatingPayment === payment.id || payment.status?.toLowerCase() === 'overdue' || payment.raw_status === 'overdue'}
                      className="inline-flex items-center px-3 py-1.5 bg-red-600 text-white text-xs font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Mark Overdue"
                    >
                      <AlertTriangle className="h-3.5 w-3.5 mr-1" />
                      Mark Overdue
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && pagination.total_pages > 1 && (
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === pagination.total_pages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing{' '}
                <span className="font-medium">{(currentPage - 1) * pagination.limit + 1}</span>
                {' '}to{' '}
                <span className="font-medium">
                  {Math.min(currentPage * pagination.limit, pagination.total_count)}
                </span>
                {' '}of{' '}
                <span className="font-medium">{pagination.total_count}</span>
                {' '}results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  onClick={() => onPageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                {Array.from({ length: Math.min(5, pagination.total_pages) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => onPageChange(page)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        currentPage === page
                          ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
                <button
                  onClick={() => onPageChange(currentPage + 1)}
                  disabled={currentPage === pagination.total_pages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* View Invoice Modal */}
      {viewingInvoice && (
        <ViewInvoiceModal
          invoice={viewingInvoice}
          onClose={() => setViewingInvoice(null)}
        />
      )}
    </div>
  );
};

export default PaymentList;
