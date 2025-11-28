import React, { useState, useMemo, useEffect } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import useUpdateApplicantStatus from "../api/useUpdateApplicantStatus";
import useGetJobApplicants from "../api/useGetApplicant";

export default function InterviewApplicantsTable({ applicants }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [interviewDetails, setInterviewDetails] = useState({
    interviewDate: "",
    interviewTime: "",
    interviewLocation: "",
    interviewerName: "",
    interviewMode: "",
    position: "",
    notes: "",
  });

  const { updateApplicantStatus } = useUpdateApplicantStatus();

  const statusOptions = [
    "New",
    "Under Review",
    "For Interview",
    "Hired",
    "Rejected",
  ];

  //   // Filter only "For Interview" applicants
  //   const forInterviewApplicants = useMemo(() => {
  //     return applicants.filter((a) => a.status === "For Interview");
  //   }, [applicants]);

  const [forInterviewApplicants, setForInterviewApplicants] = useState([]);

  // Pagination calculations
  const totalPages = Math.ceil(forInterviewApplicants.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentApplicants = forInterviewApplicants.slice(startIndex, endIndex);

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

  // Open interview modal
  const openInterviewModal = (applicant) => {
    setSelectedApplicant(applicant);
    setInterviewDetails({
      interviewDate: "",
      interviewTime: "",
      interviewLocation: "",
      interviewerName: "",
      position: applicant.position,
      notes: "",
    });
    setIsInterviewModalOpen(true);
  };

  // Handle interview details change
  const handleInterviewDetailsChange = (field, value) => {
    setInterviewDetails((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Validate interview time is within office hours (9 AM to 5 PM)
  const isTimeWithinOfficeHours = (timeString) => {
    if (!timeString) return true;
    const [hours, minutes] = timeString.split(":").map(Number);
    const totalMinutes = hours * 60 + minutes;
    const startOfficeHours = 9 * 60;
    const endOfficeHours = 17 * 60;
    return totalMinutes >= startOfficeHours && totalMinutes < endOfficeHours;
  };

  // Get office hours error message
  const getOfficeHoursError = () => {
    if (!interviewDetails.interviewTime) return "";
    if (!isTimeWithinOfficeHours(interviewDetails.interviewTime)) {
      return "Interview time must be between 9:00 AM and 5:00 PM";
    }
    return "";
  };

  // Send interview email
  const {
    getJobApplicantsForInterview,
    loadingForGetJobApplicantForInterview,
  } = useGetJobApplicants();

  useEffect(() => {
    const useGetJobApplicantsFunc = async () => {
      try {
        const response = await getJobApplicantsForInterview();
        console.log(response);

        if (!response.success) {
          alert(response.message);
          return;
        }
        console.log(response.message);
        setForInterviewApplicants(response.data);
      } catch (error) {
        console.error("Error fetching interview applicants:", error);
      }
    };
    useGetJobApplicantsFunc();
  }, []);
  const handleSendInterviewEmail = async () => {
    if (!interviewDetails.interviewDate || !interviewDetails.interviewTime) {
      alert("Please fill in all required fields");
      return;
    }

    if (!isTimeWithinOfficeHours(interviewDetails.interviewTime)) {
      alert("Interview time must be between 9:00 AM and 5:00 PM");
      return;
    }

    try {
      const response = await getJobApplicantsForInterview();

      const result = response;
      if (result.success) {
        alert("Interview details sent successfully!");
        setIsInterviewModalOpen(false);
      } else {
        alert("Failed to send email: " + result.message);
      }
    } catch (error) {
      console.error("Error sending email:", error);
      alert("Error sending email");
    }
  };

  const statusColors = {
    New: "bg-blue-100 text-blue-800",
    "Under Review": "bg-yellow-100 text-yellow-800",
    "For Interview": "bg-purple-100 text-purple-800",
    Hired: "bg-green-100 text-green-800",
    Rejected: "bg-red-100 text-red-800",
  };

  if (forInterviewApplicants.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center border border-gray-200">
        <p className="text-gray-500 text-sm">
          No applicants scheduled for interview
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-gray-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-gray-900 uppercase">
            Interview Candidates
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Total: {forInterviewApplicants.length} applicant(s)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Show:</span>
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
          <span className="text-sm text-gray-600">per page</span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-white border-b-2 border-gray-200">
              <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-black text-gray-900 uppercase">
                Applicant ID
              </th>
              <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-black text-gray-900 uppercase">
                Full Name
              </th>
              <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-black text-gray-900 uppercase">
                Position
              </th>
              <th className="hidden md:table-cell px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-black text-gray-900 uppercase">
                Email
              </th>
              <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-black text-gray-900 uppercase">
                Interview Date
              </th>
              <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-black text-gray-900 uppercase">
                Interview Time
              </th>
              <th className="hidden md:table-cell px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-black text-gray-900 uppercase">
                Location
              </th>

              <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-black text-gray-900 uppercase">
                Status
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {currentApplicants.map((applicant, index) => (
              <tr key={index} className="hover:bg-white/50 transition-colors">
                <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-900">
                  {applicant.applicant_id}
                </td>
                <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-900">
                  {applicant.first_name + " " + applicant.last_name}
                </td>
                <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-900">
                  {applicant.job_applied_for}
                </td>
                <td className="hidden md:table-cell px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-900">
                  {applicant.email}
                </td>
                <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-900">
                  {applicant.interview_date || "-"}
                </td>
                <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-900">
                  {applicant.interview_time || "-"}
                </td>
                <td className="hidden md:table-cell px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-900">
                  {applicant.location || "-"}
                </td>

                <td className="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-semibold ${
                      statusColors[applicant.status] ||
                      "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {applicant.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {forInterviewApplicants.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
          <div className="text-xs sm:text-sm text-gray-600">
            Showing {startIndex + 1} to{" "}
            {Math.min(endIndex, forInterviewApplicants.length)} of{" "}
            {forInterviewApplicants.length} results
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className={`p-2 rounded-lg transition-colors ${
                currentPage === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
              }`}
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            <div className="flex gap-1">
              {getPageNumbers().map((page, index) => (
                <button
                  key={index}
                  onClick={() => typeof page === "number" && goToPage(page)}
                  disabled={page === "..."}
                  className={`min-w-[36px] sm:min-w-[40px] px-2 sm:px-3 py-1 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors ${
                    page === currentPage
                      ? "bg-blue-600 text-white"
                      : page === "..."
                      ? "bg-transparent text-gray-400 cursor-default"
                      : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-lg transition-colors ${
                currentPage === totalPages
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
              }`}
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Interview Details Modal */}
      {isInterviewModalOpen && selectedApplicant && (
        <div className="fixed inset-0 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full border border-gray-300">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                Interview Details
              </h2>
              <button
                onClick={() => setIsInterviewModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
              {/* Applicant Info */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-600">
                  <span className="font-semibold text-gray-900">
                    Applicant:
                  </span>{" "}
                  {selectedApplicant.fullName}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  <span className="font-semibold text-gray-900">Email:</span>{" "}
                  {selectedApplicant.email}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  <span className="font-semibold text-gray-900">Position:</span>{" "}
                  {selectedApplicant.position}
                </p>
              </div>

              {/* Interview Date */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Interview Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={interviewDetails.interviewDate}
                  onChange={(e) =>
                    handleInterviewDetailsChange(
                      "interviewDate",
                      e.target.value
                    )
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>

              {/* Interview Time */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Interview Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  value={interviewDetails.interviewTime}
                  onChange={(e) =>
                    handleInterviewDetailsChange(
                      "interviewTime",
                      e.target.value
                    )
                  }
                  className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
                    getOfficeHoursError()
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                />
                {getOfficeHoursError() && (
                  <p className="text-red-500 text-xs mt-1 font-medium">
                    {getOfficeHoursError()}
                  </p>
                )}
              </div>

              {/* Interview Location */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Interview Location
                </label>
                <input
                  type="text"
                  placeholder="e.g., Conference Room A or Google Meet Link"
                  value={interviewDetails.interviewLocation}
                  onChange={(e) =>
                    handleInterviewDetailsChange(
                      "interviewLocation",
                      e.target.value
                    )
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>

              {/* Additional Notes */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Additional Notes
                </label>
                <textarea
                  placeholder="Any additional information for the applicant..."
                  value={interviewDetails.notes}
                  onChange={(e) =>
                    handleInterviewDetailsChange("notes", e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white resize-none"
                  rows="3"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
              <button
                onClick={() => setIsInterviewModalOpen(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSendInterviewEmail}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Send Interview Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
