import React, { useState, useMemo, useEffect } from "react";
import { Search, Edit, ChevronLeft, ChevronRight, X, Save } from "lucide-react";
import DashboardLayout from "../components/layouts/DashboardLayout";
import useGetAttendanceRecord from "../api/useGetAttendanceRecord";

export default function AttendanceSchedule() {
  const [activeTab, setActiveTab] = useState("attendance");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 8, 1));
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedNotes, setEditedNotes] = useState("");

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

  // Sample schedule data
  const [scheduleData, setScheduleData] = useState([
    {
      employeeId: "VT-12345",
      name: "Sphere Star",
      shift: "09/10/2025",
      time: "10:00 AM",
      notes: "Morning shift",
    },
    {
      employeeId: "VT-22345",
      name: "Mean Arthur",
      shift: "09/10/2025",
      time: "10:05 AM",
      notes: "Full day",
    },
    {
      employeeId: "VT-32345",
      name: "Juan Dela Cruz",
      shift: "09/11/2025",
      time: "08:30 AM",
      notes: "Early shift",
    },
    {
      employeeId: "VT-42345",
      name: "Maria Santos",
      shift: "09/12/2025",
      time: "02:00 PM",
      notes: "Afternoon",
    },
  ]);

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

  // Filter and sort schedule
  const filteredSchedule = useMemo(() => {
    let filtered = scheduleData.filter((record) => {
      const query = searchQuery.toLowerCase();
      return (
        record.employeeId.toLowerCase().includes(query) ||
        record.name.toLowerCase().includes(query)
      );
    });

    if (sortBy === "position") {
      filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
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
                  <button className="px-4 py-2 bg-blue-500 text-white text-sm font-semibold rounded-lg hover:bg-blue-600 transition-colors w-full sm:w-auto">
                    Leave Request
                  </button>
                </div>

                {/* Search and Filter */}
                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                  <div className="relative flex-1">
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
                    <option value="position">Name A-Z</option>
                  </select>
                </div>

                {/* Schedule Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-2 sm:px-4 py-2 sm:py-3 text-left font-black text-gray-900 uppercase">
                          Employee ID
                        </th>
                        <th className="px-2 sm:px-4 py-2 sm:py-3 text-left font-black text-gray-900 uppercase">
                          Name
                        </th>
                        <th className="px-2 sm:px-4 py-2 sm:py-3 text-left font-black text-gray-900 uppercase">
                          Shift
                        </th>
                        <th className="px-2 sm:px-4 py-2 sm:py-3 text-left font-black text-gray-900 uppercase">
                          Time
                        </th>
                        <th className="px-2 sm:px-4 py-2 sm:py-3 text-left font-black text-gray-900 uppercase">
                          Notes
                        </th>
                        <th className="px-2 sm:px-4 py-2 sm:py-3"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredSchedule.length > 0 ? (
                        filteredSchedule.map((record, index) => (
                          <tr
                            key={index}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <td className="px-2 sm:px-4 py-2 sm:py-3 text-gray-900">
                              {record.employeeId}
                            </td>
                            <td className="px-2 sm:px-4 py-2 sm:py-3 text-gray-900">
                              {record.name}
                            </td>
                            <td className="px-2 sm:px-4 py-2 sm:py-3 text-gray-900">
                              {record.shift}
                            </td>
                            <td className="px-2 sm:px-4 py-2 sm:py-3 text-gray-900">
                              {record.time}
                            </td>
                            <td className="px-2 sm:px-4 py-2 sm:py-3">
                              {editingIndex === index ? (
                                <div className="flex gap-2 items-center">
                                  <input
                                    type="text"
                                    value={editedNotes}
                                    onChange={(e) =>
                                      setEditedNotes(e.target.value)
                                    }
                                    className="flex-1 px-2 py-1 border border-blue-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    autoFocus
                                  />
                                  <button
                                    onClick={() => handleSaveNotes(index)}
                                    className="p-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                                    title="Save"
                                  >
                                    <Save className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={handleCancelEdit}
                                    className="p-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                                    title="Cancel"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              ) : (
                                <span className="text-gray-900">
                                  {record.notes}
                                </span>
                              )}
                            </td>
                            <td className="px-2 sm:px-4 py-2 sm:py-3">
                              {editingIndex !== index && (
                                <button
                                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                                  onClick={() =>
                                    handleEditClick(index, record.notes)
                                  }
                                  title="Edit notes"
                                >
                                  <Edit className="w-4 h-4 text-gray-600" />
                                </button>
                              )}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="6"
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
    </DashboardLayout>
  );
}
