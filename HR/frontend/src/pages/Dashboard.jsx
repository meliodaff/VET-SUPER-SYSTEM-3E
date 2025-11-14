import {
  BarChart3,
  TrendingUp,
  Users,
  Calendar,
  Gift,
  Clock,
  FileText,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../components/layouts/DashboardLayout";
import useGetAdminAnalytics from "../api/useGetAdminAnalytics";

export default function Dashboard() {
  const [statsData, setStatsData] = useState(null);
  const { getAdminAnalytics } = useGetAdminAnalytics();

  useEffect(() => {
    const fetchAnalytics = async () => {
      const response = await getAdminAnalytics();
      if (!response.success) {
        alert(response.message);
        return;
      }
      const record = response.data;

      const formattedData = {
        overallAttendance:
          record.attendance?.overall_attendance_percentage ?? 0,
        avgPerformance: record.performance?.average_performance ?? 0,
        totalIncentives:
          record.totalIncentivesGivenByMonth?.total_incentives_value ?? 0,
      };

      setStatsData(formattedData);
    };
    fetchAnalytics();
  }, []);

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Welcome to Dashboard
            </h1>
            <p className="text-gray-600">
              Overview of your HR system performance
            </p>
          </div>

          {/* Key Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-400 to-blue-500 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-3xl sm:text-4xl font-bold">
                    {statsData?.overallAttendance}%
                  </div>
                  <div className="text-blue-100 text-sm mt-1">
                    Overall Attendance
                  </div>
                </div>
                <Users className="w-12 h-12 text-blue-200 opacity-50" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-400 to-green-500 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-3xl sm:text-4xl font-bold">
                    {statsData?.avgPerformance}
                  </div>
                  <div className="text-green-100 text-sm mt-1">
                    Average Performance
                  </div>
                </div>
                <TrendingUp className="w-12 h-12 text-green-200 opacity-50" />
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 sm:col-span-2 lg:col-span-1 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-gray-400 text-2xl font-semibold">
                      ₱
                    </span>
                    <div className="text-2xl sm:text-3xl font-bold text-gray-900">
                      {statsData?.totalIncentives.toLocaleString()}
                    </div>
                  </div>
                  <div className="text-gray-500 text-sm">
                    Total Incentives Given
                  </div>
                </div>
                <BarChart3 className="w-12 h-12 text-gray-300 opacity-50" />
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Link
              to="/admin-analytics"
              className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl hover:border-blue-300 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="bg-blue-100 p-3 rounded-lg group-hover:bg-blue-200 transition-colors">
                  <BarChart3 className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">
                    View Full Analytics
                  </h3>
                  <p className="text-sm text-gray-600">
                    Detailed charts and trends
                  </p>
                </div>
              </div>
            </Link>

            <Link
              to="/employees"
              className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl hover:border-green-300 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="bg-green-100 p-3 rounded-lg group-hover:bg-green-200 transition-colors">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">
                    Manage Employees
                  </h3>
                  <p className="text-sm text-gray-600">
                    View and manage all employees
                  </p>
                </div>
              </div>
            </Link>

            <Link
              to="/admin-schedule"
              className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl hover:border-purple-300 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="bg-purple-100 p-3 rounded-lg group-hover:bg-purple-200 transition-colors">
                  <Calendar className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">
                    Schedule Management
                  </h3>
                  <p className="text-sm text-gray-600">Manage work schedules</p>
                </div>
              </div>
            </Link>

            <Link
              to="/admin-incentives"
              className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl hover:border-yellow-300 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="bg-yellow-100 p-3 rounded-lg group-hover:bg-yellow-200 transition-colors">
                  <Gift className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Incentives</h3>
                  <p className="text-sm text-gray-600">
                    Manage employee incentives
                  </p>
                </div>
              </div>
            </Link>

            <Link
              to="/applicant"
              className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl hover:border-red-300 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="bg-red-100 p-3 rounded-lg group-hover:bg-red-200 transition-colors">
                  <FileText className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Applicants</h3>
                  <p className="text-sm text-gray-600">
                    Review job applications
                  </p>
                </div>
              </div>
            </Link>

            <Link
              to="/admin-leave-requests"
              className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl hover:border-orange-300 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="bg-orange-100 p-3 rounded-lg group-hover:bg-orange-200 transition-colors">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">
                    Leave Requests
                  </h3>
                  <p className="text-sm text-gray-600">
                    Manage employee leaves
                  </p>
                </div>
              </div>
            </Link>
          </div>

          {/* Quick Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900">System Status</h3>
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-sm">Analytics</span>
                  <span className="inline-block bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-semibold">
                    Active
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-sm">
                    Employee Database
                  </span>
                  <span className="inline-block bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-semibold">
                    Active
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-sm">
                    Scheduling System
                  </span>
                  <span className="inline-block bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-semibold">
                    Active
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900">Quick Actions</h3>
                <AlertCircle className="w-5 h-5 text-blue-500" />
              </div>
              <div className="space-y-2">
                <button className="w-full text-left px-3 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors text-blue-700 text-sm font-medium">
                  ▸ Generate Attendance Report
                </button>
                <button className="w-full text-left px-3 py-2 rounded-lg bg-green-50 hover:bg-green-100 transition-colors text-green-700 text-sm font-medium">
                  ▸ Export Employee Data
                </button>
                <button className="w-full text-left px-3 py-2 rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors text-purple-700 text-sm font-medium">
                  ▸ View Performance Reports
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
