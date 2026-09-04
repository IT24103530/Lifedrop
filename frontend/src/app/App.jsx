import React from 'react';
import Navbar from '../components/Navbar';
import AppRoutes from './routes';
import { AuthProvider } from '../context/AuthContext';
import { NotificationProvider } from '../context/NotificationContext';
import ToastAlert from '../components/ToastAlert';

export default function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <div className="app-shell">
          <Navbar />
          <main className="main-content">
            <AppRoutes />
          </main>
          <ToastAlert />
          <footer className="footer section">
            <div className="container text-center">
              <p>© 2026 LifeDrop Platform. All rights reserved.</p>
              <small style={{ color: 'var(--text-muted)' }}>
                Voluntary Non-Profit Blood Donation Platform
              </small>
            </div>
          </footer>
        </div>
      </NotificationProvider>
    </AuthProvider>
  );
}
