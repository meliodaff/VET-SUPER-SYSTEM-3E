import React, { useState, useEffect } from "react";
import { Search, Bell, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import useGetAnnouncements from "../../api/useGetAnnouncements";
import { useNavigate } from "react-router-dom";
const NavItem = ({ link, children, active = false, onClick }) => (
  <Link to={link}>
    <button
      onClick={onClick}
      className={`relative px-4 py-2 font-bold text-sm lg:text-base transition-all duration-300 group ${
        active ? "text-blue-600" : "text-black hover:text-blue-600"
      }`}
    >
      <span className="relative z-10">{children}</span>
      <div className="absolute inset-0 bg-blue-50 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300 ease-out opacity-0 group-hover:opacity-100"></div>
      <div className="absolute inset-0 bg-blue-100 rounded-full scale-0 group-hover:scale-110 transition-transform duration-500 ease-out opacity-0 group-hover:opacity-70"></div>
    </button>
  </Link>
);

const MobileNavItem = ({ link, children, active = false, onClick }) => (
  <Link to={link}>
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-2 font-bold text-base transition-colors duration-200 rounded-lg ${
        active
          ? "text-blue-600 bg-blue-50"
          : "text-black hover:text-blue-600 hover:bg-gray-50"
      }`}
    >
      {children}
    </button>
  </Link>
);

const EmployeeNavbar = ({ employee, onNavigate }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("HOME");
  const [announcements, setAnnouncements] = useState([]);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const location = useLocation();
  const { getAnnouncements, loadingForGetAnnouncements } =
    useGetAnnouncements();

  // Fetch announcements from custom hook
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await getAnnouncements();
        if (response && response.data) {
          setAnnouncements(response.data);
        }
      } catch (error) {
        console.error("Error fetching announcements:", error);
      }
    };

    fetchAnnouncements();
  }, [getAnnouncements]);

  const [photo, setPhoto] = useState("");
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    setPhoto(user.photo);
  }, []);

  // Sync activeNav with current route
  useEffect(() => {
    if (location.pathname === "/employee-schedule") {
      setActiveNav("SCHEDULE");
    } else if (location.pathname === "/employee-incentives") {
      setActiveNav("INCENTIVES");
    } else if (location.pathname === "/employee-analytics") {
      setActiveNav("ANALYTICS");
    } else if (location.pathname === "/employee-performance-rating") {
      setActiveNav("PERFORMANCE");
    }
  }, [location.pathname]);

  // Helper function to get date category
  const getDateCategory = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const dateOnly = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );
    const todayOnly = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const yesterdayOnly = new Date(
      yesterday.getFullYear(),
      yesterday.getMonth(),
      yesterday.getDate()
    );

    if (dateOnly.getTime() === todayOnly.getTime()) {
      return "Today";
    } else if (dateOnly.getTime() === yesterdayOnly.getTime()) {
      return "Yesterday";
    }

    const daysAgo = Math.floor(
      (todayOnly.getTime() - dateOnly.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (daysAgo <= 7) {
      return "This Week";
    } else if (daysAgo <= 30) {
      return "This Month";
    } else {
      return "Earlier";
    }
  };

  // Format announcements to display format
  const formatAnnouncements = () => {
    const announcementItems = announcements.map((ann) => {
      const startDate = new Date(ann.start_date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });

      let message = ann.content;
      if (ann.type === "Meeting") {
        const meetingTime = ann.meeting_time_start
          ? ann.meeting_time_start.substring(0, 5)
          : "";
        message = `${ann.content} | Meeting at ${ann.location} at ${meetingTime}`;
      }

      return {
        id: ann.announcement_id,
        title: ann.title,
        message: `${message} (${startDate})`,
        isNew: false,
        type: ann.type,
        createdDate: ann.created_at,
      };
    });

    // Sort announcements by creation date (newest first)
    announcementItems.sort(
      (a, b) => new Date(b.createdDate) - new Date(a.createdDate)
    );

    // Group announcements by date
    const groupedAnnouncements = {};
    announcementItems.forEach((item) => {
      const category = getDateCategory(item.createdDate);
      if (!groupedAnnouncements[category]) {
        groupedAnnouncements[category] = [];
      }
      groupedAnnouncements[category].push(item);
    });

    // Create announcement categories in order
    const announcementCategories = [];
    const categoryOrder = [
      "Today",
      "Yesterday",
      "This Week",
      "This Month",
      "Earlier",
    ];
    let categoryId = 0;

    categoryOrder.forEach((category) => {
      if (groupedAnnouncements[category]) {
        announcementCategories.push({
          id: categoryId++,
          category: `Announcements - ${category}`,
          items: groupedAnnouncements[category],
        });
      }
    });

    return announcementCategories;
  };

  const notifications = formatAnnouncements();

  const unreadCount = notifications.reduce(
    (count, category) =>
      count + category.items.filter((item) => item.isNew).length,
    0
  );

  const handleNavClick = (navName) => {
    setActiveNav(navName);
    setIsMobileMenuOpen(false);
    if (onNavigate) {
      onNavigate(navName);
    }
  };

  const handleMarkAllAsRead = () => {
    // Backend API call to mark all as read
    console.log("Mark all notifications as read");
    setIsNotificationOpen(false);
  };

  const [isOpen, setIsOpen] = useState(false);

  const navigate = useNavigate();
  const handleLogout = () => {
    // Add your logout logic here
    console.log("Logging out...");
    localStorage.clear();
    document.cookie.split(";").forEach((cookie) => {
      document.cookie = cookie.replace(
        /=.*/,
        "=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/"
      );
    });
    navigate("/");
    setIsOpen(false);
  };

  return (
    <nav className="w-full bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
          >
            <img
              src="/images/logo.png"
              alt="Logo"
              className="w-10 h-10 object-contain"
            />
            <span className="text-blue-600 font-black text-xl tracking-wide">
              FUR EVER
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <NavItem
              active={activeNav === "SCHEDULE"}
              onClick={() => handleNavClick("SCHEDULE")}
              link="/employee-schedule"
            >
              SCHEDULE
            </NavItem>
            <NavItem
              active={activeNav === "INCENTIVES"}
              onClick={() => handleNavClick("INCENTIVES")}
              link="/employee-incentives"
            >
              INCENTIVES
            </NavItem>
            <NavItem
              active={activeNav === "ANALYTICS"}
              onClick={() => handleNavClick("ANALYTICS")}
              link="/employee-analytics"
            >
              ANALYTICS
            </NavItem>
            <NavItem
              active={activeNav === "PERFORMANCE"}
              onClick={() => handleNavClick("PERFORMANCE")}
              link="/employee-performance-rating"
            >
              PERFORMANCE RATING
            </NavItem>
          </div>

          {/* Right Section - Search, Notifications, Profile */}
          <div className="flex items-center gap-3">
            {/* Search Icon */}
            <button className="hidden md:block p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Search className="w-5 h-5 text-gray-600" />
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative"
              >
                <Bell className="w-5 h-5 text-gray-600" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>

              {/* Notification Dropdown */}
              {isNotificationOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-lg shadow-xl border border-gray-200 max-h-96 overflow-y-auto z-50">
                  {/* Header */}
                  <div className="flex items-center justify-between p-4 border-b border-gray-200 sticky top-0 bg-white">
                    <h3 className="text-lg font-black text-gray-900">
                      Notification
                    </h3>
                    <button
                      onClick={handleMarkAllAsRead}
                      className="text-sm text-blue-600 hover:text-blue-800 font-semibold"
                    >
                      Mark all as Read
                    </button>
                  </div>

                  {/* Notifications List */}
                  <div className="divide-y divide-gray-200">
                    {notifications.map((category) => (
                      <div key={category.id}>
                        <div className="px-4 py-2 bg-gray-50">
                          <h4 className="text-xs font-bold text-gray-700 uppercase">
                            {category.category}
                          </h4>
                        </div>
                        {category.items.map((item) => {
                          const announcement = announcements.find(
                            (ann) => ann.announcement_id === item.id
                          );
                          return (
                            <div
                              key={item.id}
                              className={`px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors ${
                                item.isNew ? "bg-blue-50" : ""
                              }`}
                              onClick={() => {
                                if (announcement) {
                                  setSelectedAnnouncement(announcement);
                                }
                              }}
                            >
                              <div className="flex items-start gap-2">
                                <div className="w-2 h-2 rounded-full bg-blue-600 mt-1.5 flex-shrink-0"></div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <h5 className="text-sm font-bold text-gray-900">
                                      {item.title}
                                    </h5>
                                    {item.type && (
                                      <span
                                        className={`text-xs px-2 py-0.5 rounded font-semibold ${
                                          item.type === "Meeting"
                                            ? "bg-blue-100 text-blue-800"
                                            : item.type === "Policy"
                                            ? "bg-purple-100 text-purple-800"
                                            : "bg-green-100 text-green-800"
                                        }`}
                                      >
                                        {item.type}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">
                                    {item.message}
                                  </p>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Picture */}
            {/* <div className="relative">
              <button className="w-10 h-10 rounded-lg overflow-hidden border-2 border-gray-200 hover:border-blue-500 transition-colors">
                <img
                  src={`http://localhost/VET-SUPER-SYSTEM-3E/HR/backend/${photo}`}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </button>
            </div> */}

            <div className="relative">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-10 h-10 rounded-lg overflow-hidden border-2 border-gray-200 hover:border-blue-500 transition-colors"
              >
                <img
                  src={`http://localhost/VET-SUPER-SYSTEM-3E/HR/backend/${photo}`}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </button>

              {/* Dropdown Menu */}
              {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <button
                    onClick={() => {
                      const user = JSON.parse(localStorage.getItem("user"));
                      if (user.department === "HR") {
                        navigate("/dashboard");
                      } else if (user.department === "Finance") {
                        window.location.href =
                          "http://localhost:3000/finance-dashboard";
                      } else if (user.department === "Appointment") {
                        window.location.href =
                          "http://localhost/VET-SUPER-SYSTEM-3E/APPOINTMENT/appointment/admin_page/overview.php";
                      } else if (user.department === "Patient") {
                        window.location.href =
                          "http://localhost/VET-SUPER-SYSTEM-3E/APPOINTMENT/appointment/client_page/Book_appointment_dashboard.php";
                      }
                    }}
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors rounded-lg"
                  >
                    Go back to Dashboard
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors rounded-lg"
                  >
                    Logout
                  </button>
                </div>
              )}

              {/* Overlay to close dropdown when clicking outside */}
              {isOpen && (
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsOpen(false)}
                />
              )}
            </div>
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 bg-white">
            <div className="flex flex-col space-y-2">
              <MobileNavItem
                active={activeNav === "HOME"}
                onClick={() => handleNavClick("HOME")}
                link="/"
              >
                HOME
              </MobileNavItem>
              <MobileNavItem
                active={activeNav === "SCHEDULE"}
                onClick={() => handleNavClick("SCHEDULE")}
                link="/employee-schedule"
              >
                SCHEDULE
              </MobileNavItem>
              <MobileNavItem
                active={activeNav === "INCENTIVES"}
                onClick={() => handleNavClick("INCENTIVES")}
                link="/employee-incentives"
              >
                INCENTIVES
              </MobileNavItem>
              <MobileNavItem
                active={activeNav === "ANALYTICS"}
                onClick={() => handleNavClick("ANALYTICS")}
                link="/employee-analytics"
              >
                ANALYTICS
              </MobileNavItem>
              <MobileNavItem
                active={activeNav === "PERFORMANCE"}
                onClick={() => handleNavClick("PERFORMANCE")}
                link="/employee-performance-rating"
              >
                PERFORMANCE RATING
              </MobileNavItem>

              {/* Mobile Search */}
              <div className="pt-4">
                <button className="w-full flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                  <Search className="w-5 h-5 text-gray-600" />
                  <span className="text-sm font-semibold text-gray-700">
                    Search
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Overlay for notification dropdown */}
      {isNotificationOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsNotificationOpen(false)}
        />
      )}

      {/* Announcement Detail Modal */}
      {selectedAnnouncement && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/30 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden border border-gray-200 animate-in slide-in-from-bottom-4 duration-300">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-gray-900">
                  {selectedAnnouncement.title}
                </h2>
                <span
                  className={`text-xs px-3 py-1 rounded font-semibold ${
                    selectedAnnouncement.type === "Meeting"
                      ? "bg-blue-100 text-blue-800"
                      : selectedAnnouncement.type === "Policy"
                      ? "bg-purple-100 text-purple-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {selectedAnnouncement.type}
                </span>
              </div>
              <button
                onClick={() => setSelectedAnnouncement(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              {/* Content */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                  Content
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {selectedAnnouncement.content}
                </p>
              </div>

              {/* Date Range */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">
                    Start Date
                  </h3>
                  <p className="text-sm text-gray-600">
                    {new Date(
                      selectedAnnouncement.start_date
                    ).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">
                    End Date
                  </h3>
                  <p className="text-sm text-gray-600">
                    {new Date(selectedAnnouncement.end_date).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      }
                    )}
                  </p>
                </div>
              </div>

              {/* Meeting Details - Show only for Meeting type */}
              {selectedAnnouncement.type === "Meeting" &&
                selectedAnnouncement.meeting_date && (
                  <div className="border-t pt-4">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">
                      Meeting Details
                    </h3>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div>
                        <span className="font-medium text-gray-700">Date:</span>{" "}
                        {new Date(
                          selectedAnnouncement.meeting_date
                        ).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </div>
                      {selectedAnnouncement.meeting_time_start && (
                        <div>
                          <span className="font-medium text-gray-700">
                            Time:
                          </span>{" "}
                          {selectedAnnouncement.meeting_time_start.substring(
                            0,
                            5
                          )}{" "}
                          {selectedAnnouncement.meeting_time_end &&
                            `- ${selectedAnnouncement.meeting_time_end.substring(
                              0,
                              5
                            )}`}
                        </div>
                      )}
                      {selectedAnnouncement.location && (
                        <div>
                          <span className="font-medium text-gray-700">
                            Location:
                          </span>{" "}
                          {selectedAnnouncement.location}
                        </div>
                      )}
                    </div>
                  </div>
                )}

              {/* Status */}
              <div className="border-t pt-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                  Status
                </h3>
                <div className="inline-flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-sm text-gray-600">
                    {selectedAnnouncement.status || "Active"}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t bg-gray-50 flex justify-end">
              <button
                onClick={() => setSelectedAnnouncement(null)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default EmployeeNavbar;
