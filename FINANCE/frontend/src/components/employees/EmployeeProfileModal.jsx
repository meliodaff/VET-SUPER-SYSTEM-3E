import React from 'react';
import { X, Mail, Phone, MapPin, Briefcase, Calendar, User } from 'lucide-react';
import { formatCurrency } from '../../utils/helpers';

const EmployeeProfileModal = ({ employee, onClose }) => {
  if (!employee) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          {/* Close Button */}
          <div className="absolute top-4 right-4">
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Header Section with Profile */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-8 border-b border-gray-200">
            <div className="flex items-start space-x-6">
              {/* Profile Image */}
              <div>
                {employee.profile_image_url ? (
                  <img
                    src={`http://localhost/fur-ever-care/${employee.profile_image_url.replace(/\\/g, '/')}`}
                    alt={`${employee.first_name} ${employee.last_name}`}
                    className="h-24 w-24 rounded-full object-cover border-4 border-white shadow-md"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      if (e.target.nextSibling) {
                        e.target.nextSibling.style.display = 'flex';
                      }
                    }}
                  />
                ) : null}
                <div
                  className={`h-24 w-24 bg-blue-200 rounded-full flex items-center justify-center border-4 border-white shadow-md ${
                    employee.profile_image_url ? 'hidden' : ''
                  }`}
                  style={{ display: employee.profile_image_url ? 'none' : 'flex' }}
                >
                  <User className="h-12 w-12 text-blue-600" />
                </div>
              </div>

              {/* Employee Name and Title */}
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-gray-900">
                  {employee.first_name} {employee.middle_name ? employee.middle_name + ' ' : ''}
                  {employee.last_name}
                </h2>
                <p className="text-gray-600 text-lg mt-2">{employee.position || 'Position'}</p>
                {employee.contact_email && (
                  <p className="text-gray-500 text-sm mt-2">{employee.contact_email}</p>
                )}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 bg-white px-6">
            <div className="flex space-x-8">
              <button className="py-4 px-0 border-b-2 border-blue-600 text-blue-600 font-medium focus:outline-none">
                PROFILE
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-6 space-y-8">
            {/* Profile Information */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <span className="h-1 w-8 bg-blue-600 mr-3 rounded"></span>
                PROFILE INFORMATION
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start space-x-3">
                  <Calendar className="h-5 w-5 text-gray-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Birthdate</p>
                    <p className="text-gray-900">{employee.birthdate ? formatDate(employee.birthdate) : 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-gray-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Address</p>
                    <p className="text-gray-900">{employee.address || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Phone className="h-5 w-5 text-gray-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Contact No</p>
                    <p className="text-gray-900">{employee.phone_number || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Mail className="h-5 w-5 text-gray-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Email</p>
                    <p className="text-gray-900">{employee.contact_email || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Employment Information */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <span className="h-1 w-8 bg-red-600 mr-3 rounded"></span>
                EMPLOYMENT INFORMATION
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start space-x-3">
                  <User className="h-5 w-5 text-gray-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Employee ID</p>
                    <p className="text-gray-900">{employee.employee_id || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Briefcase className="h-5 w-5 text-gray-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Department</p>
                    <p className="text-gray-900">{employee.department || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Calendar className="h-5 w-5 text-gray-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Date Hired</p>
                    <p className="text-gray-900">{employee.date_hired ? formatDate(employee.date_hired) : 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Briefcase className="h-5 w-5 text-gray-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Employment Type</p>
                    <p className="text-gray-900">{employee.employment_type || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Briefcase className="h-5 w-5 text-gray-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Position</p>
                    <p className="text-gray-900">{employee.position || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Briefcase className="h-5 w-5 text-gray-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Salary/Rate</p>
                    <p className="text-gray-900">{formatCurrency(employee.rate || 0)}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Briefcase className="h-5 w-5 text-gray-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Status</p>
                    <div className="mt-1">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        employee.status === 'Active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {employee.status || 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Close Button */}
          <div className="bg-gray-50 px-6 py-4 flex justify-end border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfileModal;
