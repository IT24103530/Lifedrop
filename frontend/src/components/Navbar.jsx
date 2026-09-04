import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Heart, UserPlus, FilePlus, Users, Activity, User, LogIn, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import NotificationBell from './NotificationBell';
import './Navbar.css';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="header-navbar">
      <div className="container nav-container">
        <NavLink to="/" className="brand-logo">
          <div className="logo-icon">
            <Heart className="heart-icon" fill="#D62828" size={24} />
          </div>
          <span className="logo-text">
            Life<span className="logo-highlight">Drop</span>
          </span>
        </NavLink>

        <nav className="nav-links">
          <NavLink to="/" end className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
            <Heart size={16} /> Home
          </NavLink>
          <NavLink to="/request" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
            <FilePlus size={16} /> Request Blood
          </NavLink>
          <NavLink to="/browse" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
            <Users size={16} /> Browse Donors
          </NavLink>
          <NavLink to="/requests" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
            <Activity size={16} /> Active Requests
          </NavLink>

          {isAuthenticated ? (
            <>
              <NotificationBell />
              <NavLink to="/profile" className={({ isActive }) => (isActive ? 'nav-item active profile-nav' : 'nav-item profile-nav')}>
                <User size={16} />
                <span>{user?.name ? user.name.split(' ')[0] : 'Profile'}</span>
                {user?.bloodGroup && <span className="nav-blood-badge">{user.bloodGroup}</span>}
              </NavLink>
              <button className="nav-logout-btn" onClick={handleLogout} title="Sign Out">
                <LogOut size={16} />
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
                <LogIn size={16} /> Sign In
              </NavLink>
              <NavLink to="/register" className="nav-item nav-item-cta">
                <UserPlus size={16} /> Register
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
