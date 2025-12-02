import React, { useState } from 'react';
import { Search, Download, ExternalLink } from 'lucide-react';

// This page replaces the previous Employees management view and now serves as the Payroll page.
const Employees = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Sample employees & payroll records; replace with API calls to your backend.
  const [payrolls] = useState([
    {
      id: 1,
      employeeName: 'Juan dela Cruz',
      employeeId: 'EMP-001',
      monthlySalary: 45000,
      payDate: '2025-12-05',
      status: 'paid',
    },
    {
      id: 2,
      employeeName: 'Maria Santos',
      employeeId: 'EMP-002',
      monthlySalary: 32000,
      payDate: '2025-12-05',
      status: 'paid',
    },
    {
      id: 3,
      employeeName: 'Carlos Reyes',
      employeeId: 'EMP-010',
      monthlySalary: 42000,
      payDate: '2025-12-20',
      status: 'pending',
    },
  ]);

  // Controls for building HR reference link
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1); // 1-12
  const [period, setPeriod] = useState(1); // example period (1 or 2)

  const filtered = payrolls.filter((p) => {
    const matchesSearch =
      !searchTerm ||
      p.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || p.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const formatCurrency = (v) => {
    // Safely format numbers; return a dash for missing values
    if (v === null || v === undefined || v === '') return '-';
    const n = Number(v);
    if (Number.isNaN(n)) return '-';
    return n.toLocaleString(undefined, { style: 'currency', currency: 'PHP' });
  };

  const downloadSlip = (record) => {
    // Placeholder behavior: in future replace with API-generated PDF download
    const content = `Payroll Slip\nName: ${record.employeeName}\nID: ${record.employeeId}\nMonthly Salary: ${formatCurrency(record.monthlySalary)}\nPay Date: ${record.payDate}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${record.employeeId}-payroll-${record.payDate}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const buildHRReference = (employeeId) => {
    // Build URL like: http://localhost/VET-SUPER-SYSTEM-3E/HR/backend/routes/getPaidHours.php?id=1&period=2&year=2025&month=12
    const base = window.location.origin + '/VET-SUPER-SYSTEM-3E/HR/backend/routes/getPaidHours.php';
    // Try to extract a numeric id (EMP-001 -> 1). If not numeric, pass raw value.
    const digits = (employeeId || '').toString().replace(/\D/g, '');
    const idParam = digits ? String(parseInt(digits, 10)) : employeeId;
    const params = new URLSearchParams({ id: idParam, period, year, month });
    return `${base}?${params.toString()}`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Payroll</h1>
        <p className="text-gray-600 mt-2">Track payroll records, pay dates and download payroll slips.</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1 relative w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search name or employee ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="all">All Statuses</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>

            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Period</label>
              <select value={period} onChange={(e) => setPeriod(e.target.value)} className="px-2 py-1 border rounded">
                <option value={1}>1</option>
                <option value={2}>2</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Month</label>
              <select value={month} onChange={(e) => setMonth(Number(e.target.value))} className="px-2 py-1 border rounded">
                {[...Array(12)].map((_, i) => (
                  <option key={i+1} value={i+1}>{i+1}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Year</label>
              <input type="number" value={year} onChange={(e) => setYear(Number(e.target.value))} className="w-20 px-2 py-1 border rounded" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Employee</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Employee ID</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Monthly Salary</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Reference</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Pay Date</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filtered.length > 0 ? (
                filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">{p.employeeName}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{p.employeeId}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{formatCurrency(p.monthlySalary)}</td>
                    <td className="px-6 py-4 text-sm text-blue-600">
                      <a href={buildHRReference(p.employeeId)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-blue-600 hover:underline">
                        <ExternalLink className="w-4 h-4" />
                        Reference
                      </a>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{p.payDate}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${p.status === 'paid' ? 'bg-green-100 text-green-800' : p.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => downloadSlip(p)}
                        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-500">No payroll records found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Employees;
