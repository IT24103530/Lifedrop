import React, { useState, useRef, useEffect } from 'react';
import { Bell, Check, AlertCircle, Clock, Trash2, X } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';
import './NotificationBell.css';

export default function NotificationBell() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification, clearNotifications } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
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
    <div className="notification-bell-container" ref={dropdownRef}>
      <button
        className="bell-button"
        onClick={() => setIsOpen(!isOpen)}
        title="Urgent Blood Alerts"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="bell-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>
        )}
      </button>

      {isOpen && (
        <div className="notification-dropdown glass-panel">
          <div className="dropdown-header">
            <div className="dropdown-title">
              <AlertCircle size={18} className="text-danger" />
              <span>Urgent Alerts ({notifications.length})</span>
            </div>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              {unreadCount > 0 && (
                <button className="mark-all-btn" onClick={markAllAsRead} title="Mark all as read">
                  <Check size={13} /> Read all
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  className="mark-all-btn"
                  onClick={clearNotifications}
                  style={{ color: '#DC2626' }}
                  title="Clear all notifications"
                >
                  <Trash2 size={13} /> Clear
                </button>
              )}
            </div>
          </div>

          <div className="dropdown-body">
            {notifications.length === 0 ? (
              <div className="empty-notifications">
                <Clock size={24} />
                <p>No urgent blood request alerts yet.</p>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n._id}
                  className={`notification-item ${!n.read ? 'unread' : ''}`}
                  onClick={() => markAsRead(n._id)}
                  style={{ position: 'relative' }}
                >
                  <div className="item-header">
                    <span className={`urgency-pill ${n.urgency ? n.urgency.toLowerCase() : 'urgent'}`}>
                      {n.urgency || 'URGENT'}
                    </span>
                    <span className="item-time">
                      {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="item-message">{n.message}</p>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(n._id);
                    }}
                    style={{
                      position: 'absolute',
                      right: '10px',
                      bottom: '8px',
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      padding: '2px'
                    }}
                    title="Delete notification"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
