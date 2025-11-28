import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, AlertCircle } from "lucide-react";
import LeaveRequestModal from "../components/modals/LeaveRequestModal";
import useInsertLeaveRequest from "../api/useInsertLeaveRequest";
import useGetSchedule from "../api/useGetSchedule";
import { useNavigate } from "react-router-dom";

export default function LeaveRequest() {
  const navigate = useNavigate();
  const {
    responseForLeaveRequest,
    insertLeaveRequest,
    loadingForLeaveRequest,
    errorForLeaveRequest,
  } = useInsertLeaveRequest();

  const { getSchedules, loadingForGetSchedule } = useGetSchedule();

  const [formData, setFormData] = useState({
    startDate: null,
    endDate: null,
    typeOfLeave: "",
    reason: "",
    document: null,
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date()); // Set to current month
  const [errors, setErrors] = useState({});
  const [workingDays, setWorkingDays] = useState([]); // Store employee's working days
  const [employee, setEmployee] = useState(null); // Store dynamic employee data
  const [loadingEmployee, setLoadingEmployee] = useState(true); // Loading state

  // Get today's date at noon
  const getTodayAtNoon = () => {
    const today = new Date();
    today.setHours(12, 0, 0, 0);
    return today;
  };

  // Fetch employee's schedule on component mount
  useEffect(() => {
    const fetchEmployeeSchedule = async () => {
      try {
        setLoadingEmployee(true);
        const response = await getSchedules();
        console.log(response);
        if (response.success && response.data && response.data.length > 0) {
          // Get the first unique employee from schedule data
          const firstRecord = response.data[1];
          const employeeId = firstRecord.employee_id;

          // Get all schedules for this employee
          const employeeSchedules = response.data.filter(
            (record) => record.employee_id === employeeId
          );

          // Set employee data from first schedule record
          setEmployee({
            name: `${firstRecord.first_name} ${firstRecord.last_name}`,
            position: firstRecord.Position,
            email: "employee@example.com",
            gender: firstRecord.gender || "Unknown",
            id: employeeId,
            department: firstRecord.department,
            hireDate: firstRecord.hire_date,
            employmentType: firstRecord.employment_type,
            photo: firstRecord.photo,
          });

          console.log(employee);

          // Extract unique working days
          const days = employeeSchedules.map((record) => record.day_of_week);
          setWorkingDays([...new Set(days)]); // Remove duplicates
        }
      } catch (error) {
        console.error("Error fetching employee schedule:", error);
      } finally {
        setLoadingEmployee(false);
      }
    };

    fetchEmployeeSchedule();
  }, []);

  // Display loading state or employee data
  if (loadingEmployee) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
          <p className="mt-4 text-gray-600">Loading schedule...</p>
        </div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
          <p className="text-gray-700 font-semibold">
            No employee schedule found
          </p>
          <p className="text-gray-500 mt-2">
            Please contact your administrator
          </p>
        </div>
      </div>
    );
  }

  // Calendar setup
  const monthName = currentMonth.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });
  const firstDay = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  ).getDay();
  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();

  const daysArray = [];
  for (let i = 0; i < firstDay; i++) {
    daysArray.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    daysArray.push(i);
  }

  const handleDateClick = (day) => {
    if (!day || isSubmitted || !isWorkingDay(day) || isPastDate(day)) return;

    const selectedDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day,
      12,
      0,
      0,
      0
    );

    // Check if a leave type is selected and if adding this date would exceed the limit
    if (formData.typeOfLeave) {
      const maxDays = getMaxLeaveDays(Number(formData.typeOfLeave));
      let potentialEndDate = selectedDate;

      // Calculate what the new range would be
      if (!formData.startDate) {
        // First date being selected
        potentialEndDate = selectedDate;
      } else if (!formData.endDate) {
        // Second date being selected
        potentialEndDate =
          selectedDate >= formData.startDate
            ? selectedDate
            : formData.startDate;
      } else {
        // Resetting range
        potentialEndDate = selectedDate;
      }

      // Determine the start date for counting
      let potentialStartDate = formData.startDate || selectedDate;
      if (!formData.startDate && formData.endDate) {
        potentialStartDate = selectedDate;
      }

      // Count working days for the potential range
      const potentialDaysCount = countWorkingDays(
        potentialStartDate,
        potentialEndDate
      );

      if (potentialDaysCount > maxDays) {
        alert(
          `${getLeaveName(
            Number(formData.typeOfLeave)
          )} cannot exceed ${maxDays} working days. This selection would result in ${potentialDaysCount} days.`
        );
        return;
      }
    }

    if (!formData.startDate) {
      setFormData({ ...formData, startDate: selectedDate, endDate: null });
      setErrors({ ...errors, dates: "" });
    } else if (!formData.endDate) {
      if (selectedDate >= formData.startDate) {
        setFormData({ ...formData, endDate: selectedDate });
        setErrors({ ...errors, dates: "" });
      } else {
        setFormData({ ...formData, startDate: selectedDate, endDate: null });
      }
    } else {
      setFormData({ ...formData, startDate: selectedDate, endDate: null });
    }
  };

  const isDateInRange = (day) => {
    if (!day || !formData.startDate) return false;
    const date = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day,
      12,
      0,
      0,
      0
    );

    if (formData.endDate) {
      return date >= formData.startDate && date <= formData.endDate;
    }
    return date.toDateString() === formData.startDate.toDateString();
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, document: file });
    }
  };

  // Leave type limits in days
  const leaveLimits = {
    1: 10, // Vacation Leave: 10 days
    2: 10, // Sick Leave: 10 days
    3: 105, // Maternity Leave: 105 days
    4: 7, // Paternity Leave: 7 days
    5: 3, // Emergency Leave: 3 days
  };

  // Get the maximum allowed days for a leave type
  const getMaxLeaveDays = (leaveTypeId) => {
    return leaveLimits[leaveTypeId] || 0;
  };

  // Get the leave type name
  const getLeaveName = (leaveTypeId) => {
    const names = {
      1: "Vacation Leave",
      2: "Sick Leave",
      3: "Maternity Leave",
      4: "Paternity Leave",
      5: "Emergency Leave",
    };
    return names[leaveTypeId] || "Leave";
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.startDate || !formData.endDate) {
      newErrors.dates = "Please select start and end dates";
    }
    if (!formData.typeOfLeave) {
      newErrors.typeOfLeave = "Please select a type of leave";
    }
    if (!formData.reason.trim()) {
      newErrors.reason = "Please provide a reason";
    }

    // Check leave day limits
    if (formData.startDate && formData.endDate && formData.typeOfLeave) {
      const workingDaysCount = countWorkingDays(
        formData.startDate,
        formData.endDate
      );
      const maxDays = getMaxLeaveDays(Number(formData.typeOfLeave));

      if (workingDaysCount > maxDays) {
        newErrors.dates = `${getLeaveName(
          Number(formData.typeOfLeave)
        )} is limited to ${maxDays} days maximum. You selected ${workingDaysCount} working days.`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDone = async () => {
    if (validateForm()) {
      setIsSubmitted(true);
      setErrors({});
    }
  };

  const handleSubmit = async () => {
    try {
      // Filter to only include working days
      const workingDaysList = [];
      let currentDate = new Date(formData.startDate);

      while (currentDate <= formData.endDate) {
        const dayOfWeek = currentDate.toLocaleDateString("en-US", {
          weekday: "long",
        });
        if (workingDays.includes(dayOfWeek)) {
          workingDaysList.push(new Date(currentDate));
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }

      if (workingDaysList.length === 0) {
        alert(
          "No working days selected. Please select at least one working day."
        );
        return;
      }

      // Use the original selected dates, not the filtered ones
      const formDataToSend = {
        employeeId: employee.id,
        startDate: getLocalDateString(formData.startDate),
        endDate: getLocalDateString(formData.endDate),
        leaveTypeId: Number(formData.typeOfLeave),
        reasonDetail: formData.reason,
        attachmentUrl: formData.document || null,
        leaveDaysTaken: workingDaysList.length,
      };

      console.log("Submitting leave request:", formDataToSend);
      console.log("Working days count:", workingDaysList.length);
      console.log(
        "Selected start date:",
        getLocalDateString(formData.startDate)
      );
      console.log(formData);
      console.log("Selected end date:", getLocalDateString(formData.endDate));
      const response = await insertLeaveRequest(formDataToSend);
      console.log(response);
      if (!response.success) {
        console.log(response);
        alert(response.message);
        return;
      }

      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error submitting leave request:", error);
      alert("Failed to submit leave request. Please try again.");
    }
  };

  const handleEdit = () => {
    setIsSubmitted(false);
  };

  const handleCancel = () => {
    if (confirm("Are you sure you want to cancel?")) {
      setFormData({
        startDate: null,
        endDate: null,
        typeOfLeave: "",
        reason: "",
        document: null,
      });
      setIsSubmitted(false);
      navigate("/employee-schedule");
      setErrors({});
    }
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    setFormData({
      startDate: null,
      endDate: null,
      typeOfLeave: "",
      reason: "",
      document: null,
    });
    setIsSubmitted(false);
  };

  const prevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
    );
  };

  const nextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
    );
  };

  const formatDate = (date) => {
    if (!date) return "";
    return date.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });
  };

  // Convert date to local YYYY-MM-DD format (not ISO which applies UTC offset)
  const getLocalDateString = (date) => {
    if (!date) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Helper function to check if a day is in the past
  const isPastDate = (day) => {
    if (!day) return false;
    const date = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day,
      12,
      0,
      0,
      0
    );
    return date < getTodayAtNoon();
  };

  // Helper function to check if a day is a working day for the employee
  const isWorkingDay = (day) => {
    if (!day) return false;
    const date = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day,
      12,
      0,
      0,
      0
    );
    const dayOfWeek = date.toLocaleDateString("en-US", { weekday: "long" });
    return workingDays.includes(dayOfWeek);
  };

  // Count only working days between start and end date
  const countWorkingDays = (startDate, endDate) => {
    if (!startDate || !endDate) return 0;

    let count = 0;
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const dayOfWeek = currentDate.toLocaleDateString("en-US", {
        weekday: "long",
      });
      if (workingDays.includes(dayOfWeek)) {
        count++;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return count;
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-center text-gray-900">
                REQUEST LEAVE
              </h2>
            </div>

            {/* Content */}
            <div className="p-6 lg:p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column */}
                <div>
                  {/* Employee Info */}
                  <div className="flex items-start gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                    <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={`http://localhost/VET-SUPER-SYSTEM-3E/HR/backend/${employee.photo}`}
                        alt={employee.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="text-white text-3xl font-bold">
                        {employee.name.charAt(0)}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="mb-2">
                        <span className="font-semibold text-gray-700">
                          Name:
                        </span>{" "}
                        <span className="text-gray-900">{employee.name}</span>
                      </div>
                      <div className="mb-2">
                        <span className="font-semibold text-gray-700">
                          Position:
                        </span>{" "}
                        <span className="text-gray-900">
                          {employee.position}
                        </span>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-700">
                          Email:
                        </span>{" "}
                        <span className="text-gray-900">{employee.email}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-700">
                        Employee ID:
                      </div>
                      <div className="text-gray-900">{employee.id}</div>
                    </div>
                  </div>

                  {/* Date Range Display */}
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    <div>
                      <input
                        type="text"
                        value={
                          formData.startDate
                            ? formatDate(formData.startDate)
                            : ""
                        }
                        placeholder="Start Date"
                        readOnly
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg text-center bg-white"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        value={
                          formData.endDate ? formatDate(formData.endDate) : ""
                        }
                        placeholder="End Date"
                        readOnly
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg text-center bg-white"
                      />
                    </div>
                    <div>
                      <div className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-gray-50 text-center font-semibold text-gray-700">
                        {formData.startDate && formData.endDate
                          ? (() => {
                              const days = countWorkingDays(
                                formData.startDate,
                                formData.endDate
                              );
                              const maxDays =
                                formData.typeOfLeave &&
                                getMaxLeaveDays(Number(formData.typeOfLeave));
                              return maxDays
                                ? `${days}/${maxDays} days`
                                : `${days} working days`;
                            })()
                          : "0 working days"}
                      </div>
                    </div>
                  </div>

                  {/* Leave Type */}
                  <div className="mb-6">
                    <label className="block text-base font-semibold text-gray-700 mb-3">
                      Type of Leave:
                    </label>
                    <select
                      value={formData.typeOfLeave}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          typeOfLeave: e.target.value,
                        });
                        setErrors({ ...errors, typeOfLeave: "" });
                      }}
                      disabled={isSubmitted}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white disabled:bg-gray-100"
                    >
                      <option value="">Type of Leave</option>
                      <option value="2">Sick Leave (max 10 days)</option>
                      <option value="1">Vacation Leave (max 10 days)</option>
                      <option value="5">Emergency Leave (max 3 days)</option>
                      {employee.gender === "Female" ? (
                        <option value="3">
                          Maternity Leave (max 105 days)
                        </option>
                      ) : (
                        <option value="4">Paternity Leave (max 7 days)</option>
                      )}
                    </select>
                    {errors.typeOfLeave && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.typeOfLeave}
                      </p>
                    )}
                  </div>

                  {/* Calendar */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <button
                        onClick={prevMonth}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        disabled={isSubmitted}
                      >
                        <ChevronLeft size={24} className="text-gray-600" />
                      </button>
                      <div className="text-lg font-bold text-gray-900">
                        {monthName.toUpperCase()}
                      </div>
                      <button
                        onClick={nextMonth}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        disabled={isSubmitted}
                      >
                        <ChevronRight size={24} className="text-gray-600" />
                      </button>
                    </div>

                    <div className="grid grid-cols-7 gap-2">
                      {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                        <div
                          key={day}
                          className="text-center text-sm font-bold text-gray-600 py-2"
                        >
                          {day}
                        </div>
                      ))}
                      {daysArray.map((day, index) => (
                        <button
                          key={index}
                          onClick={() => handleDateClick(day)}
                          disabled={
                            !day ||
                            isSubmitted ||
                            (day && !isWorkingDay(day)) ||
                            (day && isPastDate(day))
                          }
                          className={`aspect-square flex items-center justify-center text-base font-medium rounded-lg transition-colors ${
                            day
                              ? isPastDate(day)
                                ? "text-gray-300 bg-gray-50"
                                : isWorkingDay(day)
                                ? isDateInRange(day)
                                  ? "bg-gray-800 text-white font-bold shadow-md"
                                  : "hover:bg-gray-100 text-gray-900 border border-gray-200"
                                : "text-gray-300 bg-gray-50"
                              : "text-gray-300"
                          } ${
                            isSubmitted &&
                            day &&
                            isWorkingDay(day) &&
                            !isPastDate(day)
                              ? "cursor-not-allowed opacity-50"
                              : day && (!isWorkingDay(day) || isPastDate(day))
                              ? "cursor-not-allowed opacity-50"
                              : "cursor-pointer"
                          }`}
                          title={
                            day && isPastDate(day)
                              ? "Past dates are not available"
                              : day && !isWorkingDay(day)
                              ? "No schedule on this day"
                              : ""
                          }
                        >
                          {day || ""}
                        </button>
                      ))}
                    </div>
                    {errors.dates && (
                      <p className="text-red-500 text-sm mt-2">
                        {errors.dates}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-col">
                  {/* Reason */}
                  <div className="mb-6">
                    <label className="block text-base font-semibold text-gray-700 mb-3">
                      Reason:
                    </label>
                    <textarea
                      placeholder="Enter reason for leave request..."
                      value={formData.reason}
                      onChange={(e) => {
                        setFormData({ ...formData, reason: e.target.value });
                        setErrors({ ...errors, reason: "" });
                      }}
                      disabled={isSubmitted}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base resize-none h-48 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-100"
                    />
                    {errors.reason && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.reason}
                      </p>
                    )}
                  </div>

                  {/* Supporting Document */}
                  <div className="mb-8">
                    <label className="block text-base font-semibold text-gray-700 mb-3">
                      Supporting Document
                    </label>
                    <div className="flex gap-3">
                      <input
                        type="file"
                        id="document-upload"
                        onChange={handleFileUpload}
                        disabled={isSubmitted}
                        className="hidden"
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      />
                      <label
                        htmlFor="document-upload"
                        className={`flex-1 px-4 py-3 border border-gray-300 rounded-lg text-base text-gray-500 truncate ${
                          isSubmitted
                            ? "bg-gray-100 cursor-not-allowed"
                            : "cursor-pointer hover:bg-gray-50"
                        }`}
                      >
                        {formData.document
                          ? formData.document.name
                          : "Document"}
                      </label>
                      <button
                        onClick={() =>
                          !isSubmitted &&
                          document.getElementById("document-upload").click()
                        }
                        disabled={isSubmitted}
                        className="px-6 py-3 bg-gray-200 rounded-lg text-base font-semibold hover:bg-gray-300 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Upload
                      </button>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="mt-auto">
                    {!isSubmitted ? (
                      <div className="flex gap-4">
                        <button
                          onClick={handleCancel}
                          className="flex-1 px-8 py-3 bg-red-400 text-white rounded-full text-lg font-bold hover:bg-red-500 transition-colors shadow-md"
                        >
                          CANCEL
                        </button>
                        <button
                          onClick={handleDone}
                          className="flex-1 px-8 py-3 bg-blue-400 text-white rounded-full text-lg font-bold hover:bg-blue-500 transition-colors shadow-md"
                        >
                          DONE
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-4">
                        <button
                          onClick={handleEdit}
                          className="flex-1 px-8 py-3 bg-yellow-400 text-white rounded-full text-lg font-bold hover:bg-yellow-500 transition-colors shadow-md"
                        >
                          EDIT
                        </button>
                        <button
                          onClick={handleSubmit}
                          className="flex-1 px-8 py-3 bg-green-500 text-white rounded-full text-lg font-bold hover:bg-green-600 transition-colors shadow-md"
                        >
                          SUBMIT
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <LeaveRequestModal
        isOpen={showSuccessModal}
        onClose={handleSuccessClose}
      />
    </>
  );
}
