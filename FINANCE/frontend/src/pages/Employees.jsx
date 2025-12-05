import React, { useState, useEffect } from 'react';
import { Search, Download, ExternalLink, CreditCard, CheckCircle2 } from 'lucide-react';
import { payrollAPI, employeesAPI, paymentsAPI } from '../services/api';
import { formatCurrency } from '../utils/helpers';
import PaymentModal from '../components/employees/PaymentModal';

// This page replaces the previous Employees management view and now serves as the Payroll page.
const Employees = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [payrolls, setPayrolls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedPayrollData, setSelectedPayrollData] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentStatuses, setPaymentStatuses] = useState({});

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

        // Extract employee IDs and deduplicate
        // Create a map to track unique employees by their primary ID
        const employeeMap = new Map();
        const idToPrimaryIdMap = new Map(); // Map to track both id and employee_id relationships
        
        employees.forEach(emp => {
          // Normalize IDs - convert to numbers if possible, otherwise keep as string
          const numericId = emp.id ? (typeof emp.id === 'string' ? parseInt(emp.id, 10) : emp.id) : null;
          const employeeIdStr = emp.employee_id ? String(emp.employee_id) : null;
          
          // Use numeric id as primary key, fallback to employee_id
          const primaryId = numericId || employeeIdStr;
          
          if (primaryId) {
            // Store the employee with the primary ID
            if (!employeeMap.has(primaryId)) {
              employeeMap.set(primaryId, emp);
            } else {
              // If entry exists, prefer the one with more complete data
              const existing = employeeMap.get(primaryId);
              const existingFields = Object.keys(existing).filter(k => existing[k] != null && existing[k] !== '').length;
              const newFields = Object.keys(emp).filter(k => emp[k] != null && emp[k] !== '').length;
              if (newFields > existingFields) {
                employeeMap.set(primaryId, emp);
              }
            }
            
            // Create bidirectional mapping for lookup
            if (numericId && numericId !== primaryId) {
              idToPrimaryIdMap.set(numericId, primaryId);
            }
            if (employeeIdStr && employeeIdStr !== primaryId) {
              idToPrimaryIdMap.set(employeeIdStr, primaryId);
            }
          }
        });
        
        // Get unique employee IDs (normalized)
        const employeeIds = Array.from(employeeMap.keys()).map(id => {
          // Convert to number if it's a numeric string, otherwise keep as is
          const numId = typeof id === 'string' && /^\d+$/.test(id) ? parseInt(id, 10) : id;
          return numId;
        });
        
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
            const attendanceRecords = Array.isArray(response.data?.data) ? response.data.data : [];
            
            // Find employee details from the map - try multiple lookup strategies
            let employee = employeeMap.get(id) || null;
            
            // If not found, try looking up by converted ID
            if (!employee) {
              const stringId = String(id);
              const numId = typeof id === 'string' ? parseInt(id, 10) : id;
              employee = employeeMap.get(stringId) || employeeMap.get(numId) || null;
              
              // Try using the idToPrimaryIdMap if available
              if (!employee && idToPrimaryIdMap && idToPrimaryIdMap.has(id)) {
                const primaryId = idToPrimaryIdMap.get(id);
                employee = employeeMap.get(primaryId) || null;
              }
              
              // Also try reverse lookup - check if any employee has this as their id or employee_id
              if (!employee) {
                employeeMap.forEach((emp, key) => {
                  if (!employee && (emp.id === id || emp.employee_id === id || emp.id === numId || emp.employee_id === stringId)) {
                    employee = emp;
                  }
                });
              }
            }
            
            // Fallback to empty object if still not found
            employee = employee || {};
            
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
        const validResults = results.filter(r => r !== null && r !== undefined && r.id !== undefined);
        
        // Deduplicate results by employee ID to prevent duplicates
        let uniquePayrollsMap = new Map();
        let finalUniquePayrolls = new Map();
        
        try {
          validResults.forEach(payroll => {
            if (!payroll || !payroll.id) {
              console.warn('Skipping invalid payroll record:', payroll);
              return;
            }
          
          // Normalize the key - use both id and employeeId for uniqueness
          const key = String(payroll.id);
          const altKey = payroll.employeeId ? String(payroll.employeeId) : null;
          
          // Check if we already have this employee (by id or employeeId)
          let existingKey = uniquePayrollsMap.has(key) ? key : null;
          if (!existingKey && altKey && uniquePayrollsMap.has(altKey)) {
            existingKey = altKey;
          }
          
          if (!existingKey) {
            // New employee, add it
            uniquePayrollsMap.set(key, payroll);
            if (altKey && altKey !== key) {
              uniquePayrollsMap.set(altKey, payroll); // Also index by employeeId
            }
          } else {
            // Duplicate found, merge attendance records and recalculate totals
            const existing = uniquePayrollsMap.get(existingKey);
            const existingRecords = Array.isArray(existing.attendanceRecords) ? existing.attendanceRecords : [];
            const newRecords = Array.isArray(payroll.attendanceRecords) ? payroll.attendanceRecords : [];
            const mergedRecords = [...existingRecords, ...newRecords];
            
            // Remove duplicate attendance records based on attendance_id if available
            const uniqueRecords = mergedRecords.filter((record, index, self) => {
              const recordId = record.attendance_id || `${record.check_in_time}_${record.check_out_time}`;
              return index === self.findIndex(r => {
                const rId = r.attendance_id || `${r.check_in_time}_${r.check_out_time}`;
                return rId === recordId;
              });
            });
            
            // Recalculate totals
            const totalPaidHours = uniqueRecords.reduce((sum, record) => {
              const hours = parseFloat(record.paid_hours || 0);
              return sum + (isNaN(hours) ? 0 : hours);
            }, 0);
            
            const hourlyRate = uniqueRecords.length > 0 
              ? parseFloat(uniqueRecords[0].rate || 0) 
              : (existing.hourlyRate || payroll.hourlyRate || 0);
            
            const totalAmount = totalPaidHours * hourlyRate;
            
            // Update with merged data
            const updatedPayroll = {
              ...existing,
              ...payroll, // Keep latest data
              attendanceRecords: uniqueRecords,
              totalPaidHours: totalPaidHours.toFixed(2),
              hourlyRate: hourlyRate,
              monthlySalary: totalAmount,
              recordCount: uniqueRecords.length,
            };
            
            uniquePayrollsMap.set(existingKey, updatedPayroll);
            if (altKey && altKey !== existingKey) {
              uniquePayrollsMap.set(altKey, updatedPayroll);
            }
          }
        });
        
        // Remove duplicates from map - keep only one entry per employee
        finalUniquePayrolls = new Map();
        const seenIds = new Set();
        
        uniquePayrollsMap.forEach((payroll, key) => {
          const id = String(payroll.id || key);
          if (!seenIds.has(id)) {
            seenIds.add(id);
            finalUniquePayrolls.set(id, payroll);
          }
        });
        } catch (dedupeError) {
          console.error('Error during deduplication:', dedupeError);
          // Fallback: use validResults as-is if deduplication fails
          finalUniquePayrolls = new Map();
          validResults.forEach((payroll, index) => {
            if (payroll && payroll.id) {
              finalUniquePayrolls.set(String(payroll.id) + '-' + index, payroll);
            }
          });
        }
        
        // Convert map back to array
        const uniquePayrolls = Array.from(finalUniquePayrolls.values()).filter(p => p && p.id);
        
        console.log('📊 Payroll results:', {
          total: results.length,
          successful: validResults.length,
          unique: uniquePayrolls.length,
          duplicates_removed: validResults.length - uniquePayrolls.length,
          failed: results.length - validResults.length,
          data: uniquePayrolls
        });
        
        setPayrolls(uniquePayrolls);
        
        // Check payment statuses for all employees
        checkPaymentStatuses(uniquePayrolls);
        
        if (uniquePayrolls.length === 0) {
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

  // Check payment statuses for employees
  const checkPaymentStatuses = async (payrollRecords) => {
    const statusMap = {};
    
    for (const record of payrollRecords) {
      try {
        const response = await paymentsAPI.getEmployeePayments({
          employee_id: record.id,
          period: period,
          year: year,
          month: month
        });
        
        if (response?.data?.success && response.data.data.payments.length > 0) {
          statusMap[record.id] = 'paid';
        } else {
          statusMap[record.id] = 'pending';
        }
      } catch (err) {
        console.error(`Error checking payment status for employee ${record.id}:`, err);
        statusMap[record.id] = 'pending';
      }
    }
    
    setPaymentStatuses(statusMap);
  };

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

  const handleProcessPayment = (payrollRecord) => {
    // Find employee details
    const employee = {
      id: payrollRecord.id,
      employee_id: payrollRecord.employeeId,
      first_name: payrollRecord.employeeName?.split(' ')[0] || '',
      last_name: payrollRecord.employeeName?.split(' ').slice(1).join(' ') || ''
    };
    
    setSelectedEmployee(employee);
    setSelectedPayrollData(payrollRecord);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = () => {
    // Refresh payment statuses
    checkPaymentStatuses(payrolls);
    setShowPaymentModal(false);
    setSelectedEmployee(null);
    setSelectedPayrollData(null);
    
    // Show success message
    alert('Payment processed successfully!');
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

      {/* Payroll Summary */}
      {payrolls.length > 0 && (
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-lg p-6 text-white">
          <h3 className="text-lg font-semibold mb-4">Payroll Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <p className="text-blue-100 text-sm">Total Employees</p>
              <p className="text-2xl font-bold">{payrolls.length}</p>
            </div>
            <div>
              <p className="text-blue-100 text-sm">Total Salary Amount</p>
              <p className="text-2xl font-bold">
                {formatCurrency(payrolls.reduce((sum, p) => sum + (p.monthlySalary || 0), 0))}
              </p>
            </div>
            <div>
              <p className="text-blue-100 text-sm">Paid Employees</p>
              <p className="text-2xl font-bold">
                {Object.values(paymentStatuses).filter(s => s === 'paid').length}
              </p>
            </div>
            <div>
              <p className="text-blue-100 text-sm">Pending Payments</p>
              <p className="text-2xl font-bold">
                {Object.values(paymentStatuses).filter(s => s === 'pending').length}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Employee</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Employee ID</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Hours Worked</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Hourly Rate</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Total Salary</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Reference</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                    Loading payroll data...
                  </td>
                </tr>
              ) : filtered.length > 0 ? (
                filtered.map((p, index) => {
                  // Extract numeric ID from employeeId for the HR reference
                  const digits = (p.employeeId || '').toString().replace(/\D/g, '');
                  const numericId = digits ? parseInt(digits, 10) : p.id;
                  
                  // Create a unique key combining id and index to prevent React key conflicts
                  const uniqueKey = `${p.id}-${p.employeeId || ''}-${index}`;
                  
                  return (
                    <tr key={uniqueKey} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                        {p.employeeName || p.name || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {p.employeeId || `EMP-${String(p.id).padStart(3, '0')}`}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        <div>
                          <span className="font-medium">{p.totalPaidHours || '0'} hrs</span>
                          {p.recordCount > 0 && (
                            <span className="text-xs text-gray-500 block">
                              ({p.recordCount} {p.recordCount === 1 ? 'record' : 'records'})
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        <span className="font-medium">{formatCurrency(p.hourlyRate || 0)}</span>
                        <span className="text-xs text-gray-500 block">per hour</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 font-semibold">
                        <span className="text-lg text-blue-600">{formatCurrency(p.monthlySalary || p.salary || p.amount || 0)}</span>
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
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${
                          paymentStatuses[p.id] === 'paid'
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {paymentStatuses[p.id] === 'paid' && <CheckCircle2 className="w-3 h-3" />}
                          {paymentStatuses[p.id] === 'paid' ? 'Paid' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => downloadSlip(p)}
                            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm"
                          >
                            <Download className="w-4 h-4" />
                            Download
                          </button>
                          {paymentStatuses[p.id] !== 'paid' && (
                            <button
                              onClick={() => handleProcessPayment(p)}
                              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-sm"
                            >
                              <CreditCard className="w-4 h-4" />
                              Pay Salary
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                    No payroll records found for Period {period}, {month}/{year}.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && selectedEmployee && selectedPayrollData && (
        <PaymentModal
          employee={selectedEmployee}
          payrollData={selectedPayrollData}
          period={period}
          year={year}
          month={month}
          onClose={() => {
            setShowPaymentModal(false);
            setSelectedEmployee(null);
            setSelectedPayrollData(null);
          }}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
};

export default Employees;

