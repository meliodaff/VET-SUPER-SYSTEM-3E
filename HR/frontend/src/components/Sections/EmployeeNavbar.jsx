import React, { useState } from "react";
import { Search, Bell, X } from "lucide-react";
import { Link } from "react-router-dom";

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

  // Sample notifications - backend ready
  const notifications = [
    {
      id: 1,
      category: "Today",
      items: [
        {
          id: 11,
          title: "Leave Request",
          message:
            "Your Leave Request has been Approved (Sept 12, 2025, 10:15 AM)",
          isNew: true,
        },
        {
          id: 12,
          title: "Schedule Reminder",
          message:
            "You are assigned for this Morning Shift (8:00 AM - 2:00 PM) tomorrow",
          isNew: false,
        },
      ],
    },
    {
      id: 2,
      category: "Yesterday",
      items: [
        {
          id: 21,
          title: "Schedule Change",
          message: "Afternoon shift on Sept 12 moved to Morning shift.",
          isNew: false,
        },
      ],
    },
    {
      id: 3,
      category: "Last Week",
      items: [
        {
          id: 31,
          title: "Leave Request Declined:",
          message: "Sept 18 (Reason: Schedule Conflict)",
          isNew: false,
        },
      ],
    },
  ];

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

  return (
    <nav className="w-full bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <img
              src="src/assets/images/logo.png"
              alt="Logo"
              className="w-10 h-10 object-contain"
            />
            <span className="text-blue-600 font-black text-xl tracking-wide">
              FUR EVER
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <NavItem
              active={activeNav === "HOME"}
              onClick={() => handleNavClick("HOME")}
              link="/"
            >
              HOME
            </NavItem>
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
                        {category.items.map((item) => (
                          <div
                            key={item.id}
                            className={`px-4 py-3 hover:bg-gray-50 cursor-pointer ${
                              item.isNew ? "bg-blue-50" : ""
                            }`}
                          >
                            <div className="flex items-start gap-2">
                              <div className="w-2 h-2 rounded-full bg-blue-600 mt-1.5 flex-shrink-0"></div>
                              <div className="flex-1">
                                <h5 className="text-sm font-bold text-gray-900 mb-1">
                                  {item.title}
                                </h5>
                                <p className="text-xs text-gray-600 leading-relaxed">
                                  {item.message}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Picture */}
            <div className="relative">
              <button className="w-10 h-10 rounded-lg overflow-hidden border-2 border-gray-200 hover:border-blue-500 transition-colors">
                <img
                  src={
                    employee?.profilePicture || "src/assets/images/profile.jpg"
                  }
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </button>
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
              >
                HOME
              </MobileNavItem>
              <MobileNavItem
                active={activeNav === "SCHEDULE"}
                onClick={() => handleNavClick("SCHEDULE")}
              >
                SCHEDULE
              </MobileNavItem>
              <MobileNavItem
                active={activeNav === "INCENTIVES"}
                onClick={() => handleNavClick("INCENTIVES")}
              >
                INCENTIVES
              </MobileNavItem>
              <MobileNavItem
                active={activeNav === "ANALYTICS"}
                onClick={() => handleNavClick("ANALYTICS")}
              >
                ANALYTICS
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
    </nav>
  );
};

export default EmployeeNavbar;
