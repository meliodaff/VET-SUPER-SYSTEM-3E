import React, { useState, useMemo, useEffect } from "react";
import {
  Star,
  Search,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Gift,
  Check,
  Eye,
} from "lucide-react";
import DashboardLayout from "../components/layouts/DashboardLayout";
import usePostIncentiveAward from "../api/usePostIncentiveAward";
import useGetEmployees from "../api/useGetEmployee";
import useGetPerformanceReviews from "../api/useGetPerformanceReviews";
import useGetIncentive from "../api/useGetIncentive";
import useGetIncentiveAwards from "../api/useGetIncentiveAwards";

export default function AdminCreateIncentiveAwards() {
  const [employees, setEmployees] = useState([]);
  const [incentives, setIncentives] = useState([]);
  const [performanceReviews, setPerformanceReviews] = useState([]);
  const [awardHistory, setAwardHistory] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // NEW: View mode state for modal
  const [viewMode, setViewMode] = useState("create"); // "create" or "viewRatings"
  const [receivedRatings, setReceivedRatings] = useState([]);

  const [awardForm, setAwardForm] = useState({
    incentive_id: "",
    bonus: "",
    notes: "",
    performance_review_id: "",
  });

  const { getEmployees } = useGetEmployees();
  const { getIncentiveAwards } = useGetIncentiveAwards();
  // useEffect(() => {
  //   const useGetEmployeesFunc = async () => {
  //     const response = await getEmployees();
  //     console.log(response);
  //     if (!response.success) {
  //       alert(response.message);
  //       return;
  //     }
  //     setEmployees(response.data);
  //   };
  //   useGetEmployeesFunc();
  // }, []);

  const { getPerformanceReviews, loadingForGePerformanceReviews } =
    useGetPerformanceReviews();
  const { getIncentiveItems, loadingForGetIncentiveItems } = useGetIncentive();
  useEffect(() => {
    const useGetPerformanceReviewsFunc = async () => {
      const response = await getPerformanceReviews();
      const responseEmployees = await getEmployees();
      if (!response.success) {
        alert(response.message);
        return;
      }
      console.log(response.data);
      const formattedEmployees = responseEmployees.data.map((data, index) => ({
        employee_id: data.employee_id,
        first_name: data.first_name,
        last_name: data.last_name,
        department: data.department,
        position: data.Position,
        hire_date: data.hire_date,
      }));

      const response1 = await getIncentiveItems();

      if (!response1.success) {
        alert(response1.message);
        return;
      }

      const formattedPerformanceReviews = response.data.map((data, index) => ({
        review_id: data.review_id,
        employee_id: data.employee_id,
        reviewer_id: data.reviewer_id,
        review_date: data.review_date,
        review_score: data.review_score,
        comments: data.comments,
      }));

      const responseIncentiveAwards = await getIncentiveAwards();

      if (!responseIncentiveAwards.success) {
        alert(responseIncentiveAwards.message);
        return;
      }

      setEmployees(formattedEmployees);
      setIncentives(response1.data);
      setPerformanceReviews(formattedPerformanceReviews);
      setAwardHistory(responseIncentiveAwards.data);
      console.log(responseIncentiveAwards);
    };
    useGetPerformanceReviewsFunc();
  }, []);

  const itemsPerPage = 6;

  useEffect(() => {
    // setEmployees(mockEmployees);
    // setIncentives(mockIncentives);
    // setPerformanceReviews(mockPerformanceReviews);
    // setAwardHistory(mockIncentiveAwards);
  }, []);

  // Filter employees
  const filteredEmployees = useMemo(() => {
    return employees.filter((employee) => {
      const query = searchQuery.toLowerCase();
      return (
        employee.employee_id?.toString().toLowerCase().includes(query) ||
        employee.first_name?.toLowerCase().includes(query) ||
        employee.last_name?.toLowerCase().includes(query) ||
        employee.department?.toLowerCase().includes(query)
      );
    });
  }, [employees, searchQuery]);

  // const mockPerformanceReviews = [
  //   {
  //     review_id: 1,
  //     employee_id: 1,
  //     reviewer_id: 2,
  //     review_date: "2025-11-15",
  //     review_score: 95,
  //     comments:
  //       "Outstanding performance. Excellent leadership and technical skills.",
  //   },
  //   {
  //     review_id: 2,
  //     employee_id: 1,
  //     reviewer_id: 3,
  //     review_date: "2025-11-14",
  //     review_score: 92,
  //     comments: "Great teamwork and dedication.",
  //   },
  //   {
  //     review_id: 3,
  //     employee_id: 1,
  //     reviewer_id: 4,
  //     review_date: "2025-11-13",
  //     review_score: 94,
  //     comments: "Consistently delivers quality work.",
  //   },
  //   {
  //     review_id: 4,
  //     employee_id: 2,
  //     reviewer_id: 1,
  //     review_date: "2025-11-12",
  //     review_score: 88,
  //     comments: "Good communication skills and professionalism.",
  //   },
  //   {
  //     review_id: 5,
  //     employee_id: 2,
  //     reviewer_id: 5,
  //     review_date: "2025-11-11",
  //     review_score: 90,
  //     comments: "Strong reliability and positive attitude.",
  //   },
  //   {
  //     review_id: 6,
  //     employee_id: 3,
  //     reviewer_id: 1,
  //     review_date: "2025-11-10",
  //     review_score: 93,
  //     comments: "Excellent project management skills.",
  //   },
  //   {
  //     review_id: 7,
  //     employee_id: 5,
  //     reviewer_id: 2,
  //     review_date: "2025-11-09",
  //     review_score: 91,
  //     comments: "Outstanding team collaboration.",
  //   },
  //   {
  //     review_id: 8,
  //     employee_id: 8,
  //     reviewer_id: 1,
  //     review_date: "2025-11-08",
  //     review_score: 89,
  //     comments: "Consistent quality in customer service.",
  //   },
  // ];

  // Pagination
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedEmployees = filteredEmployees.slice(startIndex, endIndex);

  // NEW: Get all ratings received by an employee
  const getEmployeeReceivedRatings = (employeeId) => {
    return performanceReviews.filter((r) => r.employee_id === employeeId);
  };

  // NEW: Get average rating for employee (0-100 scale)
  const getAverageRating = (employeeId) => {
    const reviews = getEmployeeReceivedRatings(employeeId);
    if (reviews.length === 0) return 0;
    const avg =
      reviews.reduce((sum, r) => sum + r.review_score, 0) / reviews.length;
    return Math.round(avg);
  };

  // NEW: Get reviewer name
  const getReviewerName = (reviewerId) => {
    const reviewer = employees.find((e) => e.employee_id === reviewerId);
    return reviewer
      ? `${reviewer.first_name} ${reviewer.last_name}`
      : "Unknown";
  };

  const getEmployeePerformanceReview = (employeeId) => {
    return performanceReviews.find((p) => p.employee_id === employeeId);
  };

  const getIncentiveName = (incentiveId) => {
    const incentive = incentives.find((i) => i.incentive_id === incentiveId);
    return incentive ? incentive.incentive_name : "Unknown";
  };

  const handleOpenAwardModal = (employee) => {
    setSelectedEmployee(employee);
    setViewMode("create");
    setAwardForm({
      incentive_id: "",
      bonus: "",
      notes: "",
      performance_review_id:
        getEmployeePerformanceReview(employee.employee_id)?.review_id || "",
    });
    setIsModalOpen(true);
  };

  // NEW: Handle viewing ratings
  const handleViewRatings = (employee) => {
    setSelectedEmployee(employee);
    setViewMode("viewRatings");
    const ratings = getEmployeeReceivedRatings(employee.employee_id);
    setReceivedRatings(ratings);
    setIsModalOpen(true);
  };

  const { postIncentiveAward, setLoadingForPostIncentiveAward } =
    usePostIncentiveAward();

  const handleSubmitAward = async () => {
    if (!awardForm.incentive_id || !awardForm.bonus) {
      setErrorMsg("Please fill in all required fields");
      setTimeout(() => setErrorMsg(""), 3000);
      return;
    }

    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));

      const newAward = {
        award_id: awardHistory.length + 1,
        employee_id: selectedEmployee.employee_id,
        incentive_id: parseInt(awardForm.incentive_id),
        performance_review_id: parseInt(awardForm.performance_review_id),
        award_date: new Date().toISOString().split("T")[0],
        bonus: awardForm.bonus,
        notes: awardForm.notes,
        is_claimed: 0,
        claimed_date: null,
        status: "Pending Approval",
      };
      console.log(newAward);

      const response = await postIncentiveAward(newAward);
      console.log(response);
      if (!response.success) {
        alert(response.message);
        return;
      }

      setAwardHistory([...awardHistory, newAward]);
      setSuccessMsg(
        `Award created for ${selectedEmployee.first_name} ${selectedEmployee.last_name}!`
      );
      setIsModalOpen(false);
      setSelectedEmployee(null);
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (error) {
      setErrorMsg("Error creating award");
      console.error(error);
      setTimeout(() => setErrorMsg(""), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEmployee(null);
    setViewMode("create");
    setAwardForm({
      incentive_id: "",
      bonus: "",
      notes: "",
      performance_review_id: "",
    });
    setReceivedRatings([]);
  };

  // Render stars for 0-100 scale (convert to 5-star rating)
  const renderStars = (score) => {
    const stars = Math.round(score / 20);
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            size={16}
            className={
              i <= stars ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
            }
          />
        ))}
      </div>
    );
  };

  // NEW: Render read-only stars for display
  const renderReadOnlyStars = (score) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${
              star <= Math.round(score / 20)
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900">
              CREATE INCENTIVE AWARDS
            </h1>
            <p className="text-gray-600 mt-2">
              Create and manage employee incentive awards based on performance
              reviews
            </p>
          </div>

          {/* Success/Error Messages */}
          {successMsg && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
              <Check className="text-green-600" size={20} />
              <span className="text-green-700 font-medium">{successMsg}</span>
            </div>
          )}
          {errorMsg && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
              <AlertCircle className="text-red-600" size={20} />
              <span className="text-red-700 font-medium">{errorMsg}</span>
            </div>
          )}

          {/* Search Bar */}
          <div className="mb-6 flex gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by name, ID, or department..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Employee Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {paginatedEmployees.length > 0 ? (
              paginatedEmployees.map((employee) => {
                const avgRating = getAverageRating(employee.employee_id);
                const reviewCount = getEmployeeReceivedRatings(
                  employee.employee_id
                ).length;
                const hasAward = awardHistory.some(
                  (a) => a.employee_id === employee.employee_id
                );

                return (
                  <div
                    key={employee.employee_id}
                    className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4 border border-gray-200"
                  >
                    <div className="mb-4">
                      <h3 className="text-lg font-bold text-gray-900">
                        {employee.first_name} {employee.last_name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {employee.position}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        ID: {employee.employee_id}
                      </p>
                      <p className="text-xs text-gray-500">
                        {employee.department}
                      </p>
                    </div>

                    {/* Rating Info */}
                    {avgRating > 0 && (
                      <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-center gap-2 mb-1">
                          {renderReadOnlyStars(avgRating)}
                          <span className="text-xs font-bold text-gray-900">
                            {avgRating}%
                          </span>
                        </div>
                        <p className="text-xs text-gray-600">
                          {reviewCount}{" "}
                          {reviewCount === 1 ? "rating" : "ratings"}
                        </p>
                      </div>
                    )}

                    {hasAward && (
                      <div className="mb-4 p-2 bg-green-50 rounded-lg border border-green-200">
                        <p className="text-xs font-semibold text-green-700">
                          ✓ Award Already Created
                        </p>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleOpenAwardModal(employee)}
                        disabled={avgRating === 0 || hasAward}
                        className="flex-1 px-3 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        <Gift size={16} />
                        {hasAward ? "Award Created" : "Create Award"}
                      </button>
                      <button
                        onClick={() => handleViewRatings(employee)}
                        className="px-3 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors text-sm flex items-center gap-1"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full text-center py-8 text-gray-500">
                No employees found
              </div>
            )}
          </div>

          {/* Pagination */}
          {filteredEmployees.length > itemsPerPage && (
            <div className="flex items-center justify-center gap-4 mb-8">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="flex gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                        currentPage === page
                          ? "bg-blue-500 text-white"
                          : "border border-gray-300 text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}
              </div>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage === totalPages}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Award History Table */}
          <div className="mt-12">
            <h2 className="text-2xl font-black text-gray-900 mb-4">
              Award History
            </h2>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left font-bold text-gray-900">
                        Employee
                      </th>
                      <th className="px-4 py-3 text-left font-bold text-gray-900">
                        Award
                      </th>
                      <th className="px-4 py-3 text-left font-bold text-gray-900">
                        Bonus
                      </th>
                      <th className="px-4 py-3 text-left font-bold text-gray-900">
                        Date
                      </th>
                      <th className="px-4 py-3 text-center font-bold text-gray-900">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {awardHistory.length > 0 ? (
                      awardHistory.map((award) => {
                        const employee = employees.find(
                          (e) => e.employee_id === award.employee_id
                        );
                        return (
                          <tr key={award.award_id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-gray-900 font-semibold">
                              {employee
                                ? `${employee.first_name} ${employee.last_name}`
                                : "Unknown"}
                            </td>
                            <td className="px-4 py-3 text-gray-900">
                              {getIncentiveName(award.incentive_id)}
                            </td>
                            <td className="px-4 py-3 text-gray-900">
                              {award.bonus}
                            </td>
                            <td className="px-4 py-3 text-gray-900">
                              {new Date(award.award_date).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-3 text-center">
                              <span
                                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                                  award.status === "Claimed"
                                    ? "bg-green-100 text-green-800"
                                    : award.status === "Approved"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }`}
                              >
                                {award.status}
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td
                          colSpan="5"
                          className="px-4 py-8 text-center text-gray-500"
                        >
                          No awards created yet
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Modal */}
        {isModalOpen && selectedEmployee && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-6 text-white sticky top-0">
                <h2 className="text-2xl font-black">
                  {viewMode === "create" ? "Create Award" : "Ratings Received"}
                </h2>
                <p className="text-blue-100 text-sm mt-1">
                  {selectedEmployee.first_name} {selectedEmployee.last_name}
                </p>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-6">
                {/* Employee Info Card */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600 font-semibold">Position</p>
                      <p className="text-gray-900">
                        {selectedEmployee.position}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 font-semibold">Department</p>
                      <p className="text-gray-900">
                        {selectedEmployee.department}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 font-semibold">Employee ID</p>
                      <p className="text-gray-900">
                        {selectedEmployee.employee_id}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 font-semibold">Hire Date</p>
                      <p className="text-gray-900">
                        {new Date(
                          selectedEmployee.hire_date
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                {viewMode === "create" ? (
                  <>
                    {/* Latest Performance Review */}
                    {getEmployeePerformanceReview(
                      selectedEmployee.employee_id
                    ) && (
                      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                        <p className="text-sm font-semibold text-gray-600 mb-2">
                          LATEST PERFORMANCE REVIEW
                        </p>
                        <div className="flex items-center gap-2 mb-2">
                          {renderStars(
                            getEmployeePerformanceReview(
                              selectedEmployee.employee_id
                            ).review_score
                          )}
                          <span className="font-bold">
                            {
                              getEmployeePerformanceReview(
                                selectedEmployee.employee_id
                              ).review_score
                            }
                            %
                          </span>
                        </div>
                        <p className="text-sm text-gray-700">
                          {
                            getEmployeePerformanceReview(
                              selectedEmployee.employee_id
                            ).comments
                          }
                        </p>
                      </div>
                    )}

                    {/* Award Form */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-900 mb-2">
                          Select Incentive *
                        </label>
                        <select
                          value={awardForm.incentive_id}
                          onChange={(e) =>
                            setAwardForm({
                              ...awardForm,
                              incentive_id: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Choose an incentive...</option>
                          {incentives.map((inc) => (
                            <option
                              key={inc.incentive_id}
                              value={inc.incentive_id}
                            >
                              {inc.incentive_name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-900 mb-2">
                          Bonus/Reward Value *
                        </label>
                        <input
                          type="text"
                          value={awardForm.bonus}
                          onChange={(e) =>
                            setAwardForm({
                              ...awardForm,
                              bonus: e.target.value,
                            })
                          }
                          placeholder="e.g., ₱5,000, 2 Days Off"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-900 mb-2">
                          Reason/Notes
                        </label>
                        <textarea
                          value={awardForm.notes}
                          onChange={(e) =>
                            setAwardForm({
                              ...awardForm,
                              notes: e.target.value,
                            })
                          }
                          placeholder="Why is this employee receiving this award?"
                          rows={4}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* View Ratings */}
                    {receivedRatings.length > 0 ? (
                      <div className="space-y-6">
                        <h3 className="text-lg font-bold text-gray-900">
                          Performance Ratings
                        </h3>

                        {/* Average Rating */}
                        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                          <p className="text-sm font-semibold text-gray-600 mb-2">
                            AVERAGE RATING
                          </p>
                          <div className="flex items-center gap-3">
                            {renderReadOnlyStars(
                              getAverageRating(selectedEmployee.employee_id)
                            )}
                            <span className="text-2xl font-black text-gray-900">
                              {getAverageRating(selectedEmployee.employee_id)}%
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 mt-2">
                            Based on {receivedRatings.length}{" "}
                            {receivedRatings.length === 1
                              ? "rating"
                              : "ratings"}
                          </p>
                        </div>

                        {/* Individual Ratings */}
                        <div className="mt-6 pt-6 border-t border-gray-200">
                          <h4 className="font-semibold text-gray-900 mb-4">
                            All Ratings & Comments:
                          </h4>
                          <div className="space-y-3">
                            {receivedRatings.map((rating, idx) => (
                              <div
                                key={idx}
                                className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                              >
                                <div className="flex justify-between items-start mb-3">
                                  <div>
                                    <p className="font-semibold text-gray-900">
                                      {getReviewerName(rating.reviewer_id)}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {new Date(
                                        rating.review_date
                                      ).toLocaleDateString()}
                                    </p>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    {renderReadOnlyStars(rating.review_score)}
                                    <span className="font-bold text-gray-900">
                                      {rating.review_score}%
                                    </span>
                                  </div>
                                </div>
                                {rating.comments && (
                                  <p className="text-sm text-gray-600 italic">
                                    "{rating.comments}"
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        No ratings received yet
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Modal Footer */}
              <div className="flex gap-3 px-6 py-4 bg-gray-50 border-t border-gray-200 sticky bottom-0">
                <button
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
                {viewMode === "create" && (
                  <button
                    onClick={handleSubmitAward}
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        Creating...
                      </>
                    ) : (
                      <>
                        <Gift className="w-4 h-4" />
                        Create Award
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
