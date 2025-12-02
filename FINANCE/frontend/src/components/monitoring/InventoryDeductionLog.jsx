import React from "react";
import { Package, TrendingDown, AlertCircle, CheckCircle2 } from "lucide-react";

const InventoryDeductionLog = ({ metrics, deductions, onRefresh }) => {
  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg shadow-md border border-orange-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-700">Total Deductions</p>
              <p className="text-3xl font-bold text-orange-900 mt-2">
                {metrics?.total_deductions || 0}
              </p>
              <p className="text-xs text-orange-600 mt-2">Last 30 days</p>
            </div>
            <Package className="h-8 w-8 text-orange-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-md border border-blue-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700">Today's Deductions</p>
              <p className="text-3xl font-bold text-blue-900 mt-2">
                {metrics?.today_deductions || 0}
              </p>
              <p className="text-xs text-blue-600 mt-2">Automatic</p>
            </div>
            <TrendingDown className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow-md border border-green-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700">Value Deducted</p>
              <p className="text-3xl font-bold text-green-900 mt-2">
                ₱{parseFloat(metrics?.total_value_deducted || 0).toLocaleString()}
              </p>
              <p className="text-xs text-green-600 mt-2">This month</p>
            </div>
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg shadow-md border border-red-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-700">Manual Deductions</p>
              <p className="text-3xl font-bold text-red-900 mt-2">
                {metrics?.manual_deductions || 0}
              </p>
              <p className="text-xs text-red-600 mt-2">Requiring review</p>
            </div>
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
        </div>
      </div>

      {/* Key Question 4: Is inventory automatically deducted? */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900 flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-orange-600" />
            <span>Automatic Inventory Deduction System</span>
          </h3>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-green-600 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-green-700 font-medium">
                    Auto-Deduction Status
                  </p>
                  <p className="text-2xl font-bold text-green-900">
                    {metrics?.deduction_status === "automatic" ? "ENABLED" : "DISABLED"}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <Package className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-blue-700 font-medium">
                    Deduction Method
                  </p>
                  <p className="text-2xl font-bold text-blue-900">
                    {metrics?.deduction_method || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-purple-600 rounded-full flex items-center justify-center">
                  <TrendingDown className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-purple-700 font-medium">
                    Accuracy Rate
                  </p>
                  <p className="text-2xl font-bold text-purple-900">
                    {metrics?.accuracy_rate || 0}%
                  </p>
                </div>
              </div>
            </div>
          </div>

          {metrics?.deduction_details && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-900">
                <strong>Deduction Details:</strong> {metrics.deduction_details}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Inventory Deduction Log */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          Inventory Deduction Log
        </h3>
        {deductions && deductions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Item Name
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Quantity
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Unit Price
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Total Value
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Reason
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Type
                  </th>
                </tr>
              </thead>
              <tbody>
                {deductions.map((deduction, index) => (
                  <tr key={index} className="border-t border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {new Date(deduction.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {deduction.item_name}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {deduction.quantity} {deduction.unit}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      ₱{parseFloat(deduction.unit_price).toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 font-semibold">
                      ₱{parseFloat(deduction.total_value).toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {deduction.reason}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          deduction.type === "Automatic"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {deduction.type}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No inventory deductions recorded yet
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryDeductionLog;
