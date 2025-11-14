import { useState } from "react";
import Button from "./Button";
import { Link, useLocation } from "react-router-dom";
const NavItem = ({ link, children, active = false }) => (
  <Link to={link}>
    <button
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

const MobileNavItem = ({ link, children, active = false }) => (
  <Link to={link}>
    <button
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

const navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Show navigation only on dashboard-related routes, hide on homepage and job offer pages
  const showNavigation =
    location.pathname !== "/" && !location.pathname.startsWith("/job-");

  return (
    <nav className="w-full bg-white/90 backdrop-blur-sm shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-3 flex-shrink-0 hover:opacity-80 transition-opacity"
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
          {showNavigation && (
            <div className="hidden md:flex items-center space-x-1 flex-1 justify-center">
              <NavItem
                link="/employee-schedule"
                active={location.pathname === "/employee-schedule"}
              >
                SCHEDULE
              </NavItem>
              <NavItem
                link="/employee-incentives"
                active={location.pathname === "/employee-incentives"}
              >
                INCENTIVES
              </NavItem>
              <NavItem
                link="/employee-analytics"
                active={location.pathname === "/employee-analytics"}
              >
                ANALYTICS
              </NavItem>
            </div>
          )}

          {/* Login Button */}
          <div className="hidden md:block ml-auto">
            <Button className="border-2 border-black hover:bg-black hover:text-white transform hover:scale-105">
              LOGIN
            </Button>
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

        {/* Mobile Menu */}
        {isMobileMenuOpen && showNavigation && (
          <div className="md:hidden py-4 border-t border-gray-200 bg-white/95 backdrop-blur-sm">
            <div className="flex flex-col space-y-2">
              <MobileNavItem
                link="/employee-schedule"
                active={location.pathname === "/employee-schedule"}
              >
                SCHEDULE
              </MobileNavItem>
              <MobileNavItem
                link="/employee-incentives"
                active={location.pathname === "/employee-incentives"}
              >
                INCENTIVES
              </MobileNavItem>
              <MobileNavItem
                link="/employee-analytics"
                active={location.pathname === "/employee-analytics"}
              >
                ANALYTICS
              </MobileNavItem>
              <div className="pt-4">
                <Button className="w-full border-2 border-black hover:bg-black hover:text-white">
                  LOGIN
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default navbar;
