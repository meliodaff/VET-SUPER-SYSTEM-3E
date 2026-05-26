import React, { useState, useEffect } from 'react';
import { X, CreditCard, Calendar, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { paymentsAPI } from '../../services/api';
import { formatCurrency } from '../../utils/helpers';

const PaymentModal = ({ employee, payrollData, period, year, month, onClose, onSuccess }) => {
  const [paymentMethod, setPaymentMethod] = useState('bank_transfer');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [checkingHistory, setCheckingHistory] = useState(true);

  useEffect(() => {
    checkPaymentHistory();
  }, [employee, period, year, month]);

  const checkPaymentHistory = async () => {
    if (!employee?.id) return;
    
    try {
      setCheckingHistory(true);
      const response = await paymentsAPI.getEmployeePayments({
        employee_id: employee.id,
        period: period,
        year: year,
        month: month
      });

      if (response?.data?.success) {
        setPaymentHistory(response.data.data.payments || []);
      }
    } catch (err) {
      console.error('Error checking payment history:', err);
    } finally {
      setCheckingHistory(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!employee || !payrollData) {
      setError('Employee or payroll data is missing');
      return;
    }

    const amount = payrollData.monthlySalary || 0;
    
    if (amount <= 0) {
      setError('Invalid salary amount. Cannot process payment.');
      return;
    }

    // Check if already paid
    if (paymentHistory.length > 0) {
      setError('Payment already recorded for this period. Please check payment history.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const paymentData = {
        employee_id: employee.id,
        amount: amount,
        payment_method: paymentMethod,
        payment_date: paymentDate,
        period: period,
        year: year,
        month: month,
        notes: notes || `Payroll payment for period ${period}, ${month}/${year}`
      };

      const response = await paymentsAPI.createEmployeePayment(paymentData);

      if (response?.data?.success) {
        if (onSuccess) {
          onSuccess(response.data.data);
        }
        onClose();
      } else {
        setError(response?.data?.message || 'Failed to process payment');
      }
    } catch (err) {
      console.error('Error processing payment:', err);
      setError(err?.response?.data?.message || 'Failed to process payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!employee || !payrollData) {
    return null;
  }

  const amount = payrollData.monthlySalary || 0;
  const totalHours = payrollData.totalPaidHours || '0';
  const hourlyRate = payrollData.hourlyRate || 0;
  const isAlreadyPaid = paymentHistory.length > 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <div className="bg-white px-6 pt-6 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Process Employee Payment</h3>
                <p className="text-sm text-gray-500 mt-1">Record salary payment for this employee</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3 flex items-start">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            {isAlreadyPaid && (
              <div className="mb-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-start">
                <AlertCircle className="h-5 w-5 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-yellow-800 text-sm font-medium">Payment Already Recorded</p>
                  <p className="text-yellow-700 text-xs mt-1">
                    This employee has already been paid for Period {period}, {month}/{year}
                  </p>
                </div>
              </div>
            )}

            {/* Employee & Salary Breakdown */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Employee Name</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {employee.first_name} {employee.last_name}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Employee ID</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {employee.employee_id || `EMP-${String(employee.id).padStart(3, '0')}`}
                  </p>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Salary Breakdown</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Hours Worked:</span>
                    <span className="font-medium text-gray-900">{totalHours} hours</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Hourly Rate:</span>
                    <span className="font-medium text-gray-900">{formatCurrency(hourlyRate)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Attendance Records:</span>
                    <span className="font-medium text-gray-900">{payrollData.recordCount || 0} records</span>
                  </div>
                  <div className="border-t border-gray-300 pt-2 mt-2">
                    <div className="flex justify-between">
                      <span className="text-base font-semibold text-gray-900">Total Salary:</span>
                      <span className="text-xl font-bold text-blue-600">{formatCurrency(amount)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Period:</span>
                  <span className="font-medium text-gray-900">
                    Period {period} ({period === 1 ? '1-15' : '16-31'}), {month}/{year}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Method <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    disabled={isAlreadyPaid}
                  >
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="cash">Cash</option>
                    <option value="check">Check</option>
                    <option value="credit_card">Credit Card</option>
                    <option value="debit_card">Debit Card</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="date"
                    value={paymentDate}
                    onChange={(e) => setPaymentDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    disabled={isAlreadyPaid}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg font-semibold">₱</span>
                  <input
                    type="text"
                    value={formatCurrency(amount)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                    readOnly
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Calculated from {totalHours} hours × {formatCurrency(hourlyRate)}/hour
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes (Optional)
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Additional notes about this payment..."
                    disabled={isAlreadyPaid}
                  />
                </div>
              </div>

              {/* Payment History */}
              {paymentHistory.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-blue-900 mb-2 flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Payment History for This Period
                  </h4>
                  <div className="space-y-2">
                    {paymentHistory.map((payment) => (
                      <div key={payment.id} className="text-sm">
                        <div className="flex justify-between">
                          <span className="text-blue-700">
                            Paid: {formatCurrency(payment.amount)} via {payment.payment_method}
                          </span>
                          <span className="text-blue-600">
                            {new Date(payment.payment_date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || isAlreadyPaid}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-4 w-4" />
                      Process Payment
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;

