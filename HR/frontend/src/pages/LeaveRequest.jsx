import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import LeaveRequestModal from "../components/modals/LeaveRequestModal";
import useInsertLeaveRequest from "../api/useInsertLeaveRequest";
import { useNavigate } from "react-router-dom";

export default function LeaveRequest() {
  const navigate = useNavigate();
  const {
    responseForLeaveRequest,
    insertLeaveRequest,
    loadingForLeaveRequest,
    errorForLeaveRequest,
  } = useInsertLeaveRequest();

  const [formData, setFormData] = useState({
    startDate: null,
    endDate: null,
    typeOfLeave: "",
    reason: "",
    document: null,
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 8)); // September 2025
  const [errors, setErrors] = useState({});

  // Sample employee data
  const employee = {
    name: "Jv Bialen",
    position: "Veterinarian",
    email: "test@gmail.com",
    gender: "Male",
    id: 1,
  };

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
    if (!day || isSubmitted) return;

    const selectedDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );

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
      day
    );

    if (formData.endDate) {
      return date >= formData.startDate && date <= formData.endDate;
    }
    return date.getTime() === formData.startDate.getTime();
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, document: file });
    }
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
      // const formDataToSend = new FormData();
      // formDataToSend.append("employeeId", employee.id);
      // formDataToSend.append("startDate", formData.startDate.toISOString());
      // formDataToSend.append("endDate", formData.endDate.toISOString());
      // formDataToSend.append("leaveTypeId", Number(formData.typeOfLeave)); // from typeOfLeave key to leaveTypeId
      // formDataToSend.append("reasonDetail", formData.reason); // from reason key, i changed it to reasonDetail
      // if (formData.document) {
      //   formDataToSend.append("attachmentUrl", formData.document); // from document key, i changed it to attachmentUrl
      // }

      // console.log("Submitting leave request:", formData);

      const formDataToSend = {
        employeeId: employee.id,
        startDate: formData.startDate.toISOString(),
        endDate: formData.endDate.toISOString(),
        leaveTypeId: Number(formData.typeOfLeave),
        reasonDetail: formData.reason,
        attachmentUrl: formData.document || null,
      };

      const response = await insertLeaveRequest(formDataToSend);
      console.log(response);
      if (!response.success) {
        console.log(response);
        alert(response.message);
        return;
      }

      setShowSuccessModal(true);
      // console.log(errorForLeaveRequest);
      // if (!responseForLeaveRequest.success) {
      //   console.log(errorForLeaveRequest);
      //   alert(errorForLeaveRequest.response.data.message);
      // } else {
      //   console.log(responseForLeaveRequest);
      //   setShowSuccessModal(true);
      // }
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
                        src="/src/assets/images/profile.jpg"
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
                        <option value="2">Sick Leave</option>
                        <option value="1">Vacation Leave</option>
                        <option value="5">Emergency Leave</option>
                        {employee.gender === "Female" ? (
                          <option value="3">Maternity Leave</option>
                        ) : (
                          <option value="4">Paternity Leave</option>
                        )}
                      </select>
                    </div>
                  </div>
                  {errors.typeOfLeave && (
                    <p className="text-red-500 text-sm mb-2 -mt-4">
                      {errors.typeOfLeave}
                    </p>
                  )}

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
                          disabled={!day || isSubmitted}
                          className={`aspect-square flex items-center justify-center text-base font-medium rounded-lg transition-colors ${
                            day
                              ? isDateInRange(day)
                                ? "bg-gray-800 text-white font-bold shadow-md"
                                : "hover:bg-gray-100 text-gray-900 border border-gray-200"
                              : "text-gray-300"
                          } ${
                            isSubmitted && day
                              ? "cursor-not-allowed opacity-50"
                              : "cursor-pointer"
                          }`}
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
