import React, { useState, useEffect } from 'react';
import { Search, Download, ExternalLink } from 'lucide-react';
import { payrollAPI, employeesAPI } from '../services/api';

// This page replaces the previous Employees management view and now serves as the Payroll page.
const Employees = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [payrolls, setPayrolls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Get current date and calculate dynamic period, month, year
  const now = new Date();
  const currentDay = now.getDate();
  const currentMonth = now.getMonth() + 1; // 1-12
  const currentYear = now.getFullYear();
  
  // Calculate period: 1 for first half (1-15), 2 for second half (16-31)
  const calculatePeriod = (day) => {
    return day <= 15 ? 1 : 2;
  };

  const [year, setYear] = useState(currentYear);
  const [month, setMonth] = useState(currentMonth);
  const [period, setPeriod] = useState(calculatePeriod(currentDay));

  // Fetch payroll data from HR endpoint
  useEffect(() => {
    const fetchPayrollData = async () => {
      setLoading(true);
      setError('');
      
      console.log('🔄 Fetching payroll data...', { period, month, year });
      
      try {
        // First, get list of employees to fetch payroll for
        let employees = [];
        try {
          const employeesRes = await employeesAPI.getEmployees();
          if (employeesRes?.data?.success && employeesRes.data.data) {
            employees = Array.isArray(employeesRes.data.data) ? employeesRes.data.data : [];
          } else if (Array.isArray(employeesRes?.data)) {
            employees = employeesRes.data;
          }
          console.log('👥 Loaded employees:', employees.length);
        } catch (err) {
          console.warn('Could not fetch employees list, using default IDs:', err);
          // Fallback to default employee IDs if employees API fails
          employees = [{ id: 1 }, { id: 2 }, { id: 3 }];
        }

        // Extract employee IDs
        const employeeIds = employees.map(emp => emp.id || emp.employee_id).filter(Boolean);
        
        if (employeeIds.length === 0) {
          setError('No employees found. Please ensure employees are added to the system.');
          setLoading(false);
          return;
        }

        console.log('📋 Fetching payroll for employee IDs:', employeeIds);
        
        const payrollPromises = employeeIds.map(async (id) => {
          try {
            console.log(`📡 Calling API for employee ${id}...`, {
              id,
              period,
              year,
              month,
              url: `${window.location.origin}/VET-SUPER-SYSTEM-3E/HR/backend/routes/getPaidHours.php?id=${id}&period=${period}&year=${year}&month=${month}`
            });
            
            const response = await payrollAPI.getPaidHours(id, period, year, month);
            
            console.log(`✅ Success for employee ${id}:`, response.data);
            
            // Handle response structure: { data: [{ attendance_id, employee_id, check_in_time, check_out_time, rate, paid_hours }, ...] }
            const attendanceRecords = response.data?.data || [];
            
            // Find employee details
            const employee = employees.find(emp => (emp.id || emp.employee_id) === id) || {};
            const employeeName = employee.first_name && employee.last_name 
              ? `${employee.first_name} ${employee.last_name}`.trim()
              : employee.name || employee.employee_name || `Employee ${id}`;
            const employeeId = employee.employee_id || `EMP-${String(id).padStart(3, '0')}`;
            
            // Calculate totals from attendance records
            const totalPaidHours = attendanceRecords.reduce((sum, record) => {
              return sum + parseFloat(record.paid_hours || 0);
            }, 0);
            
            const hourlyRate = attendanceRecords.length > 0 
              ? parseFloat(attendanceRecords[0].rate || 0) 
              : 0;
            
            const totalAmount = totalPaidHours * hourlyRate;
            
            // Get pay date (use first check-in date or calculate based on period)
            const firstRecord = attendanceRecords[0];
            const payDate = firstRecord?.check_in_time 
              ? firstRecord.check_in_time.split(' ')[0] 
              : `${year}-${String(month).padStart(2, '0')}-${period === 1 ? '15' : '30'}`;
            
            // Determine status based on records
            const status = attendanceRecords.length > 0 ? 'paid' : 'pending';
            
            return {
              id,
              employeeId,
              employeeName,
              attendanceRecords,
              totalPaidHours: totalPaidHours.toFixed(2),
              hourlyRate,
              monthlySalary: totalAmount, // Total calculated from attendance
              payDate,
              status,
              recordCount: attendanceRecords.length,
            };
          } catch (err) {
            console.error(`❌ Error fetching payroll for employee ${id}:`, {
              error: err,
              response: err.response,
              status: err.response?.status,
              data: err.response?.data,
              message: err.message
            });
            return null;
          }
        });

        const results = await Promise.all(payrollPromises);
        const validResults = results.filter(r => r !== null);
        
        console.log('📊 Payroll results:', {
          total: results.length,
          successful: validResults.length,
          failed: results.length - validResults.length,
          data: validResults
        });
        
        setPayrolls(validResults);
        
        if (validResults.length === 0) {
          setError('No payroll data found. Please check if the HR endpoint is accessible and employee IDs are correct.');
        }
      } catch (err) {
        console.error('❌ Error fetching payroll data:', err);
        setError(`Failed to load payroll data: ${err.message || 'Unknown error'}. Check browser console for details.`);
      } finally {
        setLoading(false);
      }
    };

    fetchPayrollData();
  }, [period, year, month]);

  const filtered = payrolls.filter((p) => {
    const employeeName = (p.employeeName || p.name || '').toLowerCase();
    const employeeId = (p.employeeId || `EMP-${String(p.id).padStart(3, '0')}`).toLowerCase();
    const searchLower = searchTerm.toLowerCase();
    
    const matchesSearch =
      !searchTerm ||
      employeeName.includes(searchLower) ||
      employeeId.includes(searchLower);
    
    const status = (p.status || 'pending').toLowerCase();
    const matchesStatus = filterStatus === 'all' || status === filterStatus.toLowerCase();
    
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
    const employeeName = record.employeeName || record.name || 'N/A';
    const employeeId = record.employeeId || `EMP-${String(record.id).padStart(3, '0')}`;
    const totalHours = record.totalPaidHours || '0';
    const hourlyRate = record.hourlyRate || 0;
    const totalAmount = record.monthlySalary || record.salary || record.amount || 0;
    const payDate = record.payDate || record.payment_date || new Date().toISOString().split('T')[0];
    const recordCount = record.recordCount || 0;
    
    let content = `PAYROLL SLIP\n`;
    content += `==============================\n\n`;
    content += `Employee Name: ${employeeName}\n`;
    content += `Employee ID: ${employeeId}\n`;
    content += `Period: ${period} (${period === 1 ? '1-15' : '16-31'})\n`;
    content += `Month: ${month}\n`;
    content += `Year: ${year}\n`;
    content += `Pay Date: ${payDate}\n\n`;
    content += `==============================\n`;
    content += `Total Hours Worked: ${totalHours} hours\n`;
    content += `Hourly Rate: ${formatCurrency(hourlyRate)}\n`;
    content += `Total Amount: ${formatCurrency(totalAmount)}\n`;
    content += `Attendance Records: ${recordCount}\n\n`;
    
    if (record.attendanceRecords && record.attendanceRecords.length > 0) {
      content += `ATTENDANCE DETAILS:\n`;
      content += `==============================\n`;
      record.attendanceRecords.forEach((att, idx) => {
        content += `\nRecord ${idx + 1}:\n`;
        content += `  Check-in: ${att.check_in_time || 'N/A'}\n`;
        content += `  Check-out: ${att.check_out_time || 'N/A'}\n`;
        content += `  Paid Hours: ${att.paid_hours || '0'} hrs\n`;
        content += `  Rate: ${formatCurrency(parseFloat(att.rate || 0))}\n`;
      });
    }
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${employeeId}-payroll-${year}-${month}-period${period}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const buildHRReference = (employeeId) => {
    // Build URL like: http://localhost/VET-SUPER-SYSTEM-3E/HR/backend/routes/getPaidHours.php?id=1&period=2&year=2025&month=12
    const base = window.location.origin + '/VET-SUPER-SYSTEM-3E/HR/backend/routes/getPaidHours.php';
    // employeeId should already be numeric from the map function
    const idParam = String(employeeId);
    const params = new URLSearchParams({ 
      id: idParam, 
      period: String(period), 
      year: String(year), 
      month: String(month) 
    });
    const url = `${base}?${params.toString()}`;
    console.log('🔗 Generated HR Reference URL:', url);
    return url;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Payroll</h1>
        <p className="text-gray-600 mt-2">Track payroll records, pay dates and download payroll slips.</p>
        <div className="mt-2 text-sm text-gray-500">
          <span className="font-medium">Current Filters:</span> Period {period} ({period === 1 ? '1-15' : '16-31'}), Month {month}, Year {year}
          {period === calculatePeriod(currentDay) && month === currentMonth && year === currentYear && (
            <span className="ml-2 text-green-600">✓ Using current date</span>
          )}
        </div>
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
              <select 
                value={period} 
                onChange={(e) => setPeriod(Number(e.target.value))} 
                className="px-2 py-1 border rounded"
              >
                <option value={1}>1 (1-15)</option>
                <option value={2}>2 (16-31)</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Month</label>
              <select 
                value={month} 
                onChange={(e) => setMonth(Number(e.target.value))} 
                className="px-2 py-1 border rounded"
              >
                {[
                  'January', 'February', 'March', 'April', 'May', 'June',
                  'July', 'August', 'September', 'October', 'November', 'December'
                ].map((name, i) => (
                  <option key={i+1} value={i+1}>
                    {i+1 === currentMonth ? `${i+1} (${name})` : `${i+1}`}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Year</label>
              <input 
                type="number" 
                value={year} 
                onChange={(e) => setYear(Number(e.target.value))} 
                className="w-20 px-2 py-1 border rounded"
                min="2020"
                max="2100"
              />
              {year === currentYear && (
                <span className="text-xs text-gray-500">(Current)</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

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
              {loading ? (
                <tr>
                  <td colSpan="9" className="px-6 py-8 text-center text-gray-500">
                    Loading payroll data...
                  </td>
                </tr>
              ) : filtered.length > 0 ? (
                filtered.map((p) => {
                  // Extract numeric ID from employeeId for the HR reference
                  const digits = (p.employeeId || '').toString().replace(/\D/g, '');
                  const numericId = digits ? parseInt(digits, 10) : p.id;
                  
                  return (
                    <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                        {p.employeeName || p.name || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {p.employeeId || `EMP-${String(p.id).padStart(3, '0')}`}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {p.totalPaidHours || '0'} hrs
                        {p.recordCount > 0 && (
                          <span className="text-xs text-gray-500 block">
                            ({p.recordCount} {p.recordCount === 1 ? 'record' : 'records'})
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {formatCurrency(p.hourlyRate || 0)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 font-semibold">
                        {formatCurrency(p.monthlySalary || p.salary || p.amount || 0)}
                      </td>
                      <td className="px-6 py-4 text-sm text-blue-600">
                        <a 
                          href={buildHRReference(numericId)} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="inline-flex items-center gap-2 text-blue-600 hover:underline"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Reference
                        </a>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {p.payDate || p.payment_date || '-'}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          (p.status || '').toLowerCase() === 'paid' 
                            ? 'bg-green-100 text-green-800' 
                            : (p.status || '').toLowerCase() === 'pending' 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {p.status || 'pending'}
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
                  );
                })
              ) : (
                <tr>
                  <td colSpan="9" className="px-6 py-8 text-center text-gray-500">
                    No payroll records found for Period {period}, {month}/{year}.
                  </td>
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

