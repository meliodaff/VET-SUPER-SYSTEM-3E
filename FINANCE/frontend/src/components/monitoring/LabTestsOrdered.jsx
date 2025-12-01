import React from "react";
import { Beaker, AlertCircle, CheckCircle2, Clock } from "lucide-react";

const LabTestsOrdered = ({ metrics, labTests, onRefresh }) => {
  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg shadow-md border border-purple-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-700">Total Tests Ordered</p>
              <p className="text-3xl font-bold text-purple-900 mt-2">
                {metrics?.total_tests || 0}
              </p>
              <p className="text-xs text-purple-600 mt-2">Last 30 days</p>
            </div>
            <Beaker className="h-8 w-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg shadow-md border border-yellow-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-700">Pending Tests</p>
              <p className="text-3xl font-bold text-yellow-900 mt-2">
                {metrics?.pending_tests || 0}
              </p>
              <p className="text-xs text-yellow-600 mt-2">Awaiting results</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow-md border border-green-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700">Completed Tests</p>
              <p className="text-3xl font-bold text-green-900 mt-2">
                {metrics?.completed_tests || 0}
              </p>
              <p className="text-xs text-green-600 mt-2">
                {metrics?.test_completion_rate || 0}% complete
              </p>
            </div>
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg shadow-md border border-red-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-700">Overdue Tests</p>
              <p className="text-3xl font-bold text-red-900 mt-2">
                {metrics?.overdue_tests || 0}
              </p>
              <p className="text-xs text-red-600 mt-2">Need follow-up</p>
            </div>
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
        </div>
      </div>

      {/* Key Question 3: Are lab tests automatically ordered and tracked? */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900 flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-purple-600" />
            <span>Automatic Lab Test Ordering & Tracking</span>
          </h3>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-purple-600 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-purple-700 font-medium">
                    Auto-Order Enabled
                  </p>
                  <p className="text-2xl font-bold text-purple-900">
                    {metrics?.auto_order_enabled ? "Yes" : "No"}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <Beaker className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-blue-700 font-medium">
                    Tracking System
                  </p>
                  <p className="text-2xl font-bold text-blue-900">
                    {metrics?.tracking_enabled ? "Active" : "Inactive"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {metrics?.test_ordering_details && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-900">
                <strong>Status:</strong> {metrics.test_ordering_details}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Lab Tests List */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Lab Tests Ordered</h3>
        {labTests && labTests.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Date Ordered
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Patient
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Test Type
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Test Lab
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Due Date
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {labTests.map((test, index) => (
                  <tr key={index} className="border-t border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {new Date(test.date_ordered).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {test.patient_name}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {test.test_type}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {test.lab_name}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {new Date(test.due_date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          test.status === "Completed"
                            ? "bg-green-100 text-green-800"
                            : test.status === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : test.status === "Overdue"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {test.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No lab tests ordered yet
          </div>
        )}
      </div>
    </div>
  );
};

export default LabTestsOrdered;
