import React, { useState, useMemo, useEffect } from "react";
import { Search, Plus, X } from "lucide-react";
import DashboardLayout from "../components/layouts/DashboardLayout";
import EmployeeInformation from "./EmployeeInformation";
import useGetEmployees from "../api/useGetEmployee";

export default function Employees() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isAddEmployeeModalOpen, setIsAddEmployeeModalOpen] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    birthDate: "",
    gender: "",
    email: "",
    phoneNumber: "",
    address: "",
    employmentStatus: "full-time",
    jobTitle: "",
    password: "",
    confirmPassword: "",
  });
  const [validationErrors, setValidationErrors] = useState({});
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

  // Validate form data
  const validateForm = () => {
    const errors = {};

    if (!formData.firstName.trim()) errors.firstName = "First name is required";
    if (!formData.lastName.trim()) errors.lastName = "Last name is required";
    if (!formData.birthDate) errors.birthDate = "Birth date is required";
    else {
      const today = new Date().toISOString().split("T")[0];
      if (formData.birthDate > today)
        errors.birthDate = "Birth date cannot be in the future";
    }
    if (!formData.gender) errors.gender = "Gender is required";
    if (!formData.email.trim()) errors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      errors.email = "Email format is invalid";
    if (!formData.phoneNumber.trim())
      errors.phoneNumber = "Phone number is required";
    else if (!/^09\d{9}$/.test(formData.phoneNumber))
      errors.phoneNumber = "Phone must be in format 09123456789";
    if (!formData.address.trim()) errors.address = "Address is required";
    if (!formData.jobTitle) errors.jobTitle = "Job title is required";
    if (!formData.password.trim()) errors.password = "Password is required";
    else if (formData.password.length < 6)
      errors.password = "Password must be at least 6 characters";
    if (!formData.confirmPassword.trim())
      errors.confirmPassword = "Confirm password is required";
    else if (formData.confirmPassword !== formData.password)
      errors.confirmPassword = "Passwords do not match";

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      firstName: "",
      middleName: "",
      lastName: "",
      birthDate: "",
      gender: "",
      email: "",
      phoneNumber: "",
      address: "",
      employmentStatus: "full-time",
      jobTitle: "",
      password: "",
      confirmPassword: "",
    });
    setValidationErrors({});
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
              <button
                onClick={() => setIsAddEmployeeModalOpen(true)}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-white border-2 border-gray-300 rounded-lg font-semibold text-sm hover:bg-gray-50 transition-colors order-1 sm:order-1"
              >
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
            {/* Desktop View */}
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

        {/* Add Employee Modal */}
        {isAddEmployeeModalOpen && (
          <div className="fixed inset-0 bg-gradient-to-br from-black/40 to-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              {/* Modal Header with Gradient */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 sm:px-8 py-8 flex items-center justify-between">
                <div>
                  <h2 className="text-3xl sm:text-4xl font-black text-white mb-1">
                    Add New Employee
                  </h2>
                  <p className="text-blue-100 text-sm">
                    Fill in the details to create a new employee record
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsAddEmployeeModalOpen(false);
                    resetForm();
                  }}
                  className="text-blue-100 hover:text-white hover:bg-blue-500 rounded-full p-2 transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 sm:p-8 bg-gray-50">
                <form className="space-y-6">
                  {/* Row 1: First, Middle, Last Name */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-3">
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            firstName: e.target.value,
                          })
                        }
                        placeholder="John"
                        className={`w-full px-4 py-3 border-2 rounded-lg bg-white focus:outline-none focus:ring-2 transition-all text-sm ${
                          validationErrors.firstName
                            ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                            : "border-gray-200 focus:border-blue-500 focus:ring-blue-100"
                        }`}
                      />
                      {validationErrors.firstName && (
                        <p className="text-red-500 text-xs mt-1">
                          {validationErrors.firstName}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-3">
                        Middle Name
                      </label>
                      <input
                        type="text"
                        value={formData.middleName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            middleName: e.target.value,
                          })
                        }
                        placeholder="Middle"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-3">
                        Last Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) =>
                          setFormData({ ...formData, lastName: e.target.value })
                        }
                        placeholder="Doe"
                        className={`w-full px-4 py-3 border-2 rounded-lg bg-white focus:outline-none focus:ring-2 transition-all text-sm ${
                          validationErrors.lastName
                            ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                            : "border-gray-200 focus:border-blue-500 focus:ring-blue-100"
                        }`}
                      />
                      {validationErrors.lastName && (
                        <p className="text-red-500 text-xs mt-1">
                          {validationErrors.lastName}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Row 2: Birth Date, Gender */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-3">
                        Birth Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={formData.birthDate}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            birthDate: e.target.value,
                          })
                        }
                        className={`w-full px-4 py-3 border-2 rounded-lg bg-white focus:outline-none focus:ring-2 transition-all text-sm ${
                          validationErrors.birthDate
                            ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                            : "border-gray-200 focus:border-blue-500 focus:ring-blue-100"
                        }`}
                      />
                      {validationErrors.birthDate && (
                        <p className="text-red-500 text-xs mt-1">
                          {validationErrors.birthDate}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-3">
                        Gender <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.gender}
                        onChange={(e) =>
                          setFormData({ ...formData, gender: e.target.value })
                        }
                        className={`w-full px-4 py-3 border-2 rounded-lg bg-white focus:outline-none focus:ring-2 transition-all text-sm appearance-none cursor-pointer ${
                          validationErrors.gender
                            ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                            : "border-gray-200 focus:border-blue-500 focus:ring-blue-100"
                        }`}
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                      {validationErrors.gender && (
                        <p className="text-red-500 text-xs mt-1">
                          {validationErrors.gender}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Row 3: Email, Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-3">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        placeholder="john@example.com"
                        className={`w-full px-4 py-3 border-2 rounded-lg bg-white focus:outline-none focus:ring-2 transition-all text-sm ${
                          validationErrors.email
                            ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                            : "border-gray-200 focus:border-blue-500 focus:ring-blue-100"
                        }`}
                      />
                      {validationErrors.email && (
                        <p className="text-red-500 text-xs mt-1">
                          {validationErrors.email}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-3">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        value={formData.phoneNumber}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            phoneNumber: e.target.value,
                          })
                        }
                        placeholder="09123456789"
                        className={`w-full px-4 py-3 border-2 rounded-lg bg-white focus:outline-none focus:ring-2 transition-all text-sm ${
                          validationErrors.phoneNumber
                            ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                            : "border-gray-200 focus:border-blue-500 focus:ring-blue-100"
                        }`}
                      />
                      {validationErrors.phoneNumber && (
                        <p className="text-red-500 text-xs mt-1">
                          {validationErrors.phoneNumber}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Row 4: Address */}
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-3">
                      Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                      placeholder="123 Main Street"
                      className={`w-full px-4 py-3 border-2 rounded-lg bg-white focus:outline-none focus:ring-2 transition-all text-sm ${
                        validationErrors.address
                          ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                          : "border-gray-200 focus:border-blue-500 focus:ring-blue-100"
                      }`}
                    />
                    {validationErrors.address && (
                      <p className="text-red-500 text-xs mt-1">
                        {validationErrors.address}
                      </p>
                    )}
                  </div>

                  {/* Row 5: Job Title */}
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-3">
                      Job Title <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.jobTitle}
                      onChange={(e) =>
                        setFormData({ ...formData, jobTitle: e.target.value })
                      }
                      className={`w-full px-4 py-3 border-2 rounded-lg bg-white focus:outline-none focus:ring-2 transition-all text-sm appearance-none cursor-pointer ${
                        validationErrors.jobTitle
                          ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                          : "border-gray-200 focus:border-blue-500 focus:ring-blue-100"
                      }`}
                    >
                      <option value="">Select Job Title</option>
                      <option value="Veterinarian">Veterinarian</option>
                      <option value="Groomer">Groomer</option>
                      <option value="Receptionist">Receptionist</option>
                      <option value="Assistant">Assistant</option>
                      <option value="Manager">Manager</option>
                    </select>
                    {validationErrors.jobTitle && (
                      <p className="text-red-500 text-xs mt-1">
                        {validationErrors.jobTitle}
                      </p>
                    )}
                  </div>

                  {/* Row 6: Employment Status */}
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-3">
                      Employment Status <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.employmentStatus}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          employmentStatus: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-sm appearance-none cursor-pointer"
                    >
                      <option value="full-time">Full Time</option>
                      <option value="part-time">Part Time</option>
                      <option value="contract">Contract</option>
                      <option value="temporary">Temporary</option>
                    </select>
                  </div>

                  {/* Row 7: Password, Confirm Password */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-3">
                        Password <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="password"
                        value={formData.password}
                        onChange={(e) =>
                          setFormData({ ...formData, password: e.target.value })
                        }
                        placeholder="Enter password"
                        className={`w-full px-4 py-3 border-2 rounded-lg bg-white focus:outline-none focus:ring-2 transition-all text-sm ${
                          validationErrors.password
                            ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                            : "border-gray-200 focus:border-blue-500 focus:ring-blue-100"
                        }`}
                      />
                      {validationErrors.password && (
                        <p className="text-red-500 text-xs mt-1">
                          {validationErrors.password}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-3">
                        Confirm Password <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            confirmPassword: e.target.value,
                          })
                        }
                        placeholder="Confirm password"
                        className={`w-full px-4 py-3 border-2 rounded-lg bg-white focus:outline-none focus:ring-2 transition-all text-sm ${
                          validationErrors.confirmPassword
                            ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                            : "border-gray-200 focus:border-blue-500 focus:ring-blue-100"
                        }`}
                      />
                      {validationErrors.confirmPassword && (
                        <p className="text-red-500 text-xs mt-1">
                          {validationErrors.confirmPassword}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Row 8: Admin Checkbox */}
                </form>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 px-6 sm:px-8 py-6 bg-white border-t border-gray-100">
                <button
                  onClick={() => {
                    setIsAddEmployeeModalOpen(false);
                    resetForm();
                  }}
                  className="px-6 py-2.5 text-gray-700 font-semibold rounded-lg hover:bg-gray-100 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (!validateForm()) {
                      alert("Please fill out all required fields correctly");
                      return;
                    }
                    // Call your API function here with formData
                    console.log("Form Data:", formData);
                    // Example: await addEmployee(formData);
                    setIsAddEmployeeModalOpen(false);
                    resetForm();
                  }}
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:shadow-lg hover:from-blue-700 hover:to-blue-800 transition-all"
                >
                  Add Employee
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
