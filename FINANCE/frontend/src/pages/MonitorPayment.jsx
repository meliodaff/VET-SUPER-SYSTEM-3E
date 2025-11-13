import React, { useState, useEffect } from 'react';
import { Search, RefreshCw, BarChart3, Coins, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { paymentsAPI } from '../services/api';
import PaymentStatistics from '../components/payments/PaymentStatistics';
import PaymentList from '../components/payments/PaymentList';

const MonitorPayment = () => {
  const [payments, setPayments] = useState([]);
  const [statistics, setStatistics] = useState({});
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'paid', 'pending', 'overdue'
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    fetchPayments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, currentPage, searchTerm, sortBy, sortOrder]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      setError('');
      // Status is already lowercase from the select options
      const statusParam = statusFilter !== 'all' ? statusFilter : '';
      const params = {
        status: statusParam,
        page: currentPage,
        limit: 10,
        search: searchTerm,
        sort_by: sortBy,
        sort_order: sortOrder
      };
      
      const response = await paymentsAPI.getPayments(params);
      
      // Check if response is successful and has data structure like Invoices page
      if (response?.data?.success && response?.data?.data) {
        const data = response.data.data;
        const paymentsList = data.payments || [];
        const stats = data.statistics || {};
        const paginationData = data.pagination || {};
        
        console.log('Payments loaded:', paymentsList.length, 'payments');
        console.log('Statistics:', stats);
        console.log('Pagination:', paginationData);
        
        setPayments(paymentsList);
        setStatistics(stats);
        setPagination(paginationData);
        setLastUpdated(new Date());
        setError(''); // Clear any previous errors on success
      } else {
        // Handle API error response
        const errorMsg = response?.data?.message || 'Failed to load payments';
        console.error('API returned error:', errorMsg, response?.data);
        setError(errorMsg);
        setPayments([]);
        setStatistics({});
        setPagination({});
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
      const errorMessage = error?.response?.data?.message || 
                          error?.message || 
                          'Failed to load payments. Please check if XAMPP is running.';
      setError(errorMessage);
      setPayments([]);
      setStatistics({});
      setPagination({});
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchPayments();
    setRefreshing(false);
  };

  const handleUpdatePaymentStatus = async (paymentId, status, paymentMethod = null) => {
    try {
      setLoading(true);
      const response = await paymentsAPI.updatePaymentStatus({
        id: paymentId,
        status: status,
        payment_method: paymentMethod
      });
      
      if (response?.data?.success) {
        // Refresh payments and statistics after successful update
        await fetchPayments();
        return { success: true, message: 'Payment status updated successfully' };
      } else {
        const errorMsg = response?.data?.message || 'Failed to update payment status';
        return { success: false, message: errorMsg };
      }
    } catch (error) {
      console.error('Error updating payment status:', error);
      const errorMsg = error?.response?.data?.message || 
                      error?.message || 
                      'Failed to update payment status. Please check if XAMPP is running.';
      return { 
        success: false, 
        message: errorMsg
      };
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setCurrentPage(1);
    // Reset to page 1 when search changes
  };

  const handleStatusFilter = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Show loading state only on initial load (when there's no data and no error)
  if (loading && payments.length === 0 && !error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading payment data...</p>
        </div>
      </div>
    );
  }

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      hour12: true 
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Section with Gradient Background */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 rounded-lg shadow-lg p-8 text-white relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">Payment Monitor</h1>
              <p className="text-blue-100 text-lg">Track and manage client payment transactions from localhost database</p>
            </div>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="inline-flex items-center px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-lg transition-all duration-200 disabled:opacity-50 backdrop-blur-sm"
            >
              <RefreshCw className={`h-5 w-5 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
          
          {/* Live Data Status */}
          <div className="flex items-center space-x-2 mt-4">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-blue-100 text-sm">Live Data • Last updated: {formatTime(lastUpdated)}</span>
          </div>
        </div>
        
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -ml-24 -mb-24"></div>
      </div>

      {/* Payment Statistics */}
      <PaymentStatistics statistics={statistics} />

      {/* Filters and Search Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={handleStatusFilter}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          >
            <option value="all">All Status</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="overdue">Overdue</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          >
            <option value="date">Sort by Date</option>
            <option value="amount">Sort by Amount</option>
            <option value="client">Sort by Client</option>
          </select>

          {/* Sort Order */}
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          >
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>

          {/* Search Input */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search payments, clients, invoices"
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4">
          <div className="flex items-start">
            <AlertTriangle className="h-5 w-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-red-800 mb-1">Error Loading Payments</h3>
              <p className="text-sm text-red-700 mb-3">{error}</p>
              <button
                onClick={fetchPayments}
                className="text-sm text-red-800 hover:text-red-900 underline font-medium"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment List */}
      <PaymentList
        payments={payments}
        pagination={pagination}
        onUpdatePaymentStatus={handleUpdatePaymentStatus}
        onPageChange={handlePageChange}
        loading={loading}
      />
    </div>
  );
};

export default MonitorPayment;
