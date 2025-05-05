import { useApp } from '../contexts/AppContext';

export const useNotifications = () => {
  const { notifications, setNotifications } = useApp();

  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(notif => ({
      ...notif,
      read: true
    }));
    setNotifications(updatedNotifications);
  };

  const markAsRead = (notificationId) => {
    const updatedNotifications = notifications.map(n =>
      n.id === notificationId ? { ...n, read: true } : n
    );
    setNotifications(updatedNotifications);
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return {
    notifications,
    markAllAsRead,
    markAsRead,
    clearAll
  };
};