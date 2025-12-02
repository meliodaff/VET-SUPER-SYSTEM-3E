import React, { useState, useMemo, useEffect } from "react";
import {
  Search,
  Plus,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Phone,
  Mail,
  User,
  PawPrint,
} from "lucide-react";
import DashboardLayout from "../components/layouts/DashboardLayout";
import EmployeeNavbar from "../components/Sections/EmployeeNavbar";
import useGetAppointment from "../api/useGetAppointment";

export default function AppointmentsTable({ employee }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const { getAppointment, loadingForGetAppointment } = useGetAppointment();
  const [appointments, setAppointment] = useState([]);

  useEffect(() => {
    const useGetAppointmentFunc = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      const response = await getAppointment(user.employee_id);

      console.log(response);
      if (!response.success) {
        alert(response.message);
        return;
      }

      const formattedData = response.data.map((data, indexx) => ({
        id: data.id,
        ownerName: data.user_first_name + " " + data.user_last_name || "-",
        phone: data.user_phone || "-",
        email: data.user_email || "-",
        petName: data.pet_name || "-",
        time:
          new Date(`1970-01-01T${data.time}Z`).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }) || "-",
        appointmentDay: data.date || "-",
      }));
      setAppointment(formattedData);
    };
    useGetAppointmentFunc();
  }, []);

  // Mock employee data - replace with your actual employee data

  // Mock navigation handler - replace with your actual navigation logic
  const handleNavigation = (page) => {
    console.log("Navigate to:", page);
  };

  // Mock data - replace with your API call

  // Filter appointments based on search query
  const filteredAppointments = useMemo(() => {
    return appointments.filter((appointment) => {
      const query = searchQuery.toLowerCase();
      return (
        appointment.ownerName.toLowerCase().includes(query) ||
        appointment.phone.includes(query) ||
        appointment.email.toLowerCase().includes(query) ||
        appointment.petName.toLowerCase().includes(query) ||
        appointment.appointmentDay.includes(query)
      );
    });
  }, [appointments, searchQuery]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentAppointments = filteredAppointments.slice(startIndex, endIndex);

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <>
      <EmployeeNavbar employee={employee} onNavigate={handleNavigation} />

      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900">
              APPOINTMENTS
            </h1>
          </div>

          {/* Search and Actions Bar */}
          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-6">
            <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
              <div className="relative order-2 sm:order-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search appointments..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-gradient-to-br from-blue-100 via-blue-50 to-white rounded-xl shadow-lg overflow-hidden">
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white border-b-2 border-blue-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-black text-gray-900 uppercase tracking-wider">
                      Owner Name
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-black text-gray-900 uppercase tracking-wider">
                      Phone Number
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-black text-gray-900 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-black text-gray-900 uppercase tracking-wider">
                      Pet Name
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-black text-gray-900 uppercase tracking-wider">
                      Time
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-black text-gray-900 uppercase tracking-wider">
                      Appointment Day
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-100">
                  {currentAppointments.length > 0 ? (
                    currentAppointments.map((appointment) => (
                      <tr
                        key={appointment.id}
                        className="hover:bg-white/50 transition-colors cursor-pointer"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          <div className="flex items-center gap-2">
                            {appointment.ownerName}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="flex items-center gap-2">
                            {appointment.phone}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="flex items-center gap-2">
                            {appointment.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="flex items-center gap-2">
                            {appointment.petName}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="flex items-center gap-2">
                            {appointment.time}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="flex items-center gap-2">
                            {formatDate(appointment.appointmentDay)}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-6 py-8 text-center text-gray-500"
                      >
                        No appointments found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden divide-y divide-blue-100">
              {currentAppointments.length > 0 ? (
                currentAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="p-4 hover:bg-white/50 transition-colors cursor-pointer"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                          Owner Name
                        </p>
                        <p className="text-sm font-bold text-gray-900 flex items-center gap-2">
                          {appointment.ownerName}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                          Date
                        </p>
                        <p className="text-sm text-gray-900 flex items-center gap-2 justify-end">
                          {formatDate(appointment.appointmentDay)}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase">
                          Pet Name
                        </p>
                        <p className="text-sm text-gray-900 flex items-center gap-2">
                          {appointment.petName}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase">
                          Phone
                        </p>
                        <p className="text-sm text-gray-900 flex items-center gap-2">
                          {appointment.phone}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase">
                          Email
                        </p>
                        <p className="text-sm text-gray-900 break-all flex items-center gap-2">
                          {appointment.email}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-gray-500">
                  No appointments found
                </div>
              )}
            </div>

            {/* Pagination Controls */}
            {filteredAppointments.length > 0 && (
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-blue-100 sm:px-6">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-gray-700">
                      Showing{" "}
                      <span className="font-medium">{startIndex + 1}</span> to{" "}
                      <span className="font-medium">
                        {Math.min(endIndex, filteredAppointments.length)}
                      </span>{" "}
                      of{" "}
                      <span className="font-medium">
                        {filteredAppointments.length}
                      </span>{" "}
                      results
                    </p>
                    <select
                      value={itemsPerPage}
                      onChange={(e) => {
                        setItemsPerPage(Number(e.target.value));
                        setCurrentPage(1);
                      }}
                      className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value={5}>5 per page</option>
                      <option value={10}>10 per page</option>
                      <option value={20}>20 per page</option>
                      <option value={50}>50 per page</option>
                    </select>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>

                      {[...Array(totalPages)].map((_, i) => {
                        const pageNumber = i + 1;
                        if (
                          pageNumber === 1 ||
                          pageNumber === totalPages ||
                          (pageNumber >= currentPage - 1 &&
                            pageNumber <= currentPage + 1)
                        ) {
                          return (
                            <button
                              key={pageNumber}
                              onClick={() => handlePageChange(pageNumber)}
                              className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                currentPage === pageNumber
                                  ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                                  : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                              }`}
                            >
                              {pageNumber}
                            </button>
                          );
                        } else if (
                          pageNumber === currentPage - 2 ||
                          pageNumber === currentPage + 2
                        ) {
                          return (
                            <span
                              key={pageNumber}
                              className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                            >
                              ...
                            </span>
                          );
                        }
                        return null;
                      })}

                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
