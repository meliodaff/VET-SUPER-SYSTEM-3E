import React, { useState, useMemo, useEffect } from "react";
import {
  MoreVertical,
  Search,
  ChevronLeft,
  ChevronRight,
  X,
  Loader2,
} from "lucide-react";
import DashboardLayout from "../components/layouts/DashboardLayout";
import useGetJobApplicants from "../api/useGetApplicant";
import useUpdateApplicantStatus from "../api/useUpdateApplicantStatus";
import InterviewApplicantsTable from "../components/InterviewApplicantsTable";

export default function ApplicantsTable() {
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateSort, setDateSort] = useState("none");
  const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [tableView, setTableView] = useState("all");
  const [isSendingEmail, setIsSendingEmail] = useState(false); // NEW: Loading state
  const [interviewDetails, setInterviewDetails] = useState({
    interviewDate: "",
    interviewTime: "",
    interviewLocation: "",
    interviewerName: "",
    interviewMode: "",
    position: "",
    notes: "",
  });

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const { getJobApplicants, loadingForGetJobApplicant } = useGetJobApplicants();
  const { updateApplicantStatus, loadingForUpdateApplicantStatus } =
    useUpdateApplicantStatus();

  const [applicants, setApplicants] = useState([]);

  // NEW: Separate function to fetch applicants for reusability
  const fetchApplicants = async () => {
    const response = await getJobApplicants();
    console.log(response);
    if (!response.success) {
      alert(response.message);
      return;
    }

    const formattedData = response.data.map((record) => ({
      id: String(record.applicant_id),
      fullName: record.first_name + " " + record.last_name,
      position: record.job_applied_for,
      email: record.email,
      resume: record.resume_url ? record.resume_url : "No Resume Attached",
      status: record.status,
      createdAt: record.application_date,
    }));

    setApplicants(formattedData);
  };

  useEffect(() => {
    fetchApplicants();
  }, []);

  const statusOptions = [
    "New",
    "Under Review",
    "For Interview",
    "Hired",
    "Rejected",
  ];

  // Toggle dropdown
  const toggleMenu = (id) => {
    setActiveMenuId((cur) => (cur === id ? null : id));
  };

  // Update applicant status by id
  const updateStatusById = async (id, newStatus) => {
    if (newStatus === "For Interview") {
      const applicant = applicants.find((a) => a.id === id);
      if (applicant) {
        openInterviewModal(applicant);
      }
      return;
    }

    setApplicants((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
    );

    const response = await updateApplicantStatus({ id, newStatus });

    console.log(response);
    if (!response.success) {
      alert(response.message);
      return;
    }

    alert(response.message);
    setActiveMenuId(null);
  };

  // Open interview modal
  const openInterviewModal = (applicant) => {
    setSelectedApplicant(applicant);
    setInterviewDetails({
      interviewDate: "",
      interviewTime: "",
      interviewLocation: "",
      interviewerName: "",
      interviewMode: "",
      position: applicant.position,
      notes: "",
    });
    setIsInterviewModalOpen(true);
    setActiveMenuId(null);
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

  // UPDATED: Send interview email with loading and refresh
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
      setIsSendingEmail(true); // START LOADING

      const data = {
        to: selectedApplicant.email,
        subject: `Interview Invitation - ${selectedApplicant.position}`,
        fullName: selectedApplicant.fullName,
        position: interviewDetails.position,
        interviewDate: interviewDetails.interviewDate,
        interviewTime: interviewDetails.interviewTime,
        interviewLocation: interviewDetails.interviewLocation,
        notes: interviewDetails.notes,
        type: "interview",
        mode: interviewDetails.interviewMode,
      };

      const response = await updateApplicantStatus({
        id: selectedApplicant.id,
        newStatus: "For Interview",
        interviewDate: data.interviewDate,
        interviewTime: data.interviewTime,
        interviewLocation: data.interviewLocation,
        notes: data.notes,
        mode: data.mode,
      });

      console.log(response);

      if (response.success) {
        alert("Interview details sent successfully!");

        // Close modal
        setIsInterviewModalOpen(false);

        // Refresh the applicants table
        await fetchApplicants();

        // Reset interview details
        setInterviewDetails({
          interviewDate: "",
          interviewTime: "",
          interviewLocation: "",
          interviewerName: "",
          interviewMode: "",
          position: "",
          notes: "",
        });
      } else {
        alert("Failed to send email: " + response.message);
      }
    } catch (error) {
      console.error("Error sending email:", error);
      alert("Error sending email");
    } finally {
      setIsSendingEmail(false); // STOP LOADING
    }
  };

  // Filter + sort logic
  const filteredApplicants = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    let out = applicants.filter((a) => {
      if (statusFilter !== "all" && a.status !== statusFilter) return false;

      if (!term) return true;
      if ((a.fullName || "").toLowerCase().includes(term)) return true;
      if ((a.position || "").toLowerCase().includes(term)) return true;
      if ((a.email || "").toLowerCase().includes(term)) return true;
      if ((a.id || "").toLowerCase().includes(term)) return true;
      return false;
    });

    if (dateSort === "desc") {
      out.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (dateSort === "asc") {
      out.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }

    return out;
  }, [applicants, searchTerm, statusFilter, dateSort]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredApplicants.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentApplicants = filteredApplicants.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, dateSort, itemsPerPage]);

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

  const statusColors = {
    New: "bg-blue-100 text-blue-800",
    "Under Review": "bg-yellow-100 text-yellow-800",
    "For Interview": "bg-purple-100 text-purple-800",
    Hired: "bg-green-100 text-green-800",
    Rejected: "bg-red-100 text-red-800",
  };

  return (
    <DashboardLayout>
      {/* Header Row */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <div className="text-center md:text-left">
          <h1 className="text-2xl font-bold text-gray-800">Job Applicants</h1>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => {
              setTableView("all");
              setCurrentPage(1);
            }}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              tableView === "all"
                ? "bg-blue-600 text-white shadow-md"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            All Applicants
          </button>
          <button
            onClick={() => {
              setTableView("interview");
              setCurrentPage(1);
            }}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              tableView === "interview"
                ? "bg-purple-600 text-white shadow-md"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Interview Candidates
          </button>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search applicants..."
              className="pl-9 w-full border rounded-md p-2 text-sm"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded-md p-2 text-sm"
          >
            <option value="all">All Statuses</option>
            {statusOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <select
            value={dateSort}
            onChange={(e) => setDateSort(e.target.value)}
            className="border rounded-md p-2 text-sm"
          >
            <option value="none">Sort by Date</option>
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>
        </div>
      </div>

      {tableView === "interview" ? (
        <InterviewApplicantsTable applicants={applicants} />
      ) : (
        <>
          <div className="flex justify-between items-center mb-3">
            <div className="text-sm text-gray-500 font-medium">
              Applicant Information Details
            </div>
            <div className="flex items-center gap-2">
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
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full table-fixed border-collapse">
              <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-20">
                <tr>
                  <th className="w-1/6 px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Applicant ID
                  </th>
                  <th className="w-1/6 px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Full Name
                  </th>
                  <th className="w-1/6 px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Position
                  </th>
                  <th className="w-1/6 px-3 py-3 hidden md:table-cell text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="w-1/6 px-3 py-3 hidden sm:table-cell text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Resume
                  </th>
                  <th className="w-1/6 px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="w-1/6 px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {currentApplicants.length > 0 ? (
                  currentApplicants.map((applicant) => (
                    <tr
                      key={applicant.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-3 py-4 text-sm text-gray-900">
                        {applicant.id}
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-900">
                        {applicant.fullName}
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-900">
                        {applicant.position}
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-900 hidden md:table-cell">
                        {applicant.email}
                      </td>
                      <td
                        className={`px-3 py-4 text-sm ${
                          applicant.resume !== "No Resume Attached" &&
                          "text-blue-600 hover:underline cursor-pointer"
                        } hidden sm:table-cell`}
                      >
                        {applicant.resume === "No Resume Attached" ? (
                          applicant.resume
                        ) : (
                          <a
                            href={`http://localhost/hr-information-system/backend/${applicant.resume}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {applicant.resume.split("/")[2]}
                          </a>
                        )}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            statusColors[applicant.status] ||
                            "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {applicant.status}
                        </span>
                      </td>

                      <td className="px-3 py-4 text-sm text-gray-500">
                        <div className="relative">
                          <button
                            onClick={() => toggleMenu(applicant.id)}
                            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                            aria-expanded={activeMenuId === applicant.id}
                          >
                            <MoreVertical className="w-5 h-5 text-gray-600" />
                          </button>

                          {activeMenuId === applicant.id && (
                            <div className="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20 flex flex-col">
                              {statusOptions.map((option) => (
                                <button
                                  key={option}
                                  onClick={() =>
                                    updateStatusById(applicant.id, option)
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
                      colSpan="7"
                      className="px-3 py-6 text-center text-sm text-gray-500"
                    >
                      No applicants found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {filteredApplicants.length > 0 && (
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6 px-3">
              <div className="text-sm text-gray-600">
                Showing {startIndex + 1} to{" "}
                {Math.min(endIndex, filteredApplicants.length)} of{" "}
                {filteredApplicants.length} results
              </div>

              <div className="flex items-center gap-2">
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

                <div className="flex gap-1">
                  {getPageNumbers().map((page, index) => (
                    <button
                      key={index}
                      onClick={() => typeof page === "number" && goToPage(page)}
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
        </>
      )}

      {/* Interview Details Modal */}
      {isInterviewModalOpen && selectedApplicant && (
        <div className="fixed inset-0 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full border border-gray-300">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900">
                Send Interview Details
              </h2>
              <button
                onClick={() => setIsInterviewModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
                disabled={isSendingEmail}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Applicant:</span>{" "}
                  {selectedApplicant.fullName}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Email:</span>{" "}
                  {selectedApplicant.email}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Position:</span>{" "}
                  {selectedApplicant.position}
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
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
                  disabled={isSendingEmail}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
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
                  disabled={isSendingEmail}
                  className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 disabled:bg-gray-100 disabled:cursor-not-allowed ${
                    getOfficeHoursError()
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                />
                {getOfficeHoursError() && (
                  <p className="text-red-500 text-xs mt-1">
                    {getOfficeHoursError()}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
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
                  disabled={isSendingEmail}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Mode of Interview <span className="text-red-500">*</span>
                </label>
                <select
                  value={interviewDetails.interviewMode}
                  onChange={(e) =>
                    handleInterviewDetailsChange(
                      "interviewMode",
                      e.target.value
                    )
                  }
                  disabled={isSendingEmail}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">Select Interview Mode</option>
                  <option value="OnSite">OnSite</option>
                  <option value="Online">Online</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Additional Notes
                </label>
                <textarea
                  placeholder="Any additional information for the applicant..."
                  value={interviewDetails.notes}
                  onChange={(e) =>
                    handleInterviewDetailsChange("notes", e.target.value)
                  }
                  disabled={isSendingEmail}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                  rows="3"
                />
              </div>
            </div>

            {/* UPDATED: Footer with loading state */}
            <div className="px-6 py-4 border-t bg-gray-50 flex justify-end gap-3">
              <button
                onClick={() => setIsInterviewModalOpen(false)}
                disabled={isSendingEmail}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleSendInterviewEmail}
                disabled={isSendingEmail}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSendingEmail ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Interview Details"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
