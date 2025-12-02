import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  FileText,
  CreditCard,
  LogOut,
  Globe,
  Package,
} from "lucide-react";

const Sidebar = ({ onLogout }) => {
  const location = useLocation();
  const [logoError, setLogoError] = useState(false);

  // Ensure onLogout is defined
  const handleLogout =
    onLogout ||
    (() => {
      console.warn("onLogout is not defined in Sidebar");
      // No-op since authentication is removed
    });

  const menuItems = [
    {
      name: "Sales and Finance",
      path: "/finance-dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Stock Tracking",
      path: "/stock-tracking",
      icon: Package,
    },
    {
      name: "Inventory Portal",
      path: "/inventory-portal",
      icon: Package,
    },
    {
      name: "Payroll",
      path: "/employees",
      icon: Users,
    },
    {
      name: "Invoices",
      path: "/invoices",
      icon: FileText,
    },
    {
      name: "Monitor Payment",
      path: "/payments",
      icon: CreditCard,
    },
    {
      name: "Supplier Orders",
      path: "/supplier-payments",
      icon: Package,
    },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="fixed top-0 left-0 h-full w-64 bg-white shadow-lg flex flex-col">
      {/* Logo Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          {/* Logo Image */}
          <div className="w-12 h-12 rounded-full flex items-center justify-center overflow-hidden bg-white shadow-sm">
            {!logoError ? (
              <img
                src="/logo.png"
                alt="Fur-Ever Care Logo"
                className="w-full h-full object-cover"
                onError={() => setLogoError(true)}
              />
            ) : (
              <div className="w-full h-full bg-blue-400 rounded-full flex items-center justify-center">
                <Globe className="h-6 w-6 text-white" />
              </div>
            )}
          </div>

          {/* Title */}
          <div>
            <h1
              className="text-xl font-bold tracking-wide"
              style={{ color: "#5080BE" }}
            >
              FUR-EVER CARE
            </h1>
            <p className="text-xs text-gray-500">Sales & Finance</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6">
        <ul className="space-y-2 px-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <li key={item.name}>
                <Link to={item.path}>
                  <button
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                      active
                        ? "bg-blue-100 text-blue-600 shadow-sm"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                    }`}
                  >
                    <Icon
                      size={20}
                      className={active ? "text-blue-600" : "text-gray-500"}
                    />
                    <span className="font-medium">{item.name}</span>
                  </button>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-100">
        <a
          href="http://localhost:5173/login"
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-800 rounded-lg transition-all duration-200"
        >
          <LogOut size={20} className="text-gray-500" />
          <span className="font-medium">LOGOUT</span>
        </a>
      </div>
    </div>
  );
};

export default Sidebar;
