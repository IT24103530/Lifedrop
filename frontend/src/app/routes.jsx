import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Profile from '../pages/Profile';
import CompleteProfile from '../pages/CompleteProfile';
import DonorRegistration from '../features/donor-registration/DonorRegistration';
import BloodRequest from '../features/blood-request/BloodRequest';
import DonorBrowse from '../features/donor-browse/DonorBrowse';
import ActiveRequests from '../features/requests/ActiveRequests';
import { useAuth } from '../context/AuthContext';

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="container text-center" style={{ padding: '60px' }}>Loading session...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

// Profile Completion Gate Wrapper
const ProfileGate = ({ children }) => {
  const { isAuthenticated, isProfileComplete, loading } = useAuth();

  if (loading) return null;

  if (isAuthenticated && !isProfileComplete) {
    return <Navigate to="/complete-profile" replace />;
  }

  return children;
};

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/complete-profile"
        element={
          <ProtectedRoute>
            <CompleteProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/request"
        element={
          <ProfileGate>
            <BloodRequest />
          </ProfileGate>
        }
      />
      <Route
        path="/browse"
        element={
          <ProfileGate>
            <DonorBrowse />
          </ProfileGate>
        }
      />
      <Route
        path="/requests"
        element={
          <ProfileGate>
            <ActiveRequests />
          </ProfileGate>
        }
      />
    </Routes>
  );
}
