import React, { useEffect, useState } from "react";
import EmployeeNavbar from "../components/Sections/EmployeeNavbar";
import useGetEmployeeAnalytics from "../api/useGetEmployeeAnalytics";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

export default function EmployeeAnalytics({ employee }) {
  const { getEmployeeAnalytics } = useGetEmployeeAnalytics();

  const [attendanceAnalytics, setAttendanceAnalytics] = useState({});
  const [analyticsTrend, setAnalyticsTrend] = useState([]);
  const [punctualityImprovementRate, setPunctualityImprovementRate] = useState(
    {}
  );
  const [totalRewards, setTotalRewards] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployeeAnalytics = async () => {
      try {
        const response = await getEmployeeAnalytics(employee?.employee_id || 1);

        if (!response.success) {
          alert(response.message);
          setLoading(false);
          return;
        }

        const firstResponse = response.data[0];
        const secondResponse = response.data[1];

        const formattedAttendance = {
          present: +firstResponse.present_percentage,
          late: +firstResponse.late_percentage,
          absent: +firstResponse.absent_percentage,
        };

        const formattedTrends = secondResponse.map((value) => ({
          month: value.month_name.substring(0, 3),
          fullMonth: value.month_name,
          value: +value.punctuality_rate,
        }));

        setAttendanceAnalytics(formattedAttendance);
        setAnalyticsTrend(formattedTrends);
        setPunctualityImprovementRate({
          improvementRate:
            secondResponse[formattedTrends.length - 1]
              ?.punctuality_improvement_percentage || 0,
          status:
            secondResponse[formattedTrends.length - 1]?.trend_status ||
            "No Change",
        });
        console.log(response.data[2]);
        setTotalRewards(response.data[2].total_rewards);
      } catch (error) {
        console.error("Error fetching analytics:", error);
        alert("Failed to fetch analytics data");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeAnalytics();
  }, [employee]);

  const [rewardsData] = useState({
    totalEarned: 3,
    targetMonth: "November",
  });

  // Prepare data for pie chart
  const attendanceChartData = [
    {
      name: "Present",
      value: attendanceAnalytics.present || 0,
      color: "#6B7280",
    },
    {
      name: "Absent",
      value: attendanceAnalytics.absent || 0,
      color: "#EF4444",
    },
    { name: "Late", value: attendanceAnalytics.late || 0, color: "#F59E0B" },
  ];

  const presentPercentage = attendanceAnalytics.present || 0;

  // Navigation handler
  const handleNavigation = (navName) => {
    console.log("Navigate to:", navName);
  };

  // Custom tooltip for Trends
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm font-semibold text-gray-900">
            {payload[0].payload.fullMonth}
          </p>
          <p className="text-sm text-blue-600">
            Punctuality:{" "}
            <span className="font-bold">{payload[0].value.toFixed(1)}%</span>
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom label for pie chart center
  const renderCustomLabel = ({ cx, cy }) => {
    return (
      <text
        x={cx}
        y={cy}
        textAnchor="middle"
        dominantBaseline="middle"
        className="font-black text-3xl"
        fill="#111827"
      >
        {presentPercentage.toFixed(0)}%
      </text>
    );
  };

  // Custom legend
  const renderLegend = () => {
    return (
      <div className="space-y-2">
        {attendanceChartData.map((entry, index) => (
          <div key={index} className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: entry.color }}
              ></div>
              <span className="text-sm font-semibold text-gray-700">
                {entry.name}
              </span>
            </div>
            <span className="text-sm font-bold text-gray-900">
              {entry.value.toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <>
        <EmployeeNavbar employee={employee} onNavigate={handleNavigation} />
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <p className="text-gray-600">Loading analytics...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <EmployeeNavbar employee={employee} onNavigate={handleNavigation} />

      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 mb-6">
            PERFORMANCE ANALYTICS
          </h1>

          <div className="bg-gradient-to-br from-blue-200 via-blue-100 to-blue-50 rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Attendance Analytics */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-lg sm:text-xl font-black text-gray-900 mb-6">
                  Attendance Analytics
                </h2>

                <div className="flex flex-col sm:flex-row items-center gap-6">
                  {/* Pie Chart */}
                  <div className="w-48 h-48 flex-shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={attendanceChartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={2}
                          dataKey="value"
                          label={renderCustomLabel}
                          labelLine={false}
                        >
                          {attendanceChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Legend and Description */}
                  <div className="flex-1">
                    {renderLegend()}
                    <p className="text-sm text-gray-600 leading-relaxed mt-4">
                      You're{" "}
                      <span className="font-bold">
                        {presentPercentage.toFixed(0)}% toward Perfect
                        Attendance
                      </span>{" "}
                      this month
                    </p>
                  </div>
                </div>
              </div>

              {/* Trends Chart with Recharts */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-lg sm:text-xl font-black text-gray-900 mb-6">
                  Trends
                </h2>

                {analyticsTrend.length > 0 ? (
                  <>
                    <ResponsiveContainer width="100%" height={220}>
                      <LineChart
                        data={analyticsTrend}
                        margin={{ top: 5, right: 5, left: -20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis
                          dataKey="month"
                          tick={{ fontSize: 12, fill: "#6B7280" }}
                          stroke="#9CA3AF"
                        />
                        <YAxis
                          tick={{ fontSize: 12, fill: "#6B7280" }}
                          stroke="#9CA3AF"
                          domain={["dataMin - 5", "dataMax + 5"]}
                          tickFormatter={(value) => `${value.toFixed(0)}%`}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke="#3B82F6"
                          strokeWidth={3}
                          dot={{ fill: "#3B82F6", r: 5 }}
                          activeDot={{ r: 7 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>

                    <p className="text-sm text-gray-600 mt-4">
                      You{" "}
                      {punctualityImprovementRate?.status === "Improved"
                        ? "improved"
                        : "declined"}{" "}
                      punctuality by{" "}
                      <span className="font-bold text-gray-900">
                        {Math.abs(
                          punctualityImprovementRate?.improvementRate || 0
                        ).toFixed(1)}
                        %
                      </span>{" "}
                      compared to last month
                    </p>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-48">
                    <p className="text-gray-400">No trend data available</p>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Section - Rewards */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-lg sm:text-xl font-black text-gray-900 mb-4">
                Rewards and Achievements
              </h2>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-gray-700 mb-2">
                    <span className="font-bold">
                      Total Rewards Earned This Year:
                    </span>{" "}
                    <span className="text-lg font-black text-gray-900">
                      {totalRewards} awards
                    </span>
                  </p>
                </div>

                <div className="text-sm text-gray-600 sm:text-right">
                  <p>
                    Maintain <span className="font-bold">100% attendance</span>{" "}
                    this{" "}
                    <span className="font-bold">{rewardsData.targetMonth}</span>{" "}
                    to earn a{" "}
                    <span className="font-bold">Perfect Attendance Badge!</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
