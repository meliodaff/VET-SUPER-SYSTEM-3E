import React, { useState, useRef, useEffect } from 'react';
import { User, Settings, LogOut, Box } from 'lucide-react';
import './Navbar.css';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-container">
          <h1 className="navbar-title">Inventory Management</h1>
        </div>

        <div className="navbar-user-menu" ref={dropdownRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="navbar-avatar-btn"
          >
            C
          </button>

          {isOpen && (
            <div className="navbar-dropdown">
              <div className="navbar-dropdown-header">
                <p className="navbar-dropdown-name">Christian</p>
                <p className="navbar-dropdown-email">admin@furevercare.com</p>
                <p className="navbar-dropdown-role">Role: Admin</p>
              </div>

              <div className="navbar-dropdown-menu">
                <button className="navbar-dropdown-item">
                  <LogOut className="navbar-dropdown-icon" />
                  <span>Log out</span>
                </button>
              </div>
            </div>
          )}
        </div>
    </nav>
  );
}