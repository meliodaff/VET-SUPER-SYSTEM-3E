import React, { useState, useMemo, useEffect } from "react";
import {
  Search,
  CheckCircle,
  Clock,
  XCircle,
  Check,
  X,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import DashboardLayout from "../components/layouts/DashboardLayout";
import useGetLeaveRequest from "../api/useGetLeaveRequest";
import usePatchLeaveRequest from "../api/usePatchLeaveRequest";

export default function AdminLeaveRequests() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("pending");
  const [sortBy, setSortBy] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [actionNotes, setActionNotes] = useState("");
  const [actionType, setActionType] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [leaveRequests, setLeaveRequests] = useState([
    {
      id: "LR-001",
      employeeName: "John Doe",
      employeeId: "VT-001",
      leaveType: "Sick Leave",
      startDate: "2025-11-15",
      endDate: "2025-11-17",
      duration: 3,
      reason: "Medical appointment and recovery",
      status: "approved",
      approvedBy: "Admin User",
      approvalDate: "2025-11-14",
      document: "medical_cert.pdf",
      notes: "Medical certificate provided",
    },
    {
      id: "LR-002",
      employeeName: "Jane Smith",
      employeeId: "VT-002",
      leaveType: "Vacation",
      startDate: "2025-12-01",
      endDate: "2025-12-05",
      duration: 5,
      reason: "Family vacation",
      status: "pending",
      approvedBy: null,
      approvalDate: null,
      document: null,
      notes: null,
    },
    {
      id: "LR-003",
      employeeName: "Maria Santos",
      employeeId: "VT-003",
      leaveType: "Bereavement Leave",
      startDate: "2025-11-10",
      endDate: "2025-11-12",
      duration: 3,
      reason: "Death of family member",
      status: "approved",
      approvedBy: "Admin User",
      approvalDate: "2025-11-09",
      document: "death_cert.pdf",
      notes: "Death certificate provided",
    },
    {
      id: "LR-004",
      employeeName: "Juan Dela Cruz",
      employeeId: "VT-004",
      leaveType: "Sick Leave",
      startDate: "2025-11-20",
      endDate: "2025-11-21",
      duration: 2,
      reason: "Flu symptoms",
      status: "rejected",
      approvedBy: "Admin User",
      approvalDate: "2025-11-19",
      document: null,
      notes: "No medical certificate provided",
    },
    {
      id: "LR-005",
      employeeName: "Alice Johnson",
      employeeId: "VT-005",
      leaveType: "Personal Leave",
      startDate: "2025-11-25",
      endDate: "2025-11-26",
      duration: 2,
      reason: "Personal matter",
      status: "pending",
      approvedBy: null,
      approvalDate: null,
      document: null,
      notes: null,
    },
    {
      id: "LR-006",
      employeeName: "Robert Brown",
      employeeId: "VT-006",
      leaveType: "Vacation",
      startDate: "2025-11-08",
      endDate: "2025-11-14",
      duration: 7,
      reason: "Summer vacation",
      status: "pending",
      approvedBy: null,
      approvalDate: null,
      document: null,
      notes: null,
    },
  ]);

  const {
    getLeaveRequest,
    getLeaveRequests,
    loadingForGetLeaveRequest,
    loadingForGetLeaveRequests,
  } = useGetLeaveRequest();

  useEffect(() => {
    const useGetLeaveRequestFunc = async () => {
      try {
        const response = await getLeaveRequests();
        console.log("Response from API:", response);

        // Check if response exists and has success property
        if (!response || !response.success) {
          console.error(
            "Failed to fetch leave requests:",
            response?.message || "Unknown error"
          );
          return;
        }

        // Check if data exists and is an array
        if (!response.data || !Array.isArray(response.data)) {
          console.error("Response data is not an array");
          return;
        }

        const formattedData = response.data.map((data, key) => ({
          requestId: `LR-00${data.request_id}`,
          employeeName: data.first_name + " " + data.last_name,
          employeeId: data.employee_id,
          leaveType: data.type_name,
          startDate: data.start_date,
          endDate: data.end_date,
          duration: data.leave_days,
          reason: data.reason_detail,
          status: (data.status || "pending").toLowerCase(),
          approvedBy: null,
          approvalDate: null,
          document: data.attachment_url,
          notes: "-",
        }));
        setLeaveRequests(formattedData);
      } catch (error) {
        console.error("Error in useGetLeaveRequestFunc:", error);
      }
    };
    useGetLeaveRequestFunc();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filter and sort leave requests
  const filteredAndSortedRequests = useMemo(() => {
    let filtered = leaveRequests.filter((request) => {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        request.employeeId?.toString().toLowerCase().includes(query) ||
        false ||
        request.employeeName?.toLowerCase().includes(query) ||
        false ||
        request.leaveType?.toLowerCase().includes(query) ||
        false ||
        request.reason?.toLowerCase().includes(query) ||
        false;

      const matchesFilter =
        filterStatus === "all" || request.status === filterStatus;

      return matchesSearch && matchesFilter;
    });

    // Sort
    if (sortBy === "date") {
      filtered = [...filtered].sort(
        (a, b) => new Date(b.startDate) - new Date(a.startDate)
      );
    } else if (sortBy === "duration") {
      filtered = [...filtered].sort((a, b) => b.duration - a.duration);
    } else if (sortBy === "employee") {
      filtered = [...filtered].sort((a, b) =>
        a.employeeName.localeCompare(b.employeeName)
      );
    }

    return filtered;
  }, [leaveRequests, searchQuery, filterStatus, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedRequests.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedRequests = filteredAndSortedRequests.slice(
    startIndex,
    endIndex
  );

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterStatus, sortBy]);

  const { patchLeaveRequests, loadingForPatchLeaveRequest } =
    usePatchLeaveRequest();
  const handleApprove = (request) => {
    setSelectedRequest(request);
    setActionType("approve");
    setIsModalOpen(true);
    setActionNotes("");
  };

  const handleReject = (request) => {
    setSelectedRequest(request);
    setActionType("reject");
    setIsModalOpen(true);
    setActionNotes("");
  };

  const submitAction = async () => {
    if (!selectedRequest) return;

    const requestId = selectedRequest.requestId
      .replace("LR-00", "")
      .replace("LR-0", "")
      .replace("LR-", "");

    console.log("Submitting action with:", {
      requestId,
      status: actionType === "approve" ? "Approved" : "Rejected",
      employeeId: selectedRequest.employeeId,
      actionNotes,
    });

    try {
      const response = await patchLeaveRequests(
        requestId,
        actionType === "approve" ? "Approved" : "Rejected",
        selectedRequest.employeeId
      );

      console.log("API Response:", response);

      if (response?.success) {
        setLeaveRequests((prev) =>
          prev.map((req) =>
            req.requestId === selectedRequest.requestId
              ? {
                  ...req,
                  status: actionType === "approve" ? "approved" : "rejected",
                  approvedBy: "Admin User",
                  approvalDate: new Date().toISOString().split("T")[0],
                  notes: actionNotes,
                }
              : req
          )
        );

        setIsModalOpen(false);
        setSelectedRequest(null);
        setActionNotes("");
        setActionType(null);

        alert(
          `Leave request ${
            actionType === "approve" ? "approved" : "rejected"
          } successfully!`
        );
      } else {
        console.error("Failed to update leave request:", response);
        alert(
          `Failed to ${actionType} leave request: ${
            response?.message || response?.error || "Unknown error"
          }`
        );
      }
    } catch (error) {
      console.error("Error submitting action:", error);
      alert(`Error: ${error.message || "Failed to process request"}`);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return (
          <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
            <CheckCircle className="w-3 h-3" />
            Approved
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-semibold">
            <Clock className="w-3 h-3" />
            Pending
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-semibold">
            <XCircle className="w-3 h-3" />
            Rejected
          </span>
        );
      default:
        return null;
    }
  };

  const getLeaveTypeColor = (type) => {
    switch (type) {
      case "Sick Leave":
        return "bg-red-50 border-red-200";
      case "Vacation":
        return "bg-blue-50 border-blue-200";
      case "Bereavement Leave":
        return "bg-gray-50 border-gray-200";
      case "Personal Leave":
        return "bg-purple-50 border-purple-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900">
              LEAVE REQUESTS
            </h1>
            <p className="text-gray-600 mt-2">
              Review and manage employee leave requests
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <div className="text-3xl font-bold text-gray-900">
                {leaveRequests.length}
              </div>
              <p className="text-gray-600 text-sm mt-1">Total Requests</p>
            </div>
            <div className="bg-green-50 rounded-xl p-6 shadow-lg border border-green-200">
              <div className="text-3xl font-bold text-green-600">
                {leaveRequests.filter((r) => r.status === "approved").length}
              </div>
              <p className="text-green-600 text-sm mt-1">Approved</p>
            </div>
            <div className="bg-yellow-50 rounded-xl p-6 shadow-lg border border-yellow-200">
              <div className="text-3xl font-bold text-yellow-600">
                {leaveRequests.filter((r) => r.status === "pending").length}
              </div>
              <p className="text-yellow-600 text-sm mt-1">Pending</p>
            </div>
            <div className="bg-red-50 rounded-xl p-6 shadow-lg border border-red-200">
              <div className="text-3xl font-bold text-red-600">
                {leaveRequests.filter((r) => r.status === "rejected").length}
              </div>
              <p className="text-red-600 text-sm mt-1">Rejected</p>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search by employee, ID, or leave type..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Filter */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white appearance-none cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white appearance-none cursor-pointer"
              >
                <option value="">Sort by</option>
                <option value="date">Recent First</option>
                <option value="duration">Longest Duration</option>
                <option value="employee">Employee Name</option>
              </select>
            </div>
          </div>

          {/* Leave Requests Table - Desktop */}
          <div className="hidden md:block bg-white rounded-xl shadow-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-100 border-b-2 border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-black text-gray-900 uppercase tracking-wider">
                    Request ID
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-black text-gray-900 uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-black text-gray-900 uppercase tracking-wider">
                    Leave Type
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-black text-gray-900 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-black text-gray-900 uppercase tracking-wider">
                    Dates
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-black text-gray-900 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-black text-gray-900 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredAndSortedRequests.length > 0 ? (
                  paginatedRequests.map((request, key) => (
                    <tr
                      key={key}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-semibold text-gray-900">
                          {request.requestId}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {request.employeeName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {request.employeeId}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">
                          {request.leaveType}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-semibold text-gray-900">
                          {request.duration} day
                          {request.duration > 1 ? "s" : ""}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-xs text-gray-600">
                          {formatDate(request.startDate)} -{" "}
                          {formatDate(request.endDate)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(request.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {request.status === "pending" ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleApprove(request)}
                              className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-lg hover:bg-green-200 transition-colors text-xs font-semibold"
                            >
                              <Check className="w-3 h-3" />
                              Approve
                            </button>
                            <button
                              onClick={() => handleReject(request)}
                              className="inline-flex items-center gap-1 bg-red-100 text-red-700 px-3 py-1 rounded-lg hover:bg-red-200 transition-colors text-xs font-semibold"
                            >
                              <X className="w-3 h-3" />
                              Reject
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setSelectedRequest(request);
                              setIsDetailsModalOpen(true);
                            }}
                            className="text-blue-600 hover:text-blue-700 font-semibold text-sm"
                          >
                            View Details
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      No leave requests found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Desktop Pagination */}
            {filteredAndSortedRequests.length > 0 && (
              <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  Showing {startIndex + 1} to{" "}
                  {Math.min(endIndex, filteredAndSortedRequests.length)} of{" "}
                  {filteredAndSortedRequests.length} results
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                    disabled={currentPage === 1}
                    className="inline-flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                            currentPage === page
                              ? "bg-blue-600 text-white"
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
                    className="inline-flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Leave Requests Cards - Mobile */}
          <div className="md:hidden space-y-4">
            {filteredAndSortedRequests.length > 0 ? (
              paginatedRequests.map((request) => (
                <div
                  key={request.id}
                  className={`rounded-xl p-4 shadow-lg border-2 ${getLeaveTypeColor(
                    request.leaveType
                  )}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase">
                        {request.id}
                      </p>
                      <p className="text-sm font-bold text-gray-900">
                        {request.employeeName}
                      </p>
                      <p className="text-xs text-gray-600">
                        {request.employeeId}
                      </p>
                    </div>
                    {getStatusBadge(request.status)}
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div>
                      <p className="text-xs text-gray-600">Leave Type</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {request.leaveType}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Duration</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {request.duration} day{request.duration > 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>

                  <div className="mb-3">
                    <p className="text-xs text-gray-600">Dates</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {formatDate(request.startDate)} to{" "}
                      {formatDate(request.endDate)}
                    </p>
                  </div>

                  <div className="mb-4">
                    <p className="text-xs text-gray-600">Reason</p>
                    <p className="text-sm text-gray-900">{request.reason}</p>
                  </div>

                  {request.status === "pending" ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApprove(request)}
                        className="flex-1 inline-flex items-center justify-center gap-1 bg-green-100 text-green-700 px-3 py-2 rounded-lg hover:bg-green-200 transition-colors text-xs font-semibold"
                      >
                        <Check className="w-3 h-3" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(request)}
                        className="flex-1 inline-flex items-center justify-center gap-1 bg-red-100 text-red-700 px-3 py-2 rounded-lg hover:bg-red-200 transition-colors text-xs font-semibold"
                      >
                        <X className="w-3 h-3" />
                        Reject
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setSelectedRequest(request);
                        setIsDetailsModalOpen(true);
                      }}
                      className="w-full text-blue-600 hover:text-blue-700 font-semibold text-sm py-2 rounded-lg hover:bg-blue-50 transition-colors"
                    >
                      View Details
                    </button>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                No leave requests found
              </div>
            )}

            {/* Mobile Pagination */}
            {filteredAndSortedRequests.length > 0 && (
              <div className="mt-6 flex items-center justify-between gap-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={currentPage === 1}
                  className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>
                <div className="text-sm text-gray-600 font-semibold">
                  {currentPage} / {totalPages}
                </div>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Details Modal */}
      {isDetailsModalOpen && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-6 text-white sticky top-0">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black">Leave Request Details</h2>
                  <p className="text-blue-100 text-sm mt-1">
                    {selectedRequest.requestId}
                  </p>
                </div>
                <button
                  onClick={() => setIsDetailsModalOpen(false)}
                  className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Employee Information */}
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-black text-gray-900 mb-4">
                  Employee Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-600 font-semibold uppercase">
                      Employee Name
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                      {selectedRequest.employeeName}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 font-semibold uppercase">
                      Employee ID
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                      {selectedRequest.employeeId}
                    </p>
                  </div>
                </div>
              </div>

              {/* Leave Information */}
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-black text-gray-900 mb-4">
                  Leave Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-600 font-semibold uppercase">
                      Leave Type
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                      {selectedRequest.leaveType}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 font-semibold uppercase">
                      Duration
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                      {selectedRequest.duration} day
                      {selectedRequest.duration > 1 ? "s" : ""}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 font-semibold uppercase">
                      Start Date
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                      {formatDate(selectedRequest.startDate)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 font-semibold uppercase">
                      End Date
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                      {formatDate(selectedRequest.endDate)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Request Details */}
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-black text-gray-900 mb-4">
                  Request Details
                </h3>
                <div>
                  <p className="text-xs text-gray-600 font-semibold uppercase mb-2">
                    Reason
                  </p>
                  <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">
                    {selectedRequest.reason}
                  </p>
                </div>
              </div>

              {/* Status Information */}
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-black text-gray-900 mb-4">
                  Status Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-600 font-semibold uppercase">
                      Current Status
                    </p>
                    <div className="mt-1">
                      {getStatusBadge(selectedRequest.status)}
                    </div>
                  </div>
                  {selectedRequest.status !== "pending" && (
                    <>
                      <div>
                        <p className="text-xs text-gray-600 font-semibold uppercase">
                          Approved By
                        </p>
                        <p className="text-sm font-semibold text-gray-900">
                          {selectedRequest.approvedBy || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 font-semibold uppercase">
                          Approval Date
                        </p>
                        <p className="text-sm font-semibold text-gray-900">
                          {selectedRequest.approvalDate
                            ? formatDate(selectedRequest.approvalDate)
                            : "N/A"}
                        </p>
                      </div>
                      {selectedRequest.notes && (
                        <div className="sm:col-span-2">
                          <p className="text-xs text-gray-600 font-semibold uppercase mb-2">
                            Notes
                          </p>
                          <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">
                            {selectedRequest.notes}
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Attachment */}
              {selectedRequest.document && (
                <div className="border-b border-gray-200 pb-4">
                  <h3 className="text-lg font-black text-gray-900 mb-4">
                    Attachment
                  </h3>
                  <a
                    href={`http://localhost/VET-SUPER-SYSTEM-3E/HR/backend/${selectedRequest.document}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-semibold text-sm"
                  >
                    📄 Download Attachment
                  </a>
                </div>
              )}

              {/* Request Submission Date */}
              <div>
                <p className="text-xs text-gray-600 font-semibold uppercase">
                  Submitted On
                </p>
                <p className="text-sm font-semibold text-gray-900">
                  {formatDate(selectedRequest.startDate)}
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex gap-3 px-6 py-4 bg-gray-50 border-t border-gray-200">
              <button
                onClick={() => setIsDetailsModalOpen(false)}
                className="flex-1 px-4 py-2 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
              {selectedRequest.status === "pending" && (
                <>
                  <button
                    onClick={() => {
                      setIsDetailsModalOpen(false);
                      setActionType("approve");
                      setIsModalOpen(true);
                    }}
                    className="flex-1 px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Check className="w-4 h-4 inline mr-1" />
                    Approve
                  </button>
                  <button
                    onClick={() => {
                      setIsDetailsModalOpen(false);
                      setActionType("reject");
                      setIsModalOpen(true);
                    }}
                    className="flex-1 px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <X className="w-4 h-4 inline mr-1" />
                    Reject
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Action Modal */}
      {isModalOpen && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            {/* Modal Header */}
            <div
              className={`bg-gradient-to-r ${
                actionType === "approve"
                  ? "from-green-600 to-green-700"
                  : "from-red-600 to-red-700"
              } px-6 py-6 text-white`}
            >
              <h2 className="text-2xl font-black">
                {actionType === "approve" ? "Approve" : "Reject"} Leave Request
              </h2>
              <p className="text-white/80 text-sm mt-1">
                {selectedRequest.employeeName} - {selectedRequest.id}
              </p>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <p className="text-xs text-gray-600 mb-1">Request Summary</p>
                <p className="text-sm font-semibold text-gray-900">
                  {selectedRequest.leaveType} ({selectedRequest.duration} days)
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  {formatDate(selectedRequest.startDate)} to{" "}
                  {formatDate(selectedRequest.endDate)}
                </p>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  {actionType === "approve" ? "Approval" : "Rejection"} Notes
                  <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={actionNotes}
                  onChange={(e) => setActionNotes(e.target.value)}
                  placeholder={
                    actionType === "approve"
                      ? "Add approval notes (optional)..."
                      : "Provide reason for rejection..."
                  }
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>

              {selectedRequest.document && (
                <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">
                    Attached Document
                  </p>
                  <a
                    href={`http://localhost/VET-SUPER-SYSTEM-3E/HR/backend/${selectedRequest.document}`}
                    target="_blank"
                    className="text-sm font-semibold text-blue-600"
                  >
                    📄 Document
                  </a>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex gap-3 px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-2xl">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedRequest(null);
                  setActionNotes("");
                  setActionType(null);
                }}
                className="flex-1 px-4 py-2 text-gray-700 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={submitAction}
                disabled={loadingForPatchLeaveRequest}
                className={`flex-1 px-4 py-2 text-white font-semibold rounded-lg transition-colors ${
                  actionType === "approve"
                    ? "bg-green-600 hover:bg-green-700 disabled:bg-green-400"
                    : "bg-red-600 hover:bg-red-700 disabled:bg-red-400"
                } disabled:cursor-not-allowed`}
              >
                {loadingForPatchLeaveRequest ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Processing...
                  </span>
                ) : actionType === "approve" ? (
                  "Approve"
                ) : (
                  "Reject"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
