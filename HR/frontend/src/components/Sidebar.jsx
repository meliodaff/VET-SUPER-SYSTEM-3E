import React, { useState, useEffect } from "react";
import {
  Home,
  User,
  Users,
  Calendar,
  Gift,
  BarChart3,
  LogOut,
  Megaphone,
  IdCardLanyard,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const [activeItem, setActiveItem] = useState("Applicant");
  const location = useLocation();

  // Sync activeItem with current route
  useEffect(() => {
    const pathToItemMap = {
      "/dashboard": "Dashboard",
      "/employees": "Employee Profile",
      "/applicant": "Applicant",
      "/admin-schedule": "Schedule",
      "/admin-incentives": "Incentives",
      "/admin-analytics": "Analytics",
      "/admin-announcements": "Announcements",
    };

    const currentItem = pathToItemMap[location.pathname];
    if (currentItem) {
      setActiveItem(currentItem);
    }
  }, [location.pathname]);
  const navigate = useNavigate();
  const menuItems = [
    { id: "Dashboard", label: "Dashboard", icon: Home, link: "/dashboard" },
    {
      id: "Employee Profile",
      label: "Employee Profile",
      icon: User,
      link: "/employees",
    },
    { id: "Applicant", label: "Applicant", icon: Users, link: "/applicant" },
    {
      id: "Schedule",
      label: "Schedule",
      icon: Calendar,
      link: "/admin-schedule",
    },
    {
      id: "Incentives",
      label: "Incentives",
      icon: Gift,
      link: "/admin-incentives",
    },
    {
      id: "Analytics",
      label: "Analytics",
      icon: BarChart3,
      link: "/admin-analytics",
    },
    {
      id: "Announcements",
      label: "Announcements",
      icon: Megaphone,
      link: "/admin-announcements",
    },
    {
      id: "Employee Portal",
      label: "Employee Portal",
      icon: IdCardLanyard,
      link: "/employee-analytics",
    },
  ];

  return (
    <div className="fixed top-0 left-0 h-full w-64 bg-white shadow-lg flex flex-col">
      <div className="p-6 border-b border-gray-100">
        <Link
          to="/"
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          {/* Logo */}
          <img
            src="/images/logo.png"
            alt="Fur Ever Logo"
            className="w-12 h-12 rounded-full object-cover"
          />

          <div className="flex flex-col">
            <h1
              className="text-xl font-bold tracking-wide"
              style={{ color: "#5080BE" }}
            >
              FUR EVER
            </h1>
            <p
              className="text-sm font-semibold tracking-wide"
              style={{ color: "#5080BE" }}
            >
              HR Department
            </p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 py-6">
        <ul className="space-y-2 px-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;

            return (
              <li key={item.id}>
                <Link to={item.link}>
                  <button
                    onClick={() => setActiveItem(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                      isActive
                        ? "bg-blue-100 text-blue-600 shadow-sm"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                    }`}
                  >
                    <Icon
                      size={20}
                      className={isActive ? "text-blue-600" : "text-gray-500"}
                    />

                    <span className="font-medium">{item.label}</span>
                  </button>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-100">
        <button
          className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-800 rounded-lg transition-all duration-200"
          onClick={() => {
            navigate("/");
            localStorage.clear();
            document.cookie.split(";").forEach((cookie) => {
              document.cookie = cookie.replace(
                /=.*/,
                "=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/"
              );
            });
          }}
        >
          <LogOut size={20} className="text-gray-500" />
          <span className="font-medium">LOGOUT</span>
        </button>
      </div>
    </div>
  );
}
