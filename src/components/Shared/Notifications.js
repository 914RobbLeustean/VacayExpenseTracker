import React from 'react';
import { Bell } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { useNotifications } from '../../hooks/useNotifications';

const Notifications = () => {
  const { darkMode, showNotifications, setShowNotifications } = useApp();
  const { notifications, markAllAsRead, markAsRead, clearAll } = useNotifications();
  
  return (
    <div className="relative notifications-dropdown">
      <div className="relative">
        <Bell 
          className={`h-6 w-6 ${darkMode ? 'text-gray-400' : 'text-gray-500'} cursor-pointer hover:text-blue-600`} 
          onClick={() => setShowNotifications(!showNotifications)}
        />
        {notifications.filter(n => !n.read).length > 0 && (
          <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
            {notifications.filter(n => !n.read).length}
          </span>
        )}
      </div>
      {showNotifications && (
        <div className={`absolute right-0 mt-2 w-80 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-md shadow-lg z-50`}>
          <div className={`p-3 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex justify-between items-center">
              <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>Notifications</h3>
              <button 
                className="text-sm text-blue-600 hover:text-blue-800"
                onClick={markAllAsRead}
              >
                Mark all as read
              </button>
            </div>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className={`p-4 text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                No notifications
              </div>
            ) : (
              notifications.map(notif => (
                <div 
                  key={notif.id} 
                  className={`p-3 ${darkMode ? 'border-gray-700' : 'border-gray-100'} border-b hover:${darkMode ? 'bg-gray-700' : 'bg-gray-50'} cursor-pointer ${!notif.read ? darkMode ? 'bg-blue-900' : 'bg-blue-50' : ''}`}
                  onClick={() => markAsRead(notif.id)}
                >
                  <div className="flex justify-between">
                    <p className={`text-sm ${!notif.read ? 'font-medium' : darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {notif.message}
                    </p>
                    <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {notif.date}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className={`p-2 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} text-center`}>
            <button 
              className="text-sm text-red-600 hover:text-red-800"
              onClick={clearAll}
            >
              Clear all
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;