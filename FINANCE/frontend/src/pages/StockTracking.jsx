import React, { useState, useEffect } from 'react';
import { Package, Truck, AlertCircle, CheckCircle, Clock, Search } from 'lucide-react';

const StockTracking = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Sample data - replace with actual API calls
  const [stocks] = useState([
    {
      id: 1,
      productName: 'Pet Vitamins',
      quantity: 150,
      expectedDelivery: '2025-12-10',
      status: 'in-transit',
      supplier: 'Pet Health Supplies Co.',
      orderDate: '2025-11-28',
      trackingNumber: 'TRK-2025-001',
    },
    {
      id: 2,
      productName: 'Surgical Masks (Pack of 100)',
      quantity: 500,
      expectedDelivery: '2025-12-05',
      status: 'delivered',
      supplier: 'Medical Supplies Inc.',
      orderDate: '2025-11-20',
      trackingNumber: 'TRK-2025-002',
    },
    {
      id: 3,
      productName: 'Antibiotic Ointment',
      quantity: 75,
      expectedDelivery: '2025-12-08',
      status: 'pending',
      supplier: 'Pharma Distributors Ltd.',
      orderDate: '2025-11-25',
      trackingNumber: 'TRK-2025-003',
    },
    {
      id: 4,
      productName: 'IV Infusion Sets',
      quantity: 200,
      expectedDelivery: '2025-12-03',
      status: 'delayed',
      supplier: 'Medical Equipment Corp.',
      orderDate: '2025-11-18',
      trackingNumber: 'TRK-2025-004',
    },
    {
      id: 5,
      productName: 'Stethoscopes',
      quantity: 30,
      expectedDelivery: '2025-12-12',
      status: 'in-transit',
      supplier: 'Diagnostic Tools Ltd.',
      orderDate: '2025-11-30',
      trackingNumber: 'TRK-2025-005',
    },
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'in-transit':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'delayed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="w-4 h-4" />;
      case 'in-transit':
        return <Truck className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'delayed':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const filteredStocks = stocks.filter((stock) => {
    const matchesSearch =
      stock.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stock.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || stock.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const statusCounts = {
    all: stocks.length,
    delivered: stocks.filter((s) => s.status === 'delivered').length,
    'in-transit': stocks.filter((s) => s.status === 'in-transit').length,
    pending: stocks.filter((s) => s.status === 'pending').length,
    delayed: stocks.filter((s) => s.status === 'delayed').length,
  };

  // Payment modal state
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [activeStock, setActiveStock] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentReference, setPaymentReference] = useState('');
  const [availableMethods, setAvailableMethods] = useState([]);

  useEffect(() => {
    // load supplier methods from localStorage if present
    const raw = localStorage.getItem('finance_supplier_payment_methods_v1');
    try {
      const parsed = raw ? JSON.parse(raw) : {};
      setAvailableMethods(parsed);
    } catch (e) {
      setAvailableMethods({});
    }
  }, []);

  const openPaymentModal = (stock) => {
    setActiveStock(stock);
    const methods = (availableMethods && availableMethods[stock.supplier]) || [];
    setPaymentMethod(methods.length ? methods[0] : '');
    setPaymentAmount('');
    setPaymentReference('');
    setShowPaymentModal(true);
  };

  const savePaymentRecord = () => {
    if (!activeStock) return;
    const amount = parseFloat(paymentAmount);
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    const record = {
      id: Date.now(),
      stockId: activeStock.id,
      supplier: activeStock.supplier,
      productName: activeStock.productName,
      amount: amount,
      paymentMethod: paymentMethod || 'Unknown',
      reference: paymentReference || null,
      status: 'pending',
      created_at: new Date().toISOString()
    };

    const key = 'finance_supplier_payment_records_v1';
    const raw = localStorage.getItem(key);
    let records = [];
    try {
      records = raw ? JSON.parse(raw) : [];
    } catch (e) {
      records = [];
    }
    records.unshift(record);
    localStorage.setItem(key, JSON.stringify(records));
    setShowPaymentModal(false);
    alert('Supplier payment record created (saved locally).');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Stock Tracking</h1>
        <p className="text-gray-600 mt-2">Track delivery status of clinic products and supplies</p>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div
          onClick={() => setFilterStatus('all')}
          className={`p-4 rounded-lg cursor-pointer transition-all ${
            filterStatus === 'all'
              ? 'bg-blue-50 border-2 border-blue-600'
              : 'bg-white border border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{statusCounts.all}</p>
            </div>
            <Package className="w-8 h-8 text-blue-600 opacity-20" />
          </div>
        </div>

        <div
          onClick={() => setFilterStatus('delivered')}
          className={`p-4 rounded-lg cursor-pointer transition-all ${
            filterStatus === 'delivered'
              ? 'bg-green-50 border-2 border-green-600'
              : 'bg-white border border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Delivered</p>
              <p className="text-2xl font-bold text-green-600">{statusCounts.delivered}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600 opacity-20" />
          </div>
        </div>

        <div
          onClick={() => setFilterStatus('in-transit')}
          className={`p-4 rounded-lg cursor-pointer transition-all ${
            filterStatus === 'in-transit'
              ? 'bg-blue-50 border-2 border-blue-600'
              : 'bg-white border border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">In Transit</p>
              <p className="text-2xl font-bold text-blue-600">{statusCounts['in-transit']}</p>
            </div>
            <Truck className="w-8 h-8 text-blue-600 opacity-20" />
          </div>
        </div>

        <div
          onClick={() => setFilterStatus('pending')}
          className={`p-4 rounded-lg cursor-pointer transition-all ${
            filterStatus === 'pending'
              ? 'bg-yellow-50 border-2 border-yellow-600'
              : 'bg-white border border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{statusCounts.pending}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-600 opacity-20" />
          </div>
        </div>

        <div
          onClick={() => setFilterStatus('delayed')}
          className={`p-4 rounded-lg cursor-pointer transition-all ${
            filterStatus === 'delayed'
              ? 'bg-red-50 border-2 border-red-600'
              : 'bg-white border border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Delayed</p>
              <p className="text-2xl font-bold text-red-600">{statusCounts.delayed}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-red-600 opacity-20" />
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by product name or tracking number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent flex-1 outline-none text-gray-900 placeholder-gray-500"
          />
        </div>
      </div>

      {/* Stock List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Product</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Quantity</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Supplier</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Order Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Expected Delivery</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Tracking Number</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredStocks.length > 0 ? (
                filteredStocks.map((stock) => (
                  <tr key={stock.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">{stock.productName}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{stock.quantity} units</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{stock.supplier}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{stock.orderDate}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{stock.expectedDelivery}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 font-mono">{stock.trackingNumber}</td>
                    <td className="px-6 py-4 text-sm">
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${getStatusColor(stock.status)}`}>
                        {getStatusIcon(stock.status)}
                        <span className="capitalize font-medium">
                          {stock.status === 'in-transit' ? 'In Transit' : stock.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <button onClick={() => openPaymentModal(stock)} className="inline-flex items-center gap-2 px-3 py-1 rounded bg-purple-600 text-white hover:bg-purple-700">
                        Generate Payment
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                    No stocks found matching your criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* Payment Modal */}
      {showPaymentModal && activeStock && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Create Supplier Payment</h3>
              <button onClick={() => setShowPaymentModal(false)} className="text-gray-500">✕</button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-600">Supplier</label>
                <div className="mt-1 text-sm font-medium">{activeStock.supplier}</div>
              </div>

              <div>
                <label className="text-sm text-gray-600">Product</label>
                <div className="mt-1 text-sm">{activeStock.productName}</div>
              </div>

              <div>
                <label className="text-sm text-gray-600">Amount</label>
                <input type="number" value={paymentAmount} onChange={(e) => setPaymentAmount(e.target.value)} className="w-full mt-1 border px-3 py-2 rounded" placeholder="0.00" />
              </div>

              <div>
                <label className="text-sm text-gray-600">Payment Method</label>
                <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="w-full mt-1 border px-3 py-2 rounded">
                  <option value="">-- select method --</option>
                  {((availableMethods && availableMethods[activeStock.supplier]) || []).map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
                {!((availableMethods && availableMethods[activeStock.supplier]) || []).length && (
                  <p className="text-xs text-gray-500 mt-1">No methods defined for this supplier.</p>
                )}
              </div>

              <div>
                <label className="text-sm text-gray-600">Reference / Notes</label>
                <input value={paymentReference} onChange={(e) => setPaymentReference(e.target.value)} className="w-full mt-1 border px-3 py-2 rounded" />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button onClick={() => setShowPaymentModal(false)} className="px-4 py-2 rounded border">Cancel</button>
                <button onClick={savePaymentRecord} className="px-4 py-2 rounded bg-blue-600 text-white">Save Payment</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockTracking;
