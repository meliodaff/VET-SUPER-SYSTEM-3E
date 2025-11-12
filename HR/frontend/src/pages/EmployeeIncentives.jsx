import React, { useState, useMemo, useEffect } from "react";
import EmployeeNavbar from "../components/Sections/EmployeeNavbar";
import { Search, Award, Star, Heart } from "lucide-react";
import useGetIncentive from "../api/useGetIncentive";
import useGetAttendancePercentage from "../api/useGetAttendancePercentage";

export default function EmployeeIncentives({ employee }) {
  const [activeTab, setActiveTab] = useState("incentives");
  const [searchQuery, setSearchQuery] = useState("");
  const [rewardsData, setRewardsData] = useState([]);
  const [achievementsCount, setAchievementsCount] = useState([]);
  const [attendancePercentage, setAttendancePercentage] = useState("");
  const [employeeInformation, setEmployeeInformation] = useState({});
  const [employeeName, setEmployeeName] = useState(null);
  const {
    getIncentives,
    loadingForGetIncentives,
    getIncentive,
    loadingForGetIncentive,
  } = useGetIncentive();

  const { getAttendancePercentage, loadingForGetAttendancePercetage } =
    useGetAttendancePercentage();

  useEffect(() => {
    const useGetAttendancePercentageFunc = async () => {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, "0");

      const data = {
        id: 2,
        date: `${year}-${month}-01`,
        year: year,
        month: parseInt(month),
      };

      const response = await getAttendancePercentage(data);
      console.log(response);
      setEmployeeInformation(() => {
        return {
          name: response.data.name,
        };
      });
      setAttendancePercentage(response.data);
    };

    useGetAttendancePercentageFunc();
  }, []);

  useEffect(() => {
    const useGetIncentivesFunc = async () => {
      const response = await getIncentive(2);
      console.log(response);
      if (!response.success) {
        alert(response.message);
        return;
      }

      const formattedRewards = response.data.map((data) => ({
        date: new Date(data.award_date).toLocaleDateString("en-PH", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        reward: data.incentive_name,
        remarksBonus: data.bonus,
        status: data.is_claimed ? "claim" : "claimed",
      }));

      const formattedAchievements = response.data.map((data) => {
        const awardDate = new Date(data.award_date);
        const previousMonthDate = new Date(
          awardDate.getFullYear(),
          awardDate.getMonth() - 1,
          1
        );

        return {
          achievementId: data.incentive_id,
          achievementName: data.incentive_name,
          awardDate: previousMonthDate.toLocaleDateString("en-PH", {
            year: "numeric",
            month: "long",
          }),
        };
      });
      console.log(formattedAchievements);
      setAchievementsCount(formattedAchievements);
      setRewardsData(formattedRewards);
    };

    useGetIncentivesFunc();
  }, []);

  // Achievements count
  // const achievementsCount = {
  //   employeeOfMonth: "August 2025",
  //   perfectAttendance: "July 2025",
  //   outstandingCare: "June 2025",
  // };

  // Sample rewards data
  // const rewardsData = [
  //   {
  //     date: 'August 2025',
  //     reward: 'Perfect Attendance',
  //     remarksBonus: 'GiftCard',
  //     status: 'claim'
  //   },
  //   {
  //     date: 'August 2025',
  //     reward: 'Employee of the Month',
  //     remarksBonus: '₱500 Bonus',
  //     status: 'pending'
  //   },
  //   {
  //     date: 'August 2025',
  //     reward: 'Outstanding Employee of the month',
  //     remarksBonus: 'GiftCard',
  //     status: 'claimed'
  //   },
  //   {
  //     date: 'August 2025',
  //     reward: 'Best Team Player',
  //     remarksBonus: 'Clinic Voucher',
  //     status: 'claimed'
  //   }
  // ];

  // Sample benefits data
  const benefitsData = [
    {
      name: "SSS",
      monthly: "₱ 300",
      totalContribution: "₱ 2000.00",
      lastUpdate: "September 30, 2025",
    },
    {
      name: "PhilHealth",
      monthly: "₱ 300",
      totalContribution: "₱ 2000.00",
      lastUpdate: "September 28, 2025",
    },
    {
      name: "Pag-ibig",
      monthly: "₱ 300",
      totalContribution: "₱ 2000.00",
      lastUpdate: "September 30, 2025",
    },
  ];

  const handleNavigation = (navName) => {
    console.log("Navigate to:", navName);
  };

  // Filter rewards based on search
  const filteredRewards = useMemo(() => {
    return rewardsData.filter((reward) => {
      const query = searchQuery.toLowerCase();
      return (
        reward.reward.toLowerCase().includes(query) ||
        reward.remarksBonus.toLowerCase().includes(query) ||
        reward.status.toLowerCase().includes(query)
      );
    });
  }, [searchQuery, rewardsData]);

  // Filter benefits based on search
  const filteredBenefits = useMemo(() => {
    return benefitsData.filter((benefit) => {
      const query = searchQuery.toLowerCase();
      return benefit.name.toLowerCase().includes(query);
    });
  }, [searchQuery]);

  const getStatusColor = (status) => {
    switch (status) {
      case "claim":
        return "bg-blue-500 text-white";
      case "pending":
        return "bg-yellow-500 text-white";
      case "claimed":
        return "bg-gray-400 text-white";
      default:
        return "bg-gray-300 text-gray-700";
    }
  };

  return (
    <>
      <EmployeeNavbar employee={employee} onNavigate={handleNavigation} />

      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Tab Navigation */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setActiveTab("incentives")}
              className={`px-6 py-3 rounded-lg font-bold text-sm transition-all ${
                activeTab === "incentives"
                  ? "bg-blue-400 text-white shadow-md"
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-300"
              }`}
            >
              MY INCENTIVES
            </button>
            <button
              onClick={() => setActiveTab("benefits")}
              className={`px-6 py-3 rounded-lg font-bold text-sm transition-all ${
                activeTab === "benefits"
                  ? "bg-blue-400 text-white shadow-md"
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-300"
              }`}
            >
              Benefits
            </button>
          </div>

          {/* MY INCENTIVES Tab */}
          {activeTab === "incentives" && (
            <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl shadow-lg p-6">
              {/* Header Section */}
              <div className="bg-white rounded-xl p-6 mb-6 shadow-md">
                <h2 className="text-xl font-black text-gray-900 mb-2">
                  Hi! Doc. {employeeInformation?.name || "Sphene"}
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                  here are your rewards
                </p>

                {/* Rewards Summary */}
                <div className="bg-blue-50 rounded-lg p-4 mb-6">
                  <p className="text-sm text-gray-700">
                    You're{" "}
                    <span className="font-bold">
                      {attendancePercentage.days_attended_percentage}%
                    </span>{" "}
                    {+attendancePercentage.days_attended_percentage >= 100
                      ? "perfect attendance this month"
                      : "towards perfect attendance this month"}
                  </p>
                </div>

                {/* Achievement Badges */}
                <div className="grid grid-cols-3 gap-4">
                  {achievementsCount.length > 0
                    ? achievementsCount.map((data, index) => (
                        <div className="text-center" key={index}>
                          <div className="w-16 h-16 mx-auto mb-2 bg-yellow-100 rounded-full flex items-center justify-center">
                            {data.achievementId === 1 ? (
                              <Award className="w-10 h-10 text-yellow-500" />
                            ) : data.achievementId === 2 ? (
                              <Award className="w-10 h-10 text-green-500" />
                            ) : data.achievementId === 3 ? (
                              <Star className="w-10 h-10 text-orange-500" />
                            ) : null}
                          </div>
                          <h4 className="font-bold text-sm text-gray-900">
                            {data.achievementName}
                          </h4>
                          <p className="text-xs text-gray-500 mt-1">
                            {data.awardDate}
                          </p>
                        </div>
                      ))
                    : "No Rewards Found"}
                  {/* <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-2 bg-yellow-100 rounded-full flex items-center justify-center">
                      <Award className="w-10 h-10 text-yellow-500" />
                    </div>
                    <h4 className="font-bold text-sm text-gray-900">
                      Employee
                    </h4>
                    <p className="text-xs text-gray-600">of the month</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {achievementsCount.employeeOfMonth}
                    </p>
                  </div> */}

                  {/* <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-2 bg-green-100 rounded-full flex items-center justify-center">
                      <Award className="w-10 h-10 text-green-500" />
                    </div>
                    <h4 className="font-bold text-sm text-gray-900">Perfect</h4>
                    <p className="text-xs text-gray-600">Attendance</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {achievementsCount.perfectAttendance}
                    </p>
                  </div> */}

                  {/* <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-2 bg-orange-100 rounded-full flex items-center justify-center">
                      <Star className="w-10 h-10 text-orange-500" />
                    </div>
                    <h4 className="font-bold text-sm text-gray-900">
                      Outstanding
                    </h4>
                    <p className="text-xs text-gray-600">Care Award</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {achievementsCount.outstandingCare}
                    </p>
                  </div> */}
                </div>
              </div>

              {/* Rewards Table */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-black text-gray-900">Reward</h3>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-black text-gray-900 uppercase">
                          Date
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-black text-gray-900 uppercase">
                          Reward
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-black text-gray-900 uppercase">
                          Remarks/Bonus
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-black text-gray-900 uppercase">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredRewards.length > 0 ? (
                        filteredRewards.map((reward, index) => (
                          <tr
                            key={index}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <td className="px-4 py-3 text-sm text-gray-900">
                              {reward.date}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900">
                              {reward.reward}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900">
                              {reward.remarksBonus}
                            </td>
                            <td className="px-4 py-3">
                              <span
                                className={`px-4 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                                  reward.status
                                )}`}
                              >
                                {reward.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="4"
                            className="px-4 py-8 text-center text-gray-500"
                          >
                            No rewards found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* MY BENEFITS Tab */}
          {activeTab === "benefits" && (
            <div className="space-y-6">
              {/* Search Bar */}
              <div className="bg-white rounded-xl shadow-sm p-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search benefits..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Benefits Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBenefits.length > 0 ? (
                  filteredBenefits.map((benefit, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl shadow-md p-6"
                    >
                      <h3 className="text-2xl font-black text-gray-900 mb-4">
                        {benefit.name}
                      </h3>

                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-700">Monthly:</span>
                          <span className="font-bold text-gray-900">
                            {benefit.monthly}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-700">
                            Total Contribution:
                          </span>
                          <span className="font-bold text-gray-900">
                            {benefit.totalContribution}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-gray-600 mb-4">
                        Last update: {benefit.lastUpdate}
                      </p>

                      <button className="w-full py-2 bg-white text-gray-900 font-semibold text-sm rounded-lg hover:bg-gray-100 transition-colors">
                        View Details
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12 text-gray-500">
                    No benefits found
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
