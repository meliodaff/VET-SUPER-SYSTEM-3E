import React, { useState, useMemo, useEffect } from "react";
import { Search, Plus } from "lucide-react";
import DashboardLayout from "../components/layouts/DashboardLayout";
import EmployeeInformation from "./EmployeeInformation";
import useGetEmployees from "../api/useGetEmployee";

export default function Employees() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const { getEmployees, loadingForGetEmployees } = useGetEmployees();
  useEffect(() => {
    const getEmployeesFunc = async () => {
      const response = await getEmployees();
      console.log(response);
      if (!response.success) {
        alert(response.message);
        return;
      }

      const formattedData = response.data.map((record) => ({
        id: String(record.employee_id),
        name: record.first_name + " " + record.last_name,
        position: record.Position,
        email: record.contact_email,
        photo: record.profile_image_url,
      }));
      console.log(formattedData);
      setEmployees(formattedData);
    };

    getEmployeesFunc();
  }, []);

  // Sample employee data
  const [employees, setEmployees] = useState([]);

  // Filter and sort employees
  const filteredAndSortedEmployees = useMemo(() => {
    let filtered = employees.filter((employee) => {
      const query = searchQuery.toLowerCase();
      return (
        employee.id.toLowerCase().includes(query) ||
        employee.name.toLowerCase().includes(query) ||
        employee.position.toLowerCase().includes(query) ||
        employee.email.toLowerCase().includes(query)
      );
    });

    // Sort by position
    if (sortBy === "position") {
      filtered = [...filtered].sort((a, b) =>
        a.position.localeCompare(b.position)
      );
    } else if (sortBy === "date") {
      // Sort by ID
      filtered = [...filtered].sort((a, b) => b.id.localeCompare(a.id));
    }

    return filtered;
  }, [employees, searchQuery, sortBy]);

  // Handle employee click
  const handleEmployeeClick = (employee) => {
    setSelectedEmployee(employee);
  };

  // Handle close profile
  const handleCloseProfile = () => {
    setSelectedEmployee(null);
  };

  // If an employee is selected, show the profile page
  if (selectedEmployee) {
    return (
      <EmployeeInformation
        employee={selectedEmployee}
        onClose={handleCloseProfile}
      />
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900">
              EMPLOYEE
            </h1>
          </div>

          {/* Controls */}
          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-6">
            <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
              {/* Add Employee Button */}
              <button className="flex items-center justify-center gap-2 px-4 py-2 bg-white border-2 border-gray-300 rounded-lg font-semibold text-sm hover:bg-gray-50 transition-colors order-1 sm:order-1">
                <Plus className="w-5 h-5" />
                Add Employee
              </button>

              {/* Search and Sort */}
              <div className="flex flex-col sm:flex-row gap-3 order-2 sm:order-2">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Sort by Position */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white appearance-none cursor-pointer"
                >
                  <option value="">Sort by Position</option>
                  <option value="position">Position A-Z</option>
                  <option value="date">Newest First</option>
                </select>

                {/* Sort by Date */}
                <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white appearance-none cursor-pointer">
                  <option value="">Sort by date</option>
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                </select>
              </div>
            </div>
          </div>

          {/* Employee Table */}
          <div className="bg-gradient-to-br from-blue-100 via-blue-50 to-white rounded-xl shadow-lg overflow-hidden">
            {/* Desktop  View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white border-b-2 border-blue-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-black text-gray-900 uppercase tracking-wider">
                      Employee ID
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-black text-gray-900 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-black text-gray-900 uppercase tracking-wider">
                      Position
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-black text-gray-900 uppercase tracking-wider">
                      Email
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-100">
                  {filteredAndSortedEmployees.length > 0 ? (
                    filteredAndSortedEmployees.map((employee, index) => (
                      <tr
                        key={index}
                        onClick={() => handleEmployeeClick(employee)}
                        className="hover:bg-white/50 transition-colors cursor-pointer"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          VT - {employee.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {employee.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {employee.position}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {employee.email}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="4"
                        className="px-6 py-8 text-center text-gray-500"
                      >
                        No employees found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile View */}
            <div className="md:hidden divide-y divide-blue-100">
              {filteredAndSortedEmployees.length > 0 ? (
                filteredAndSortedEmployees.map((employee, index) => (
                  <div
                    key={index}
                    onClick={() => handleEmployeeClick(employee)}
                    className="p-4 hover:bg-white/50 transition-colors cursor-pointer"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase">
                          Employee ID
                        </p>
                        <p className="text-sm font-bold text-gray-900">
                          {employee.id}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-semibold text-gray-500 uppercase">
                          Position
                        </p>
                        <p className="text-sm text-gray-900">
                          {employee.position}
                        </p>
                      </div>
                    </div>
                    <div className="mb-2">
                      <p className="text-xs font-semibold text-gray-500 uppercase">
                        Name
                      </p>
                      <p className="text-sm text-gray-900">{employee.name}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase">
                        Email
                      </p>
                      <p className="text-sm text-gray-900 break-all">
                        {employee.email}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-gray-500">
                  No employees found
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
