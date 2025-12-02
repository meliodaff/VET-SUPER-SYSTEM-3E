import React, { useState, useEffect } from "react";
import {
  Activity,
  Pill,
  Beaker,
  Package,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { dashboardAPI } from "../services/api";
import TreatmentsCaptured from "../components/monitoring/TreatmentsCaptured";
import MedicationsDispensed from "../components/monitoring/MedicationsDispensed";
import LabTestsOrdered from "../components/monitoring/LabTestsOrdered";
import InventoryDeductionLog from "../components/monitoring/InventoryDeductionLog";
import SalesVerification from "../components/monitoring/SalesVerification";
import MonitoringMetrics from "../components/monitoring/MonitoringMetrics";

const SalesMonitoring = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [monitoringData, setMonitoringData] = useState({
    treatmentMetrics: null,
    treatmentsList: [],
    medicationMetrics: null,
    medicationsList: [],
    labTestMetrics: null,
    labTestsList: [],
    inventoryMetrics: null,
    inventoryDeductions: [],
    salesMetrics: null,
    verificationStatus: {},
  });

  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    // Initialize with empty data - no live data fetching
    setLoading(false);
  }, []);

  const fetchMonitoringData = async () => {
    // Placeholder for refresh button - no actual data fetching
    console.log("Refresh clicked - no data to fetch");
  };

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-700">{error}</p>
        <button
          onClick={fetchMonitoringData}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Sales & Monitoring Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            Track treatments, medications, lab tests, and inventory in real-time
          </p>
        </div>
        <button
          onClick={fetchMonitoringData}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4">
        <div className="flex space-x-2 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
              activeTab === "overview"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4" />
              <span>Overview</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab("treatments")}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
              activeTab === "treatments"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <div className="flex items-center space-x-2">
              <Activity className="h-4 w-4" />
              <span>Treatments</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab("medications")}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
              activeTab === "medications"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <div className="flex items-center space-x-2">
              <Pill className="h-4 w-4" />
              <span>Medications</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab("labTests")}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
              activeTab === "labTests"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <div className="flex items-center space-x-2">
              <Beaker className="h-4 w-4" />
              <span>Lab Tests</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab("inventory")}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
              activeTab === "inventory"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <div className="flex items-center space-x-2">
              <Package className="h-4 w-4" />
              <span>Inventory</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab("sales")}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
              activeTab === "sales"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-4 w-4" />
              <span>Sales Verification</span>
            </div>
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="space-y-6">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <>
            <MonitoringMetrics
              treatments={monitoringData.treatmentMetrics}
              medications={monitoringData.medicationMetrics}
              labTests={monitoringData.labTestMetrics}
              inventory={monitoringData.inventoryMetrics}
              sales={monitoringData.salesMetrics}
              verification={monitoringData.verificationStatus}
            />
          </>
        )}

        {/* Treatments Tab */}
        {activeTab === "treatments" && (
          <TreatmentsCaptured
            metrics={monitoringData.treatmentMetrics}
            treatments={monitoringData.treatmentsList}
            onRefresh={fetchMonitoringData}
          />
        )}

        {/* Medications Tab */}
        {activeTab === "medications" && (
          <MedicationsDispensed
            metrics={monitoringData.medicationMetrics}
            medications={monitoringData.medicationsList}
            onRefresh={fetchMonitoringData}
          />
        )}

        {/* Lab Tests Tab */}
        {activeTab === "labTests" && (
          <LabTestsOrdered
            metrics={monitoringData.labTestMetrics}
            labTests={monitoringData.labTestsList}
            onRefresh={fetchMonitoringData}
          />
        )}

        {/* Inventory Tab */}
        {activeTab === "inventory" && (
          <InventoryDeductionLog
            metrics={monitoringData.inventoryMetrics}
            deductions={monitoringData.inventoryDeductions}
            onRefresh={fetchMonitoringData}
          />
        )}

        {/* Sales Verification Tab */}
        {activeTab === "sales" && (
          <SalesVerification
            salesMetrics={monitoringData.salesMetrics}
            treatments={monitoringData.treatmentMetrics}
            medications={monitoringData.medicationMetrics}
            labTests={monitoringData.labTestMetrics}
            inventory={monitoringData.inventoryMetrics}
            verification={monitoringData.verificationStatus}
            onRefresh={fetchMonitoringData}
          />
        )}
      </div>
    </div>
  );
};

export default SalesMonitoring;
