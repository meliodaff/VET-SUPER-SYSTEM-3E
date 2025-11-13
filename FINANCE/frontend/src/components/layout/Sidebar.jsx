import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  CreditCard, 
  LogOut,
  Globe
} from 'lucide-react';

const Sidebar = ({ onLogout }) => {
  const location = useLocation();
  const [logoError, setLogoError] = useState(false);

  // Ensure onLogout is defined
  const handleLogout = onLogout || (() => {
    console.warn('onLogout is not defined in Sidebar');
    localStorage.removeItem('admin');
    window.location.href = '/login';
  });

  const menuItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: LayoutDashboard
    },
    {
      name: 'Employees',
      path: '/employees',
      icon: Users
    },
    {
      name: 'Invoices',
      path: '/invoices',
      icon: FileText
    },
    {
      name: 'Monitor Payment',
      path: '/payments',
      icon: CreditCard
    }
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="flex flex-col h-full">
      {/* Logo Header - Matching Login Form */}
      <div className="flex flex-col items-center justify-center py-6 px-4 bg-navy-800 border-b border-navy-700">
        {/* Logo Image */}
        <div className="mb-3">
          <div className="w-16 h-16 rounded-full border-4 border-white shadow-lg flex items-center justify-center transform transition-all duration-300 hover:scale-110 hover:rotate-12 overflow-hidden bg-white">
            {!logoError ? (
              <img 
                src="/logo.png" 
                alt="Fur-Ever Care Logo" 
                className="w-full h-full object-contain p-2"
                onError={() => setLogoError(true)}
              />
            ) : (
              <div className="w-full h-full bg-blue-400 rounded-full flex items-center justify-center">
                <Globe className="h-8 w-8 text-white" />
              </div>
            )}
          </div>
        </div>
        
        {/* Title and Subtitle */}
        <div className="text-center">
          <h1 className="text-lg font-bold text-white mb-0.5">FUR-EVER CARE</h1>
          <p className="text-xs text-gray-300">Sales And Finance</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
                isActive(item.path)
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-navy-800 hover:text-white'
              }`}
            >
              <Icon className="h-5 w-5 mr-3" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Logout button */}
      <div className="px-4 py-6 border-t border-navy-700">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-300 rounded-lg hover:bg-navy-800 hover:text-white transition-colors duration-200"
        >
          <LogOut className="h-5 w-5 mr-3" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
