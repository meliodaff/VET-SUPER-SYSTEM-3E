import React, { useState, useMemo, useEffect } from "react";
import { MoreVertical, Search } from "lucide-react";
import DashboardLayout from "../components/layouts/DashboardLayout";
import useGetJobApplicants from "../api/useGetApplicant";
import useUpdateApplicantStatus from "../api/useUpdateApplicantStatus";

export default function ApplicantsTable() {
  const [activeMenuId, setActiveMenuId] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateSort, setDateSort] = useState("none");
  const { getJobApplicants, loadingForGetJobApplicant } = useGetJobApplicants();
  const { updateApplicantStatus, loadingForUpdateApplicantStatus } =
    useUpdateApplicantStatus();
  useEffect(() => {
    const useGetJobApplicantsFunc = async () => {
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

    useGetJobApplicantsFunc();
  }, []);

  const [applicants, setApplicants] = useState([]);

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

  // Filter + sort logic
  const filteredApplicants = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    let out = applicants.filter((a) => {
      // status filter
      if (statusFilter !== "all" && a.status !== statusFilter) return false;

      // search filter
      if (!term) return true;
      if ((a.fullName || "").toLowerCase().includes(term)) return true;
      if ((a.position || "").toLowerCase().includes(term)) return true;
      if ((a.email || "").toLowerCase().includes(term)) return true;
      if ((a.id || "").toLowerCase().includes(term)) return true;
      return false;
    });

    // sort by createdAt if requested
    if (dateSort === "desc") {
      out.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // newest first
    } else if (dateSort === "asc") {
      out.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)); // oldest first
    }

    return out;
  }, [applicants, searchTerm, statusFilter, dateSort]);

  // applicant status color
  const statusColors = {
    New: "bg-blue-100 text-blue-800",
    "Under Review": "bg-yellow-100 text-yellow-800",
    "For Interview": "bg-purple-100 text-purple-800",
    Hired: "bg-green-100 text-green-800",
    Rejected: "bg-red-100 text-red-800",
  };

  return (
    <DashboardLayout>
      {/* Header Row: left title, right controls */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <div className="text-center md:text-left">
          <h1 className="text-2xl font-bold text-gray-800">Job Applicants</h1>
        </div>

        {/* Right-aligned controls: Search, Sort by Status, Sort by Date */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          {/* Search */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search applicants..."
              className="pl-9 w-full border rounded-md p-2 text-sm"
            />
          </div>

          {/* Sort by Status */}
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

          {/* Sort by Date */}
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

      {/* Secondary label on the top-right */}
      <div className="flex justify-end mb-3">
        <div className="text-sm text-gray-500 font-medium">
          Applicant Information Details
        </div>
      </div>

      {/* Table */}
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
            {filteredApplicants.length > 0 ? (
              filteredApplicants.map((applicant) => (
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
                        href={`
                          http://localhost/hr-information-system/backend/${applicant.resume}
                          `}
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
    </DashboardLayout>
  );
}
