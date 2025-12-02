import React from "react";
import { Pill, TrendingUp, CheckCircle2, AlertCircle } from "lucide-react";

const MedicationsDispensed = ({ metrics, medications, onRefresh }) => {
  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow-md border border-green-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700">Total Medications</p>
              <p className="text-3xl font-bold text-green-900 mt-2">
                {metrics?.total_medications || 0}
              </p>
              <p className="text-xs text-green-600 mt-2">Last 30 days</p>
            </div>
            <Pill className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-md border border-blue-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700">Today Dispensed</p>
              <p className="text-3xl font-bold text-blue-900 mt-2">
                {metrics?.today_medications || 0}
              </p>
              <p className="text-xs text-blue-600 mt-2">
                {metrics?.dispensed_rate || 0}% dispensed
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg shadow-md border border-orange-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-700">Top Medication</p>
              <p className="text-xl font-bold text-orange-900 mt-2">
                {metrics?.top_medication || "N/A"}
              </p>
              <p className="text-xs text-orange-600 mt-2">
                {metrics?.top_medication_count || 0} times
              </p>
            </div>
            <CheckCircle2 className="h-8 w-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Key Question 2: Are medications automatically recorded when dispensed? */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900 flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-green-600" />
            <span>Automatic Medication Dispensing</span>
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
                    Auto-Record Enabled
                  </p>
                  <p className="text-2xl font-bold text-green-900">
                    {metrics?.auto_record_enabled ? "Yes" : "No"}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <Pill className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-blue-700 font-medium">
                    Recorded This Month
                  </p>
                  <p className="text-2xl font-bold text-blue-900">
                    {metrics?.month_recorded || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {metrics?.dispensing_status_details && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-900">
                <strong>Status:</strong> {metrics.dispensing_status_details}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Medications List */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Medications Dispensed</h3>
        {medications && medications.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Medication Name
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Patient
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Dosage
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Quantity
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {medications.map((med, index) => (
                  <tr key={index} className="border-t border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {new Date(med.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {med.medication_name}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {med.patient_name}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {med.dosage}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {med.quantity} {med.unit}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          med.status === "Dispensed"
                            ? "bg-green-100 text-green-800"
                            : med.status === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {med.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No medications dispensed yet
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicationsDispensed;
