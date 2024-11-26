import React, { useState } from "react";
import { Link } from 'react-router-dom';
import './Navbar.css';
import EditPreferences from './../EditPreferences'

const Navbar = ({ userDetails, onEditPreferences }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [editingPreferences, setEditingPreferences] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const avatarUrl = userDetails?.email
    ? `https://api.dicebear.com/9.x/pixel-art/svg?seed=${encodeURIComponent(userDetails.email)}`
    : 'path/to/fallback/image.png';

  return (
    <header className="navbar">
      <div className="navbar-container">
        <div className="navbar-center">
          <h1>Travel Planner</h1>
        </div>
        <div className="navbar-user">
          <span>{userDetails?.name || 'Guest'}</span>
          <div
            className={`avatar-container ${dropdownOpen ? 'dropdown-open' : ''}`}
            onClick={toggleDropdown}
          >
            <img
              src={avatarUrl}
              alt="User Avatar"
              className="user-avatar"
              onError={(e) => {
                console.error("Error loading avatar:", e);
                e.target.src = '/fallback-image.png';
              }}
            />
            {dropdownOpen && (
              <div className="dropdown-menu">

                  <Link
                        to="/preferences"
                        onClick={(e) => {
                          e.preventDefault();
                          onEditPreferences();
                        }}
                      >Edit Preferences</Link>

                <Link to="/logout">Logout</Link>
              </div>
            )}
          </div>
        </div>
      </div>
      {editingPreferences && (
              <EditPreferences onClose={() => setEditingPreferences(false)} />
            )}
    </header>
  );
};

export default Navbar;
