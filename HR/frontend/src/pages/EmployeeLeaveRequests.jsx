import React, { useState, useMemo, useEffect } from "react";
import {
  Search,
  Filter,
  CheckCircle,
  Clock,
  XCircle,
  Download,
} from "lucide-react";
import DashboardLayout from "../components/layouts/DashboardLayout";

export default function EmployeeLeaveRequests() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("");
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
      status: "approved",
      approvedBy: "Admin User",
      approvalDate: "2025-11-07",
      document: null,
    },
  ]);

  // Filter and sort leave requests
  const filteredAndSortedRequests = useMemo(() => {
    let filtered = leaveRequests.filter((request) => {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        request.employeeId.toLowerCase().includes(query) ||
        request.employeeName.toLowerCase().includes(query) ||
        request.leaveType.toLowerCase().includes(query) ||
        request.reason.toLowerCase().includes(query);

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
              Manage and track all employee leave requests
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
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
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
                  filteredAndSortedRequests.map((request) => (
                    <tr
                      key={request.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-semibold text-gray-900">
                          {request.id}
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
                        <button className="text-blue-600 hover:text-blue-700 font-semibold text-sm">
                          View Details
                        </button>
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
          </div>

          {/* Leave Requests Cards - Mobile */}
          <div className="md:hidden space-y-4">
            {filteredAndSortedRequests.length > 0 ? (
              filteredAndSortedRequests.map((request) => (
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

                  <div className="mb-3">
                    <p className="text-xs text-gray-600">Reason</p>
                    <p className="text-sm text-gray-900">{request.reason}</p>
                  </div>

                  <button className="w-full text-blue-600 hover:text-blue-700 font-semibold text-sm py-2 rounded-lg hover:bg-blue-50 transition-colors">
                    View Details
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                No leave requests found
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
