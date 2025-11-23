import React, { useState, useMemo } from "react";
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

export default function AdminAnnouncements() {
  const [announcements, setAnnouncements] = useState([
    {
      id: 1,
      title: "System Maintenance Scheduled",
      content:
        "The system will be undergoing maintenance on November 25th from 10 PM to 2 AM. Please plan accordingly.",
      priority: "high",
      status: "active",
      createdAt: "2025-11-23",
      expiresAt: "2025-11-25",
    },
    {
      id: 2,
      title: "New Leave Policy Update",
      content:
        "As of December 1st, 2025, all employees will receive 3 additional vacation days. Details are available in the HR portal.",
      priority: "medium",
      status: "active",
      createdAt: "2025-11-22",
      expiresAt: "2025-12-31",
    },
    {
      id: 3,
      title: "Holiday Schedule Reminder",
      content:
        "Please remember that we will be closed on November 27th for Thanksgiving. The office will reopen on November 28th.",
      priority: "low",
      status: "active",
      createdAt: "2025-11-20",
      expiresAt: "2025-11-27",
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    priority: "medium",
    expiresAt: "",
  });

  const itemsPerPage = 10;

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
        priority: announcement.priority,
        expiresAt: announcement.expiresAt,
      });
    } else {
      setEditingId(null);
      setFormData({
        title: "",
        content: "",
        priority: "medium",
        expiresAt: "",
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
      priority: "medium",
      expiresAt: "",
    });
  };

  const handleSubmit = () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      alert("Please fill in all required fields");
      return;
    }

    if (editingId) {
      // Edit existing announcement
      setAnnouncements(
        announcements.map((ann) =>
          ann.id === editingId
            ? {
                ...ann,
                title: formData.title,
                content: formData.content,
                priority: formData.priority,
                expiresAt: formData.expiresAt,
              }
            : ann
        )
      );
    } else {
      // Create new announcement
      const newAnnouncement = {
        id: Math.max(...announcements.map((a) => a.id), 0) + 1,
        title: formData.title,
        content: formData.content,
        priority: formData.priority,
        status: "active",
        createdAt: new Date().toISOString().split("T")[0],
        expiresAt: formData.expiresAt,
      };
      setAnnouncements([newAnnouncement, ...announcements]);
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

  const getPriorityBadgeColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border border-red-300";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border border-yellow-300";
      case "low":
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
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100 border-b border-gray-200">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Title
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Priority
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Expires
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
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
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-semibold text-gray-900">
                              {announcement.title}
                            </p>
                            <p className="text-sm text-gray-600 mt-1 truncate">
                              {announcement.content}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getPriorityBadgeColor(
                              announcement.priority
                            )}`}
                          >
                            {announcement.priority.charAt(0).toUpperCase() +
                              announcement.priority.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(announcement.status)}
                            <span className="text-sm text-gray-700 capitalize">
                              {announcement.status}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-600">
                            {new Date(
                              announcement.expiresAt
                            ).toLocaleDateString()}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleOpenModal(announcement)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <Edit className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() =>
                                handleToggleStatus(announcement.id)
                              }
                              className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                            >
                              {announcement.status === "active" ? (
                                <CheckCircle className="w-5 h-5" />
                              ) : (
                                <AlertCircle className="w-5 h-5" />
                              )}
                            </button>
                            <button
                              onClick={() => handleDelete(announcement.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-6 py-8 text-center text-gray-500"
                      >
                        No announcements found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

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
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Priority
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) =>
                    setFormData({ ...formData, priority: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              {/* Expires At */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Expires At
                </label>
                <input
                  type="date"
                  value={formData.expiresAt}
                  onChange={(e) =>
                    setFormData({ ...formData, expiresAt: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
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
