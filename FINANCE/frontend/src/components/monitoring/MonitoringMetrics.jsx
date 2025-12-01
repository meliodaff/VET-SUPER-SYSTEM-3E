import React from "react";
import { Activity, TrendingUp, AlertCircle, CheckCircle2 } from "lucide-react";

const MonitoringMetrics = ({
  treatments,
  medications,
  labTests,
  inventory,
  sales,
  verification,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Treatments Captured */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Treatments Captured</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {treatments?.total_treatments || 0}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Today: {treatments?.today_treatments || 0}
            </p>
          </div>
          <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <Activity className="h-6 w-6 text-blue-600" />
          </div>
        </div>
        {treatments?.capture_rate && (
          <div className="mt-4 flex items-center">
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${treatments.capture_rate}%` }}
              ></div>
            </div>
            <span className="text-sm font-semibold text-gray-700 ml-2">
              {treatments.capture_rate}%
            </span>
          </div>
        )}
      </div>

      {/* Medications Dispensed */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Medications Dispensed</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {medications?.total_medications || 0}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Today: {medications?.today_medications || 0}
            </p>
          </div>
          <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
            <TrendingUp className="h-6 w-6 text-green-600" />
          </div>
        </div>
        {medications?.dispensed_rate && (
          <div className="mt-4 flex items-center">
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full"
                style={{ width: `${medications.dispensed_rate}%` }}
              ></div>
            </div>
            <span className="text-sm font-semibold text-gray-700 ml-2">
              {medications.dispensed_rate}%
            </span>
          </div>
        )}
      </div>

      {/* Lab Tests Ordered */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Lab Tests Ordered</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {labTests?.total_tests || 0}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Pending: {labTests?.pending_tests || 0}
            </p>
          </div>
          <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <AlertCircle className="h-6 w-6 text-purple-600" />
          </div>
        </div>
        {labTests?.test_completion_rate && (
          <div className="mt-4 flex items-center">
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div
                className="bg-purple-600 h-2 rounded-full"
                style={{ width: `${labTests.test_completion_rate}%` }}
              ></div>
            </div>
            <span className="text-sm font-semibold text-gray-700 ml-2">
              {labTests.test_completion_rate}%
            </span>
          </div>
        )}
      </div>

      {/* Inventory Deductions */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Inventory Deducted</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {inventory?.total_deductions || 0}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Today: {inventory?.today_deductions || 0}
            </p>
          </div>
          <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
            <CheckCircle2 className="h-6 w-6 text-orange-600" />
          </div>
        </div>
        {inventory?.deduction_status === "automatic" && (
          <div className="mt-4 text-sm text-green-600 font-medium">
            ✓ Automatic deduction enabled
          </div>
        )}
      </div>

      {/* Sales Verified */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Sales Verified</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {verification?.verified_sales || 0}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Total Revenue: ₱{parseFloat(sales?.total_revenue || 0).toLocaleString()}
            </p>
          </div>
          <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
            <CheckCircle2 className="h-6 w-6 text-red-600" />
          </div>
        </div>
        {verification?.verification_rate && (
          <div className="mt-4 flex items-center">
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div
                className="bg-red-600 h-2 rounded-full"
                style={{ width: `${verification.verification_rate}%` }}
              ></div>
            </div>
            <span className="text-sm font-semibold text-gray-700 ml-2">
              {verification.verification_rate}%
            </span>
          </div>
        )}
      </div>

      {/* System Health */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">System Health</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {verification?.system_health || "N/A"}%
            </p>
            <p className="text-sm text-gray-500 mt-2">Overall status</p>
          </div>
          <div className="h-12 w-12 bg-teal-100 rounded-lg flex items-center justify-center">
            <CheckCircle2 className="h-6 w-6 text-teal-600" />
          </div>
        </div>
        {verification?.last_sync && (
          <div className="mt-4 text-xs text-gray-500">
            Last sync: {new Date(verification.last_sync).toLocaleString()}
          </div>
        )}
      </div>
    </div>
  );
};

export default MonitoringMetrics;
