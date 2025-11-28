import React, { useState, useMemo, useEffect } from "react";
import {
  Plus,
  Trash2,
  Edit,
  X,
  Search,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import DashboardLayout from "../components/layouts/DashboardLayout";
import useGetAnnouncements from "../api/useGetAnnouncements";
import usePostAnnouncement from "../api/usePostAnnouncement";
import useUpdateAnnouncement from "../api/useUpdateAnnouncement";

// {
//       id: 1,
//       title: "Team Meeting",
//       content: "Quarterly team sync meeting.",
//       type: "Meeting",
//       startDate: "2025-12-01",
//       endDate: "2025-12-01",
//       meetingDate: "2025-12-01",
//       meetingTimeStart: "10:00",
//       meetingTimeEnd: "11:00",
//       location: "Conference Room A",
//       status: "active",
//       createdAt: "2025-11-26",
//     },
//     {
//       id: 2,
//       title: "Work From Home Policy",
//       content: "New WFH policy effective December 1st.",
//       type: "Policy",
//       startDate: "2025-12-01",
//       endDate: "2025-12-31",
//       meetingDate: null,
//       meetingTimeStart: null,
//       meetingTimeEnd: null,
//       location: null,
//       status: "active",
//       createdAt: "2025-11-26",
//     },
//     {
//       id: 3,
//       title: "Holiday Closure Notice",
//       content: "Office closed for holidays.",
//       type: "General",
//       startDate: "2025-12-24",
//       endDate: "2025-12-26",
//       meetingDate: null,
//       meetingTimeStart: null,
//       meetingTimeEnd: null,
//       location: null,
//       status: "active",
//       createdAt: "2025-11-26",
//     },

export default function AdminAnnouncements() {
  const [announcements, setAnnouncements] = useState([]);

  const { getAnnouncements, loadingForGetAnnouncements } =
    useGetAnnouncements();

  useEffect(() => {
    const fetchAnnouncements = async () => {
      const data = await getAnnouncements();

      const formattedData = data.data.map((data, index) => ({
        id: data.announcement_id,
        title: data.title,
        content: data.content,
        type: data.type,
        startDate: data.start_date,
        endDate: data.end_date,
        meetingDate: data.meeting_date || " - ",
        meetingTimeStart: data.meeting_time_start || " - ",
        meetingTimeEnd: data.meeting_time_end || " - ",
        location: data.location,
        status: data.status.toLowerCase(),
        createdAt: data.created_at.split(" ")[0],
      }));
      setAnnouncements(formattedData);
    };
    fetchAnnouncements();
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    type: "General",
    startDate: "",
    endDate: "",
    meetingDate: "",
    meetingTimeStart: "",
    meetingTimeEnd: "",
    location: "",
  });

  const itemsPerPage = 10;

  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Validate office hours (9 AM to 5 PM)
  const isWithinOfficeHours = (timeString) => {
    const [hours, minutes] = timeString.split(":").map(Number);
    const totalMinutes = hours * 60 + minutes;
    const officeStartMinutes = 9 * 60; // 9 AM
    const officeEndMinutes = 17 * 60; // 5 PM
    return (
      totalMinutes >= officeStartMinutes && totalMinutes <= officeEndMinutes
    );
  };

  const getOfficeHoursError = (startTime, endTime) => {
    if (!isWithinOfficeHours(startTime)) {
      return "Meeting start time must be between 9:00 AM and 5:00 PM";
    }
    if (!isWithinOfficeHours(endTime)) {
      return "Meeting end time must be between 9:00 AM and 5:00 PM";
    }
    const [startHours, startMinutes] = startTime.split(":").map(Number);
    const [endHours, endMinutes] = endTime.split(":").map(Number);
    const startTotalMinutes = startHours * 60 + startMinutes;
    const endTotalMinutes = endHours * 60 + endMinutes;
    if (startTotalMinutes >= endTotalMinutes) {
      return "Meeting start time must be before end time";
    }
    const durationMinutes = endTotalMinutes - startTotalMinutes;
    if (durationMinutes > 120) {
      return "Meeting duration cannot exceed 2 hours (120 minutes)";
    }
    return null;
  };

  // Filter announcements
  const filteredAnnouncements = useMemo(() => {
    return announcements.filter((announcement) => {
      const query = searchQuery.toLowerCase();
      return (
        announcement.title.toLowerCase().includes(query) ||
        announcement.content.toLowerCase().includes(query)
      );
    });
  }, [announcements, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredAnnouncements.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedAnnouncements = filteredAnnouncements.slice(
    startIndex,
    endIndex
  );

  const handleOpenModal = (announcement = null) => {
    if (announcement) {
      setEditingId(announcement.id);
      setFormData({
        title: announcement.title,
        content: announcement.content,
        type: announcement.type,
        startDate: announcement.startDate,
        endDate: announcement.endDate,
        meetingDate: announcement.meetingDate || "",
        meetingTimeStart: announcement.meetingTimeStart || "",
        meetingTimeEnd: announcement.meetingTimeEnd || "",
        location: announcement.location || "",
      });
    } else {
      setEditingId(null);
      setFormData({
        title: "",
        content: "",
        type: "General",
        startDate: getTodayDate(),
        endDate: "",
        meetingDate: "",
        meetingTimeStart: "",
        meetingTimeEnd: "",
        location: "",
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({
      title: "",
      content: "",
      type: "General",
      startDate: "",
      endDate: "",
      meetingDate: "",
      meetingTimeStart: "",
      meetingTimeEnd: "",
      location: "",
    });
  };

  const { postAnnouncement, loadingForPostAnnouncement } =
    usePostAnnouncement();

  const { updateAnnouncement, loadingForUpdateAnnouncement } =
    useUpdateAnnouncement();

  const handleSubmit = async () => {
    if (
      !formData.title.trim() ||
      !formData.content.trim() ||
      !formData.startDate ||
      !formData.endDate
    ) {
      alert(
        "Please fill in all required fields (Title, Content, Start Date, End Date)"
      );
      return;
    }

    if (formData.type === "Meeting") {
      if (
        !formData.meetingDate ||
        !formData.meetingTimeStart ||
        !formData.meetingTimeEnd ||
        !formData.location
      ) {
        alert("Please fill in all meeting details for Meeting type");
        return;
      }

      // Validate office hours
      const officeHoursError = getOfficeHoursError(
        formData.meetingTimeStart,
        formData.meetingTimeEnd
      );
      if (officeHoursError) {
        alert(officeHoursError);
        return;
      }
    }

    if (editingId) {
      const updatedAnnouncement = {
        ...announcements.find((ann) => ann.id === editingId),
        title: formData.title,
        content: formData.content,
        type: formData.type,
        startDate: formData.startDate,
        endDate: formData.endDate,
        meetingDate: formData.type === "Meeting" ? formData.meetingDate : null,
        meetingTimeStart:
          formData.type === "Meeting" ? formData.meetingTimeStart : null,
        meetingTimeEnd:
          formData.type === "Meeting" ? formData.meetingTimeEnd : null,
        location: formData.type === "Meeting" ? formData.location : null,
      };
      console.log(updatedAnnouncement);

      const response = await updateAnnouncement(updatedAnnouncement);

      console.log(response);

      // Edit existing announcement
      setAnnouncements(
        announcements.map((ann) =>
          ann.id === editingId
            ? {
                ...ann,
                title: formData.title,
                content: formData.content,
                type: formData.type,
                startDate: formData.startDate,
                endDate: formData.endDate,
                meetingDate:
                  formData.type === "Meeting" ? formData.meetingDate : null,
                meetingTimeStart:
                  formData.type === "Meeting"
                    ? formData.meetingTimeStart
                    : null,
                meetingTimeEnd:
                  formData.type === "Meeting" ? formData.meetingTimeEnd : null,
                location:
                  formData.type === "Meeting" ? formData.location : null,
              }
            : ann
        )
      );
      console.log("im here sa editing");
    } else {
      // Create new announcement
      const newAnnouncement = {
        id: Math.max(...announcements.map((a) => a.id), 0) + 1,
        title: formData.title,
        content: formData.content,
        type: formData.type,
        startDate: formData.startDate,
        endDate: formData.endDate,
        meetingDate: formData.type === "Meeting" ? formData.meetingDate : null,
        meetingTimeStart:
          formData.type === "Meeting" ? formData.meetingTimeStart : null,
        meetingTimeEnd:
          formData.type === "Meeting" ? formData.meetingTimeEnd : null,
        location: formData.type === "Meeting" ? formData.location : null,
        status: "active",
        createdAt: new Date().toISOString().split("T")[0],
      };
      console.log(newAnnouncement);
      setAnnouncements([newAnnouncement, ...announcements]);

      const response = await postAnnouncement(newAnnouncement);
      if (!response.success) {
        alert(response.message);
        return;
      }

      alert(response.message);
    }

    handleCloseModal();
    setCurrentPage(1);
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this announcement?")) {
      setAnnouncements(announcements.filter((ann) => ann.id !== id));
    }
  };

  const handleToggleStatus = (id) => {
    setAnnouncements(
      announcements.map((ann) =>
        ann.id === id
          ? {
              ...ann,
              status: ann.status === "active" ? "inactive" : "active",
            }
          : ann
      )
    );
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "Meeting":
        return "bg-blue-100 text-blue-800 border border-blue-300";
      case "Policy":
        return "bg-purple-100 text-purple-800 border border-purple-300";
      case "General":
        return "bg-green-100 text-green-800 border border-green-300";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-300";
    }
  };

  const getStatusIcon = (status) => {
    return status === "active" ? (
      <CheckCircle className="w-5 h-5 text-green-600" />
    ) : (
      <AlertCircle className="w-5 h-5 text-gray-400" />
    );
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-gray-900">
                ANNOUNCEMENTS
              </h1>
              <p className="text-gray-600 mt-2">
                Create and manage employee announcements
              </p>
            </div>
            <button
              onClick={() => handleOpenModal()}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              New Announcement
            </button>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search announcements..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Announcements Table */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                    Announcement
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 whitespace-nowrap">
                    Type
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 whitespace-nowrap">
                    Dates
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 whitespace-nowrap">
                    Status
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900 whitespace-nowrap">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedAnnouncements.length > 0 ? (
                  paginatedAnnouncements.map((announcement) => (
                    <tr
                      key={announcement.id}
                      className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-semibold text-gray-900">
                            {announcement.title}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            {announcement.content}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block px-2 py-1 rounded text-xs font-semibold whitespace-nowrap ${getTypeColor(
                            announcement.type
                          )}`}
                        >
                          {announcement.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        <div className="whitespace-nowrap">
                          <p className="text-xs">
                            {new Date(
                              announcement.startDate
                            ).toLocaleDateString()}{" "}
                            to
                          </p>
                          <p className="text-xs">
                            {new Date(
                              announcement.endDate
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 whitespace-nowrap">
                          {getStatusIcon(announcement.status)}
                          <span className="text-sm text-gray-700 capitalize hidden sm:inline">
                            {announcement.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleOpenModal(announcement)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleToggleStatus(announcement.id)}
                            className="p-1.5 text-yellow-600 hover:bg-yellow-50 rounded transition-colors"
                            title="Toggle status"
                          >
                            {announcement.status === "active" ? (
                              <CheckCircle className="w-4 h-4" />
                            ) : (
                              <AlertCircle className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            onClick={() => handleDelete(announcement.id)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-4 py-8 text-center text-gray-500"
                    >
                      No announcements found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Pagination */}
            {filteredAnnouncements.length > itemsPerPage && (
              <div className="flex items-center justify-center gap-4 p-4 border-t border-gray-200">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={currentPage === 1}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="flex gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                          currentPage === page
                            ? "bg-blue-500 text-white"
                            : "border border-gray-300 text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}
                </div>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-6 text-white flex items-center justify-between">
              <h2 className="text-2xl font-black">
                {editingId ? "Edit Announcement" : "Create Announcement"}
              </h2>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-blue-500 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Enter announcement title..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Content *
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  placeholder="Enter announcement content..."
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              {/* Type */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Announcement Type *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="General">General</option>
                  <option value="Policy">Policy</option>
                  <option value="Meeting">Meeting</option>
                </select>
              </div>

              {/* Start Date */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Start Date *
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* End Date */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  End Date *
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData({ ...formData, endDate: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Meeting Details - Conditional */}
              {formData.type === "Meeting" && (
                <>
                  <div className="border-t border-gray-200 pt-4">
                    <h3 className="text-sm font-bold text-gray-900 mb-4">
                      Meeting Details
                    </h3>
                  </div>

                  {/* Meeting Date */}
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">
                      Meeting Date *
                    </label>
                    <input
                      type="date"
                      value={formData.meetingDate}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          meetingDate: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Meeting Time - Start and End */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-2">
                        Time Start *{" "}
                        <span className="text-xs text-gray-500">
                          (9 AM - 5 PM)
                        </span>
                      </label>
                      <input
                        type="time"
                        min="09:00"
                        max="17:00"
                        value={formData.meetingTimeStart}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            meetingTimeStart: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-2">
                        Time End *{" "}
                        <span className="text-xs text-gray-500">
                          (max 2 hrs)
                        </span>
                      </label>
                      <input
                        type="time"
                        min="09:00"
                        max="17:00"
                        value={formData.meetingTimeEnd}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            meetingTimeEnd: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">
                      Location *
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) =>
                        setFormData({ ...formData, location: e.target.value })
                      }
                      placeholder="Enter meeting location..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex gap-3 px-6 py-4 bg-gray-50 border-t border-gray-200">
              <button
                onClick={handleCloseModal}
                className="flex-1 px-4 py-2 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                {editingId ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
