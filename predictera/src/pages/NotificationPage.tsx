import React, { useEffect, useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import { AlertTriangle, Bell } from "lucide-react";

type NotificationItem = {
  id: string;
  machineName: string;
  message: string;
  level: "warning" | "critical" | "info";
  time: string;
};

const NotificationPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  // Fetch from backend
  useEffect(() => {
    const fetchNotif = async () => {
      try {
        const res = await fetch("http://localhost:5000/notifications");
        const data = await res.json();
        setNotifications(data);
      } catch (err) {
        console.error("Failed to load notifications:", err);
      }
    };

    fetchNotif();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main */}
      <div className="flex-1 p-6 pt-24 md:pt-40 relative">

        {/* Top Bar Mobile */}
        <button
          className="absolute top-6 left-6 md:left-10 p-2 bg-white shadow rounded-lg md:hidden"
          onClick={() => setSidebarOpen(true)}
        >
          ☰
        </button>

        <div className="max-w-4xl mx-auto">

          {/* Title */}
          <div className="flex items-center gap-3 mb-10">
            <Bell className="w-7 h-7 text-yellow-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Notifications</h1>
              <p className="text-gray-600">Machine warnings & critical events</p>
            </div>
          </div>

          {/* Notification List */}
          <div className="space-y-5">
            {notifications.length === 0 && (
              <p className="text-gray-500 text-center py-20">No notifications yet...</p>
            )}

            {notifications.map((n) => (
              <NotificationCard key={n.id} item={n} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const NotificationCard = ({ item }: { item: NotificationItem }) => {
  const badgeColor =
    item.level === "critical"
      ? "bg-red-100 text-red-700"
      : item.level === "warning"
      ? "bg-yellow-100 text-yellow-700"
      : "bg-blue-100 text-blue-700";

  return (
    <div className="bg-white p-5 rounded-xl shadow border border-gray-100 flex items-start gap-4">
      <AlertTriangle
        className={`w-7 h-7 ${
          item.level === "critical"
            ? "text-red-600"
            : item.level === "warning"
            ? "text-yellow-600"
            : "text-blue-600"
        }`}
      />

      <div className="flex-1">
        <div className="flex justify-between items-start">
          <h2 className="font-semibold text-gray-800">{item.machineName}</h2>

          <span className={`px-3 py-1 rounded-full text-xs font-medium ${badgeColor}`}>
            {item.level.toUpperCase()}
          </span>
        </div>

        <p className="text-gray-600 text-sm mt-1">{item.message}</p>

        <p className="text-xs text-gray-400 mt-2">{item.time}</p>
      </div>
    </div>
  );
};

export default NotificationPage;
