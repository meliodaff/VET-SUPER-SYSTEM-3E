import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Download, FileText } from 'lucide-react';
import { invoicesAPI } from '../services/api';
import InvoiceManagement from '../components/invoices/InvoiceManagement';
import CreateInvoiceModal from '../components/invoices/CreateInvoiceModal';

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [summary, setSummary] = useState({});
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState('0');
  const [currentPage, setCurrentPage] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    fetchInvoices();
  }, [statusFilter, dateRange, currentPage, searchTerm]);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const params = {
        status: statusFilter,
        date_range: dateRange,
        page: currentPage,
        limit: 10,
        search: searchTerm
      };
      
      const response = await invoicesAPI.getInvoices(params);
      
      if (response?.data?.success && response?.data?.data) {
        setInvoices(response.data.data.invoices || []);
        setSummary(response.data.data.summary || {});
        setPagination(response.data.data.pagination || {});
        setError(''); // Clear errors on success
      } else {
        setError(response?.data?.message || 'Failed to load invoices');
        setInvoices([]);
        setSummary({});
        setPagination({});
      }
    } catch (error) {
      console.error('Error fetching invoices:', error);
      setError(error?.response?.data?.message || error?.message || 'Failed to load invoices. Please check if XAMPP is running.');
      setInvoices([]);
      setSummary({});
      setPagination({});
    } finally {
      setLoading(false);
    }
  };

  const handleCreateInvoice = async (invoiceData) => {
    try {
      const response = await invoicesAPI.createInvoice(invoiceData);
      if (response.data.success) {
        setShowCreateModal(false);
        fetchInvoices();
        return { success: true };
      }
    } catch (error) {
      console.error('Error creating invoice:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to create invoice' 
      };
    }
  };

  const handleUpdateInvoice = async (invoiceData) => {
    try {
      const response = await invoicesAPI.updateInvoice(invoiceData);
      if (response.data.success) {
        fetchInvoices();
        return { success: true };
      }
    } catch (error) {
      console.error('Error updating invoice:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to update invoice' 
      };
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusFilter = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleDateRange = (e) => {
    setDateRange(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (loading && invoices.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Invoice Management</h1>
          <p className="text-gray-600 mt-2">Track and manage your clinic's invoices</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <Plus className="h-5 w-5 mr-2" />
          Create Invoice
        </button>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Invoices</p>
                <p className="text-2xl font-bold text-gray-900">{summary.total_invoices || 0}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <span className="text-yellow-600 font-bold">!</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Outstanding</p>
                <p className="text-2xl font-bold text-gray-900">{summary.outstanding_count || 0}</p>
                <p className="text-sm text-gray-500">₱{parseFloat(summary.outstanding_amount || 0).toLocaleString()}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-600 font-bold">!</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Overdue</p>
                <p className="text-2xl font-bold text-gray-900">{summary.overdue_count || 0}</p>
                <p className="text-sm text-gray-500">₱{parseFloat(summary.overdue_amount || 0).toLocaleString()}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-bold">✓</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Paid</p>
                <p className="text-2xl font-bold text-gray-900">{summary.paid_count || 0}</p>
                <p className="text-sm text-gray-500">₱{parseFloat(summary.paid_amount || 0).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search invoices..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={statusFilter}
              onChange={handleStatusFilter}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Statuses</option>
              <option value="Outstanding">Outstanding</option>
              <option value="Paid">Paid</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
            <select
              value={dateRange}
              onChange={handleDateRange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="0">All time</option>
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="365">Last year</option>
            </select>
          </div>
          
          <div className="flex items-end">
            <button className="w-full inline-flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              <Download className="h-5 w-5 mr-2" />
              Export CSV
            </button>
          </div>
        </div>
      </div>

      {/* Invoice Management */}
      <InvoiceManagement
        invoices={invoices}
        pagination={pagination}
        onUpdateInvoice={handleUpdateInvoice}
        onPageChange={handlePageChange}
        loading={loading}
      />

      {/* Create Invoice Modal */}
      {showCreateModal && (
        <CreateInvoiceModal
          onClose={() => setShowCreateModal(false)}
          onCreateInvoice={handleCreateInvoice}
        />
      )}
    </div>
  );
};

export default Invoices;
