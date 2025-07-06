import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faTimes } from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";
import axios from "axios";

const NotificationBell = ({
  notifications,
  onClearNotification,
  onNotificationClick,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const handleNotificationClick = (notification) => {
    onNotificationClick(notification);
    setShowDropdown(false);
  };

  const handleClearNotification = async (index, notification) => {
    try {
      // Get token from localStorage
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const token = userInfo?.token;

      // Mark notification as read in backend
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/notification/read`,
        {
          chatId: notification.chatId,
          notificationId: notification._id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Remove from UI
      onClearNotification(index);
    } catch (error) {
      console.error("Error clearing notification:", error);
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Filter out read notifications
  const unreadNotifications = notifications.filter((n) => !n.isRead);

  return (
    <div className="relative">
      <div
        className="relative cursor-pointer"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <FontAwesomeIcon icon={faBell} className="text-3xl text-white" />
        {unreadNotifications.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs w-6 h-6 flex items-center justify-center">
            {unreadNotifications.length}
          </span>
        )}
      </div>

      {showDropdown && (
        <div className="fixed right-4 top-20 w-80 bg-white rounded-lg shadow-lg border z-50 max-h-96 overflow-y-auto">
          <div className="p-4 border-b">
            <h3 className="font-semibold text-gray-800">Notifications</h3>
          </div>

          {unreadNotifications.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No new notifications
            </div>
          ) : (
            <div className="max-h-80 overflow-y-auto">
              {unreadNotifications.map((notification, index) => (
                <div
                  key={notification._id}
                  className="p-3 border-b hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        {notification.message.sender.pic ? (
                          <img
                            src={notification.message.sender.pic}
                            alt={notification.message.sender.name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-brightMagenta flex items-center justify-center text-white font-semibold text-xs">
                            {notification.message.sender.name
                              ?.split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()}
                          </div>
                        )}
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900">
                            {notification.message.sender.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {formatTime(notification.message.createdAt)}
                          </div>
                        </div>
                      </div>
                      <div className="mt-1 text-sm text-gray-700">
                        {notification.message.content.length > 50
                          ? notification.message.content.substring(0, 50) +
                            "..."
                          : notification.message.content}
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleClearNotification(index, notification);
                      }}
                      className="text-gray-400 hover:text-gray-600 ml-2"
                    >
                      <FontAwesomeIcon icon={faTimes} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

NotificationBell.propTypes = {
  notifications: PropTypes.array.isRequired,
  onClearNotification: PropTypes.func.isRequired,
  onNotificationClick: PropTypes.func.isRequired,
};

export default NotificationBell;
