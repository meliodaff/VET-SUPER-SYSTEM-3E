import React, { useState, useMemo, useEffect } from "react";
import {
  Star,
  Send,
  Search,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
} from "lucide-react";
import DashboardLayout from "../components/layouts/DashboardLayout";
import usePerformanceRating from "../api/usePerformanceRating";

export default function PerformanceRating() {
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [ratings, setRatings] = useState({
    teamwork: 0,
    communication: 0,
    productivity: 0,
    reliability: 0,
    attitude: 0,
  });
  const [comments, setComments] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hoveredRating, setHoveredRating] = useState({});
  const [submitMessage, setSubmitMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const itemsPerPage = 6;
  const { submitRating, loadingForSubmitRating, getEmployeesForRating } =
    usePerformanceRating();

  // Fetch employees
  useEffect(() => {
    const fetchEmployees = async () => {
      const response = await getEmployeesForRating();
      if (response.success) {
        setEmployees(response.data);
      }
    };
    fetchEmployees();
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

  // Pagination
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedEmployees = filteredEmployees.slice(startIndex, endIndex);

  const ratingCategories = [
    {
      key: "teamwork",
      label: "Teamwork",
      description: "Ability to work effectively with others",
    },
    {
      key: "communication",
      label: "Communication",
      description: "Clear and effective communication skills",
    },
    {
      key: "productivity",
      label: "Productivity",
      description: "Output and task completion",
    },
    {
      key: "reliability",
      label: "Reliability",
      description: "Dependability and consistency",
    },
    {
      key: "attitude",
      label: "Attitude",
      description: "Professionalism and positive demeanor",
    },
  ];

  const handleSelectEmployee = (employee) => {
    setSelectedEmployee(employee);
    setIsModalOpen(true);
  };

  const handleRatingChange = (category, value) => {
    setRatings((prev) => ({
      ...prev,
      [category]: value,
    }));
  };

  const handleSubmitRating = async () => {
    if (!selectedEmployee) return;

    // Validate all ratings are selected
    if (Object.values(ratings).some((r) => r === 0)) {
      setSubmitMessage({
        type: "error",
        text: "Please rate all categories",
      });
      return;
    }

    setIsSubmitting(true);
    const response = await submitRating(
      selectedEmployee.employee_id,
      ratings,
      comments
    );

    if (response.success) {
      setSubmitMessage({
        type: "success",
        text: "Rating submitted successfully!",
      });
      // Reset form
      setTimeout(() => {
        setIsModalOpen(false);
        setSelectedEmployee(null);
        setRatings({
          teamwork: 0,
          communication: 0,
          productivity: 0,
          reliability: 0,
          attitude: 0,
        });
        setComments("");
        setSubmitMessage(null);
      }, 1500);
    } else {
      setSubmitMessage({
        type: "error",
        text: response.message || "Failed to submit rating",
      });
    }
    setIsSubmitting(false);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEmployee(null);
    setRatings({
      teamwork: 0,
      communication: 0,
      productivity: 0,
      reliability: 0,
      attitude: 0,
    });
    setComments("");
    setSubmitMessage(null);
  };

  const renderStarRating = (category) => {
    const currentRating = ratings[category];
    const hovered = hoveredRating[category] || 0;
    const displayRating = hovered || currentRating;

    return (
      <div className="flex gap-2 items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onMouseEnter={() =>
              setHoveredRating((prev) => ({ ...prev, [category]: star }))
            }
            onMouseLeave={() =>
              setHoveredRating((prev) => ({ ...prev, [category]: 0 }))
            }
            onClick={() => handleRatingChange(category, star)}
            className="transition-transform hover:scale-110"
          >
            <Star
              className={`w-6 h-6 ${
                star <= displayRating
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              }`}
            />
          </button>
        ))}
        <span className="ml-2 text-sm font-semibold text-gray-700 min-w-8">
          {currentRating > 0 ? `${currentRating}/5` : "-"}
        </span>
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
              PERFORMANCE RATING
            </h1>
            <p className="text-gray-600 mt-2">
              Rate your colleagues based on their performance
            </p>
          </div>

          {/* Search */}
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
              paginatedEmployees.map((employee) => (
                <div
                  key={employee.employee_id}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4 border border-gray-200"
                >
                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-gray-900">
                      {employee.first_name} {employee.last_name}
                    </h3>
                    <p className="text-sm text-gray-600">{employee.position}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      ID: {employee.employee_id}
                    </p>
                    <p className="text-xs text-gray-500">
                      {employee.department}
                    </p>
                  </div>
                  <button
                    onClick={() => handleSelectEmployee(employee)}
                    className="w-full px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors text-sm"
                  >
                    Rate Employee
                  </button>
                </div>
              ))
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
        </div>
      </div>

      {/* Rating Modal */}
      {isModalOpen && selectedEmployee && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-6 text-white sticky top-0">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black">Rate Employee</h2>
                  <p className="text-blue-100 text-sm mt-1">
                    {selectedEmployee.first_name} {selectedEmployee.last_name}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Employee Info Card */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600 font-semibold">Position</p>
                    <p className="text-gray-900">{selectedEmployee.position}</p>
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

              {/* Rating Categories */}
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-gray-900">
                  Rating Criteria
                </h3>
                {ratingCategories.map((category) => (
                  <div
                    key={category.key}
                    className="border-l-4 border-blue-500 pl-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-semibold text-gray-900">
                          {category.label}
                        </p>
                        <p className="text-xs text-gray-600">
                          {category.description}
                        </p>
                      </div>
                    </div>
                    {renderStarRating(category.key)}
                  </div>
                ))}
              </div>

              {/* Comments Section */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Comments (Optional)
                </label>
                <textarea
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="Provide additional feedback or observations..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              {/* Message Display */}
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

            {/* Modal Footer */}
            <div className="flex gap-3 px-6 py-4 bg-gray-50 border-t border-gray-200 sticky bottom-0">
              <button
                onClick={handleCloseModal}
                className="flex-1 px-4 py-2 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitRating}
                disabled={loadingForSubmitRating || isSubmitting}
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
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
