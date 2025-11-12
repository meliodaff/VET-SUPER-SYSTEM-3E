import React, { useEffect, useState } from "react";
import EmployeeNavbar from "../components/Sections/EmployeeNavbar";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import useGetAttendanceRecord from "../api/useGetAttendanceRecord";
export default function EmployeeSchedule({ employee }) {
  const [activeTab, setActiveTab] = useState("attendance");
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 8, 1)); // September 2025
  const [hoveredDate, setHoveredDate] = useState(null);

  const [scheduleData, setScheduleData] = useState([]);
  const { getAllAttendanceById } = useGetAttendanceRecord();
  // useEffect(() => {
  //   const useGetAllAttendanceById = async (id) => {
  //     const response = await getAllAttendanceById(id);
  //     if (!response.success) {
  //       alert(response.message);
  //       return;
  //     }
  //     console.log(response.data);
  //     const formattedData = response.data.map((data) => {
  //       if (!data.check_in_time && !data.check_out_time) {
  //         return {
  //           status: data.attendance_status,
  //           remarks: data.notes || " - ",
  //         };
  //       }

  //       const timeInDate = new Date(data.check_in_time.replace(" ", "T")); // Replace space with 'T' for ISO format
  //       const timeOutDate = new Date(data.check_out_time.replace(" ", "T")); // Replace space with 'T' for ISO format

  //       const formattedTimeIn = timeInDate.toLocaleTimeString([], {
  //         hour: "2-digit",
  //         minute: "2-digit",
  //         hour12: true,
  //       });
  //       const formattedTimeOut = timeOutDate.toLocaleTimeString([], {
  //         hour: "2-digit",
  //         minute: "2-digit",
  //         hour12: true,
  //       });

  //       return {
  //         status: data.attendance_status.toLowerCase(),
  //         timeIn: formattedTimeIn,
  //         timeOut: formattedTimeOut,
  //         remarks: data.notes || " - ",
  //       };
  //     });

  //     console.log(formattedData);
  //     setScheduleData(formattedData);
  //   };

  //   useGetAllAttendanceById(1);
  // }, []);

  // "2025-09-01": {
  //   status: "present",
  //   timeIn: "8:00 AM",
  //   timeOut: "5:00 PM",
  //   remarks: "On time",
  // },

  // const scheduleData = {
  //   "2025-09-01": {
  //     status: "present",
  //     timeIn: "8:00 AM",
  //     timeOut: "5:00 PM",
  //     remarks: "On time",
  //   },
  //   "2025-09-02": {
  //     status: "late",
  //     timeIn: "11:30 AM",
  //     timeOut: "6:30 PM",
  //     remarks: "1 hour and 30 mins late",
  //   },
  //   "2025-09-03": {
  //     status: "present",
  //     timeIn: "7:55 AM",
  //     timeOut: "5:00 PM",
  //     remarks: "Early arrival",
  //   },
  //   "2025-09-04": {
  //     status: "present",
  //     timeIn: "8:00 AM",
  //     timeOut: "5:00 PM",
  //     remarks: "On time",
  //   },
  //   "2025-09-05": {
  //     status: "present",
  //     timeIn: "8:00 AM",
  //     timeOut: "5:00 PM",
  //     remarks: "On time",
  //   },
  //   "2025-09-08": {
  //     status: "present",
  //     timeIn: "8:00 AM",
  //     timeOut: "5:00 PM",
  //     remarks: "On time",
  //   },
  //   "2025-09-09": { status: "absent", remarks: "Unexcused absence" },
  //   "2025-09-10": {
  //     status: "present",
  //     timeIn: "8:05 AM",
  //     timeOut: "5:00 PM",
  //     remarks: "Slightly late",
  //   },
  //   "2025-09-11": {
  //     status: "present",
  //     timeIn: "8:00 AM",
  //     timeOut: "5:00 PM",
  //     remarks: "On time",
  //   },
  //   "2025-09-12": {
  //     status: "present",
  //     timeIn: "8:00 AM",
  //     timeOut: "5:00 PM",
  //     remarks: "On time",
  //   },
  //   "2025-09-15": {
  //     status: "present",
  //     timeIn: "8:00 AM",
  //     timeOut: "5:00 PM",
  //     remarks: "On time",
  //   },
  //   "2025-09-16": {
  //     status: "present",
  //     timeIn: "7:50 AM",
  //     timeOut: "5:00 PM",
  //     remarks: "Training session at 3 PM",
  //   },
  //   "2025-09-17": {
  //     status: "late",
  //     timeIn: "9:15 AM",
  //     timeOut: "5:00 PM",
  //     remarks: "1 hour 15 mins late",
  //   },
  //   "2025-09-18": {
  //     status: "present",
  //     timeIn: "8:00 AM",
  //     timeOut: "5:00 PM",
  //     remarks: "On time",
  //   },
  //   "2025-09-19": {
  //     status: "present",
  //     timeIn: "8:00 AM",
  //     timeOut: "5:00 PM",
  //     remarks: "On time",
  //   },
  //   "2025-09-22": {
  //     status: "present",
  //     timeIn: "8:00 AM",
  //     timeOut: "5:00 PM",
  //     remarks: "On time",
  //   },
  //   "2025-09-23": {
  //     status: "present",
  //     timeIn: "8:00 AM",
  //     timeOut: "5:00 PM",
  //     remarks: "On time",
  //   },
  //   "2025-09-24": {
  //     status: "present",
  //     timeIn: "8:00 AM",
  //     timeOut: "5:00 PM",
  //     remarks: "On time",
  //   },
  //   "2025-09-25": {
  //     status: "present",
  //     timeIn: "8:00 AM",
  //     timeOut: "5:00 PM",
  //     remarks: "On time",
  //   },
  //   "2025-09-26": {
  //     status: "present",
  //     timeIn: "8:00 AM",
  //     timeOut: "5:00 PM",
  //     remarks: "Weekend coverage",
  //   },
  //   "2025-09-29": {
  //     status: "present",
  //     timeIn: "8:00 AM",
  //     timeOut: "5:00 PM",
  //     remarks: "On time",
  //   },
  //   "2025-09-30": {
  //     status: "present",
  //     timeIn: "8:00 AM",
  //     timeOut: "5:00 PM",
  //     remarks: "Month-end closing",
  //   },
  // };

  // Function to check if day is weekend

  // useEffect(() => {
  //   const useGetAllAttendanceById = async (id) => {
  //     const response = await getAllAttendanceById(id);
  //     if (!response.success) {
  //       alert(response.message);
  //       return;
  //     }
  //     console.log(response.data);

  //     const formattedData = response.data.reduce((acc, data) => {
  //       // Skip records without attendance_date
  //       if (!data.schedule_day) {
  //         console.warn("Skipping record without date:", data);
  //         return acc;
  //       }

  //       // Use attendance_date as the key (YYYY-MM-DD format)
  //       const dateKey = data.schedule_day;

  //       // Handle absent or records without times
  //       if (!data.check_in_time && !data.check_out_time) {
  //         acc[dateKey] = {
  //           status: data.attendance_status?.toLowerCase() || "unknown",
  //           remarks: data.notes || " - ",
  //         };
  //         return acc;
  //       }

  //       // Format times
  //       const timeInDate = new Date(data.check_in_time.replace(" ", "T"));
  //       const timeOutDate = new Date(data.check_out_time.replace(" ", "T"));

  //       const formattedTimeIn = timeInDate.toLocaleTimeString([], {
  //         hour: "2-digit",
  //         minute: "2-digit",
  //         hour12: true,
  //       });
  //       const formattedTimeOut = timeOutDate.toLocaleTimeString([], {
  //         hour: "2-digit",
  //         minute: "2-digit",
  //         hour12: true,
  //       });

  //       acc[dateKey] = {
  //         status: data.attendance_status?.toLowerCase() || "unknown",
  //         timeIn: formattedTimeIn,
  //         timeOut: formattedTimeOut,
  //         remarks:
  //           data.notes === "on leave"
  //             ? "leave"
  //             : data.notes
  //             ? data.notes
  //             : " - ",
  //       };

  //       return acc;
  //     }, {}); // Start with empty object

  //     console.log(formattedData);
  //     setScheduleData(formattedData);
  //   };

  //   useGetAllAttendanceById(1);
  // }, []);

  useEffect(() => {
    const fetchAndFormatAttendance = async (id) => {
      const response = await getAllAttendanceById(id);

      if (!response.success) {
        alert(response.message);
        return;
      }

      const formattedData = formatAttendanceData(response.data);
      const completeData = fillMissingDaysAsOff(formattedData);

      setScheduleData(completeData);
    };

    fetchAndFormatAttendance(1);
  }, []);

  // Helper function to format a single attendance record
  const formatAttendanceRecord = (data) => {
    const status = data.attendance_status?.toLowerCase() || "unknown";
    const isLeave = status === "on leave" || status === "leave";

    // Base record structure
    const record = {
      status: isLeave ? "leave" : status,
      remarks: data.notes || " - ",
    };

    // Add time information if available
    if (data.check_in_time && data.check_out_time) {
      const formatTime = (timeString) => {
        const date = new Date(timeString.replace(" ", "T"));
        return date.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });
      };

      record.timeIn = formatTime(data.check_in_time);
      record.timeOut = formatTime(data.check_out_time);
    }

    return record;
  };

  // Format all attendance data from API
  const formatAttendanceData = (dataArray) => {
    return dataArray.reduce((acc, data) => {
      if (!data.schedule_day) {
        console.warn("Skipping record without date:", data);
        return acc;
      }

      acc[data.schedule_day] = formatAttendanceRecord(data);
      return acc;
    }, {});
  };

  // Fill missing weekdays as day off
  const fillMissingDaysAsOff = (data) => {
    const result = { ...data };
    const dates = Object.keys(data);

    if (dates.length === 0) return result;

    const sortedDates = dates.sort();
    const startDate = new Date(sortedDates[0]);
    const endDate = new Date(sortedDates[sortedDates.length - 1]);

    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const dateKey = currentDate.toISOString().split("T")[0];
      const dayOfWeek = currentDate.getDay();
      const isWeekday = dayOfWeek !== 0 && dayOfWeek !== 6;

      if (!result[dateKey] && isWeekday) {
        result[dateKey] = {
          status: "dayoff",
          remarks: "Day Off",
        };
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return result;
  };

  const isWeekend = (day) => {
    const date = new Date(year, month, day);
    const dayOfWeek = date.getDay();
    return dayOfWeek === 0 || dayOfWeek === 6; // 0 = Sunday, 6 = Saturday
  };

  // Attendance summary
  const attendanceSummary = {
    present: 25,
    workdays: 25,
    restday: 8,
    leave: 2,
    leaveBalance: 5,
  };

  const handleNavigation = (navName) => {
    console.log("Navigate to:", navName);
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const { daysInMonth, startingDayOfWeek, year, month } =
    getDaysInMonth(currentMonth);
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

  const getDateKey = (day) => {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;
  };

  const getDateStatus = (day) => {
    const dateKey = getDateKey(day);
    return scheduleData[dateKey];
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "present":
        return "bg-green-200 text-gray-900";
      case "late":
        return "bg-yellow-200 text-gray-900";
      case "absent":
        return "bg-red-200 text-gray-900";
      case "leave":
        return "bg-purple-200 text-gray-900";
      case "dayoff":
        return "bg-blue-200 text-gray-900";
      default:
        return "bg-gray-100 text-gray-400";
    }
  };

  const getScheduleStatusColor = (status) => {
    if (status === "present") return "bg-green-200 text-gray-900";
    if (status === "absent") return "bg-red-200 text-gray-900";
    return "bg-gray-50 text-gray-400";
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "present":
        return "PRESENT";
      case "late":
        return "PRESENT - LATE";
      case "absent":
        return "ABSENT";
      case "leave":
        return "LEAVE";
      case "dayoff":
        return "DAY OFF";
      default:
        return "";
    }
  };

  const handlePrevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  const formatDate = (day) => {
    const date = new Date(year, month, day);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "2-digit",
      year: "numeric",
    });
  };

  return (
    <>
      <EmployeeNavbar employee={employee} onNavigate={handleNavigation} />

      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Tab Navigation */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setActiveTab("attendance")}
              className={`flex-1 px-6 py-3 rounded-lg font-bold text-sm transition-all ${
                activeTab === "attendance"
                  ? "bg-blue-400 text-white shadow-md"
                  : "bg-gray-200 text-gray-600 hover:bg-gray-300"
              }`}
            >
              ATTENDANCE
            </button>
            <button
              onClick={() => setActiveTab("schedule")}
              className={`flex-1 px-6 py-3 rounded-lg font-bold text-sm transition-all ${
                activeTab === "schedule"
                  ? "bg-blue-400 text-white shadow-md"
                  : "bg-gray-200 text-gray-600 hover:bg-gray-300"
              }`}
            >
              WORK SCHEDULE
            </button>
          </div>

          {/* Attendance Tab */}
          {activeTab === "attendance" && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mb-6">
                MY ATTENDANCE
              </h1>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Calendar */}
                <div className="lg:col-span-2">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-black text-gray-900">
                      {monthNames[month]} {year}
                    </h2>
                    <div className="flex gap-2">
                      <button
                        onClick={handlePrevMonth}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <ChevronLeft className="w-5 h-5 text-gray-600" />
                      </button>
                      <button
                        onClick={handleNextMonth}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <ChevronRight className="w-5 h-5 text-gray-600" />
                      </button>
                    </div>
                  </div>

                  {/* Legend - Attendance */}
                  <div className="mb-4 flex flex-wrap gap-3 text-xs sm:text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-green-200"></div>
                      <span className="font-semibold text-gray-700">
                        Present
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-yellow-200"></div>
                      <span className="font-semibold text-gray-700">Late</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-red-200"></div>
                      <span className="font-semibold text-gray-700">
                        Absent
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-purple-200"></div>
                      <span className="font-semibold text-gray-700">Leave</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-blue-200"></div>
                      <span className="font-semibold text-gray-700">
                        Day Off
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-7 gap-2">
                    {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map(
                      (day) => (
                        <div
                          key={day}
                          className="text-center text-xs font-bold text-gray-600 py-2"
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
                      const dateStatus = getDateStatus(day);
                      const dateKey = getDateKey(day);
                      const isDayOff = isWeekend(day);

                      return (
                        <div
                          key={day}
                          className="relative"
                          onMouseEnter={() => setHoveredDate(dateKey)}
                          onMouseLeave={() => setHoveredDate(null)}
                        >
                          <div
                            className={`aspect-square flex flex-col items-center justify-center rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                              isDayOff
                                ? "bg-blue-200 text-gray-900"
                                : dateStatus
                                ? getStatusColor(dateStatus.status)
                                : "bg-gray-50 text-gray-400 hover:bg-gray-100"
                            }`}
                          >
                            <span>{day}</span>
                          </div>

                          {/* Tooltip on hover */}
                          {hoveredDate === dateKey &&
                            (isDayOff || dateStatus) && (
                              <div className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-white border-2 border-gray-200 rounded-lg p-4 shadow-xl">
                                <div className="text-center mb-3">
                                  <div className="font-bold text-gray-900 mb-1">
                                    {formatDate(day)}
                                  </div>
                                  <div className="font-bold text-lg text-gray-900">
                                    {isDayOff
                                      ? "DAY OFF"
                                      : getStatusLabel(dateStatus?.status)}
                                  </div>
                                </div>

                                {dateStatus?.timeIn && (
                                  <div className="space-y-1 mb-3 text-sm">
                                    <div className="flex justify-between">
                                      <span className="text-gray-600">
                                        Time in:
                                      </span>
                                      <span className="font-semibold text-gray-900">
                                        {dateStatus.timeIn}
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-gray-600">
                                        Time out:
                                      </span>
                                      <span className="font-semibold text-gray-900">
                                        {dateStatus.timeOut}
                                      </span>
                                    </div>
                                  </div>
                                )}

                                {(dateStatus?.remarks || isDayOff) && (
                                  <div className="text-sm border-t border-gray-200 pt-2">
                                    <div className="text-red-600 font-bold mb-1">
                                      REMARKS:
                                    </div>
                                    <div className="text-gray-900">
                                      {isDayOff
                                        ? "Weekend"
                                        : dateStatus?.remarks}
                                    </div>
                                  </div>
                                )}

                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-gray-200"></div>
                              </div>
                            )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Summary */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-bold text-gray-700 mb-2">
                    Summary
                  </h3>
                  <p className="text-xs text-gray-500">
                    Attendance statistics for the month
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Work Schedule Tab */}
          {activeTab === "schedule" && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
                <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
                  MY SCHEDULE
                </h1>
                <Link to="/leave-request">
                  <button className="mt-4 sm:mt-0 px-6 py-2 bg-white border-2 border-gray-300 rounded-lg font-semibold text-sm hover:bg-gray-50 transition-colors">
                    Request Leave
                  </button>
                </Link>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Calendar */}
                <div className="lg:col-span-2">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-black text-gray-900">
                      {monthNames[month]} {year}
                    </h2>
                    <div className="flex gap-2">
                      <button
                        onClick={handlePrevMonth}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <ChevronLeft className="w-5 h-5 text-gray-600" />
                      </button>
                      <button
                        onClick={handleNextMonth}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <ChevronRight className="w-5 h-5 text-gray-600" />
                      </button>
                    </div>
                  </div>

                  {/* Legend - Work Schedule */}
                  <div className="mb-4 flex flex-wrap gap-3 text-xs sm:text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-green-200"></div>
                      <span className="font-semibold text-gray-700">
                        Present
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-red-200"></div>
                      <span className="font-semibold text-gray-700">
                        Absent
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-7 gap-2">
                    {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map(
                      (day) => (
                        <div
                          key={day}
                          className="text-center text-xs font-bold text-gray-600 py-2"
                        >
                          {day}
                        </div>
                      )
                    )}

                    {Array.from({ length: startingDayOfWeek }).map(
                      (_, index) => (
                        <div
                          key={`empty-${index}`}
                          className="aspect-square bg-gray-50 rounded-lg"
                        ></div>
                      )
                    )}

                    {Array.from({ length: daysInMonth }).map((_, index) => {
                      const day = index + 1;
                      const dateStatus = getDateStatus(day);
                      const dateKey = getDateKey(day);
                      const isDayOff = isWeekend(day);

                      return (
                        <div
                          key={day}
                          className="relative"
                          onMouseEnter={() => setHoveredDate(dateKey)}
                          onMouseLeave={() => setHoveredDate(null)}
                        >
                          <div
                            className={`aspect-square flex items-center justify-center rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                              isDayOff
                                ? "bg-blue-200 text-gray-900"
                                : dateStatus
                                ? getScheduleStatusColor(dateStatus.status)
                                : "bg-gray-50 text-gray-400 hover:bg-gray-100"
                            }`}
                          >
                            {day}
                          </div>

                          {/* Tooltip on hover */}
                          {hoveredDate === dateKey &&
                            (isDayOff || dateStatus) && (
                              <div className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-white border-2 border-gray-200 rounded-lg p-4 shadow-xl">
                                <div className="text-center mb-3">
                                  <div className="font-bold text-gray-900 mb-1">
                                    {formatDate(day)}
                                  </div>
                                  <div className="font-bold text-lg text-gray-900">
                                    {isDayOff
                                      ? "DAY OFF"
                                      : getStatusLabel(dateStatus?.status)}
                                  </div>
                                </div>

                                {dateStatus?.timeIn && (
                                  <div className="space-y-1 mb-3 text-sm">
                                    <div className="flex justify-between">
                                      <span className="text-gray-600">
                                        Time in:
                                      </span>
                                      <span className="font-semibold text-gray-900">
                                        {dateStatus.timeIn}
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-gray-600">
                                        Time out:
                                      </span>
                                      <span className="font-semibold text-gray-900">
                                        {dateStatus.timeOut}
                                      </span>
                                    </div>
                                  </div>
                                )}

                                {(dateStatus?.remarks || isDayOff) && (
                                  <div className="text-sm border-t border-gray-200 pt-2">
                                    <div className="text-red-600 font-bold mb-1">
                                      REMARKS:
                                    </div>
                                    <div className="text-gray-900">
                                      {isDayOff
                                        ? "Weekend"
                                        : dateStatus?.remarks}
                                    </div>
                                  </div>
                                )}

                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-gray-200"></div>
                              </div>
                            )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Summary */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="space-y-4 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-700">
                        Total of Workdays:
                      </span>
                      <span className="text-xl font-black text-gray-900">
                        {attendanceSummary.workdays}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-700">
                        Total of Restday:
                      </span>
                      <span className="text-xl font-black text-gray-900">
                        {attendanceSummary.restday}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-700">
                        Total of Leave:
                      </span>
                      <span className="text-xl font-black text-gray-900">
                        {attendanceSummary.leave}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t border-gray-300">
                      <span className="font-semibold text-gray-700">
                        Leave Balance:
                      </span>
                      <span className="text-xl font-black text-gray-900">
                        {attendanceSummary.leaveBalance}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
