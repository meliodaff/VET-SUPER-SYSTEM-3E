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
// import usePerformanceRating from "../api/usePerformanceRating";
import EmployeeNavbar from "../components/Sections/EmployeeNavbar";

export default function EmployeePerformanceRating() {
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState("rate"); // "rate" or "view"
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
  const [receivedRatings, setReceivedRatings] = useState([]);

  const itemsPerPage = 6;
  //   const {
  //     submitRating,
  //     loadingForSubmitRating,
  //     getEmployeesForRating,
  //     getPerformanceRatings,
  //   } = usePerformanceRating();

  // Fetch employees
  const mockData = [
    {
      employee_id: 1,
      first_name: "John",
      last_name: "Doe",
      position: "Veterinarian",
      department: "Clinical",
      hire_date: "2023-01-15",
    },
    {
      employee_id: 2,
      first_name: "Jane",
      last_name: "Smith",
      position: "Receptionist",
      department: "Front Desk",
      hire_date: "2023-06-20",
    },
    {
      employee_id: 3,
      first_name: "Michael",
      last_name: "Johnson",
      position: "Nurse",
      department: "Clinical",
      hire_date: "2023-03-10",
    },
    {
      employee_id: 4,
      first_name: "Sarah",
      last_name: "Williams",
      position: "Lab Technician",
      department: "Laboratory",
      hire_date: "2023-05-05",
    },
    {
      employee_id: 5,
      first_name: "David",
      last_name: "Brown",
      position: "Groomer",
      department: "Grooming",
      hire_date: "2023-02-28",
    },
    {
      employee_id: 6,
      first_name: "Emily",
      last_name: "Davis",
      position: "Assistant",
      department: "Front Desk",
      hire_date: "2023-04-12",
    },
    {
      employee_id: 7,
      first_name: "Robert",
      last_name: "Miller",
      position: "Veterinarian",
      department: "Clinical",
      hire_date: "2022-12-01",
    },
    {
      employee_id: 8,
      first_name: "Lisa",
      last_name: "Wilson",
      position: "Receptionist",
      department: "Front Desk",
      hire_date: "2023-07-15",
    },
  ];

  // Mock ratings data
  const mockRatingsData = {
    1: [
      {
        rater_name: "Jane Smith",
        teamwork: 5,
        communication: 4,
        productivity: 5,
        reliability: 5,
        attitude: 4,
        created_at: "2025-11-10",
      },
      {
        rater_name: "Michael Johnson",
        teamwork: 4,
        communication: 5,
        productivity: 4,
        reliability: 5,
        attitude: 5,
        created_at: "2025-11-12",
      },
      {
        rater_name: "Sarah Williams",
        teamwork: 5,
        communication: 5,
        productivity: 5,
        reliability: 4,
        attitude: 5,
        created_at: "2025-11-14",
      },
    ],
    2: [
      {
        rater_name: "John Doe",
        teamwork: 4,
        communication: 4,
        productivity: 3,
        reliability: 4,
        attitude: 4,
        created_at: "2025-11-08",
      },
      {
        rater_name: "David Brown",
        teamwork: 5,
        communication: 5,
        productivity: 4,
        reliability: 5,
        attitude: 5,
        created_at: "2025-11-13",
      },
    ],
    3: [
      {
        rater_name: "John Doe",
        teamwork: 5,
        communication: 4,
        productivity: 5,
        reliability: 5,
        attitude: 4,
        created_at: "2025-11-11",
      },
    ],
  };
  useEffect(() => {
    const fetchEmployees = async () => {
      //   const response = await getEmployeesForRating();
      //   if (!response.success) {
      //     console.log(response.message);
      //   }
      //   setEmployees(response.data);
      setEmployees(mockData);
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
    setViewMode("rate");
    setIsModalOpen(true);
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

  const handleViewRatings = async (employee) => {
    setSelectedEmployee(employee);
    setViewMode("view");
    setIsModalOpen(true);
    // Use mock ratings data
    const ratings = mockRatingsData[employee.employee_id] || [];
    setReceivedRatings(ratings);
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

    // Simulate API call with mock data
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate network delay

      // Mock success response
      const mockNewRating = {
        rater_name: "Current User",
        ...ratings,
        created_at: new Date().toISOString().split("T")[0],
      };

      // Add to mock ratings data
      if (!mockRatingsData[selectedEmployee.employee_id]) {
        mockRatingsData[selectedEmployee.employee_id] = [];
      }
      mockRatingsData[selectedEmployee.employee_id].push(mockNewRating);

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
    } catch (error) {
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
    setRatings({
      teamwork: 0,
      communication: 0,
      productivity: 0,
      reliability: 0,
      attitude: 0,
    });
    setComments("");
    setSubmitMessage(null);
    setReceivedRatings([]);
  };

  const renderStarRating = (category, readonly = false) => {
    const currentRating = ratings[category];
    const hovered = hoveredRating[category] || 0;
    const displayRating = hovered || currentRating;

    return (
      <div className="flex gap-2 items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onMouseEnter={() => {
              if (!readonly)
                setHoveredRating((prev) => ({ ...prev, [category]: star }));
            }}
            onMouseLeave={() => {
              if (!readonly)
                setHoveredRating((prev) => ({ ...prev, [category]: 0 }));
            }}
            onClick={() => {
              if (!readonly) handleRatingChange(category, star);
            }}
            disabled={readonly}
            className={`transition-transform ${
              !readonly && "hover:scale-110"
            } ${readonly && "cursor-default"}`}
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

  const calculateAverageRating = (categoryKey) => {
    if (receivedRatings.length === 0) return 0;
    const sum = receivedRatings.reduce((acc, rating) => {
      return acc + (rating[categoryKey] || 0);
    }, 0);
    return (sum / receivedRatings.length).toFixed(1);
  };

  return (
    <>
      <EmployeeNavbar />
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900">
              RATE YOUR COLLEAGUES
            </h1>
            <p className="text-gray-600 mt-2">
              Share feedback on your colleagues' performance
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
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSelectEmployee(employee)}
                      className="flex-1 px-3 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors text-sm"
                    >
                      Rate
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

        {/* Rating Modal */}
        {isModalOpen && selectedEmployee && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-6 text-white sticky top-0">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-black">
                      {viewMode === "rate"
                        ? "Rate Employee"
                        : "Ratings Received"}
                    </h2>
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
                  </>
                ) : (
                  <>
                    {/* View Ratings */}
                    {receivedRatings.length > 0 ? (
                      <div className="space-y-6">
                        <h3 className="text-lg font-bold text-gray-900">
                          Performance Ratings
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
                            <div className="flex gap-2 items-center">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`w-6 h-6 ${
                                    star <=
                                    Math.round(
                                      calculateAverageRating(category.key)
                                    )
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                              <span className="ml-2 text-sm font-semibold text-gray-700">
                                {calculateAverageRating(category.key)}/5 (
                                {receivedRatings.length} ratings)
                              </span>
                            </div>
                          </div>
                        ))}

                        {/* Raters Info */}
                        <div className="mt-6 pt-6 border-t border-gray-200">
                          <h4 className="font-semibold text-gray-900 mb-3">
                            Ratings from:
                          </h4>
                          <div className="space-y-2">
                            {receivedRatings.map((rating, idx) => (
                              <div
                                key={idx}
                                className="flex justify-between items-center p-2 bg-gray-50 rounded"
                              >
                                <span className="text-sm text-gray-700">
                                  {rating.rater_name || `Colleague ${idx + 1}`}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {rating.created_at
                                    ? new Date(
                                        rating.created_at
                                      ).toLocaleDateString()
                                    : "N/A"}
                                </span>
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
