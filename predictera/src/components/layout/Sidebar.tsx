import {
  LayoutDashboard,
  Users,
  History,
  Cpu,
  Bell,
  Calendar,
  Phone,
  X,
  LogOut,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const location = useLocation(); // untuk deteksi halaman aktif

  return (
    <>
      {/* Overlay for mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-20 md:hidden"
          onClick={onClose}
        />
      )}

      <div
        className={`
          fixed top-0 left-0 h-screen w-64 bg-white shadow-lg px-6 py-6
          z-30 transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:static
          flex flex-col
        `}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="md:hidden mb-6 text-gray-600 hover:text-black"
        >
          <X size={24} />
        </button>

        {/* Logo */}
        <h1 className="text-2xl font-bold text-blue-600 mb-8 md:mb-10">
          Predictera
        </h1>

        {/* Main menu */}
        <div className="space-y-2">
          <SidebarItem
            icon={<LayoutDashboard size={18} />}
            label="Dashboard"
            to="/dashboard"
            active={location.pathname === "/dashboard"}
          />

          <SidebarItem
            icon={<Users size={18} />}
            label="Agent"
            to="/agent"
            active={location.pathname === "/agent"}
          />

          <SidebarItem
            icon={<Cpu size={18} />}
            label="Machine"
            to="/machine"
            active={location.pathname === "/machine"}
          />

          <SidebarItem
            icon={<History size={18} />}
            label="History"
            to="/history"
            active={location.pathname === "/history"}
          />

          <SidebarItem
            icon={<Bell size={18} />}
            label="Notification"
            to="/notification"
            active={location.pathname === "/notification"}
          />
        </div>

        {/* Information Section */}
        <div className="mt-10">
          <p className="text-black font-bold text-xs mb-3">INFORMATION</p>
          <div className="space-y-2">
            <SidebarItem
              icon={<Calendar size={18} />}
              label="Calendar"
              to="/calendar"
              active={location.pathname === "/calendar"}
            />

            <SidebarItem
              icon={<Phone size={18} />}
              label="Contact"
              to="/contact"
              active={location.pathname === "/contact"}
            />
          </div>
        </div>

        {/* Logout */}
        <div className="mt-auto pt-6">
          <SidebarItem
            icon={<LogOut size={18} />}
            label="Logout"
            to="/logout"
          />
        </div>
      </div>
    </>
  );
}

function SidebarItem({
  icon,
  label,
  to,
  active = false,
}: {
  icon: React.ReactNode;
  label: string;
  to: string;
  active?: boolean;
}) {
  return (
    <Link to={to}>
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition
        ${active ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-blue-300"}`}
      >
        {icon}
        <span className="font-medium">{label}</span>
      </div>
    </Link>
  );
}
