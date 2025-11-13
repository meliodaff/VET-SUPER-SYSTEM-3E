import React from 'react';
import { Users, TrendingUp, Coins } from 'lucide-react';
import { formatCurrency } from '../../utils/helpers';

const DepartmentOverview = ({ departments }) => {
  if (!departments || departments.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Department Overview</h3>
        <div className="text-center py-8">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No department data available</p>
        </div>
      </div>
    );
  }

  const totalStaff = departments.reduce((sum, dept) => sum + dept.staff_count, 0);
  const totalSalary = departments.reduce((sum, dept) => sum + parseFloat(dept.total_salary || 0), 0);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Department Overview</h3>
      
      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <Users className="h-6 w-6 text-blue-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-blue-900">{totalStaff}</div>
          <div className="text-sm text-blue-700">Total Staff</div>
        </div>
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <Coins className="h-6 w-6 text-green-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-green-900">{formatCurrency(totalSalary)}</div>
          <div className="text-sm text-green-700">Total Salary</div>
        </div>
      </div>

      {/* Department List */}
      <div className="space-y-4">
        {departments.map((dept, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-900">{dept.department}</h4>
              <span className="text-sm text-gray-500">{dept.staff_count} staff</span>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Total Salary:</span>
              <span className="font-medium text-gray-900">
                {formatCurrency(dept.total_salary)}
              </span>
            </div>
            
            <div className="mt-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ 
                    width: `${totalStaff > 0 ? (dept.staff_count / totalStaff) * 100 : 0}%` 
                  }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DepartmentOverview;
