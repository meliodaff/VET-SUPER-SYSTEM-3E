import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Download } from 'lucide-react';
import { employeesAPI } from '../services/api';
import EmployeeDirectory from '../components/employees/EmployeeDirectory';
import DepartmentOverview from '../components/employees/DepartmentOverview';
import CreateEmployeeModal from '../components/employees/CreateEmployeeModal';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filterDepartment, setFilterDepartment] = useState('all');

  useEffect(() => {
    fetchEmployees();
    fetchDepartments();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await employeesAPI.getEmployees();
      
      console.log('Employees API Response:', response);
      console.log('Response data:', response?.data);
      
      // Handle different response structures
      if (response?.data?.success && response?.data?.data) {
        const employeesData = response.data.data;
        console.log('Employees loaded:', employeesData.length, 'employees');
        setEmployees(Array.isArray(employeesData) ? employeesData : []);
      } else if (response?.data?.success && Array.isArray(response.data)) {
        console.log('Employees loaded (direct array):', response.data.length, 'employees');
        setEmployees(response.data);
      } else if (Array.isArray(response?.data)) {
        console.log('Employees loaded (root array):', response.data.length, 'employees');
        setEmployees(response.data);
      } else {
        console.error('Unexpected response structure:', response?.data);
        setError('Unexpected response format from server');
        setEmployees([]);
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
      console.error('Error details:', {
        message: error?.message,
        response: error?.response?.data,
        status: error?.response?.status
      });
      const errorMessage = error?.response?.data?.message || 
                          error?.message || 
                          'Failed to load employees. Please check if XAMPP is running.';
      setError(errorMessage);
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await employeesAPI.getDepartments();
      
      // Handle different response structures
      if (response?.data?.success && response?.data?.data) {
        setDepartments(response.data.data);
      } else if (response?.data?.success && Array.isArray(response.data)) {
        setDepartments(response.data);
      } else if (Array.isArray(response?.data)) {
        setDepartments(response.data);
      } else {
        console.error('Unexpected departments response structure:', response?.data);
        setDepartments([]);
      }
    } catch (error) {
      console.error('Error fetching departments:', error);
      setDepartments([]);
    }
  };

  const handleCreateEmployee = async (employeeData) => {
    try {
      // Map monthly_salary to rate if provided
      if (employeeData.monthly_salary && !employeeData.rate) {
        employeeData.rate = employeeData.monthly_salary;
        delete employeeData.monthly_salary;
      }
      
      const response = await employeesAPI.createEmployee(employeeData);
      if (response.data.success) {
        setShowCreateModal(false);
        fetchEmployees();
        fetchDepartments();
        return { success: true };
      }
    } catch (error) {
      console.error('Error creating employee:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to create employee' 
      };
    }
  };

  const handleUpdateEmployee = async (employeeData) => {
    try {
      // Ensure we have an ID
      if (!employeeData.id && !employeeData.employee_id) {
        return { 
          success: false, 
          message: 'Employee ID is required' 
        };
      }

      // Map monthly_salary to rate if provided
      if (employeeData.monthly_salary && !employeeData.rate) {
        employeeData.rate = employeeData.monthly_salary;
        delete employeeData.monthly_salary;
      }
      
      // Use employee_id as id if id is not provided but employee_id is
      if (!employeeData.id && employeeData.employee_id) {
        employeeData.id = employeeData.employee_id;
      }
      
      setLoading(true);
      const response = await employeesAPI.updateEmployee(employeeData);
      
      if (response?.data?.success) {
        // Refresh data after successful update
        await fetchEmployees();
        await fetchDepartments();
        return { success: true, message: 'Employee updated successfully' };
      } else {
        const errorMsg = response?.data?.message || 'Failed to update employee';
        return { success: false, message: errorMsg };
      }
    } catch (error) {
      console.error('Error updating employee:', error);
      const errorMsg = error?.response?.data?.message || 
                      error?.message || 
                      'Failed to update employee. Please check if XAMPP is running.';
      return { 
        success: false, 
        message: errorMsg
      };
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEmployee = async (id) => {
    if (!id) {
      alert('Invalid employee ID');
      return;
    }

    if (window.confirm('Are you sure you want to delete this employee? This action cannot be undone.')) {
      try {
        setLoading(true);
        const response = await employeesAPI.deleteEmployee(id);
        
        if (response?.data?.success) {
          // Show success message
          alert('Employee deleted successfully');
          // Refresh data
          await fetchEmployees();
          await fetchDepartments();
        } else {
          const errorMsg = response?.data?.message || 'Failed to delete employee';
          alert(errorMsg);
        }
      } catch (error) {
        console.error('Error deleting employee:', error);
        const errorMsg = error?.response?.data?.message || 
                        error?.message || 
                        'Failed to delete employee. Please check if XAMPP is running.';
        alert(errorMsg);
      } finally {
        setLoading(false);
      }
    }
  };

  // Get unique departments from employees for filter dropdown
  const uniqueDepartments = [...new Set(employees.map(emp => emp.department).filter(Boolean))];

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = !searchTerm || 
      employee.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.middle_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.employee_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.contact_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.phone_number?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = filterDepartment === 'all' || employee.department === filterDepartment;
    
    return matchesSearch && matchesDepartment;
  });

  if (loading) {
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
          <h1 className="text-3xl font-bold text-gray-900">Employee Management</h1>
          <p className="text-gray-600 mt-2">Manage your clinic's staff and departments</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Employee
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4">
          <div className="flex items-start">
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-red-800 mb-1">Error Loading Employees</h3>
              <p className="text-sm text-red-700 mb-3">{error}</p>
              <button
                onClick={fetchEmployees}
                className="text-sm text-red-800 hover:text-red-900 underline font-medium"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="sm:w-48">
            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Departments</option>
              {uniqueDepartments.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Department Overview */}
        <div className="lg:col-span-1">
          <DepartmentOverview departments={departments} />
        </div>

        {/* Employee Directory */}
        <div className="lg:col-span-3">
          <EmployeeDirectory
            employees={filteredEmployees}
            onUpdateEmployee={handleUpdateEmployee}
            onDeleteEmployee={handleDeleteEmployee}
          />
        </div>
      </div>

      {/* Create Employee Modal */}
      {showCreateModal && (
        <CreateEmployeeModal
          onClose={() => setShowCreateModal(false)}
          onCreateEmployee={handleCreateEmployee}
        />
      )}
    </div>
  );
};

export default Employees;
