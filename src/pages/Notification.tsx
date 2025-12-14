import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import { Menu, ChevronRight } from "lucide-react";
import { notificationsApi } from "../services";

type NotificationItem = {
  id: string;
  machineName: string;
  message: string;
  level: "warning" | "critical" | "info";
  time: string;
};

const NotificationPage = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  // Fetch from backend
  useEffect(() => {
    const fetchNotif = async () => {
      try {
        const data = await notificationsApi.getNotifications();
        setNotifications(data);
      } catch (err) {
        console.error("Failed to load notifications:", err);
      }
    };

    fetchNotif();
  }, []);

  // Dismiss notification
  const dismissNotification = async (id: string) => {
    try {
      await notificationsApi.deleteNotification(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (err) {
      console.error("Failed to dismiss notification:", err);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* Sidebar */}
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main */}
      <div className="flex-1 min-h-screen bg-gray-50 p-4 md:p-10">

        {/* Header with Breadcrumb */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <button
              className="md:hidden p-2 rounded-lg border"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <div>
              {/* Breadcrumb */}
              <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                <button onClick={() => navigate("/")} className="hover:text-blue-600">
                  Dashboard
                </button>
                <ChevronRight size={16} />
                <span className="text-gray-900 font-medium">Notifications</span>
              </nav>
            </div>
          </div>

          <h1 className="text-xl md:text-3xl font-bold">Notifications</h1>
          <p className="text-gray-600">Machine warnings & critical events</p>
        </div>

        <div className="max-w-5xl">

          {/* Notification List */}
          <div className="space-y-5">
            {notifications.length === 0 && (
              <p className="text-gray-500 text-center py-20">No notifications yet...</p>
            )}

            {notifications.map((n) => (
              <NotificationCard key={n.id} item={n} onDismiss={dismissNotification} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/* Notification Card */
const NotificationCard = ({ item, onDismiss }: { item: NotificationItem; onDismiss: (id: string) => void }) => {
  const badgeColor =
    item.level === "critical"
      ? "bg-red-100 text-red-700"
      : item.level === "warning"
      ? "bg-yellow-100 text-yellow-700"
      : "bg-blue-100 text-blue-700";

  return (
    <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden group hover:shadow-lg transition-shadow relative">
      <div className="p-5 relative">
        <div className="flex justify-between items-start">
          <h2 className="font-semibold text-gray-800">{item.machineName}</h2>

          <span className={`px-3 py-1 rounded-full text-xs font-medium ${badgeColor} transition-opacity group-hover:opacity-0`}>
            {item.level.toUpperCase()}
          </span>
        </div>

        <p className="text-gray-600 text-sm mt-1">{item.message}</p>

        <p className="text-xs text-gray-400 mt-2">{item.time}</p>

        <button
          onClick={() => onDismiss(item.id)}
          className="absolute right-0 top-0 h-full bg-red-50 hover:bg-red-100 text-red-600 px-1 font-medium text-xs transition-all duration-200 opacity-0 group-hover:opacity-100 flex items-center"
          title="Dismiss notification"
        >
          <span className="transform -rotate-90 whitespace-nowrap">Dismiss</span>
        </button>
      </div>
    </div>
  );
};

export default NotificationPage;
