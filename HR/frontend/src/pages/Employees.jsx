import React, { useState, useMemo, useEffect } from "react";
import {
  Search,
  Plus,
  X,
  User,
  Camera,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import DashboardLayout from "../components/layouts/DashboardLayout";
import EmployeeInformation from "./EmployeeInformation";
import useGetEmployees from "../api/useGetEmployee";
import usePostEmployee from "../api/usePostEmployee";

export default function Employees() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isAddEmployeeModalOpen, setIsAddEmployeeModalOpen] = useState(false);
  const [employees, setEmployees] = useState([]);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [formData, setFormData] = useState({
    rfidCode: "",
    firstName: "",
    middleName: "",
    lastName: "",
    birthDate: "",
    gender: "",
    email: "",
    phoneNumber: "",
    address: "",
    employmentStatus: "Full-Time",
    jobTitle: "",
    password: "",
    confirmPassword: "",
    rateSalary: "500",
    department: "",
    photo: null,
  });
  const [photoPreview, setPhotoPreview] = useState("");
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
        department: record.department,
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

    if (sortBy === "position") {
      filtered = [...filtered].sort((a, b) =>
        a.position.localeCompare(b.position)
      );
    } else if (sortBy === "date") {
      filtered = [...filtered].sort((a, b) => b.id.localeCompare(a.id));
    }

    return filtered;
  }, [employees, searchQuery, sortBy]);

  // Pagination calculations
  const totalPages = Math.ceil(
    filteredAndSortedEmployees.length / itemsPerPage
  );
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentEmployees = filteredAndSortedEmployees.slice(
    startIndex,
    endIndex
  );

  // Reset to page 1 when search or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sortBy]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleEmployeeClick = (employee) => {
    setSelectedEmployee(employee);
  };

  const handleCloseProfile = () => {
    setSelectedEmployee(null);
  };

  const { postEmployee, loadingForPostEmployee } = usePostEmployee();

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
    if (!formData.department) errors.department = "Department is required";
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

  const resetForm = () => {
    setFormData({
      rfidCode: "",
      firstName: "",
      middleName: "",
      lastName: "",
      birthDate: "",
      gender: "",
      email: "",
      phoneNumber: "",
      address: "",
      employmentStatus: "Full-Time",
      jobTitle: "",
      password: "",
      confirmPassword: "",
      rateSalary: "500",
      department: "",
      photo: null,
    });
    setPhotoPreview("");
    setValidationErrors({});
  };

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
          <div className="mb-6 sm:mb-8">
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900">
              EMPLOYEE
            </h1>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-6">
            <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
              <button
                onClick={() => setIsAddEmployeeModalOpen(true)}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-white border-2 border-gray-300 rounded-lg font-semibold text-sm hover:bg-gray-50 transition-colors order-1 sm:order-1"
              >
                <Plus className="w-5 h-5" />
                Add Employee
              </button>

              <div className="flex flex-col sm:flex-row gap-3 order-2 sm:order-2">
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

                {/* <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white appearance-none cursor-pointer"
                >
                  <option value="">Sort by Position</option>
                  <option value="position">Position A-Z</option>
                  <option value="date">Newest First</option>
                </select> */}
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-100 via-blue-50 to-white rounded-xl shadow-lg overflow-hidden">
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
                      Department
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-black text-gray-900 uppercase tracking-wider">
                      Email
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-100">
                  {currentEmployees.length > 0 ? (
                    currentEmployees.map((employee, index) => (
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
                          {employee.department}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {employee.email}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-6 py-8 text-center text-gray-500"
                      >
                        No employees found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="md:hidden divide-y divide-blue-100">
              {currentEmployees.length > 0 ? (
                currentEmployees.map((employee, index) => (
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

            {/* Pagination Controls */}
            {filteredAndSortedEmployees.length > 0 && (
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
                        {Math.min(endIndex, filteredAndSortedEmployees.length)}
                      </span>{" "}
                      of{" "}
                      <span className="font-medium">
                        {filteredAndSortedEmployees.length}
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
                  {/* Profile Photo Upload */}
                  <div className="flex flex-col items-center">
                    <label className="block text-sm font-bold text-gray-900 mb-3">
                      Profile Photo
                    </label>
                    <div className="relative">
                      <div className="w-32 h-32 rounded-full border-4 border-gray-200 overflow-hidden bg-gray-100 flex items-center justify-center">
                        {photoPreview ? (
                          <img
                            src={photoPreview}
                            alt="Profile preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="w-16 h-16 text-gray-400" />
                        )}
                      </div>
                      <input
                        type="file"
                        id="profile-upload"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setFormData({
                              ...formData,
                              photo: file,
                            });

                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setPhotoPreview(reader.result);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="hidden"
                      />
                      <label
                        htmlFor="profile-upload"
                        className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-all shadow-lg"
                      >
                        <Camera className="w-5 h-5" />
                      </label>
                    </div>
                    {photoPreview && (
                      <button
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, photo: null });
                          setPhotoPreview("");
                        }}
                        className="mt-2 text-xs text-red-500 hover:text-red-700 font-semibold"
                      >
                        Remove Photo
                      </button>
                    )}
                  </div>

                  {/* First, Middle, Last Name */}
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
                        setFormData({
                          ...formData,
                          lastName: e.target.value,
                        })
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

                  {/* RFID Code and Rate Salary */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-3">
                        RFID Code
                      </label>
                      <input
                        type="text"
                        value={formData.rfidCode}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            rfidCode: e.target.value,
                          })
                        }
                        placeholder="## ## ## ##"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-3">
                        Rate Salary
                      </label>
                      <input
                        type="text"
                        value={formData.rateSalary}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^\d.]/g, "");
                          const formattedValue =
                            Number(value).toLocaleString("en-US");
                          setFormData({
                            ...formData,
                            rateSalary: formattedValue,
                          });
                        }}
                        placeholder="Enter amount"
                        className="w-full pl-8 pr-4 py-3 border-2 border-gray-200 rounded-lg bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-sm text-right placeholder:text-left"
                      />
                    </div>
                  </div>

                  {/* Birth Date, Gender */}
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

                  {/* Email, Phone */}
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

                  {/* Address */}
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

                  {/* Job Title */}
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
                      <option value="Senior Veterinarian">
                        Senior Veterinarian
                      </option>
                      <option value="Groomer">Groomer</option>
                      <option value="HR Officer">HR Officer</option>
                      <option value="HR Assistant">HR Assistant</option>
                      <option value="Finance Manager">Finance Manager</option>
                      <option value="Accounting Clerk">Accounting Clerk</option>
                      <option value="Receptionist">Receptionist</option>
                      <option value="Inventory Clerk">Inventory Clerk</option>
                      <option value="Inventory Assistant">
                        Inventory Assistant
                      </option>
                    </select>
                    {validationErrors.jobTitle && (
                      <p className="text-red-500 text-xs mt-1">
                        {validationErrors.jobTitle}
                      </p>
                    )}
                  </div>

                  {/* Department */}
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-3">
                      Department <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.department}
                      onChange={(e) =>
                        setFormData({ ...formData, department: e.target.value })
                      }
                      className={`w-full px-4 py-3 border-2 rounded-lg bg-white focus:outline-none focus:ring-2 transition-all text-sm appearance-none cursor-pointer ${
                        validationErrors.department
                          ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                          : "border-gray-200 focus:border-blue-500 focus:ring-blue-100"
                      }`}
                    >
                      <option value="">Select Department</option>
                      <option value="Doctor">Doctor</option>
                      <option value="Employee">Employee</option>
                      <option value="HR">HR</option>
                      <option value="Inventory">Inventory</option>
                      <option value="Finance">Finance</option>
                      <option value="Appointment">Appointment</option>
                    </select>
                    {validationErrors.department && (
                      <p className="text-red-500 text-xs mt-1">
                        {validationErrors.department}
                      </p>
                    )}
                  </div>

                  {/* Employment Status */}
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
                      <option value="Full-Time">Full Time</option>
                      <option value="Part-Time">Part Time</option>
                      <option value="Contract">Contract</option>
                    </select>
                  </div>

                  {/* Password, Confirm Password */}
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
                  onClick={async () => {
                    if (!validateForm()) {
                      alert("Please fill out all required fields correctly");
                      return;
                    }
                    console.log(formData);
                    try {
                      console.log("Form Data:", formData);
                      const response = await postEmployee(formData);
                      console.log(response);

                      if (response.success) {
                        alert("Employee added successfully!");
                        setIsAddEmployeeModalOpen(false);
                        resetForm();
                        const updatedEmployees = await getEmployees();
                        if (updatedEmployees.success) {
                          const formattedData = updatedEmployees.data.map(
                            (record) => ({
                              id: String(record.employee_id),
                              name: record.first_name + " " + record.last_name,
                              position: record.Position,
                              email: record.contact_email,
                              photo: record.profile_image_url,
                              department: record.department,
                            })
                          );
                          setEmployees(formattedData);
                        }
                      } else {
                        console.log(response);
                        alert(response.message || "Failed to add employee");
                      }
                    } catch (error) {
                      console.error("Error adding employee:", error);
                      alert("An unexpected error occurred. Please try again.");
                    }
                  }}
                  disabled={loadingForPostEmployee}
                  className={`px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:shadow-lg hover:from-blue-700 hover:to-blue-800 transition-all ${
                    loadingForPostEmployee
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  {loadingForPostEmployee ? "Adding..." : "Add Employee"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
