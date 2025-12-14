import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Calendar, { type CalendarProps } from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../styles/calendar-custom.css";
import Sidebar from "../components/layout/Sidebar";
import { ChevronRight, Menu } from "lucide-react";

export default function CalendarPage() {
  const navigate = useNavigate();
  const [value, setValue] = useState<Date | [Date, Date] | null>(new Date());
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // EVENT DUMMY UNTUK CONTOH
  const events = [
    { date: "2025-01-05", title: "Maintenance Mesin 1", desc: "Cek oli & sensor getaran" },
    { date: "2025-01-10", title: "Maintenance Mesin 2", desc: "Perbaikan belt conveyor" },
    { date: "2025-01-15", title: "Maintenance Mesin 3", desc: "Kalibrasi sensor suhu" },
  ];

  const [selectedEvent, setSelectedEvent] = useState<null | {
    date: string;
    title: string;
    desc: string;
  }>(null);

  const handleChange: CalendarProps["onChange"] = (nextValue) => {
    if (
      nextValue instanceof Date ||
      (Array.isArray(nextValue) && nextValue.every((v) => v instanceof Date))
    ) {
      setValue(nextValue as Date | [Date, Date]);

      // CEK APAKAH ADA EVENT DI TANGGAL YANG DIPILIH
      if (nextValue instanceof Date) {
        const dateString = nextValue.toISOString().split("T")[0];
        const event = events.find((e) => e.date === dateString);
        setSelectedEvent(event || null);
      }
    } else {
      setValue(null);
    }
  };

  // MEMBERI WARNA KOTAK TANGGAL YANG ADA EVENT
  const tileClassName: CalendarProps["tileClassName"] = ({ date }) => {
    const dateString = date.toISOString().split("T")[0];
    return events.some((e) => e.date === dateString)
      ? "has-event-tile"
      : "";
  };

  return (
    <div className="flex">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

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
                <span className="text-gray-900 font-medium">Calendar</span>
              </nav>
            </div>
          </div>

          <h1 className="text-xl md:text-3xl font-bold">Calendar</h1>
        </div>

        {/* Calendar Container */}
        <div className="bg-white p-6 md:p-10 rounded-3xl shadow-xl w-full max-w-4xl">

          <Calendar
            onChange={handleChange}
            value={value}
            tileClassName={tileClassName}
          />

          {/* EVENT POPUP */}
          {selectedEvent && (
            <div className="mt-6 p-5 bg-blue-50 border border-blue-300 rounded-xl shadow">
              <h2 className="text-xl font-bold text-blue-700">{selectedEvent.title}</h2>
              <p className="text-gray-700 mt-1">{selectedEvent.desc}</p>
              <p className="text-sm text-blue-500 mt-2">
                {selectedEvent.date}
              </p>

              <button
                onClick={() => setSelectedEvent(null)}
                className="mt-3 px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
