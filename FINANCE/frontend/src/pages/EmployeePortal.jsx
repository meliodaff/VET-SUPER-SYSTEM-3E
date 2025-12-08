import React from 'react';
import { Users, ExternalLink, UserCheck, FileText, Clock } from 'lucide-react';

const EmployeePortal = () => {
  // URLs for different employee-related systems
  const hrSystemUrl = `${window.location.origin}/VET-SUPER-SYSTEM-3E/HR`;
  const attendanceUrl = `${window.location.origin}/VET-SUPER-SYSTEM-3E/HR/backend/routes/getPaidHours.php`;
  const employeeManagementUrl = `${window.location.origin}/VET-SUPER-SYSTEM-3E/HR`;

  return (
    <div className="p-6 space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Employee Portal
        </h1>
        <p className="text-gray-600 mb-4">
          This Finance module is linked to the separate{" "}
          <span className="font-semibold">FUR EVER HR System</span> where
          you manage employees, attendance, payroll, and human resources.
        </p>
        <p className="text-gray-600 mb-6">
          Use the buttons below to access different HR system modules in new tabs.
        </p>

        {/* Action Buttons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* HR System Main */}
          <a
            href={hrSystemUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center space-x-3 px-6 py-4 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
          >
            <Users className="h-5 w-5" />
            <div className="flex-1">
              <div className="font-semibold">HR System</div>
              <div className="text-xs text-blue-100">Employee Management</div>
            </div>
            <ExternalLink className="h-4 w-4" />
          </a>

          {/* Attendance System */}
          <a
            href={attendanceUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center space-x-3 px-6 py-4 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors shadow-md hover:shadow-lg"
          >
            <Clock className="h-5 w-5" />
            <div className="flex-1">
              <div className="font-semibold">Attendance</div>
              <div className="text-xs text-green-100">Time Tracking</div>
            </div>
            <ExternalLink className="h-4 w-4" />
          </a>

          {/* Payroll System */}
          <a
            href="/employees"
            className="flex items-center space-x-3 px-6 py-4 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors shadow-md hover:shadow-lg"
          >
            <FileText className="h-5 w-5" />
            <div className="flex-1">
              <div className="font-semibold">Payroll</div>
              <div className="text-xs text-purple-100">Payroll Management</div>
            </div>
            <ExternalLink className="h-4 w-4" />
          </a>

          {/* Employee Directory */}
          <a
            href="/employees"
            className="flex items-center space-x-3 px-6 py-4 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg"
          >
            <UserCheck className="h-5 w-5" />
            <div className="flex-1">
              <div className="font-semibold">Employee Directory</div>
              <div className="text-xs text-indigo-100">View All Employees</div>
            </div>
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>

      {/* Quick Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center space-x-3">
            <Users className="h-8 w-8 text-blue-600" />
            <div>
              <div className="text-sm font-medium text-blue-900">HR System</div>
              <div className="text-xs text-blue-700">Manage employee records, profiles, and information</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <div className="flex items-center space-x-3">
            <Clock className="h-8 w-8 text-green-600" />
            <div>
              <div className="text-sm font-medium text-green-900">Attendance Tracking</div>
              <div className="text-xs text-green-700">Monitor check-ins, check-outs, and work hours</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
          <div className="flex items-center space-x-3">
            <FileText className="h-8 w-8 text-purple-600" />
            <div>
              <div className="text-sm font-medium text-purple-900">Payroll Processing</div>
              <div className="text-xs text-purple-700">Calculate and manage employee payments</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeePortal;
