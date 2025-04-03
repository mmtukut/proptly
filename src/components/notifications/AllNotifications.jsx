import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';

const AllNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, unread, read
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, [filter, page]);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get('/api/notifications', {
        params: {
          filter,
          page,
          limit: 20
        }
      });
      
      if (page === 1) {
        setNotifications(response.data.notifications);
      } else {
        setNotifications(prev => [...prev, ...response.data.notifications]);
      }
      
      setHasMore(response.data.hasMore);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await axios.patch(`/api/notifications/${notificationId}/read`);
      setNotifications(notifications.map(notification =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      ));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await axios.patch('/api/notifications/mark-all-read');
      setNotifications(notifications.map(notification => ({
        ...notification,
        read: true
      })));
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const handleLoadMore = () => {
    setPage(prev => prev + 1);
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'property':
        return '🏠';
      case 'message':
        return '💬';
      case 'system':
        return '⚙️';
      case 'verification':
        return '✅';
      default:
        return '📢';
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Notifications</h1>
        <div className="flex gap-4">
          <select
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
              setPage(1);
            }}
            className="border rounded px-3 py-1"
          >
            <option value="all">All</option>
            <option value="unread">Unread</option>
            <option value="read">Read</option>
          </select>
          <button
            onClick={handleMarkAllAsRead}
            className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
          >
            Mark all as read
          </button>
        </div>
      </div>

      {loading && page === 1 ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`bg-white rounded-lg shadow p-4 ${
                !notification.read ? 'border-l-4 border-blue-500' : ''
              }`}
            >
              <div className="flex items-start">
                <span className="text-2xl mr-4">
                  {getNotificationIcon(notification.type)}
                </span>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium text-gray-900">
                      {notification.title}
                    </h3>
                    <span className="text-sm text-gray-500">
                      {format(new Date(notification.createdAt), 'MMM d, yyyy h:mm a')}
                    </span>
                  </div>
                  <p className="text-gray-600 mt-1">{notification.message}</p>
                  {notification.actionUrl && (
                    <a
                      href={notification.actionUrl}
                      className="text-blue-600 hover:text-blue-800 text-sm mt-2 inline-block"
                    >
                      View details
                    </a>
                  )}
                </div>
                {!notification.read && (
                  <button
                    onClick={() => handleMarkAsRead(notification.id)}
                    className="ml-4 text-sm text-blue-600 hover:text-blue-800"
                  >
                    Mark as read
                  </button>
                )}
              </div>
            </div>
          ))}

          {hasMore && (
            <div className="text-center py-4">
              <button
                onClick={handleLoadMore}
                className="bg-gray-100 px-4 py-2 rounded hover:bg-gray-200"
              >
                Load more
              </button>
            </div>
          )}

          {notifications.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No notifications found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AllNotifications;
