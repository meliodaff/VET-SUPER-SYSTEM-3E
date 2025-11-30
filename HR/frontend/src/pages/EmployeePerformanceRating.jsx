import React, { useState, useMemo, useEffect } from "react";
import {
  Star,
  Send,
  Search,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Eye,
} from "lucide-react";
import useGetEmployees from "../api/useGetEmployee";
import EmployeeNavbar from "../components/Sections/EmployeeNavbar";
import usePostPerformanceReviews from "../api/usePostPerformanceReviews";
import useGetPerformanceReviews from "../api/useGetPerformanceReviews"; // ADD THIS IMPORT

export default function EmployeePerformanceRating({ employee }) {
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [performanceReviews, setPerformanceReviews] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState("rate");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitMessage, setSubmitMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [receivedRatings, setReceivedRatings] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);

  const [ratingForm, setRatingForm] = useState({
    review_score: 0,
    comments: "",
  });
  const [hoveredRating, setHoveredRating] = useState(0);

  const { getEmployees } = useGetEmployees();
  const { postPerformanceReviews, loadingForPostPerformanceReviews } =
    usePostPerformanceReviews();
  const { getPerformanceReviews, loadingForGetPerformanceReviews } =
    useGetPerformanceReviews(); // ADD THIS

  // Get current user ID from localStorage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    console.log(user);
    if (user && user.employee_id) {
      setCurrentUserId(user.employee_id);
    }
  }, []);

  // Fetch all employees
  useEffect(() => {
    const useGetEmployeesFunc = async () => {
      const response = await getEmployees();

      if (!response.success) {
        alert(response.message);
        return;
      }

      const formattedEmployees = response.data.map((data) => ({
        employee_id: data.employee_id,
        first_name: data.first_name,
        last_name: data.last_name,
        position: data.Position,
        department: data.department,
        hire_date: data.hire_date,
      }));
      setEmployees(formattedEmployees);
    };
    useGetEmployeesFunc();
  }, []);

  // Fetch all performance reviews
  useEffect(() => {
    const fetchPerformanceReviews = async () => {
      try {
        const response = await getPerformanceReviews();

        if (!response.success) {
          console.error(
            "Failed to fetch performance reviews:",
            response.message
          );
          return;
        }

        // Format the reviews data
        const formattedReviews = response.data.map((review) => ({
          review_id: review.review_id,
          employee_id: review.employee_id,
          reviewer_id: review.reviewer_id,
          review_date: review.review_date,
          review_score: review.review_score,
          comments: review.comments,
        }));

        setPerformanceReviews(formattedReviews);
      } catch (error) {
        console.error("Error fetching performance reviews:", error);
      }
    };

    fetchPerformanceReviews();
  }, []);

  const itemsPerPage = 6;

  const scoreToStars = (score) => {
    if (score === 0) return 0;
    return Math.round(score / 20);
  };

  const starsToScore = (stars) => {
    return stars * 20;
  };

  const filteredEmployees = useMemo(() => {
    return employees.filter((employee) => {
      // Filter out current user's own card
      if (currentUserId && employee.employee_id === currentUserId) {
        return false;
      }

      const query = searchQuery.toLowerCase();
      return (
        employee.employee_id?.toString().toLowerCase().includes(query) ||
        employee.first_name?.toLowerCase().includes(query) ||
        employee.last_name?.toLowerCase().includes(query) ||
        employee.department?.toLowerCase().includes(query)
      );
    });
  }, [employees, searchQuery, currentUserId]);

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedEmployees = filteredEmployees.slice(startIndex, endIndex);

  const getEmployeeReceivedRatings = (employeeId) => {
    return performanceReviews.filter((r) => r.employee_id === employeeId);
  };

  const getAverageRating = (employeeId) => {
    const reviews = getEmployeeReceivedRatings(employeeId);
    if (reviews.length === 0) return 0;
    const avg =
      reviews.reduce((sum, r) => sum + r.review_score, 0) / reviews.length;
    return Math.round(avg);
  };

  const getReviewerName = (reviewerId) => {
    const reviewer = employees.find((e) => e.employee_id === reviewerId);
    return reviewer
      ? `${reviewer.first_name} ${reviewer.last_name}`
      : "Unknown";
  };

  // Check if current user has already rated an employee
  const hasUserRatedEmployee = (employeeId) => {
    if (!currentUserId) return false;

    const hasRated = performanceReviews.some(
      (review) =>
        review.employee_id === employeeId &&
        review.reviewer_id === currentUserId
    );

    console.log(
      `User ${currentUserId} rated employee ${employeeId}:`,
      hasRated
    );
    return hasRated;
  };

  const handleNavigation = (navName) => {
    console.log("Navigate to:", navName);
  };

  const handleSelectEmployee = (employee) => {
    setSelectedEmployee(employee);
    setViewMode("rate");
    setIsModalOpen(true);
    setRatingForm({
      review_score: 0,
      comments: "",
    });
    setHoveredRating(0);
    setSubmitMessage(null);
  };

  const handleViewRatings = (employee) => {
    setSelectedEmployee(employee);
    setViewMode("view");
    setIsModalOpen(true);

    // Only show the current user's own rating, not all ratings
    const userRating = performanceReviews.filter(
      (r) =>
        r.employee_id === employee.employee_id &&
        r.reviewer_id === currentUserId
    );
    setReceivedRatings(userRating);
  };

  const handleStarClick = (starNumber) => {
    const score = starsToScore(starNumber);
    setRatingForm((prev) => ({
      ...prev,
      review_score: score,
    }));
  };

  const handleSliderChange = (value) => {
    setRatingForm((prev) => ({
      ...prev,
      review_score: value,
    }));
  };

  const handleSubmitRating = async () => {
    if (!selectedEmployee) return;

    if (ratingForm.review_score === 0) {
      setSubmitMessage({
        type: "error",
        text: "Please rate the employee",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const newReview = {
        employee_id: selectedEmployee.employee_id,
        reviewer_id: currentUserId,
        review_date: new Date().toISOString().split("T")[0],
        review_score: ratingForm.review_score,
        comments: ratingForm.comments,
      };

      const response = await postPerformanceReviews(newReview);

      if (!response.success) {
        setSubmitMessage({
          type: "error",
          text: response.message || "Failed to submit rating",
        });
        setIsSubmitting(false);
        return;
      }

      console.log("Rating submitted successfully:", response);

      // Add the new review to local state with the returned review_id
      const reviewWithId = {
        ...newReview,
        review_id: response.data?.review_id || performanceReviews.length + 1,
      };

      setPerformanceReviews([...performanceReviews, reviewWithId]);

      setSubmitMessage({
        type: "success",
        text: "Rating submitted successfully!",
      });

      setTimeout(() => {
        setIsModalOpen(false);
        setSelectedEmployee(null);
        setRatingForm({
          review_score: 0,
          comments: "",
        });
        setHoveredRating(0);
        setSubmitMessage(null);
      }, 1500);
    } catch (error) {
      console.error("Error submitting rating:", error);
      setSubmitMessage({
        type: "error",
        text: "Failed to submit rating",
      });
    }
    setIsSubmitting(false);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEmployee(null);
    setViewMode("rate");
    setRatingForm({
      review_score: 0,
      comments: "",
    });
    setHoveredRating(0);
    setSubmitMessage(null);
    setReceivedRatings([]);
  };

  const renderStarRating = (score, onlyView = false) => {
    const currentStars = scoreToStars(score);
    const displayStars = hoveredRating > 0 ? hoveredRating : currentStars;

    return (
      <div className="flex gap-2 items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onMouseEnter={() => {
              if (!onlyView) setHoveredRating(star);
            }}
            onMouseLeave={() => {
              if (!onlyView) setHoveredRating(0);
            }}
            onClick={() => {
              if (!onlyView) handleStarClick(star);
            }}
            disabled={onlyView}
            className={`transition-transform ${
              !onlyView && "hover:scale-110"
            } ${onlyView && "cursor-default"}`}
          >
            <Star
              className={`w-8 h-8 ${
                star <= displayStars
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              }`}
            />
          </button>
        ))}
        <span className="ml-2 text-lg font-bold text-gray-700 min-w-16">
          {score > 0 ? `${score}%` : "0%"}
        </span>
      </div>
    );
  };

  const renderReadOnlyStars = (score) => {
    const stars = scoreToStars(score);
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${
              star <= stars
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <>
      <EmployeeNavbar employee={employee} onNavigate={handleNavigation} />

      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900">
              RATE YOUR COLLEAGUES
            </h1>
            <p className="text-gray-600 mt-2">
              Share feedback on your colleagues' performance
            </p>
          </div>

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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {paginatedEmployees.length > 0 ? (
              paginatedEmployees.map((employee) => {
                const avgRating = getAverageRating(employee.employee_id);
                const reviewCount = getEmployeeReceivedRatings(
                  employee.employee_id
                ).length;

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

                    {/* Removed average rating display to keep reviews private */}

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSelectEmployee(employee)}
                        disabled={hasUserRatedEmployee(employee.employee_id)}
                        className={`flex-1 px-3 py-2 font-semibold rounded-lg transition-colors text-sm ${
                          hasUserRatedEmployee(employee.employee_id)
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-blue-500 text-white hover:bg-blue-600"
                        }`}
                      >
                        {hasUserRatedEmployee(employee.employee_id)
                          ? "Already Rated"
                          : "Rate"}
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
        </div>

        {isModalOpen && selectedEmployee && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-6 text-white sticky top-0">
                <h2 className="text-2xl font-black">
                  {viewMode === "rate" ? "Rate Employee" : "Your Rating"}
                </h2>
                <p className="text-blue-100 text-sm mt-1">
                  {selectedEmployee.first_name} {selectedEmployee.last_name}
                </p>
              </div>

              <div className="p-6 space-y-6">
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

                {viewMode === "rate" ? (
                  <>
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-4">
                          Overall Rating
                        </h3>
                        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                          <p className="text-sm text-gray-600 mb-4">
                            Click stars or move slider (20, 40, 60, 80, 100%)
                          </p>
                          <div className="mb-6">
                            {renderStarRating(ratingForm.review_score)}
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            step="1"
                            value={ratingForm.review_score}
                            onChange={(e) =>
                              handleSliderChange(parseInt(e.target.value))
                            }
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                          />
                          <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>0%</span>
                            <span>20%</span>
                            <span>40%</span>
                            <span>60%</span>
                            <span>80%</span>
                            <span>100%</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-2">
                        Comments
                      </label>
                      <textarea
                        value={ratingForm.comments}
                        onChange={(e) =>
                          setRatingForm({
                            ...ratingForm,
                            comments: e.target.value,
                          })
                        }
                        placeholder="Provide additional feedback or observations..."
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    {receivedRatings.length > 0 ? (
                      <div className="space-y-6">
                        <h3 className="text-lg font-bold text-gray-900">
                          Your Rating
                        </h3>

                        <div className="space-y-3">
                          {receivedRatings.map((rating, idx) => (
                            <div
                              key={idx}
                              className="p-4 bg-blue-50 rounded-lg border border-blue-200"
                            >
                              <div className="flex justify-between items-start mb-3">
                                <div>
                                  <p className="font-semibold text-gray-900">
                                    Your rating for{" "}
                                    {selectedEmployee.first_name}{" "}
                                    {selectedEmployee.last_name}
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
                                <div className="mt-3 pt-3 border-t border-blue-200">
                                  <p className="text-xs font-semibold text-gray-600 mb-1">
                                    Your Comments:
                                  </p>
                                  <p className="text-sm text-gray-700">
                                    {rating.comments}
                                  </p>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <p className="mb-2">
                          You haven't rated this employee yet
                        </p>
                        <p className="text-sm">
                          Click "Rate" to submit your feedback
                        </p>
                      </div>
                    )}
                  </>
                )}

                {submitMessage && (
                  <div
                    className={`p-4 rounded-lg flex items-start gap-3 ${
                      submitMessage.type === "success"
                        ? "bg-green-50 border border-green-200"
                        : "bg-red-50 border border-red-200"
                    }`}
                  >
                    <AlertCircle
                      className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                        submitMessage.type === "success"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    />
                    <p
                      className={`text-sm ${
                        submitMessage.type === "success"
                          ? "text-green-700"
                          : "text-red-700"
                      }`}
                    >
                      {submitMessage.text}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex gap-3 px-6 py-4 bg-gray-50 border-t border-gray-200 sticky bottom-0">
                <button
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
                {viewMode === "rate" && (
                  <button
                    onClick={handleSubmitRating}
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Submit Rating
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
