import React, { useEffect, useState } from "react";
import DashboardLayout from "../components/layouts/DashboardLayout";
import useGetIncentive from "../api/useGetIncentive";
import useGetAttendanceRecord from "../api/useGetAttendanceRecord";
import { MoreVertical, ChevronLeft, ChevronRight } from "lucide-react";

export default function AdminIncentives() {
  const [activeTab, setActiveTab] = useState("request");
  const [activeMenu, setActiveMenu] = useState(null);
  const { getIncentives, getAllIncentivesForTheMonth, getTopPerformer } =
    useGetIncentive();
  const { getOverAllAttendancePerMonth } = useGetAttendanceRecord();

  const [claimRequests, setClaimRequests] = useState([]);

  const [claimHistory, setClaimHistory] = useState([]);
  const [overAllAttendance, setOverAllAttendance] = useState(null);
  const [pendingRequestCount, setPendingRequestCount] = useState(0);
  const [allIncentivesForTheMonth, setAllIncentivesForTheMonth] =
    useState(false);

  useEffect(() => {
    const useGetClaimedIncentivesFunc = async (isClaim) => {
      const response = await getIncentives(isClaim);
      console.log(response.data);
      if (!response.success) {
        alert(response.message);
        return;
      }

      const formattedData = response.data.map((value) => ({
        name: value.name,
        reward: value.incentive_name,
        dateAwarded: value.award_date,
        awardBonus: value.bonus,
        dateClaimed: value.claimed_date,
        status: value.status,
      }));
      console.log(formattedData);

      setClaimHistory(formattedData);
    };
    useGetClaimedIncentivesFunc(1);
  }, []);

  useEffect(() => {
    const useGetUnClaimedIncentivesFunc = async (isClaim) => {
      const response = await getIncentives(isClaim);
      console.log(response.data);
      if (!response.success) {
        alert(response.message);
        return;
      }

      const formattedData = response.data.map((value) => ({
        name: value.name,
        reward: value.incentive_name,
        dateAwarded: value.award_date,
        awardBonus: value.bonus,
        status: value.status,
      }));

      setClaimRequests(formattedData);
      setPendingRequestCount(formattedData.length);
    };
    useGetUnClaimedIncentivesFunc(0);
  }, []);

  useEffect(() => {
    const useGetOverAllAttendancePerMonth = async () => {
      const response = await getOverAllAttendancePerMonth();
      console.log(response.data);
      if (!response.success) {
        alert(response.message);
        return;
      }

      // setClaimRequests(formattedData);
      setOverAllAttendance(response.data.overall_attendance_percentage);
    };
    useGetOverAllAttendancePerMonth();
  }, []);

  useEffect(() => {
    const useGetAllIncentivesForTheMonthFunc = async () => {
      const response = await getAllIncentivesForTheMonth();
      console.log(response);

      if (!response.success) {
        alert(response.message);
        return;
      }

      const formattedData = response.data.map((record) => {
        const previousDate = new Date(record.award_date);
        previousDate.setMonth(previousDate.getMonth() - 1);
        return {
          awardName: record.incentive_name,
          awardDate:
            record.incentive_id === 1
              ? previousDate.toLocaleDateString("en-PH", {
                  year: "numeric",
                  month: "long",
                })
              : new Date(record.award_date).toLocaleDateString("en-PH", {
                  year: "numeric",
                  month: "long",
                }),
          notes: record.notes,
          photo: record.profile_image_url,
        };
      });
      console.log(formattedData);
      setAllIncentivesForTheMonth(formattedData);
    };
    useGetAllIncentivesForTheMonthFunc();
  }, []);

  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const useGetTopPerformerFunc = async () => {
      const response = await getTopPerformer();
      console.log(response.data);

      if (!response.success) {
        alert(response.message);
        return;
      }

      const formattedData = response.data.map((data) => ({
        name: data.first_name + " " + data.last_name,
        averageReviewScore: data.avg_review_score || " - ",
        totalHours: data.total_hours,
        performanceScore: data.performance_score,
      }));

      setLeaderboard(formattedData);
    };
    useGetTopPerformerFunc();
  }, []);

  // const leaderboard = [
  //   { date: "1", name: "NAME", reward: "REWARD EARNED" },
  //   { date: "2", name: "NAME", reward: "REWARD EARNED" },
  //   { date: "3", name: "NAME", reward: "REWARD EARNED" },
  //   { date: "4", name: "NAME", reward: "REWARD EARNED" },
  //   { date: "5", name: "NAME", reward: "REWARD EARNED" },
  // ];

  const menuOptions = ["Pending Approval", "Approved", "Rejected"];

  const toggleMenu = (index) => {
    setActiveMenu(activeMenu === index ? null : index);
  };

  const handleStatusChange = (status, index) => {
    const updatedRequests = [...claimRequests];
    updatedRequests[index].status = status;
    setClaimRequests(updatedRequests);
    setActiveMenu(null);
    console.log(
      `Status changed to: ${status} for ${updatedRequests[index].name}`
    );
  };

  //status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
      case "Pending Approval":
        return "bg-yellow-100 text-yellow-800";
      case "Approved":
        return "bg-green-100 text-green-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      case "Claimed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Add these state variables at the top of your component
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Add pagination calculations (put this before the return statement)
  const totalPages = Math.ceil(claimRequests.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentClaimRequests = claimRequests.slice(startIndex, endIndex);

  // Reset to page 1 when filters change (if you have any filters)
  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage]);

  // Pagination handlers
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  // Pagination states for "history" tab
  const [currentPageHistory, setCurrentPageHistory] = useState(1);
  const [itemsPerPageHistory, setItemsPerPageHistory] = useState(10);

  // Pagination for history tab
  const totalPagesHistory = Math.ceil(
    claimHistory.length / itemsPerPageHistory
  );
  const startIndexHistory = (currentPageHistory - 1) * itemsPerPageHistory;
  const endIndexHistory = startIndexHistory + itemsPerPageHistory;
  const currentClaimHistory = claimHistory.slice(
    startIndexHistory,
    endIndexHistory
  );

  // Reset to page 1 when items per page changes for history
  useEffect(() => {
    setCurrentPageHistory(1);
  }, [itemsPerPageHistory]);

  // Pagination handlers for history tab
  const goToPageHistory = (page) => {
    if (page >= 1 && page <= totalPagesHistory) {
      setCurrentPageHistory(page);
    }
  };

  const goToPreviousPageHistory = () => {
    if (currentPageHistory > 1) {
      setCurrentPageHistory(currentPageHistory - 1);
    }
  };

  const goToNextPageHistory = () => {
    if (currentPageHistory < totalPagesHistory) {
      setCurrentPageHistory(currentPageHistory + 1);
    }
  };

  // Generate page numbers for history tab
  const getPageNumbersHistory = () => {
    const pages = [];
    const maxPagesToShow = 5;

    if (totalPagesHistory <= maxPagesToShow) {
      for (let i = 1; i <= totalPagesHistory; i++) {
        pages.push(i);
      }
    } else {
      if (currentPageHistory <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPagesHistory);
      } else if (currentPageHistory >= totalPagesHistory - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPagesHistory - 3; i <= totalPagesHistory; i++)
          pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        pages.push(currentPageHistory - 1);
        pages.push(currentPageHistory);
        pages.push(currentPageHistory + 1);
        pages.push("...");
        pages.push(totalPagesHistory);
      }
    }

    return pages;
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-6">
            INCENTIVES
          </h1>

          {/* Stats and Leaderboard */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-xl shadow-md p-6 text-center">
                  <div className="text-4xl sm:text-5xl font-black text-gray-900 mb-2">
                    {overAllAttendance} %
                  </div>
                  <div className="text-sm text-gray-600">
                    Overall Attendance
                  </div>
                </div>
                <div className="bg-white rounded-xl shadow-md p-6 text-center">
                  <div className="text-4xl sm:text-5xl font-black text-gray-900 mb-2">
                    {pendingRequestCount}
                  </div>
                  <div className="text-sm text-gray-600">Pending Request</div>
                </div>
              </div>

              {/* Employee of the Month */}
              {allIncentivesForTheMonth &&
              allIncentivesForTheMonth.length > 1 ? (
                allIncentivesForTheMonth.map((record, index) => (
                  <div
                    className="bg-white rounded-xl shadow-md p-6"
                    key={index}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-100 rounded-xl overflow-hidden flex-shrink-0">
                        <img
                          src={`http://localhost/HR-Information-System/backend/${record.photo}`}
                          alt="Employee of the Month"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-1">
                          {record.awardName} - {record.awardDate}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600">
                          {record.notes}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white rounded-xl shadow-md p-6">
                  <div className="flex items-center gap-4">
                    <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-1">
                      No Incentives for this Month
                    </h3>
                  </div>
                </div>
              )}
            </div>

            {/* Right - Leaderboard */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-lg sm:text-xl font-black text-gray-900 mb-4">
                Leaderboard / Top Performer
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b-2 border-gray-200">
                    <tr>
                      <th className="px-2 sm:px-4 py-2 text-left font-black text-gray-900 uppercase">
                        Name
                      </th>
                      <th className="px-2 sm:px-4 py-2 text-left font-black text-gray-900 uppercase">
                        Avg Review Score
                      </th>
                      <th className="px-2 sm:px-4 py-2 text-left font-black text-gray-900 uppercase">
                        Total Hours
                      </th>
                      <th className="px-2 sm:px-4 py-2 text-left font-black text-gray-900 uppercase">
                        Performance Score
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {leaderboard.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-2 sm:px-4 py-3 text-gray-900">
                          {item.name}
                        </td>
                        <td className="px-2 sm:px-4 py-3 text-gray-900">
                          {item.averageReviewScore}
                        </td>
                        <td className="px-2 sm:px-4 py-3 text-gray-900">
                          {item.totalHours}
                        </td>
                        <td className="px-2 sm:px-4 py-3 text-gray-900">
                          {item.performanceScore}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Tab Buttons */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setActiveTab("request")}
              className={`flex-1 px-6 py-3 rounded-lg font-bold text-sm transition-all ${
                activeTab === "request"
                  ? "bg-blue-400 text-white shadow-md"
                  : "bg-gray-200 text-gray-600 hover:bg-gray-300"
              }`}
            >
              REWARD CLAIM REQUEST
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`flex-1 px-6 py-3 rounded-lg font-bold text-sm transition-all ${
                activeTab === "history"
                  ? "bg-blue-400 text-white shadow-md"
                  : "bg-gray-200 text-gray-600 hover:bg-gray-300"
              }`}
            >
              REWARD CLAIM HISTORY
            </button>
          </div>

          {/* Reward Claim Request Table */}
          {activeTab === "request" && (
            <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl shadow-lg overflow-hidden">
              {/* Items per page selector */}
              <div className="flex justify-end items-center gap-2 px-4 pt-4 pb-2">
                <span className="text-sm text-gray-600">Show:</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  className="border rounded-md p-1 text-sm"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                <span className="text-sm text-gray-600">per page</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-white border-b-2 border-blue-200">
                    <tr>
                      <th className="px-2 sm:px-4 py-3 text-left font-black text-gray-900 uppercase whitespace-nowrap">
                        Employee Name
                      </th>
                      <th className="px-2 sm:px-4 py-3 text-left font-black text-gray-900 uppercase whitespace-nowrap">
                        Reward Awarded
                      </th>
                      <th className="px-2 sm:px-4 py-3 text-left font-black text-gray-900 uppercase whitespace-nowrap">
                        Date Awarded
                      </th>
                      <th className="px-2 sm:px-4 py-3 text-left font-black text-gray-900 uppercase whitespace-nowrap">
                        Award/Bonus
                      </th>
                      <th className="px-2 sm:px-4 py-3 text-left font-black text-gray-900 uppercase whitespace-nowrap">
                        Status
                      </th>
                      <th className="px-2 sm:px-4 py-3 text-left font-black text-gray-900 uppercase whitespace-nowrap">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-blue-100">
                    {currentClaimRequests.length > 0 ? (
                      currentClaimRequests.map((claim, index) => (
                        <tr
                          key={index}
                          className="hover:bg-white/50 transition-colors"
                        >
                          <td className="px-2 sm:px-4 py-3 text-gray-900">
                            {claim.name}
                          </td>
                          <td className="px-2 sm:px-4 py-3 text-gray-900">
                            {claim.reward}
                          </td>
                          <td className="px-2 sm:px-4 py-3 text-gray-900">
                            {claim.dateAwarded}
                          </td>
                          <td className="px-2 sm:px-4 py-3 text-gray-900">
                            {claim.awardBonus}
                          </td>
                          <td className="px-2 sm:px-4 py-3">
                            {claim.status && (
                              <span
                                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                                  claim.status
                                )}`}
                              >
                                {claim.status}
                              </span>
                            )}
                          </td>
                          <td className="px-2 sm:px-4 py-3">
                            <div className="relative">
                              <button
                                onClick={() => toggleMenu(startIndex + index)}
                                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                              >
                                <MoreVertical className="w-5 h-5 text-gray-600" />
                              </button>

                              {activeMenu === startIndex + index && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                                  {menuOptions.map((option, optIndex) => (
                                    <button
                                      key={optIndex}
                                      onClick={() =>
                                        handleStatusChange(
                                          option,
                                          startIndex + index
                                        )
                                      }
                                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                    >
                                      {option}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="6"
                          className="px-4 py-8 text-center text-gray-500"
                        >
                          No claim requests found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              {claimRequests.length > 0 && (
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 px-4 py-4 border-t border-blue-100">
                  {/* Results info */}
                  <div className="text-sm text-gray-600">
                    Showing {startIndex + 1} to{" "}
                    {Math.min(endIndex, claimRequests.length)} of{" "}
                    {claimRequests.length} results
                  </div>

                  {/* Pagination buttons */}
                  <div className="flex items-center gap-2">
                    {/* Previous button */}
                    <button
                      onClick={goToPreviousPage}
                      disabled={currentPage === 1}
                      className={`p-2 rounded-md border transition-colors ${
                        currentPage === 1
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>

                    {/* Page numbers */}
                    <div className="flex gap-1">
                      {getPageNumbers().map((page, index) => (
                        <button
                          key={index}
                          onClick={() =>
                            typeof page === "number" && goToPage(page)
                          }
                          disabled={page === "..."}
                          className={`min-w-[40px] px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                            page === currentPage
                              ? "bg-blue-600 text-white"
                              : page === "..."
                              ? "bg-white text-gray-400 cursor-default"
                              : "bg-white text-gray-700 hover:bg-gray-50 border"
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                    </div>

                    {/* Next button */}
                    <button
                      onClick={goToNextPage}
                      disabled={currentPage === totalPages}
                      className={`p-2 rounded-md border transition-colors ${
                        currentPage === totalPages
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Reward Claim History Table */}
          {/* Reward Claim History Table */}
          {activeTab === "history" && (
            <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl shadow-lg overflow-hidden">
              {/* Items per page selector */}
              <div className="flex justify-end items-center gap-2 px-4 pt-4 pb-2">
                <span className="text-sm text-gray-600">Show:</span>
                <select
                  value={itemsPerPageHistory}
                  onChange={(e) =>
                    setItemsPerPageHistory(Number(e.target.value))
                  }
                  className="border rounded-md p-1 text-sm"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                <span className="text-sm text-gray-600">per page</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-white border-b-2 border-blue-200">
                    <tr>
                      <th className="px-2 sm:px-4 py-3 text-left font-black text-gray-900 uppercase whitespace-nowrap">
                        Employee Name
                      </th>
                      <th className="px-2 sm:px-4 py-3 text-left font-black text-gray-900 uppercase whitespace-nowrap">
                        Reward Awarded
                      </th>
                      <th className="px-2 sm:px-4 py-3 text-left font-black text-gray-900 uppercase whitespace-nowrap">
                        Date Awarded
                      </th>
                      <th className="px-2 sm:px-4 py-3 text-left font-black text-gray-900 uppercase whitespace-nowrap">
                        Award/Bonus
                      </th>
                      <th className="px-2 sm:px-4 py-3 text-left font-black text-gray-900 uppercase whitespace-nowrap">
                        Date Claimed
                      </th>
                      <th className="px-2 sm:px-4 py-3 text-left font-black text-gray-900 uppercase whitespace-nowrap">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-blue-100">
                    {currentClaimHistory.length > 0 ? (
                      currentClaimHistory.map((claim, index) => (
                        <tr
                          key={index}
                          className="hover:bg-white/50 transition-colors"
                        >
                          <td className="px-2 sm:px-4 py-3 text-gray-900">
                            {claim.name}
                          </td>
                          <td className="px-2 sm:px-4 py-3 text-gray-900">
                            {claim.reward}
                          </td>
                          <td className="px-2 sm:px-4 py-3 text-gray-900">
                            {claim.dateAwarded}
                          </td>
                          <td className="px-2 sm:px-4 py-3 text-gray-900">
                            {claim.awardBonus}
                          </td>
                          <td className="px-2 sm:px-4 py-3 text-gray-900">
                            {claim.dateClaimed}
                          </td>
                          <td className="px-2 sm:px-4 py-3">
                            {claim.status && (
                              <span
                                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                                  claim.status
                                )}`}
                              >
                                {claim.status}
                              </span>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="6"
                          className="px-4 py-8 text-center text-gray-500"
                        >
                          No claim history found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              {claimHistory.length > 0 && (
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 px-4 py-4 border-t border-blue-100">
                  {/* Results info */}
                  <div className="text-sm text-gray-600">
                    Showing {startIndexHistory + 1} to{" "}
                    {Math.min(endIndexHistory, claimHistory.length)} of{" "}
                    {claimHistory.length} results
                  </div>

                  {/* Pagination buttons */}
                  <div className="flex items-center gap-2">
                    {/* Previous button */}
                    <button
                      onClick={goToPreviousPageHistory}
                      disabled={currentPageHistory === 1}
                      className={`p-2 rounded-md border transition-colors ${
                        currentPageHistory === 1
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>

                    {/* Page numbers */}
                    <div className="flex gap-1">
                      {getPageNumbersHistory().map((page, index) => (
                        <button
                          key={index}
                          onClick={() =>
                            typeof page === "number" && goToPageHistory(page)
                          }
                          disabled={page === "..."}
                          className={`min-w-[40px] px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                            page === currentPageHistory
                              ? "bg-blue-600 text-white"
                              : page === "..."
                              ? "bg-white text-gray-400 cursor-default"
                              : "bg-white text-gray-700 hover:bg-gray-50 border"
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                    </div>

                    {/* Next button */}
                    <button
                      onClick={goToNextPageHistory}
                      disabled={currentPageHistory === totalPagesHistory}
                      className={`p-2 rounded-md border transition-colors ${
                        currentPageHistory === totalPagesHistory
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
