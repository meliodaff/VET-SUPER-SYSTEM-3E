import React, { useState, useEffect } from 'react';
import { dashboardAPI } from '../services/api';
import SalesMetrics from '../components/dashboard/SalesMetrics';
import SalesTrend from '../components/dashboard/SalesTrend';
import ProductsRevenue from '../components/dashboard/ProductsRevenue';
import DoctorStatistics from '../components/dashboard/DoctorStatistics';
import DoctorCards from '../components/dashboard/DoctorCards';
import InventoryCost from '../components/dashboard/InventoryCost';
import DoctorSurgeryFees from '../components/dashboard/DoctorSurgeryFees';
import RecentPayments from '../components/dashboard/RecentPayments';
import SuppliesExpenses from '../components/dashboard/SuppliesExpenses';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dashboardData, setDashboardData] = useState({
    salesMetrics: null,
    salesTrend: [],
    productsRevenue: [],
    doctorStatistics: [],
    inventoryCost: null,
    doctorSurgeryFees: [],
    recentPayments: [],
    suppliesExpenses: null
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');

      // Fetch all dashboard data including doctor-related data
      const [
        salesMetricsRes,
        salesTrendRes,
        productsRevenueRes,
        doctorStatisticsRes,
        inventoryCostRes,
        doctorSurgeryFeesRes,
        recentPaymentsRes,
        suppliesExpensesRes
      ] = await Promise.all([
        dashboardAPI.getSalesMetrics().catch(err => {
          console.error('Sales Metrics Error:', err);
          return { data: { success: false, data: null, error: err } };
        }),
        dashboardAPI.getSalesTrend(6).catch(err => {
          console.error('Sales Trend Error:', err);
          return { data: { success: false, data: [], error: err } };
        }),
        dashboardAPI.getProductsRevenue().catch(err => {
          console.error('Products Revenue Error:', err);
          return { data: { success: false, data: [], error: err } };
        }),
        dashboardAPI.getDoctorStatistics().catch(err => {
          console.error('Doctor Statistics Error:', err);
          return { data: { success: false, data: [], error: err } };
        }),
        dashboardAPI.getInventoryCost().catch(err => {
          console.error('Inventory Cost Error:', err);
          return { data: { success: false, data: null, error: err } };
        }),
        dashboardAPI.getDoctorSurgeryFees().catch(err => {
          console.error('Doctor Surgery Fees Error:', err);
          return { data: { success: false, data: [], error: err } };
        }),
        dashboardAPI.getRecentPayments(5).catch(err => {
          console.error('Recent Payments Error:', err);
          return { data: { success: false, data: [], error: err } };
        }),
        dashboardAPI.getSuppliesExpenses(6).catch(err => {
          console.error('Supplies Expenses Error:', err);
          return { data: { success: false, data: null, error: err } };
        })
      ]);

      // Validate and extract doctor statistics data
      let doctorStats = [];
      if (doctorStatisticsRes?.data?.success && Array.isArray(doctorStatisticsRes.data.data)) {
        console.log('Raw doctor statistics data:', doctorStatisticsRes.data.data);
        doctorStats = doctorStatisticsRes.data.data
          .map(stat => {
            // Try multiple possible ID fields
            const employeeId = parseInt(stat.employee_id || stat.id || stat.employeeId || 0);
            console.log('Mapping doctor stat:', stat, 'employee_id:', employeeId);
            
            // Only include doctors with valid employee_id
            if (!employeeId || employeeId <= 0 || isNaN(employeeId)) {
              console.warn('Skipping doctor with invalid employee_id:', stat);
              return null;
            }
            
            return {
              employee_id: employeeId,
              id: employeeId, // Also include as id for compatibility
              doctor: stat.doctor || 'Unknown Doctor',
              title: stat.title || stat.position || 'Veterinarian',
              role: stat.role || 'Employee',
              patients: parseInt(stat.patients || stat.patients_count || 0, 10),
              revenue: parseFloat(stat.revenue || stat.total_revenue || 0),
              avg_per_patient: parseFloat(stat.avg_per_patient || 0)
            };
          })
          .filter(stat => stat !== null); // Remove null entries
        console.log('Mapped doctor stats (filtered):', doctorStats);
        
        // Verify all doctors have valid employee_id
        const invalidDoctors = doctorStats.filter(d => !d.employee_id || d.employee_id <= 0);
        if (invalidDoctors.length > 0) {
          console.error('Warning: Some doctors still have invalid employee_id:', invalidDoctors);
        }
      }
      
      // Validate and extract doctor surgery fees data
      let surgeryFees = [];
      if (doctorSurgeryFeesRes?.data?.success && Array.isArray(doctorSurgeryFeesRes.data.data)) {
        surgeryFees = doctorSurgeryFeesRes.data.data.map(fee => ({
          doctor: fee.doctor || 'Unknown Doctor',
          surgeries: parseInt(fee.surgeries || fee.surgeries_count || 0, 10),
          total_fees: parseFloat(fee.total_fees || 0)
        }));
      }

      // Log successful data fetching for debugging
      if (doctorStats.length > 0) {
        console.log('✓ Doctor Statistics loaded:', doctorStats.length, 'doctors');
      } else {
        console.warn('⚠ No doctor statistics data available');
      }
      
      if (surgeryFees.length > 0) {
        console.log('✓ Doctor Surgery Fees loaded:', surgeryFees.length, 'doctors');
      } else {
        console.warn('⚠ No doctor surgery fees data available');
      }

      // Validate and extract sales metrics data
      let salesMetrics = null;
      if (salesMetricsRes?.data?.success && salesMetricsRes?.data?.data) {
        const metrics = salesMetricsRes.data.data;
        salesMetrics = {
          today_sales: parseFloat(metrics.today_sales || 0),
          total_revenue: parseFloat(metrics.total_revenue || 0),
          pending_amount: parseFloat(metrics.pending_amount || metrics.pending_invoices || 0),
          pending_invoices: parseFloat(metrics.pending_invoices || metrics.pending_amount || 0),
          paid_revenue: parseFloat(metrics.paid_revenue || 0)
        };
        console.log('✓ Sales Metrics loaded:', salesMetrics);
      } else {
        console.warn('⚠ No sales metrics data available');
      }

      // Update dashboard data with validated and formatted data
      setDashboardData({
        salesMetrics: salesMetrics,
        salesTrend: salesTrendRes?.data?.success ? (salesTrendRes?.data?.data || []) : [],
        productsRevenue: productsRevenueRes?.data?.success ? (productsRevenueRes?.data?.data || []) : [],
        doctorStatistics: doctorStats,
        inventoryCost: inventoryCostRes?.data?.success ? (inventoryCostRes?.data?.data || null) : null,
        doctorSurgeryFees: surgeryFees,
        recentPayments: recentPaymentsRes?.data?.success ? (recentPaymentsRes?.data?.data || []) : [],
        suppliesExpenses: suppliesExpensesRes?.data?.success ? (suppliesExpensesRes?.data?.data || null) : null
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError(error.response?.data?.message || error.message || 'Failed to load dashboard data. Please check if XAMPP is running.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-700">{error}</p>
        <button
          onClick={fetchDashboardData}
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
          <h1 className="text-3xl font-bold text-gray-900">Sales Analytics Dashboard</h1>
          <p className="text-gray-600 mt-2">Monitor your clinic's financial performance</p>
        </div>
        <button
          onClick={fetchDashboardData}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          <span>{loading ? 'Refreshing...' : 'Refresh'}</span>
        </button>
      </div>

      {/* Sales Metrics */}
      <SalesMetrics data={dashboardData.salesMetrics} />

      {/* Doctor Performance Section */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-900">Doctor Performance Overview</h2>
          <p className="text-sm text-gray-600">Click on a doctor card to view detailed performance metrics, statistics, and revenue trends</p>
        </div>
        <DoctorCards data={dashboardData.doctorStatistics} />
      </div>

      {/* Charts Grid - First Row - Adjusted sizes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Sales Trend */}
        <div className="lg:col-span-1 bg-white rounded-lg shadow-md border border-gray-200 p-4">
          <SalesTrend data={dashboardData.salesTrend} />
        </div>

        {/* Products Revenue */}
        <div className="lg:col-span-1 bg-white rounded-lg shadow-md border border-gray-200 p-4">
          <ProductsRevenue data={dashboardData.productsRevenue} />
        </div>

        {/* Doctor Statistics - Patient Load and Revenue */}
        <div className="lg:col-span-1 bg-white rounded-lg shadow-md border border-gray-200 p-4">
          <DoctorStatistics data={dashboardData.doctorStatistics} />
        </div>
      </div>

      {/* Doctor Surgery Fees - Full Width */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4">
        <DoctorSurgeryFees data={dashboardData.doctorSurgeryFees} />
      </div>

      {/* Supplies Expenses Analytics - Full Width */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4">
        <SuppliesExpenses data={dashboardData.suppliesExpenses} />
      </div>

      {/* Inventory and Recent Payments - Side by Side - Adjusted sizes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4">
          <InventoryCost data={dashboardData.inventoryCost} />
        </div>

        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4">
          <RecentPayments data={dashboardData.recentPayments} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
