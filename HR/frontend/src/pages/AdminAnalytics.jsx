import { Users, TrendingUp } from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useState, useEffect } from "react";
import DashboardLayout from "../components/layouts/DashboardLayout";
import useGetAdminAnalytics from "../api/useGetAdminAnalytics";
export default function AdminAnalytics() {
  // Sample data
  // const statsData = {
  //   overallAttendance: 90.64,
  //   avgPerformance: 9.3,
  //   totalIncentives: 67750,
  // };

  const [statsData, setStatsData] = useState(null);

  const { getAdminAnalytics } = useGetAdminAnalytics();

  const [attendanceBreakdown, setAttendanceBreakdown] = useState([]);
  const [attendanceTrends, setAttendanceTrends] = useState([]);
  const [performanceData, setPerformanceData] = useState([]);
  const [avgHoursWorked, setAvgHoursWorked] = useState(null);
  const schedulingData = {
    mostCommonHours: 30,
    month: "Aug",
  };

  useEffect(() => {
    const useGetAdminAnalyticsFunc = async () => {
      const response = await getAdminAnalytics();
      if (!response.success) {
        alert(response.message);
        return;
      }
      const record = response.data;
      console.log(record);

      const formattedData = {
        overallAttendance:
          record.attendance?.overall_attendance_percentage ?? 0,
        avgPerformance: record.performance?.average_performance ?? 0,
        totalIncentives:
          record.totalIncentivesGivenByMonth?.total_incentives_value ?? 0,
      };

      const present_count = +record.attendance.present_count;
      const absent_count = +record.attendance.absent_count;
      const late_count = +record.attendance.late_count;
      const totalRecords = present_count + absent_count + late_count;

      console.log(attendanceBreakdown);
      const formattedAttendanceBreakdown = [
        {
          name: "Present",
          value: Math.round((present_count / totalRecords) * 100),
          color: "#60a5fa",
        },
        {
          name: "Absent",
          value: Math.round((absent_count / totalRecords) * 100),
          color: "#f87171",
        },
        {
          name: "Late",
          value: Math.round((late_count / totalRecords) * 100),
          color: "#fb923c",
        },
      ];

      const performanceData = record.employeePerformanceComparison;

      const formattedPerformanceData = performanceData.map((data) => ({
        month: data.month_name.split(" ")[0],
        value: data.avg_review_score,
      }));

      const attendanceTrends = record.attendanceTrends;

      const formattedAttendanceTrends = attendanceTrends.map((data) => ({
        month: data.month_name.split(" ")[0],
        value: data.attendance_rate,
      }));

      const avgHoursWorked = record.highestHoursWorked.avg_hours_worked;

      console.log(avgHoursWorked);
      const monthName = new Date().toLocaleString("en-PH", { month: "long" });
      const formattedAvgHoursWorked = {
        mostCommonHours: avgHoursWorked,
        month: monthName,
      };

      console.log(formattedAvgHoursWorked);
      setStatsData(formattedData);
      setAttendanceBreakdown(formattedAttendanceBreakdown);
      console.log(formattedAttendanceBreakdown);
      setPerformanceData(formattedPerformanceData);
      setAttendanceTrends(formattedAttendanceTrends);
      setAvgHoursWorked(formattedAvgHoursWorked);
      // setClaimRequests(formattedData);
    };
    useGetAdminAnalyticsFunc();
  }, []);

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">
            ANALYTICS
          </h1>

          {/* Top Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="bg-gradient-to-br from-blue-400 to-blue-500 rounded-xl p-6 text-white shadow-lg">
              <div className="text-4xl sm:text-5xl font-bold mb-1">
                {statsData?.overallAttendance}%
              </div>
              <div className="text-blue-100 text-sm">Overall Attendance</div>
            </div>

            <div className="bg-gradient-to-br from-blue-400 to-blue-500 rounded-xl p-6 text-white shadow-lg">
              <div className="text-4xl sm:text-5xl font-bold mb-1">
                {statsData?.avgPerformance}
              </div>
              <div className="text-blue-100 text-sm">Average Performance</div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-3 mb-1">
                <span className="text-gray-400 text-2xl font-semibold">₱</span>
                <div className="text-3xl sm:text-4xl font-bold text-gray-900">
                  {statsData?.totalIncentives.toLocaleString()}
                </div>
              </div>
              <div className="text-gray-500 text-sm">
                Total Incentives Given
              </div>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Overall Attendance Pie Chart */}
            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg border border-gray-200">
              <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-4 sm:mb-6">
                Overall Attendance
              </h2>
              <div className="relative">
                <ResponsiveContainer width="100%" height={240}>
                  <PieChart>
                    <Pie
                      data={attendanceBreakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      dataKey="value"
                    >
                      {attendanceBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}%`} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap gap-3 justify-center mt-4">
                  {attendanceBreakdown.map((item) => (
                    <div key={item.name} className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <span className="text-xs sm:text-sm text-gray-700">
                        {item.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Employee Performance Bar Chart */}
            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg border border-gray-200">
              <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-4 sm:mb-6">
                Employee Performance Comparison
              </h2>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#60a5fa" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Attendance Trends Line Chart */}
            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg border border-gray-200">
              <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-4 sm:mb-6">
                Attendance Trends
              </h2>
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={attendanceTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} domain={[0, 100]} />
                  <Tooltip formatter={(value) => `${value}%`} />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#60a5fa"
                    strokeWidth={2}
                    dot={{ fill: "#60a5fa", r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Scheduling Analysis */}
            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg border border-gray-200">
              <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-4 sm:mb-6">
                Scheduling Analysis
              </h2>
              <div className="flex items-center justify-center h-60">
                <div className="text-center">
                  <p className="text-gray-700 text-sm sm:text-base">
                    Most employee worked{" "}
                    <span className="font-bold text-2xl sm:text-3xl text-blue-500 block my-2">
                      {avgHoursWorked?.mostCommonHours} hours
                    </span>{" "}
                    per week in {avgHoursWorked?.month}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
