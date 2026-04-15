import React, { useEffect, useState } from "react";
import { Bell, CheckCircle2 } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import {
  fetchNotifications,
  markNotificationRead,
  Notification,
} from "../api/dashboardApi";

const Notifications: React.FC = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNotifications = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const data = await fetchNotifications(Number(user.id));
        setNotifications(data);
      } catch (error) {
        console.error("Failed to load notifications", error);
      } finally {
        setLoading(false);
      }
    };

    loadNotifications();
  }, [user]);

  const handleMarkRead = async (id: number) => {
    const updated = await markNotificationRead(id);
    setNotifications(
      updated.filter((note) => note.studentId === Number(user?.id)),
    );
  };

  return (
    <div>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Notifications</h2>
          <p className="text-gray-600">
            Stay informed about query replies, enrollment updates, and
            attendance alerts.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Bell className="w-10 h-10 text-blue-600 animate-spin" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-gray-600">
              No notifications available at the moment.
            </p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`rounded-3xl p-6 shadow-sm ${notification.read ? "bg-gray-50" : "bg-white"}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {notification.title}
                  </p>
                  <p className="mt-2 text-sm text-gray-600">
                    {notification.message}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${notification.read ? "bg-gray-100 text-gray-600" : "bg-blue-100 text-blue-700"}`}
                >
                  {notification.read ? "Read" : "New"}
                </span>
              </div>
              <div className="mt-4 flex items-center justify-between gap-4 text-sm text-gray-500">
                <p>{new Date(notification.createdAt).toLocaleString()}</p>
                {!notification.read && (
                  <button
                    onClick={() => handleMarkRead(notification.id)}
                    className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Mark as read
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;
