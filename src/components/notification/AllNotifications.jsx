import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { notificationService } from '../../services/notificationService';
import { formatDistanceToNow } from 'date-fns';
import { Bell, Filter, CheckCircle, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const AllNotifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, unread, read
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const pageSize = 20;

  useEffect(() => {
    loadNotifications();
  }, [filter, page]);

  const loadNotifications = async () => {
    try {
      const options = {
        limit: pageSize,
        offset: (page - 1) * pageSize
      };

      if (filter === 'unread') {
        options.unreadOnly = true;
      } else if (filter === 'read') {
        options.readOnly = true;
      }

      const data = await notificationService.getUserNotifications(user.uid, options);
      
      if (page === 1) {
        setNotifications(data);
      } else {
        setNotifications(prev => [...prev, ...data]);
      }
      
      setHasMore(data.length === pageSize);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications(prev =>
        prev.map(n =>
          n.id === notificationId ? { ...n, read: true } : n
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead(user.uid);
      setNotifications(prev =>
        prev.map(n => ({ ...n, read: true }))
      );
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const handleLoadMore = () => {
    setPage(prev => prev + 1);
  };

  if (loading && page === 1) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow">
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Bell className="w-6 h-6 text-gray-600" />
              <h2 className="text-2xl font-bold">Notifications</h2>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/settings/notifications"
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Manage Preferences
              </Link>
              {notifications.some(n => !n.read) && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Mark all as read
                </button>
              )}
            </div>
          </div>

          {/* Filters */}
          <div className="mt-4 flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value);
                setPage(1);
              }}
              className="text-sm border rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Notifications</option>
              <option value="unread">Unread</option>
              <option value="read">Read</option>
            </select>
          </div>
        </div>

        {/* Notifications List */}
        <div className="divide-y">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No notifications found
            </div>
          ) : (
            notifications.map(notification => (
              <div
                key={notification.id}
                className={`p-6 ${!notification.read ? 'bg-blue-50' : ''}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {notification.title}
                    </p>
                    <p className="mt-1 text-gray-600">
                      {notification.message}
                    </p>
                    <p className="mt-2 text-sm text-gray-500">
                      {formatDistanceToNow(notification.createdAt?.toDate(), {
                        addSuffix: true
                      })}
                    </p>
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
            ))
          )}
        </div>

        {/* Load More */}
        {hasMore && (
          <div className="p-6 border-t text-center">
            <button
              onClick={handleLoadMore}
              disabled={loading}
              className="text-blue-600 hover:text-blue-800 font-medium disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Load More'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllNotifications; 