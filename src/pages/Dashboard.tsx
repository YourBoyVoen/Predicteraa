import Sidebar from "../components/layout/Sidebar";
import { Menu, Wrench, Cpu } from "lucide-react";
import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { machinesApi } from "../services";

type MachineHealthItem = {
  id: number;
  name: string;
  healthHistory: Array<{
    health: number;
    date: string;
  }>;
};

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState("January");
  const [totalMachines, setTotalMachines] = useState("0 Machine");
  // const [totalMaintenances, setTotalMaintenances] = useState("0 Job");
  const [machinesData, setMachinesData] = useState<MachineHealthItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const count = await machinesApi.count();
        setTotalMachines(`${count} Machine${count !== 1 ? 's' : ''}`);

        const healthResponse = await machinesApi.health();
        setMachinesData(healthResponse.data.machinesHealth);
      } catch (error) {
        console.error('Failed to fetch machine data:', error);
        setTotalMachines("0 Machine");
        setMachinesData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex">

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
                <span className="text-gray-900 font-medium">Dashboard</span>
              </nav>
            </div>
          </div>

          <h1 className="text-xl md:text-3xl font-bold">Dashboard</h1>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">

          <StatCard
            title="Total Machines"
            value={totalMachines}
            icon={<Cpu size={22} className="text-purple-700" />}
            iconBg="bg-purple-100"
            // growth="+5% This Month"
            // growthColor="text-green-600"
          />

          {/* <StatCard
            title="Total Maintenance"
            value={totalMaintenances}
            icon={<Wrench size={22} className="text-yellow-700" />}
            iconBg="bg-yellow-100"
            // growth="+2% From Last Month"
            // growthColor="text-green-600"
          /> */}
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
            {loading ? (
              <div className="col-span-full text-center py-12 text-gray-500">
                Loading machine data...
              </div>
            ) : machinesData.length > 0 ? (
              machinesData.map((machine) => (
                <MachineChart
                  key={machine.id}
                  title={`${machine.name} Performance`}
                  data={machine.healthHistory}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-gray-500">
                No machine data available
              </div>
            )}
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
  health: number;
  date: string;
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
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="health" stroke="#2563eb" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
