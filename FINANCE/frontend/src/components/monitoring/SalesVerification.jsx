import React from "react";
import { AlertCircle, CheckCircle2, TrendingUp, BarChart3 } from "lucide-react";

const SalesVerification = ({
  salesMetrics,
  treatments,
  medications,
  labTests,
  inventory,
  verification,
  onRefresh,
}) => {
  const verificationChecks = [
    {
      title: "Treatments Captured Correctly?",
      status: treatments?.auto_capture_enabled ? "Enabled" : "Disabled",
      color: treatments?.auto_capture_enabled ? "green" : "yellow",
      detail: `${treatments?.capture_rate || 0}% of treatments captured`,
      icon: CheckCircle2,
    },
    {
      title: "Medications Recorded Automatically?",
      status: medications?.auto_record_enabled ? "Enabled" : "Disabled",
      color: medications?.auto_record_enabled ? "green" : "yellow",
      detail: `${medications?.dispensed_rate || 0}% of medications recorded`,
      icon: CheckCircle2,
    },
    {
      title: "Lab Tests Tracked?",
      status: labTests?.tracking_enabled ? "Active" : "Inactive",
      color: labTests?.tracking_enabled ? "green" : "yellow",
      detail: `${labTests?.test_completion_rate || 0}% of tests completed`,
      icon: CheckCircle2,
    },
    {
      title: "Inventory Auto-Deducted?",
      status:
        inventory?.deduction_status === "automatic" ? "Automatic" : "Manual",
      color: inventory?.deduction_status === "automatic" ? "green" : "red",
      detail: `${inventory?.accuracy_rate || 0}% accuracy rate`,
      icon: CheckCircle2,
    },
  ];

  const getColorClasses = (color) => {
    const colors = {
      green: "bg-green-50 border-green-200 text-green-700",
      yellow: "bg-yellow-50 border-yellow-200 text-yellow-700",
      red: "bg-red-50 border-red-200 text-red-700",
      blue: "bg-blue-50 border-blue-200 text-blue-700",
    };
    return colors[color] || colors.blue;
  };

  const getStatusBadgeClasses = (color) => {
    const colors = {
      green: "bg-green-100 text-green-800",
      yellow: "bg-yellow-100 text-yellow-800",
      red: "bg-red-100 text-red-800",
      blue: "bg-blue-100 text-blue-800",
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg shadow-md border border-red-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-700">Sales Verified</p>
              <p className="text-3xl font-bold text-red-900 mt-2">
                {verification?.verified_sales || 0}
              </p>
              <p className="text-xs text-red-600 mt-2">
                {verification?.verification_rate || 0}% complete
              </p>
            </div>
            <CheckCircle2 className="h-8 w-8 text-red-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-md border border-blue-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700">Total Revenue</p>
              <p className="text-3xl font-bold text-blue-900 mt-2">
                ₱{parseFloat(salesMetrics?.total_revenue || 0).toLocaleString()}
              </p>
              <p className="text-xs text-blue-600 mt-2">This month</p>
            </div>
            <TrendingUp className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg shadow-md border border-purple-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-700">System Health</p>
              <p className="text-3xl font-bold text-purple-900 mt-2">
                {verification?.system_health || 0}%
              </p>
              <p className="text-xs text-purple-600 mt-2">Overall status</p>
            </div>
            <BarChart3 className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Professor's Key Questions */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900 flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <span>Professor's Verification Checklist</span>
          </h3>
        </div>

        <div className="space-y-4">
          {verificationChecks.map((check, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border-2 ${getColorClasses(check.color)}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{check.title}</h4>
                  <p className="text-sm text-gray-600 mt-2">{check.detail}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeClasses(check.color)} whitespace-nowrap ml-4`}>
                  {check.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sales Verification Details */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          Sales Verification Summary
        </h3>

        <div className="space-y-4">
          {/* Treatments to Sales */}
          <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
            <div className="flex items-start space-x-4">
              <div className="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">
                  Treatments → Sales Recording
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {treatments?.total_treatments || 0} treatments recorded =
                  Expected sales entries
                </p>
                <div className="mt-2 flex items-center space-x-2">
                  <div className="flex-1 bg-gray-300 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${
                          ((treatments?.total_treatments || 0) /
                            (salesMetrics?.total_invoices || 1)) *
                          100
                        }%`,
                      }}
                    ></div>
                  </div>
                  <span className="text-xs font-semibold text-gray-700">
                    {(
                      ((treatments?.total_treatments || 0) /
                        (salesMetrics?.total_invoices || 1)) *
                      100
                    ).toFixed(0)}
                    %
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Medications to Charges */}
          <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200">
            <div className="flex items-start space-x-4">
              <div className="h-10 w-10 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">
                  Medications → Charges Recording
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {medications?.total_medications || 0} medications dispensed =
                  Expected charge entries
                </p>
                <div className="mt-2 flex items-center space-x-2">
                  <div className="flex-1 bg-gray-300 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{
                        width: `${
                          ((medications?.total_medications || 0) /
                            (salesMetrics?.total_invoices || 1)) *
                          100
                        }%`,
                      }}
                    ></div>
                  </div>
                  <span className="text-xs font-semibold text-gray-700">
                    {(
                      ((medications?.total_medications || 0) /
                        (salesMetrics?.total_invoices || 1)) *
                      100
                    ).toFixed(0)}
                    %
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Lab Tests to Charges */}
          <div className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg border border-purple-200">
            <div className="flex items-start space-x-4">
              <div className="h-10 w-10 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">
                  Lab Tests → Charges Recording
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {labTests?.total_tests || 0} tests ordered = Expected charge
                  entries
                </p>
                <div className="mt-2 flex items-center space-x-2">
                  <div className="flex-1 bg-gray-300 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full"
                      style={{
                        width: `${
                          ((labTests?.total_tests || 0) /
                            (salesMetrics?.total_invoices || 1)) *
                          100
                        }%`,
                      }}
                    ></div>
                  </div>
                  <span className="text-xs font-semibold text-gray-700">
                    {(
                      ((labTests?.total_tests || 0) /
                        (salesMetrics?.total_invoices || 1)) *
                      100
                    ).toFixed(0)}
                    %
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Inventory to Sales */}
          <div className="p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg border border-orange-200">
            <div className="flex items-start space-x-4">
              <div className="h-10 w-10 bg-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">
                  Inventory → Sales Deduction
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {inventory?.total_deductions || 0} inventory items deducted
                </p>
                <div className="mt-2">
                  <p className="text-sm font-semibold text-orange-900">
                    Deduction Status:{" "}
                    <span className="text-orange-600">
                      {inventory?.deduction_status === "automatic"
                        ? "✓ Automatic"
                        : "✗ Manual"}
                    </span>
                  </p>
                  <p className="text-xs text-orange-700 mt-1">
                    Accuracy: {inventory?.accuracy_rate || 0}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Items */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-bold text-blue-900 mb-4">
          Recommended Actions
        </h3>
        <ul className="space-y-3">
          <li className="flex items-start space-x-3">
            <CheckCircle2 className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <span className="text-blue-900">
              Verify that all treatments are captured in the system before
              generating sales records
            </span>
          </li>
          <li className="flex items-start space-x-3">
            <CheckCircle2 className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <span className="text-blue-900">
              Ensure medications are automatically recorded when dispensed to
              prevent billing errors
            </span>
          </li>
          <li className="flex items-start space-x-3">
            <CheckCircle2 className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <span className="text-blue-900">
              Enable automatic lab test tracking and monitor pending results
            </span>
          </li>
          <li className="flex items-start space-x-3">
            <CheckCircle2 className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <span className="text-blue-900">
              Activate automatic inventory deduction to maintain accurate stock
              levels
            </span>
          </li>
          <li className="flex items-start space-x-3">
            <CheckCircle2 className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <span className="text-blue-900">
              Review charges entered by veterinarians to ensure correctness
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SalesVerification;
