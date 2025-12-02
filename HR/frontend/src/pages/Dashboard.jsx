import {
  BarChart3,
  TrendingUp,
  Users,
  Calendar,
  Gift,
  Clock,
  FileText,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../components/layouts/DashboardLayout";
import useGetAdminAnalytics from "../api/useGetAdminAnalytics";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import useGetAttendanceRecord from "../api/useGetAttendanceRecord";
import useGetEmployees from "../api/useGetEmployee";
import useGetPerformanceReviews from "../api/useGetPerformanceReviews";

export default function Dashboard() {
  const [statsData, setStatsData] = useState(null);
  const { getAdminAnalytics } = useGetAdminAnalytics();
  const {
    getAttendanceRecordsForThisMonth,
    loadingForGetAttendanceForThisMonth,
  } = useGetAttendanceRecord();

  const { getEmployees, loadingForGetEmployees } = useGetEmployees();
  const [exporting, setExporting] = useState(false);

  const handleExportEmployees = async () => {
    try {
      setExporting(true);
      const response = await getEmployees();

      // Your API returns { data: [...] }
      if (!response || !response.data || !Array.isArray(response.data)) {
        alert("No employee data available");
        return;
      }

      const employees = response.data;

      if (employees.length === 0) {
        alert("No employee data to export");
        return;
      }

      // Create PDF in landscape mode for more columns
      const doc = new jsPDF("landscape");

      // fillColor: [41, 128, 185],
      // Header
      doc.setFontSize(20);
      doc.setTextColor(0, 0, 0);

      doc.text("Employee Data", 14, 20);

      // Metadata
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text(`Total Records: ${employees.length}`, 14, 28);
      doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 34);

      // Define columns to display
      const columns = [
        { header: "ID", dataKey: "employee_id" },
        { header: "First Name", dataKey: "first_name" },
        { header: "Last Name", dataKey: "last_name" },
        { header: "Contact No.", dataKey: "phone_number" },
        { header: "Address", dataKey: "address" },
        { header: "Department", dataKey: "department" },
        { header: "Position", dataKey: "position" },
        { header: "Gender", dataKey: "gender" },
        { header: "Date of Birth", dataKey: "date_of_birth" },
        { header: "Email", dataKey: "contact_email" },
        { header: "Hire Date", dataKey: "hire_date" },
        // { header: "Day", dataKey: "day_of_week" },
        // { header: "Scheduled Start", dataKey: "scheduled_start" },
        // { header: "Scheduled End", dataKey: "scheduled_end" },
        // { header: "Check In", dataKey: "check_in_time" },
        // { header: "Check Out", dataKey: "check_out_time" },
        // { header: "Status", dataKey: "attendance_status" },
        // { header: "Notes", dataKey: "notes" },
      ];
      console.log(employees);

      // { header: "First Name", dataKey: "first_name" },
      // { header: "Last Name", dataKey: "last_name" },
      // { header: "Contact No.", dataKey: "phone_number" },
      // { header: "Address", dataKey: "address" },
      // { header: "Department", dataKey: "department" },
      // { header: "Position", dataKey: "position" },
      // { header: "Gender", dataKey: "gender" },
      // { header: "Date of Birth", dataKey: "date_of_birth" },
      // { header: "Email", dataKey: "contact_email" },
      // { header: "Hire Date", dataKey: "hire_date" },

      // Prepare data - handle null values
      const tableData = employees.map((emp) => {
        console.log(emp);
        return {
          employee_id: emp.employee_id || "N/A",
          first_name: emp.first_name?.trim() || "N/A",
          last_name: emp.last_name?.trim() || "N/A",
          phone_number: emp.phone_number?.trim() || "N/A",
          address: emp.address?.trim() || "N/A",
          department: emp.department || "N/A",
          position: emp.Position || "N/A",
          gender: emp.gender || "N/A",
          date_of_birth: emp.date_of_birth || "N/A",
          contact_email: emp.contact_email || "N/A",
          hire_date: emp.hire_date || "N/A",
          // day_of_week: emp.day_of_week || "N/A",
          // scheduled_start: emp.scheduled_start || "N/A",
          // scheduled_end: emp.scheduled_end || "N/A",
          // check_in_time: emp.check_in_time || "N/A",
          // check_out_time: emp.check_out_time || "N/A",
          // attendance_status: emp.attendance_status || "N/A",
          // notes: emp.notes || "-",
        };
      });

      // Create table
      autoTable(doc, {
        columns: columns,
        body: tableData,
        startY: 40,
        styles: {
          fontSize: 7,
          cellPadding: 2,
        },
        headStyles: {
          // fillColor: [22, 163, 74],
          fillColor: [41, 128, 185],
          textColor: 255,
          fontStyle: "bold",
          fontSize: 8,
        },
        alternateRowStyles: {
          fillColor: [240, 253, 244],
        },
        margin: { top: 40, left: 10, right: 10 },
        columnStyles: {
          0: { cellWidth: 15 }, // ID
          1: { cellWidth: 25 }, // First Name
          2: { cellWidth: 25 }, // Last Name
          3: { cellWidth: 25 }, // Department
          4: { cellWidth: 30 }, // Position
        },
      });

      // Add page numbers
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(100);
        doc.text(
          `Page ${i} of ${pageCount}`,
          doc.internal.pageSize.width / 2,
          doc.internal.pageSize.height - 10,
          { align: "center" }
        );
      }

      // Save PDF
      doc.save(`employee_data_${new Date().toISOString().split("T")[0]}.pdf`);
    } catch (error) {
      console.error("Export error:", error);
      alert(`Failed to export: ${error.message}`);
    } finally {
      setExporting(false);
    }
  };

  const [isGenerating, setIsGenerating] = useState(false);

  const generatePDFReport = async () => {
    setIsGenerating(true);
    try {
      // Fetch attendance data
      const response = await getAttendanceRecordsForThisMonth();

      if (!response.success) {
        alert(response.message || "Failed to fetch attendance data");
        return;
      }

      const attendanceData = response.data;

      // Group data by employee
      const employeeMap = new Map();

      attendanceData.forEach((record) => {
        const key = record.employee_id;
        if (!employeeMap.has(key)) {
          employeeMap.set(key, {
            employee_id: record.employee_id,
            name: `${record.first_name} ${record.last_name}`,
            department: record.department,
            position: record.position,
            records: [],
          });
        }
        employeeMap.get(key).records.push(record);
      });

      // Calculate statistics for each employee
      const reportData = Array.from(employeeMap.values()).map((emp) => {
        const totalDays = emp.records.length;
        const presentDays = emp.records.filter(
          (r) => r.attendance_status === "Present"
        ).length;
        const lateDays = emp.records.filter(
          (r) => r.attendance_status === "Late"
        ).length;
        const absentDays = emp.records.filter(
          (r) => r.attendance_status === "Absent"
        ).length;
        const attendanceRate =
          totalDays > 0
            ? (((presentDays + lateDays) / totalDays) * 100).toFixed(2)
            : 0;

        return {
          employee_id: emp.employee_id,
          name: emp.name,
          department: emp.department,
          position: emp.position,
          totalDays,
          presentDays,
          lateDays,
          absentDays,
          attendanceRate,
        };
      });

      // Sort by department then name
      reportData.sort((a, b) => {
        if (a.department !== b.department) {
          return a.department.localeCompare(b.department);
        }
        return a.name.localeCompare(b.name);
      });

      // Create PDF
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();

      // Header
      doc.setFontSize(18);
      doc.setFont(undefined, "bold");
      doc.text("Attendance Report", pageWidth / 2, 20, { align: "center" });

      doc.setFontSize(12);
      doc.setFont(undefined, "normal");
      const currentDate = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      doc.text(`Generated: ${currentDate}`, pageWidth / 2, 28, {
        align: "center",
      });
      doc.text(
        `Period: ${new Date().toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        })}`,
        pageWidth / 2,
        35,
        { align: "center" }
      );

      // Summary Statistics
      const totalEmployees = reportData.length;
      const avgAttendanceRate =
        reportData.reduce(
          (sum, emp) => sum + parseFloat(emp.attendanceRate),
          0
        ) / totalEmployees;
      const totalPresent = reportData.reduce(
        (sum, emp) => sum + emp.presentDays,
        0
      );
      const totalLate = reportData.reduce((sum, emp) => sum + emp.lateDays, 0);
      const totalAbsent = reportData.reduce(
        (sum, emp) => sum + emp.absentDays,
        0
      );

      doc.setFontSize(10);
      doc.setFont(undefined, "bold");
      doc.text("Summary Statistics:", 14, 45);
      doc.setFont(undefined, "normal");
      doc.text(`Total Employees: ${totalEmployees}`, 14, 52);
      doc.text(
        `Average Attendance Rate: ${avgAttendanceRate.toFixed(2)}%`,
        14,
        58
      );
      doc.text(`Total Present Days: ${totalPresent}`, 14, 64);
      doc.text(`Total Late Days: ${totalLate}`, 100, 64);
      doc.text(`Total Absent Days: ${totalAbsent}`, 160, 64);

      // Employee Attendance Table
      autoTable(doc, {
        startY: 72,
        head: [
          [
            "ID",
            "Name",
            "Department",
            "Position",
            "Total",
            "Present",
            "Late",
            "Absent",
            "Rate %",
          ],
        ],
        body: reportData.map((emp) => [
          emp.employee_id,
          emp.name,
          emp.department,
          emp.position,
          emp.totalDays,
          emp.presentDays,
          emp.lateDays,
          emp.absentDays,
          emp.attendanceRate + "%",
        ]),
        theme: "grid",
        headStyles: {
          fillColor: [41, 128, 185],
          fontStyle: "bold",
          fontSize: 9,
        },
        bodyStyles: {
          fontSize: 8,
        },
        columnStyles: {
          0: { cellWidth: 12 },
          1: { cellWidth: 35 },
          2: { cellWidth: 25 },
          3: { cellWidth: 35 },
          4: { cellWidth: 15 },
          5: { cellWidth: 17 },
          6: { cellWidth: 13 },
          7: { cellWidth: 16 },
          8: { cellWidth: 18 },
        },
        margin: { left: 14, right: 14 },
      });

      // Footer
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setFont(undefined, "italic");
        doc.text(
          `Page ${i} of ${pageCount}`,
          pageWidth / 2,
          doc.internal.pageSize.getHeight() - 10,
          { align: "center" }
        );
      }

      // Save the PDF
      const fileName = `Attendance_Report_${
        new Date().toISOString().split("T")[0]
      }.pdf`;
      doc.save(fileName);

      // alert("Attendance report generated successfully!");
    } catch (error) {
      console.error("Error generating report:", error);
      alert("Error generating report: " + error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const { getPerformanceReviewsReport, loadingForGetPerformanceReviewsReport } =
    useGetPerformanceReviews();

  const generatePerformanceReport = useCallback(async () => {
    console.log("Generating performance report...");
    setIsGenerating(true);
    try {
      const response = await getPerformanceReviewsReport();

      if (!response?.success || !Array.isArray(response?.data)) {
        throw new Error(
          response?.message ?? "Failed to fetch performance data"
        );
      }

      const reviewsData = response.data;
      if (reviewsData.length === 0) {
        alert("No performance reviews found for this month");
        return;
      }

      const doc = new jsPDF();

      autoTable(doc, {
        head: [["ID", "Name", "Department", "Position", "Score"]],
        body: reviewsData.map((r) => [
          r.employee_id ?? "N/A",
          `${r.first_name ?? ""} ${r.last_name ?? ""}`.trim() || "N/A",
          r.department ?? "N/A",
          r.position ?? "N/A",
          Number(r.review_score ?? 0).toFixed(2),
        ]),
        theme: "grid",
      });

      const fileName = `Performance_Report_${
        new Date().toISOString().split("T")[0]
      }.pdf`;
      doc.save(fileName);
    } catch (error) {
      console.error("Error generating report:", error);
      alert("Error generating report: " + (error?.message ?? "Unknown error"));
    } finally {
      setIsGenerating(false);
    }
  }, []);

  useEffect(() => {
    const fetchAnalytics = async () => {
      const response = await getAdminAnalytics();
      if (!response.success) {
        alert(response.message);
        return;
      }
      const record = response.data;

      console.log(response.data);

      const formattedData = {
        overallAttendance:
          record.attendance?.overall_attendance_percentage ?? 0,
        avgPerformance: record.performance?.average_performance ?? 0,
        totalIncentives:
          record.totalIncentivesGivenByMonth?.total_incentives_value ?? 0,
      };

      setStatsData(formattedData);
    };
    fetchAnalytics();
  }, []);

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Welcome to Dashboard
            </h1>
            <p className="text-gray-600">
              Overview of your HR system performance
            </p>
          </div>

          {/* Key Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-400 to-blue-500 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-3xl sm:text-4xl font-bold">
                    {statsData?.overallAttendance}%
                  </div>
                  <div className="text-blue-100 text-sm mt-1">
                    Overall Attendance
                  </div>
                </div>
                <Users className="w-12 h-12 text-blue-200 opacity-50" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-400 to-green-500 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-3xl sm:text-4xl font-bold">
                    {statsData?.avgPerformance}
                  </div>
                  <div className="text-green-100 text-sm mt-1">
                    Average Performance
                  </div>
                </div>
                <TrendingUp className="w-12 h-12 text-green-200 opacity-50" />
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 sm:col-span-2 lg:col-span-1 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-gray-400 text-2xl font-semibold">
                      ₱
                    </span>
                    <div className="text-2xl sm:text-3xl font-bold text-gray-900">
                      {statsData?.totalIncentives.toLocaleString()}
                    </div>
                  </div>
                  <div className="text-gray-500 text-sm">
                    Total Incentives Given
                  </div>
                </div>
                <BarChart3 className="w-12 h-12 text-gray-300 opacity-50" />
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Link
              to="/admin-analytics"
              className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl hover:border-blue-300 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="bg-blue-100 p-3 rounded-lg group-hover:bg-blue-200 transition-colors">
                  <BarChart3 className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">
                    View Full Analytics
                  </h3>
                  <p className="text-sm text-gray-600">
                    Detailed charts and trends
                  </p>
                </div>
              </div>
            </Link>

            <Link
              to="/employees"
              className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl hover:border-green-300 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="bg-green-100 p-3 rounded-lg group-hover:bg-green-200 transition-colors">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">
                    Manage Employees
                  </h3>
                  <p className="text-sm text-gray-600">
                    View and manage all employees
                  </p>
                </div>
              </div>
            </Link>

            <Link
              to="/admin-schedule"
              className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl hover:border-purple-300 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="bg-purple-100 p-3 rounded-lg group-hover:bg-purple-200 transition-colors">
                  <Calendar className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">
                    Schedule Management
                  </h3>
                  <p className="text-sm text-gray-600">Manage work schedules</p>
                </div>
              </div>
            </Link>

            <Link
              to="/admin-incentives"
              className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl hover:border-yellow-300 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="bg-yellow-100 p-3 rounded-lg group-hover:bg-yellow-200 transition-colors">
                  <Gift className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Incentives</h3>
                  <p className="text-sm text-gray-600">
                    Manage employee incentives
                  </p>
                </div>
              </div>
            </Link>

            <Link
              to="/applicant"
              className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl hover:border-red-300 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="bg-red-100 p-3 rounded-lg group-hover:bg-red-200 transition-colors">
                  <FileText className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Applicants</h3>
                  <p className="text-sm text-gray-600">
                    Review job applications
                  </p>
                </div>
              </div>
            </Link>

            <Link
              to="/admin-leave-requests"
              className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl hover:border-orange-300 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="bg-orange-100 p-3 rounded-lg group-hover:bg-orange-200 transition-colors">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">
                    Leave Requests
                  </h3>
                  <p className="text-sm text-gray-600">
                    Manage employee leaves
                  </p>
                </div>
              </div>
            </Link>
          </div>

          {/* Quick Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900">System Status</h3>
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-sm">Analytics</span>
                  <span className="inline-block bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-semibold">
                    Active
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-sm">
                    Employee Database
                  </span>
                  <span className="inline-block bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-semibold">
                    Active
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-sm">
                    Scheduling System
                  </span>
                  <span className="inline-block bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-semibold">
                    Active
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900">Quick Actions</h3>
                <AlertCircle className="w-5 h-5 text-blue-500" />
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-900">Quick Actions</h3>
                  <AlertCircle className="w-5 h-5 text-blue-500" />
                </div>
                <div className="space-y-2">
                  <button
                    onClick={generatePDFReport}
                    className="w-full text-left px-3 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors text-blue-700 text-sm font-medium"
                  >
                    ▸ Generate Attendance Report
                  </button>
                  <button
                    onClick={generatePerformanceReport}
                    disabled={isGenerating}
                    className="w-full text-left px-3 py-2 rounded-lg bg-green-50 hover:bg-green-100 transition-colors text-green-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isGenerating
                      ? "⏳ Generating..."
                      : "▸ Export Employee Data"}
                  </button>

                  <button
                    onClick={generatePerformanceReport}
                    disabled={isGenerating}
                    className="w-full text-left px-3 py-2 rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors text-purple-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isGenerating
                      ? "⏳ Generating..."
                      : "▸ Generate Performance Reports"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
