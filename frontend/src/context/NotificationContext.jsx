import React, { createContext, useContext, useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

const SOCKET_SERVER_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api').replace('/api', '');

export const NotificationProvider = ({ children }) => {
  const { user, isAuthenticated, authFetch } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [toastAlert, setToastAlert] = useState(null);
  const [socket, setSocket] = useState(null);

  // Fetch initial notifications when authenticated
  const fetchNotifications = async () => {
    if (!isAuthenticated) return;
    try {
      const data = await authFetch('/notifications/me');
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch (error) {
      console.error('Failed to fetch notifications:', error.message);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [isAuthenticated]);

  // Socket.IO setup
  useEffect(() => {
    if (!isAuthenticated || !user) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      return;
    }

    const newSocket = io(SOCKET_SERVER_URL, {
      withCredentials: true,
      transports: ['websocket', 'polling']
    });

    newSocket.on('connect', () => {
      console.log('[Socket Client]: Connected to server socket ->', newSocket.id);
      newSocket.emit('join-user-room', user._id);
    });

    newSocket.on('urgent-alert', (notification) => {
      console.log('[Socket Client]: Urgent alert received ->', notification);
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);

      // Display live visual toast banner
      setToastAlert(notification);
      setTimeout(() => {
        setToastAlert(null);
      }, 7000);
    });

    setSocket(newSocket);

    return () => {
      newSocket.emit('leave-user-room', user._id);
      newSocket.disconnect();
    };
  }, [isAuthenticated, user?._id]);

  const markAsRead = async (id) => {
    try {
      await authFetch(`/notifications/${id}/read`, { method: 'PATCH' });
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark notification as read:', error.message);
    }
  };

  const markAllAsRead = async () => {
    try {
      await authFetch('/notifications/read-all', { method: 'PATCH' });
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error.message);
    }
  };

  const deleteNotification = async (id) => {
    try {
      await authFetch(`/notifications/${id}`, { method: 'DELETE' });
      const target = notifications.find((n) => n._id === id);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
      if (target && !target.read) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Failed to delete notification:', error.message);
    }
  };

  const clearNotifications = async () => {
    try {
      await authFetch('/notifications', { method: 'DELETE' });
      setNotifications([]);
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to clear notifications:', error.message);
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        toastAlert,
        socket,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearNotifications,
        closeToast: () => setToastAlert(null)
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
