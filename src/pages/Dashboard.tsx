import Sidebar from "../components/layout/Sidebar";
import { Menu, Wrench, Cpu } from "lucide-react";
import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState("January");

  // Dummy data for 3 machines
  const dataMachineA = [
    { day: "1", value: 88 },
    { day: "5", value: 92 },
    { day: "10", value: 90 },
    { day: "15", value: 94 },
    { day: "20", value: 97 },
    { day: "25", value: 95 },
  ];

  const dataMachineB = [
    { day: "1", value: 70 },
    { day: "5", value: 75 },
    { day: "10", value: 73 },
    { day: "15", value: 78 },
    { day: "20", value: 80 },
    { day: "25", value: 77 },
  ];

  const dataMachineC = [
    { day: "1", value: 60 },
    { day: "5", value: 65 },
    { day: "10", value: 63 },
    { day: "15", value: 68 },
    { day: "20", value: 70 },
    { day: "25", value: 69 },
  ];

  return (
    <div className="flex">

      {/* Sidebar */}
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main */}
      <div className="flex-1 min-h-screen bg-gray-50 p-4 md:p-10">

        {/* Sidebar Toggle Button (Mobile) */}
        <div className="flex items-center justify-between mb-5">
          <button
            className="md:hidden p-2 rounded-lg border"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={24} />
          </button>

          <h1 className="text-xl md:text-3xl font-bold">Dashboard</h1>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">

          <StatCard
            title="Total Machines"
            value="3 Units"
            icon={<Cpu size={22} className="text-purple-700" />}
            iconBg="bg-purple-100"
            growth="+5% This Month"
            growthColor="text-green-600"
          />

          <StatCard
            title="Total Maintenance"
            value="12 Jobs"
            icon={<Wrench size={22} className="text-yellow-700" />}
            iconBg="bg-yellow-100"
            growth="+2% From Last Month"
            growthColor="text-green-600"
          />
        </div>

        {/* Performance Overview */}
        <div className="bg-white p-4 md:p-6 rounded-xl shadow mt-8">
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <h2 className="text-lg md:text-xl font-bold">Performance Overview</h2>

            {/* Month Selector */}
            <select
              className="border px-3 py-2 rounded-lg"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              {["January", "February", "March", "April", "May", "June"].map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>
          </div>

          {/* 3 Machines Graphs */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">

            <MachineChart title="Machine A Performance" data={dataMachineA} />
            <MachineChart title="Machine B Performance" data={dataMachineB} />
            <MachineChart title="Machine C Performance" data={dataMachineC} />

          </div>
        </div>
      </div>
    </div>
  );
}

/* Stat Card */
function StatCard({
  title,
  value,
  icon,
  iconBg,
  growth,
  growthColor,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  iconBg: string;
  growth: string;
  growthColor: string;
}) {
  return (
  <div className="bg-white rounded-xl p-5 shadow flex items-start gap-4">

    <div className={`${iconBg} w-12 h-12 rounded-lg flex items-center justify-center`}>
      {icon}
    </div>

    <div>
      <p className="text-gray-500 text-sm">{title}</p>
      <h3 className="text-xl md:text-2xl font-bold">{value}</h3>
      <p className={`text-sm mt-1 ${growthColor}`}>{growth}</p>
    </div>

  </div>
);
}

/* Machine Chart */
type ChartPoint = {
  day: string;
  value: number;
};

function MachineChart({
  title,
  data,
}: {
  title: string;
  data: ChartPoint[];
}) {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-md font-semibold mb-3">{title}</h3>

      <div className="w-full h-52">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
