import React from "react";
import { Activity, Clock, CheckCircle2, AlertCircle } from "lucide-react";

const TreatmentsCaptured = ({ metrics, treatments, onRefresh }) => {
  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-md border border-blue-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700">Total Treatments</p>
              <p className="text-3xl font-bold text-blue-900 mt-2">
                {metrics?.total_treatments || 0}
              </p>
              <p className="text-xs text-blue-600 mt-2">Last 30 days</p>
            </div>
            <Activity className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow-md border border-green-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700">Today's Treatments</p>
              <p className="text-3xl font-bold text-green-900 mt-2">
                {metrics?.today_treatments || 0}
              </p>
              <p className="text-xs text-green-600 mt-2">
                {metrics?.capture_rate || 0}% captured
              </p>
            </div>
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg shadow-md border border-purple-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-700">Avg. Per Day</p>
              <p className="text-3xl font-bold text-purple-900 mt-2">
                {metrics?.avg_treatments_per_day || 0}
              </p>
              <p className="text-xs text-purple-600 mt-2">
                {metrics?.capture_status || "Pending"}
              </p>
            </div>
            <Clock className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Key Question 1: Are treatments being captured automatically? */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900 flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-blue-600" />
            <span>Automatic Treatment Capture</span>
          </h3>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-green-600 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-green-700 font-medium">
                    Auto-Capture Enabled
                  </p>
                  <p className="text-2xl font-bold text-green-900">
                    {metrics?.auto_capture_enabled ? "Yes" : "No"}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <Activity className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-blue-700 font-medium">
                    Captured This Month
                  </p>
                  <p className="text-2xl font-bold text-blue-900">
                    {metrics?.month_captured || 0}/{metrics?.total_appointments || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {metrics?.capture_status_details && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-900">
                <strong>Status:</strong> {metrics.capture_status_details}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Treatments List */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Treatments</h3>
        {treatments && treatments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Patient
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Treatment Type
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Veterinarian
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {treatments.map((treatment, index) => (
                  <tr
                    key={index}
                    className="border-t border-gray-200 hover:bg-gray-50"
                  >
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {new Date(treatment.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {treatment.patient_name}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {treatment.treatment_type}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {treatment.veterinarian}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          treatment.status === "Captured"
                            ? "bg-green-100 text-green-800"
                            : treatment.status === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {treatment.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No treatments recorded yet
          </div>
        )}
      </div>
    </div>
  );
};

export default TreatmentsCaptured;
