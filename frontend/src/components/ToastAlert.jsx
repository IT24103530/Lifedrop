import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';
import './ToastAlert.css';

export default function ToastAlert() {
  const { toastAlert, closeToast } = useNotifications();

  if (!toastAlert) return null;

  return (
    <div className="toast-alert-banner shadow-lg">
      <div className="toast-icon">
        <AlertTriangle size={22} className="text-danger-glow" />
      </div>
      <div className="toast-content">
        <span className="toast-title">URGENT BLOOD MATCH ALERT</span>
        <p className="toast-message">{toastAlert.message}</p>
      </div>
      <button className="toast-close-btn" onClick={closeToast}>
        <X size={16} />
      </button>
    </div>
  );
}
