import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import { Menu, ChevronRight } from "lucide-react";
import { historyApi } from "../services";

type HistoryItem = {
  id: number;
  machineName: string;
  issue: string;
  status: "completed" | "in-progress" | "pending";
  technician: string;
  date: string;
};

const HistoryPage = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Fetch from backend
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await historyApi.getHistory();
        setHistory(data);
      } catch (error) {
        console.error("Failed to load history:", error);
      }
    };

    fetchHistory();
  }, []);

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
                <span className="text-gray-900 font-medium">History</span>
              </nav>
            </div>
          </div>

          <h1 className="text-xl md:text-3xl font-bold">Maintenance History</h1>
          <p className="text-gray-600">A list of all machine maintenance activities over time.</p>
        </div>

        <div className="max-w-5xl">

          {/* History List */}
          <div className="space-y-5">
            {history.length === 0 && (
              <p className="text-gray-500 text-center py-20">
                No history available yet...
              </p>
            )}

            {history.map((item) => (
              <HistoryCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// CARD COMPONENT
/* History Card */
const HistoryCard = ({ item }: { item: HistoryItem }) => {
  return (
    <div className="bg-white rounded-xl shadow p-5 border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
      
      {/* LEFT SIDE INFO */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800">
          {item.machineName}
        </h2>
        <p className="text-gray-600 text-sm mt-1">{item.issue}</p>

        <div className="text-xs text-gray-400 mt-2">
          Technician: <span className="text-gray-700">{item.technician}</span>
        </div>

        <div className="text-xs text-gray-400">
          Date: <span className="text-gray-700">{item.date}</span>
        </div>
      </div>

      {/* STATUS BADGE */}
      <span
        className={`
          px-3 py-1 rounded-full text-sm font-medium w-fit
          ${
            item.status === "completed"
              ? "bg-green-100 text-green-700"
              : item.status === "in-progress"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-red-100 text-red-700"
          }
        `}
      >
        {item.status.replace("-", " ").toUpperCase()}
      </span>
    </div>
  );
};

export default HistoryPage;
