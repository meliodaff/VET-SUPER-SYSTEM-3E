import React, { useState, useEffect } from 'react';
import { Menu, User } from 'lucide-react';

const Header = ({ admin, onToggleSidebar, sidebarOpen, onLogout }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-PH', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      hour12: true 
    });
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Mobile menu button */}
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <Menu className="h-6 w-6" />
        </button>

        {/* Live Data Indicator */}
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Live Data</span>
          </div>
          <span>•</span>
          <span>Last updated: {formatTime(currentTime)}</span>
        </div>

        {/* Right side - User profile */}
        <div className="flex items-center space-x-4 ml-auto">
          {/* User profile */}
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-blue-700 rounded-full flex items-center justify-center">
              <User className="h-5 w-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-gray-900">furever care</p>
              <p className="text-xs text-gray-500">admin</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
