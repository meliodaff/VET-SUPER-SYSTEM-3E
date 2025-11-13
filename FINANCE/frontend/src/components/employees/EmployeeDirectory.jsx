import React, { useState } from 'react';
import { Edit, Trash2, User, Mail, Phone, MapPin } from 'lucide-react';
import { formatCurrency, getStatusColor } from '../../utils/helpers';
import EditEmployeeModal from './EditEmployeeModal';

const EmployeeDirectory = ({ employees, onUpdateEmployee, onDeleteEmployee }) => {
  const [editingEmployee, setEditingEmployee] = useState(null);

  const handleEdit = (employee) => {
    setEditingEmployee(employee);
  };

  const handleUpdate = async (employeeData) => {
    try {
      const result = await onUpdateEmployee(employeeData);
      if (result.success) {
        setEditingEmployee(null);
      }
      return result;
    } catch (error) {
      console.error('Update error in EmployeeDirectory:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to update employee' 
      };
    }
  };

  if (employees.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No employees found</h3>
        <p className="text-gray-500">Add your first employee to get started.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Employee Directory</h3>
        <p className="text-sm text-gray-600">Manage your clinic's staff</p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Employee
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Position
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Department
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Salary
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
            {employees.map((employee) => (
              <tr key={employee.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {employee.profile_image_url ? (
                      <img 
                        src={`http://localhost/fur-ever-care/${employee.profile_image_url.replace(/\\/g, '/')}`}
                        alt={`${employee.first_name} ${employee.last_name}`}
                        className="h-10 w-10 rounded-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          if (e.target.nextSibling) {
                            e.target.nextSibling.style.display = 'flex';
                          }
                        }}
                      />
                    ) : null}
                    <div className={`h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center ${employee.profile_image_url ? 'hidden' : ''}`} style={{ display: employee.profile_image_url ? 'none' : 'flex' }}>
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {employee.first_name} {employee.middle_name ? employee.middle_name + ' ' : ''}{employee.last_name}
                      </div>
                      <div className="text-sm text-gray-500">
                        ID: {employee.employee_id || 'N/A'}
                      </div>
                      {employee.contact_email && (
                        <div className="text-xs text-gray-400 mt-1">
                          {employee.contact_email}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{employee.position || 'N/A'}</div>
                  {employee.employment_type && (
                    <div className="text-xs text-gray-500 mt-1">
                      {employee.employment_type}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{employee.department || 'N/A'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {formatCurrency(employee.rate || 0)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(employee.status)}`}>
                    {employee.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => handleEdit(employee)}
                      className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                      title="Edit Employee"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => {
                        const deleteId = employee.id || employee.employee_id;
                        if (deleteId) {
                          onDeleteEmployee(deleteId);
                        } else {
                          alert('Cannot delete: Employee ID not found');
                        }
                      }}
                      className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors"
                      title="Delete Employee"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Employee Modal */}
      {editingEmployee && (
        <EditEmployeeModal
          employee={editingEmployee}
          onClose={() => setEditingEmployee(null)}
          onUpdateEmployee={handleUpdate}
        />
      )}
    </div>
  );
};

export default EmployeeDirectory;
