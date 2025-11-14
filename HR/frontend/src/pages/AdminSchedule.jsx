import React, { useState, useMemo, useEffect } from "react";
import {
  Search,
  Edit,
  ChevronLeft,
  ChevronRight,
  X,
  Save,
  Trash2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/layouts/DashboardLayout";
import useGetAttendanceRecord from "../api/useGetAttendanceRecord";
import useGetSchedule from "../api/useGetSchedule";

export default function AttendanceSchedule() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("attendance");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedNotes, setEditedNotes] = useState("");
  const [isEditScheduleModalOpen, setIsEditScheduleModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [editingDay, setEditingDay] = useState("");

  const {
    getAttendanceRecords,
    loadingForGetAttendanceRecords,
    getAttendanceRecordsForToday,
    loadingForGetAttendanceRecordsForToday,
    getAttendanceRecord,
    getAttendanceRecordForToday,
    loadingForGetAttendanceRecordForToday,
    loadingForGetAttendanceRecord,
  } = useGetAttendanceRecord();

  const [attendanceData, setAttendanceData] = useState([]);

  useEffect(() => {
    const fetchAttendance = async () => {
      let response;
      const today = new Date();
      const isToday = selectedDate.toDateString() === today.toDateString();

      if (isToday) {
        response = await getAttendanceRecordsForToday();
      } else {
        response = await getAttendanceRecords(selectedDate);
      }

      if (!response.success) {
        alert(response.message);
        return;
      }

      const normalizedData = response.data.map((data) => ({
        employeeId: String(data.employee_id),
        name: data.first_name + " " + data.last_name,
        department: data.department,
        position: data.position,
        timeIn: data.check_in_time,
        timeOut: data.check_out_time,
        remarks: data.attendance_status,
      }));
      console.log(normalizedData);
      setAttendanceData(normalizedData);
    };

    fetchAttendance();
  }, [selectedDate]);

  // Schedule data
  const [scheduleData, setScheduleData] = useState([]);
  const [loadingSchedule, setLoadingSchedule] = useState(false);

  // Filter and sort attendance
  const filteredAttendance = useMemo(() => {
    let filtered = attendanceData.filter((record) => {
      const query = searchQuery.toLowerCase();
      return (
        record.employeeId.toLowerCase().includes(query) ||
        record.name.toLowerCase().includes(query) ||
        record.department.toLowerCase().includes(query) ||
        record.position.toLowerCase().includes(query)
      );
    });

    if (sortBy === "position") {
      filtered = [...filtered].sort((a, b) =>
        a.position.localeCompare(b.position)
      );
    } else if (sortBy === "name") {
      filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
    }

    return filtered;
  }, [searchQuery, sortBy, attendanceData]);

  const { getSchedules, loadingForGetSchedule } = useGetSchedule();

  useEffect(() => {
    const fetchSchedules = async () => {
      setLoadingSchedule(true);
      const response = await getSchedules();
      console.log("Schedule Response:", response);

      if (!response.success) {
        console.error(response.message);
        setLoadingSchedule(false);
        return;
      }

      // Transform API data to schedule format - NOW INCLUDING NAMES
      const transformedData = response.data.map((record, index) => ({
        id: `${record.employee_id}-${record.day_of_week}-${index}`,
        employeeId: record.employee_id,
        name: `${record.first_name} ${record.last_name}`, // ADD THIS LINE
        department: record.department,
        position: record.Position, // Also add position if you want
        hireDate: record.hire_date,
        employmentType: record.employment_type,
        dayOfWeek: record.day_of_week,
      }));

      setScheduleData(transformedData);
      setLoadingSchedule(false);
    };

    fetchSchedules();
  }, []);

  // Filter and sort schedule - group by employee
  const filteredSchedule = useMemo(() => {
    // Group schedules by employee
    const groupedByEmployee = {};
    scheduleData.forEach((record) => {
      if (!groupedByEmployee[record.employeeId]) {
        groupedByEmployee[record.employeeId] = {
          employeeId: record.employeeId,
          name: record.name, // ADD THIS LINE
          department: record.department,
          position: record.position, // ADD THIS LINE
          hireDate: record.hireDate,
          employmentType: record.employmentType,
          days: [],
        };
      }
      groupedByEmployee[record.employeeId].days.push(record.dayOfWeek);
    });

    let filtered = Object.values(groupedByEmployee).filter((record) => {
      const query = searchQuery.toLowerCase();
      return (
        record.employeeId?.toString().toLowerCase().includes(query) ||
        record.name?.toLowerCase().includes(query) || // ADD THIS LINE for name search
        record.department?.toLowerCase().includes(query)
      );
    });

    if (sortBy === "employee") {
      filtered = [...filtered].sort((a, b) => a.employeeId - b.employeeId);
    } else if (sortBy === "department") {
      filtered = [...filtered].sort((a, b) =>
        a.department.localeCompare(b.department)
      );
    }

    return filtered;
  }, [scheduleData, searchQuery, sortBy]);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    return { daysInMonth, startingDayOfWeek };
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth);
  const monthNames = [
    "JANUARY",
    "FEBRUARY",
    "MARCH",
    "APRIL",
    "MAY",
    "JUNE",
    "JULY",
    "AUGUST",
    "SEPTEMBER",
    "OCTOBER",
    "NOVEMBER",
    "DECEMBER",
  ];

  const handleEditClick = (index, currentNotes) => {
    setEditingIndex(index);
    setEditedNotes(currentNotes);
  };

  const handleSaveNotes = (index) => {
    const updatedSchedule = [...scheduleData];
    updatedSchedule[index].notes = editedNotes;
    setScheduleData(updatedSchedule);
    setEditingIndex(null);
    setEditedNotes("");
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditedNotes("");
  };

  const handleEditSchedule = (record) => {
    setEditingSchedule(record);
    setEditingDay("");
    setIsEditScheduleModalOpen(true);
  };

  const handleSaveSchedule = () => {
    if (editingSchedule && editingDay) {
      // Check if the day already exists for this employee
      const dayExists = editingSchedule.days.includes(editingDay);

      if (!dayExists) {
        // Add the new day to the schedule data
        setScheduleData((prev) => [
          ...prev,
          {
            id: `${editingSchedule.employeeId}-${editingDay}-${Date.now()}`,
            employeeId: editingSchedule.employeeId,
            department: editingSchedule.department,
            hireDate: editingSchedule.hireDate,
            employmentType: editingSchedule.employmentType,
            dayOfWeek: editingDay,
          },
        ]);
      } else {
        alert("This employee is already scheduled for " + editingDay);
      }

      setIsEditScheduleModalOpen(false);
      setEditingSchedule(null);
      setEditingDay("");
    } else if (!editingDay) {
      alert("Please select a day");
    }
  };

  const handleDeleteSchedule = (id) => {
    if (window.confirm("Are you sure you want to delete this schedule?")) {
      setScheduleData((prev) => prev.filter((record) => record.id !== id));
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center gap-2 mb-6">
            <button
              onClick={() => setActiveTab("attendance")}
              className={`px-6 sm:px-10 py-3 rounded-t-xl font-bold text-xs sm:text-sm lg:text-base transition-all ${
                activeTab === "attendance"
                  ? "bg-blue-500 text-white shadow-lg"
                  : "bg-gray-200 text-gray-600 hover:bg-gray-300"
              }`}
            >
              EMPLOYEE ATTENDANCE
            </button>
            <button
              onClick={() => setActiveTab("schedule")}
              className={`px-6 sm:px-10 py-3 rounded-t-xl font-bold text-xs sm:text-sm lg:text-base transition-all ${
                activeTab === "schedule"
                  ? "bg-blue-500 text-white shadow-lg"
                  : "bg-gray-200 text-gray-600 hover:bg-gray-300"
              }`}
            >
              EMPLOYEE SCHEDULE
            </button>
          </div>

          {/* Attendance Tab */}
          {activeTab === "attendance" && (
            <div className="bg-gradient-to-br from-blue-100 via-blue-50 to-white rounded-xl shadow-lg p-4 sm:p-6">
              {/* Controls */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6 items-start sm:items-center">
                <input
                  type="date"
                  // value={selectedDate.split("/").reverse().join("-")}
                  value={selectedDate.toISOString().split("T")[0]}
                  onChange={(e) => setSelectedDate(new Date(e.target.value))}
                  // onChange={(e) => {
                  //   const date = new Date(e.target.value);
                  //   setSelectedDate(
                  //     `${String(date.getMonth() + 1).padStart(2, "0")}/${String(
                  //       date.getDate()
                  //     ).padStart(2, "0")}/${date.getFullYear()}`
                  //   );
                  // }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white w-full sm:w-auto"
                />

                <div className="flex gap-3 flex-1 justify-end flex-wrap w-full sm:w-auto">
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white w-full sm:w-auto"
                  >
                    <option value="">Sort by Position</option>
                    <option value="position">Position A-Z</option>
                    <option value="name">Name A-Z</option>
                  </select>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-white border-b-2 border-blue-200">
                    <tr>
                      <th className="px-2 sm:px-4 py-2 sm:py-3 text-left font-black text-gray-900 uppercase whitespace-nowrap">
                        Employee ID
                      </th>
                      <th className="px-2 sm:px-4 py-2 sm:py-3 text-left font-black text-gray-900 uppercase whitespace-nowrap">
                        Name
                      </th>
                      <th className="px-2 sm:px-4 py-2 sm:py-3 text-left font-black text-gray-900 uppercase whitespace-nowrap">
                        Department
                      </th>
                      <th className="px-2 sm:px-4 py-2 sm:py-3 text-left font-black text-gray-900 uppercase whitespace-nowrap">
                        Position
                      </th>
                      <th className="px-2 sm:px-4 py-2 sm:py-3 text-left font-black text-gray-900 uppercase whitespace-nowrap">
                        Time In
                      </th>
                      <th className="px-2 sm:px-4 py-2 sm:py-3 text-left font-black text-gray-900 uppercase whitespace-nowrap">
                        Time Out
                      </th>
                      <th className="px-2 sm:px-4 py-2 sm:py-3 text-left font-black text-gray-900 uppercase whitespace-nowrap">
                        Remarks
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-blue-100">
                    {filteredAttendance.length > 0 ? (
                      filteredAttendance.map((record, index) => (
                        <tr
                          key={index}
                          className="hover:bg-white/50 transition-colors"
                        >
                          <td className="px-2 sm:px-4 py-2 sm:py-3 text-gray-900">
                            {record.employeeId}
                          </td>
                          <td className="px-2 sm:px-4 py-2 sm:py-3 text-gray-900">
                            {record.name}
                          </td>
                          <td className="px-2 sm:px-4 py-2 sm:py-3 text-gray-900">
                            {record.department}
                          </td>
                          <td className="px-2 sm:px-4 py-2 sm:py-3 text-gray-900">
                            {record.position}
                          </td>
                          <td className="px-2 sm:px-4 py-2 sm:py-3 text-gray-900">
                            {record.timeIn || "-"}
                          </td>
                          <td className="px-2 sm:px-4 py-2 sm:py-3 text-gray-900">
                            {record.timeOut || "-"}
                          </td>
                          <td
                            className={`px-2 sm:px-4 py-2 sm:py-3 ${
                              record.remarks === "Present"
                                ? "text-green-600"
                                : record.remarks === null
                                ? "text-red-600"
                                : "text-red-600"
                            } font-semibold`}
                          >
                            {record.remarks || "-"}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="7"
                          className="px-4 py-8 text-center text-gray-500"
                        >
                          No records found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Schedule Tab */}
          {activeTab === "schedule" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                  <h2 className="text-lg sm:text-xl font-black text-gray-900">
                    {monthNames[currentMonth.getMonth()]}{" "}
                    {currentMonth.getFullYear()}
                  </h2>
                  <button
                    onClick={() => navigate("/admin-leave-requests")}
                    className="px-4 py-2 bg-blue-500 text-white text-sm font-semibold rounded-lg hover:bg-blue-600 transition-colors w-full sm:w-auto"
                  >
                    Leave Request
                  </button>
                </div>

                {/* Search and Filter */}
                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search by Employee ID or Department"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white w-full sm:w-auto"
                  >
                    <option value="">Sort by</option>
                    <option value="employee">Employee ID</option>
                    <option value="department">Department</option>
                  </select>
                </div>

                {/* Schedule Table */}
                <div className="overflow-x-auto">
                  {loadingSchedule ? (
                    <div className="text-center py-8 text-gray-500">
                      Loading schedules...
                    </div>
                  ) : (
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-2 sm:px-4 py-2 sm:py-3 text-left font-black text-gray-900 uppercase">
                            No.
                          </th>
                          <th className="px-2 sm:px-4 py-2 sm:py-3 text-left font-black text-gray-900 uppercase">
                            Name
                          </th>
                          <th className="px-2 sm:px-4 py-2 sm:py-3 text-left font-black text-gray-900 uppercase">
                            Employment Type
                          </th>
                          <th className="px-2 sm:px-4 py-2 sm:py-3 text-left font-black text-gray-900 uppercase">
                            Scheduled Days
                          </th>
                          <th className="px-2 sm:px-4 py-2 sm:py-3 text-left font-black text-gray-900 uppercase">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {filteredSchedule.length > 0 ? (
                          filteredSchedule.map((record, key) => {
                            console.log("Schedule Record:", record);
                            const isOnLeave =
                              record.employmentType == "On Leave"
                                ? true
                                : false;
                            const allWeekDays = [
                              "Monday",
                              "Tuesday",
                              "Wednesday",
                              "Thursday",
                              "Friday",
                              "Saturday",
                              "Sunday",
                            ];
                            const hasAllDays = allWeekDays.every((day) =>
                              record.days.includes(day)
                            );
                            const displayDays = hasAllDays
                              ? ["Everyday"]
                              : record.days;

                            return (
                              <tr
                                key={key}
                                className={`transition-colors ${
                                  isOnLeave
                                    ? "bg-red-50 cursor-not-allowed"
                                    : "hover:bg-gray-50"
                                }`}
                              >
                                <td className="px-2 sm:px-4 py-2 sm:py-3 text-gray-900 font-semibold">
                                  {key + 1}
                                </td>
                                <td className="px-2 sm:px-4 py-2 sm:py-3 text-gray-900">
                                  {record.name}
                                  {isOnLeave && (
                                    <span className="ml-2 px-2 py-0.5 bg-red-200 text-red-800 text-xs font-bold rounded">
                                      ON LEAVE
                                    </span>
                                  )}
                                </td>
                                <td className="px-2 sm:px-4 py-2 sm:py-3 text-gray-900 text-xs">
                                  {record.employmentType}
                                </td>
                                <td className="px-2 sm:px-4 py-2 sm:py-3">
                                  <div className="flex flex-wrap gap-1">
                                    {displayDays.map((day, idx) => (
                                      <span
                                        key={idx}
                                        className={`px-2 py-1 rounded text-xs font-semibold whitespace-nowrap ${
                                          isOnLeave
                                            ? "bg-red-100 text-red-700"
                                            : "bg-blue-100 text-blue-700"
                                        }`}
                                      >
                                        {day === "Everyday"
                                          ? day
                                          : day.substring(0, 3)}
                                      </span>
                                    ))}
                                  </div>
                                </td>
                                <td className="px-2 sm:px-4 py-2 sm:py-3">
                                  <div className="flex gap-2 items-center">
                                    <button
                                      onClick={() =>
                                        !isOnLeave && handleEditSchedule(record)
                                      }
                                      disabled={isOnLeave}
                                      className={`p-1 rounded transition-colors ${
                                        isOnLeave
                                          ? "opacity-50 cursor-not-allowed"
                                          : "hover:bg-blue-100"
                                      }`}
                                      title={
                                        isOnLeave
                                          ? "Cannot edit - Employee on leave"
                                          : "Edit schedule"
                                      }
                                    >
                                      <Edit
                                        className={`w-4 h-4 ${
                                          isOnLeave
                                            ? "text-gray-400"
                                            : "text-blue-600"
                                        }`}
                                      />
                                    </button>
                                    <button
                                      onClick={() => {
                                        if (isOnLeave) return;
                                        if (
                                          window.confirm(
                                            "Are you sure you want to delete all schedules for this employee?"
                                          )
                                        ) {
                                          setScheduleData((prev) =>
                                            prev.filter(
                                              (s) =>
                                                s.employeeId !==
                                                record.employeeId
                                            )
                                          );
                                        }
                                      }}
                                      disabled={isOnLeave}
                                      className={`p-1 rounded transition-colors ${
                                        isOnLeave
                                          ? "opacity-50 cursor-not-allowed"
                                          : "hover:bg-red-100"
                                      }`}
                                      title={
                                        isOnLeave
                                          ? "Cannot delete - Employee on leave"
                                          : "Delete all schedules for this employee"
                                      }
                                    >
                                      <Trash2
                                        className={`w-4 h-4 ${
                                          isOnLeave
                                            ? "text-gray-400"
                                            : "text-red-600"
                                        }`}
                                      />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td
                              colSpan="5"
                              className="px-4 py-8 text-center text-gray-500"
                            >
                              {scheduleData.length === 0
                                ? "No schedules found"
                                : "No matching schedules"}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>

              {/* Right Side - Calendar and Empty Container */}
              <div className="space-y-6">
                {/* Calendar */}
                <div className="bg-white rounded-xl shadow-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-black text-gray-900">
                      {monthNames[currentMonth.getMonth()]}{" "}
                      {currentMonth.getFullYear()}
                    </h3>
                    <div className="flex gap-1">
                      <button
                        onClick={() =>
                          setCurrentMonth(
                            new Date(
                              currentMonth.getFullYear(),
                              currentMonth.getMonth() - 1,
                              1
                            )
                          )
                        }
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                      >
                        <ChevronLeft className="w-4 h-4 text-gray-600" />
                      </button>
                      <button
                        onClick={() =>
                          setCurrentMonth(
                            new Date(
                              currentMonth.getFullYear(),
                              currentMonth.getMonth() + 1,
                              1
                            )
                          )
                        }
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                      >
                        <ChevronRight className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-7 gap-1">
                    {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map(
                      (day) => (
                        <div
                          key={day}
                          className="text-center text-xs font-bold text-gray-600 py-1"
                        >
                          {day}
                        </div>
                      )
                    )}
                    {Array.from({ length: startingDayOfWeek }).map(
                      (_, index) => (
                        <div
                          key={`empty-${index}`}
                          className="aspect-square"
                        ></div>
                      )
                    )}
                    {Array.from({ length: daysInMonth }).map((_, index) => {
                      const day = index + 1;
                      const isToday = day === 14;
                      return (
                        <button
                          key={day}
                          className={`aspect-square flex items-center justify-center text-xs font-semibold rounded transition-colors ${
                            isToday
                              ? "bg-blue-500 text-white"
                              : "hover:bg-gray-100 text-gray-900"
                          }`}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-4 min-h-[150px]"></div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Schedule Modal */}
      {isEditScheduleModalOpen && editingSchedule && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-6 text-white">
              <h2 className="text-2xl font-black">Edit Schedule</h2>
              <p className="text-blue-100 text-sm mt-1">
                Employee ID: {editingSchedule.employeeId}
              </p>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Department
                </label>
                <input
                  type="text"
                  value={editingSchedule.department}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Employment Type
                </label>
                <input
                  type="text"
                  value={editingSchedule.employmentType}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Current Scheduled Days
                </label>
                <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg">
                  {editingSchedule.days && editingSchedule.days.length > 0 ? (
                    editingSchedule.days.map((day, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold"
                      >
                        {day}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500 text-sm">
                      No scheduled days
                    </span>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Add/Edit Day of Week
                </label>
                <select
                  value={editingDay}
                  onChange={(e) => setEditingDay(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="">Select a day to add</option>
                  {[
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                    "Sunday",
                  ].map((day) => (
                    <option
                      key={day}
                      value={day}
                      disabled={editingSchedule.days.includes(day)}
                    >
                      {day}
                      {editingSchedule.days.includes(day)
                        ? " (Already scheduled)"
                        : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-blue-600">
                  <strong>Note:</strong> Select a day to add to this employee's
                  schedule. Changes will be saved when you click Save Changes.
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex gap-3 px-6 py-4 bg-gray-50 border-t border-gray-200">
              <button
                onClick={() => {
                  setIsEditScheduleModalOpen(false);
                  setEditingSchedule(null);
                  setEditingDay("");
                }}
                className="flex-1 px-4 py-2 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveSchedule}
                className="flex-1 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
