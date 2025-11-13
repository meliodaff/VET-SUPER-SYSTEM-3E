import React, { useState, useEffect } from 'react';
import { X, FileText, User, Calendar, Coins, CreditCard, Phone } from 'lucide-react';
import { formatCurrency, formatDate, formatDateTime, getStatusColor } from '../../utils/helpers';
import { invoicesAPI } from '../../services/api';

const ViewInvoiceModal = ({ invoice, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [invoiceDetails, setInvoiceDetails] = useState(null);

  useEffect(() => {
    if (invoice && invoice.id) {
      fetchInvoiceDetails();
    }
  }, [invoice]);

  const fetchInvoiceDetails = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await invoicesAPI.getInvoiceDetails(invoice.id);
      if (response.data.success) {
        setInvoiceDetails(response.data.data);
      } else {
        setError('Failed to load invoice details');
      }
    } catch (error) {
      console.error('Error fetching invoice details:', error);
      setError(error.response?.data?.message || 'Failed to load invoice details');
    } finally {
      setLoading(false);
    }
  };

  if (!invoice) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Invoice Details</h3>
              <button
                type="button"
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : invoiceDetails ? (
              <div className="space-y-6">
                {/* Invoice Header */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Invoice Information</h4>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-600">Invoice #:</span>
                        <span className="text-sm font-semibold text-gray-900 ml-2">{invoiceDetails.invoice.invoice_number}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-600">Date:</span>
                        <span className="text-sm text-gray-900 ml-2">{formatDate(invoiceDetails.invoice.invoice_date)}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-600">Due Date:</span>
                        <span className="text-sm text-gray-900 ml-2">{formatDate(invoiceDetails.invoice.due_date)}</span>
                      </div>
                      <div className="flex items-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(invoiceDetails.invoice.status)}`}>
                          {invoiceDetails.invoice.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Client Information</h4>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <User className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">{invoiceDetails.invoice.client_name}</span>
                      </div>
                      {invoiceDetails.invoice.client_phone && (
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-600">{invoiceDetails.invoice.client_phone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Invoice Items */}
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-3">Items & Services</h4>
                  {invoiceDetails.items && invoiceDetails.items.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Quantity</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Unit Price</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {invoiceDetails.items.map((item) => (
                            <tr key={item.id}>
                              <td className="px-4 py-3 text-sm text-gray-900">{item.service_name}</td>
                              <td className="px-4 py-3 text-sm text-gray-600">{item.service_category}</td>
                              <td className="px-4 py-3 text-sm text-gray-900 text-right">{item.quantity}</td>
                              <td className="px-4 py-3 text-sm text-gray-900 text-right">{formatCurrency(item.unit_price)}</td>
                              <td className="px-4 py-3 text-sm font-medium text-gray-900 text-right">{formatCurrency(item.line_total)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <p className="text-sm text-gray-500">No items found for this invoice</p>
                    </div>
                  )}
                </div>

                {/* Payment Transactions */}
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-3">Payment Transactions</h4>
                  {invoiceDetails.payments && invoiceDetails.payments.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment Method</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reference</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Amount</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {invoiceDetails.payments.map((payment) => (
                            <tr key={payment.id}>
                              <td className="px-4 py-3 text-sm text-gray-900">{formatDate(payment.payment_date)}</td>
                              <td className="px-4 py-3 text-sm text-gray-600">
                                <div className="flex items-center">
                                  <CreditCard className="h-4 w-4 text-gray-400 mr-2" />
                                  {payment.payment_method}
                                </div>
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-600">{payment.reference_number || 'N/A'}</td>
                              <td className="px-4 py-3 text-sm font-medium text-gray-900 text-right">{formatCurrency(payment.amount)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <p className="text-sm text-gray-500">No payment transactions found</p>
                    </div>
                  )}
                </div>

                {/* Summary */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Total Amount:</span>
                    <span className="text-lg font-bold text-gray-900">{formatCurrency(invoiceDetails.summary.total_amount)}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Total Paid:</span>
                    <span className="text-lg font-semibold text-green-600">{formatCurrency(invoiceDetails.summary.total_paid)}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-gray-300">
                    <span className="text-sm font-medium text-gray-700">Balance:</span>
                    <span className={`text-lg font-bold ${invoiceDetails.summary.balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {formatCurrency(invoiceDetails.summary.balance)}
                    </span>
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={onClose}
              className="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewInvoiceModal;

