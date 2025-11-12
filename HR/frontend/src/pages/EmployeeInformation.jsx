import React, { useEffect, useState } from "react";
import { Camera, Edit } from "lucide-react";
import DashboardLayout from "../components/layouts/DashboardLayout";
import Dashboard from "./Dashboard";
import useGetEmployees from "../api/useGetEmployee";
import useGetAttendanceRecord from "../api/useGetAttendanceRecord";

export default function EmployeeInformation({ employee, onClose }) {
  const [activeTab, setActiveTab] = useState("profile");
  const [employeeInformation, setEmployeeInformation] = useState([]);
  const [attendanceSummary, setAttendanceSummary] = useState([]);
  const [
    employeeAttendanceRecordForMonth,
    setEmployeeAttendanceRecordForMonth,
  ] = useState([]);
  const { getEmployee, loadingForGetEmployee } = useGetEmployees();
  const { getAttendanceRecordForMonth, loadingForGetAttendanceRecordForMonth } =
    useGetAttendanceRecord();

  useEffect(() => {
    const useGetEmployeeFunc = async () => {
      const response = await getEmployee(employee.id);
      console.log(response);
      if (!response.success) {
        alert(response.message);
        return;
      }
      console.log(response.data);
      const record = response.data[0];
      const schedule = response.data[1];
      const formattedData = {
        birthDate: record.date_of_birth,
        address: record.address,
        contactNo: record.phone_number,
        email: record.contact_email,
        department: record.department,
        dateHired: record.hire_date,
        employmentType: record.employment_type,
        // schedule: record.schedule || null,
        gender: record.gender,
        schedule: schedule.schedule_pattern,
        photo: record.profile_image_url,
      };
      console.log(formattedData);
      setEmployeeInformation(formattedData);
    };

    useGetEmployeeFunc();
  }, []);

  useEffect(() => {
    const useGetAttendanceRecordForMonthFunc = async () => {
      const currentMonth = new Date().getMonth() + 1;
      const response = await getAttendanceRecordForMonth(
        employee.id,
        currentMonth
      );
      console.log(response);
      if (!response[0].success) {
        alert(response[0].message);
        return;
      }

      if (!response[1].success) {
        alert(response[1].message);
        return;
      }
      const formattedDataAttendanceRecord = response[0].data.map((record) => ({
        // date: record.check_in_time.split(" ")[0],
        date: record.schedule_day,
        timeIn: record.check_in_time,
        timeOut: record.check_out_time,
        remarks: record.attendance_status,
      }));
      console.log(response);
      const attendanceSummary = response[1].data;

      const formattedAttendanceSummary = {
        present: attendanceSummary.present_count,
        late: attendanceSummary.late_count,
        absent: attendanceSummary.absent_count,
        leave: attendanceSummary.leave,
        leaveBalance: attendanceSummary.leave_remaining, // needs to change this also to those categories
      };

      console.log(formattedAttendanceSummary);

      setEmployeeAttendanceRecordForMonth(formattedDataAttendanceRecord);
      setAttendanceSummary(formattedAttendanceSummary);
    };

    useGetAttendanceRecordForMonthFunc();
  }, []);

  // const attendanceSummary = {
  //   present: 20,
  //   absent: 1,
  //   late: 0,
  //   leave: 2,
  //   leaveBalance: 5,
  // };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900">
              PROFILE
            </h1>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
              title="Close"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Profile Card */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {/* Profile Pic */}
              <div className="relative">
                <div className="w-24 h-24 sm:w-32 sm:h-32 bg-blue-100 rounded-xl overflow-hidden">
                  <img
                    src={`http://localhost/hr-information-system/backend/${employeeInformation.photo}`}
                    alt={employee?.name || "Employee"}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Profile */}
              <div className="flex-1">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
                  {employee?.name || "Sphere Star"}
                </h2>
                <p className="text-sm text-gray-600 mb-1">
                  {employee?.position || "Vet Assistant"}
                </p>
                <p className="text-sm text-gray-600">
                  {employee?.email || "spherestar@gmail.com"}
                </p>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mt-6 border-t pt-4">
              <button
                onClick={() => setActiveTab("profile")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                  activeTab === "profile"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                </svg>
                PROFILE
              </button>
              <button
                onClick={() => setActiveTab("attendance")}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                  activeTab === "attendance"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                ATTENDANCE
              </button>
            </div>
          </div>

          {/* Profile Tab Content */}
          {activeTab === "profile" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Profile Information */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-black text-gray-900">
                    PROFILE INFORMATION
                  </h3>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Edit className="w-4 h-4 text-gray-600" />
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start">
                    <span className="text-sm text-gray-600 w-32 flex-shrink-0">
                      🎂 Birthdate:
                    </span>
                    <span className="text-sm text-gray-900">
                      {employeeInformation.birthDate}
                    </span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-sm text-gray-600 w-32 flex-shrink-0">
                      📍 Address:
                    </span>
                    <span className="text-sm text-gray-900">
                      {employeeInformation.address}
                    </span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-sm text-gray-600 w-32 flex-shrink-0">
                      📞 Contact No:
                    </span>
                    <span className="text-sm text-gray-900">
                      {employeeInformation.contactNo}
                    </span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-sm text-gray-600 w-32 flex-shrink-0">
                      📧 Email:
                    </span>
                    <span className="text-sm text-gray-900">
                      {employee.email}
                    </span>
                  </div>
                </div>

                {/* Benefits Section */}
                <div className="mt-6 pt-6 border-t">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-base font-bold text-gray-900">
                      Benefits
                    </h4>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <Edit className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 min-h-[100px]">
                    <p className="text-sm text-gray-500">
                      No benefits information added yet.
                    </p>
                  </div>
                </div>
              </div>

              {/* Employment Information */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-black text-gray-900 mb-4">
                  Employment Information
                </h3>

                <div className="space-y-3">
                  <div className="flex items-start">
                    <span className="text-sm text-gray-600 w-40 flex-shrink-0">
                      💼 Employee ID:
                    </span>
                    <span className="text-sm text-gray-900">
                      VT - {employee.id}
                    </span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-sm text-gray-600 w-40 flex-shrink-0">
                      🏢 Department:
                    </span>
                    <span className="text-sm text-gray-900">
                      {employeeInformation.department}
                    </span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-sm text-gray-600 w-40 flex-shrink-0">
                      📅 Date Hired:
                    </span>
                    <span className="text-sm text-gray-900">
                      {employeeInformation.dateHired}
                    </span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-sm text-gray-600 w-40 flex-shrink-0">
                      ⏰ Employment Type:
                    </span>
                    <span className="text-sm text-gray-900">
                      {employeeInformation.employmentType}
                    </span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-sm text-gray-600 w-40 flex-shrink-0">
                      📋 Schedule:
                    </span>
                    <span className="text-sm text-gray-900">
                      {employeeInformation.schedule && (
                        <>
                          {employeeInformation.schedule} <br />
                          9:00 AM - 5:00 PM
                        </>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Attendance Tab Content */}
          {activeTab === "attendance" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Attendance Record */}
              <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-black text-gray-900 mb-4">
                  ATTENDANCE RECORD
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-3 text-left font-black text-gray-900 uppercase">
                          Date
                        </th>
                        <th className="px-4 py-3 text-left font-black text-gray-900 uppercase">
                          Time In
                        </th>
                        <th className="px-4 py-3 text-left font-black text-gray-900 uppercase">
                          Time Out
                        </th>
                        <th className="px-4 py-3 text-left font-black text-gray-900 uppercase">
                          Remarks
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {employeeAttendanceRecordForMonth.map((record, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-gray-900">
                            {record.date}
                          </td>
                          <td className="px-4 py-3 text-gray-900">
                            {record.timeIn}
                          </td>
                          <td className="px-4 py-3 text-gray-900">
                            {record.timeOut}
                          </td>
                          <td className="px-4 py-3">
                            {record.remarks && (
                              <span
                                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                                  record.remarks !== "Present"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-green-100 text-green-800"
                                }`}
                              >
                                {record.remarks}
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Attendance Summary */}
              <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl shadow-md p-6">
                <h3 className="text-lg font-black text-gray-900 mb-4">
                  ATTENDANCE SUMMARY
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-gray-700">
                      PRESENT:
                    </span>
                    <span className="text-xl font-black text-gray-900">
                      {attendanceSummary.present}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-gray-700">
                      ABSENT:
                    </span>
                    <span className="text-xl font-black text-gray-900">
                      {attendanceSummary.absent}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-gray-700">
                      LATE:
                    </span>
                    <span className="text-xl font-black text-gray-900">
                      {attendanceSummary.late}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-gray-700">
                      VACATION LEAVE:
                    </span>
                    <span className="text-xl font-black text-gray-900">
                      {attendanceSummary.leave[0].leave_remaining} / 10
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-gray-700">
                      SICK LEAVE:
                    </span>
                    <span className="text-xl font-black text-gray-900">
                      {attendanceSummary.leave[1].leave_remaining} / 10
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-gray-700">
                      {employeeInformation.gender === "Male"
                        ? "PATERNITY"
                        : "MATERNITY"}{" "}
                      LEAVE:
                    </span>
                    <span className="text-xl font-black text-gray-900">
                      {attendanceSummary.leave[2].leave_remaining} /
                      {employeeInformation.gender === "Male" ? "7" : "105"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-gray-700">
                      EMERGENCY LEAVE:
                    </span>
                    <span className="text-xl font-black text-gray-900">
                      {attendanceSummary.leave[3].leave_remaining} / 3
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-blue-200">
                    <span className="text-sm font-semibold text-gray-700">
                      LEAVE BALANCE:
                    </span>
                    <span className="text-xl font-black text-gray-900">
                      {attendanceSummary.leave[0].leave_remaining +
                        attendanceSummary.leave[1].leave_remaining +
                        attendanceSummary.leave[2].leave_remaining +
                        attendanceSummary.leave[3].leave_remaining}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
