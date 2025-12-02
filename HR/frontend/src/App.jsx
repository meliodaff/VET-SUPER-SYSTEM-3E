import { Routes, Route } from "react-router-dom";
import DashboardLayout from "./components/layouts/DashboardLayout";
import Homepage from "./pages/Homepage";
import JobOffer from "./pages/Joboffer";
import Dashboard from "./pages/Dashboard";
import Applicant from "./pages/Applicant";
import JobApplicationForm from "./pages/JobApplicationForm";
import Employees from "./pages/Employees";
import AdminAnalytics from "./pages/AdminAnalytics";
import AdminSchedule from "./pages/AdminSchedule";
import AdminIncentives from "./pages/AdminIncentives";
import AdminLeaveRequests from "./pages/AdminLeaveRequests";
import AdminAnnouncements from "./pages/AdminAnnouncements";
import EmployeeAnalytics from "./pages/EmployeeAnalytics";
import EmployeeSchedule from "./pages/EmployeeSchedule";
import LeaveRequest from "./pages/LeaveRequest";
import EmployeeIncentives from "./pages/EmployeeIncentives";
import LiveRFIDDisplay from "./pages/LiveRFIDDisplay";
import LiveAttendance from "./pages/LiveAttendance";
import EmployeePerformanceRating from "./pages/EmployeePerformanceRating";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import AdminPerformanceRatingApproval from "./pages/AdminPerformanceRatingApproval.jsx";
import AppointmentTable from "./pages/AppointmentTable.jsx";
export default function App() {
  return (
    <>
      <Routes>
        <Route element={<Login />} path="/login" />
        <Route element={<Register />} path="/register" />

        <Route element={<Dashboard />} path="/dashboard" />
        <Route element={<AdminAnalytics />} path="/admin-analytics" />
        <Route element={<AdminSchedule />} path="/admin-schedule" />
        <Route element={<AdminIncentives />} path="/admin-incentives" />
        <Route element={<AdminLeaveRequests />} path="/admin-leave-requests" />
        <Route element={<AdminAnnouncements />} path="/admin-announcements" />
        <Route
          element={<AdminPerformanceRatingApproval />}
          path="/admin-performance-rating"
        />
        <Route element={<Employees />} path="/employees" />
        <Route element={<Applicant />} path="/applicant" />

        <Route element={<EmployeeSchedule />} path="/employee-schedule" />
        <Route element={<Homepage />} path="/" />
        <Route path="/job-offers" element={<JobOffer />} />
        <Route path="/job-offer/:jobId" element={<JobOffer />} />
        <Route
          path="/job-application/:jobId"
          element={<JobApplicationForm />}
        />
        {/* employee schedule not done yet */}
        <Route element={<LeaveRequest />} path="/leave-request" />
        {/* not complete yet, the request shouldnt decerement immediately the count of leave remaining */}
        <Route element={<EmployeeAnalytics />} path="/employee-analytics" />
        <Route element={<EmployeeIncentives />} path="/employee-incentives" />
        <Route
          element={<EmployeePerformanceRating />}
          path="/employee-performance-rating"
        />
        <Route element={<LiveAttendance />} path="/live-attendance" />
        <Route element={<AppointmentTable />} path="/appointment-table" />
      </Routes>
    </>
  );
}
