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
  MessageSquare,
  Bot,
} from "lucide-react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { memo } from "react";
import { useConversations } from "../../contexts/ConversationsContext";

export default function Sidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const location = useLocation(); // untuk deteksi halaman aktif
  const [params] = useSearchParams();
  const { conversations, deleteConversation } = useConversations();

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
          md:translate-x-0 md:sticky md:top-0
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
        <Link to="/dashboard" className="block">
          <h1 className="text-2xl font-bold text-blue-600 mb-8 md:mb-10 hover:text-blue-700 transition-colors cursor-pointer">
            Predictera
          </h1>
        </Link>

        {/* Main menu */}
        <div className="space-y-2">

          <SidebarItem
            icon={<LayoutDashboard size={18} />}
            label="Dashboard"
            to="/dashboard"
            active={location.pathname === "/dashboard" || location.pathname === "/"}
          />

          <SidebarItem
            icon={<Users size={18} />}
            label="User List"
            to="/users"
            active={location.pathname === "/users"}
          />

          <SidebarItem
            icon={<Bot size={18} />}
            label="Agent"
            to="/agent"
            active={location.pathname === "/agent" && !params.get("conversation")}
          />
          
          <div className="ml-6 space-y-1">
            {conversations?.map((conv) => (
              <ConversationItem
                key={conv.id}
                label={conv.title || `Conversation ${conv.id}`}
                to={`/agent?conversation=${conv.id}`}
                active={location.pathname === "/agent" && params.get("conversation") === String(conv.id)}
                onDelete={() => deleteConversation(conv.id)}
              />
            ))}
          </div>

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
        {/* <div className="mt-10">
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
        </div> */}

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
        ${active ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-blue-600 hover:text-white"}`}
      >
        {icon}
        <span className="font-medium">{label}</span>
      </div>
    </Link>
  );
}

const ConversationItem = memo(function ConversationItem({
  label,
  to,
  active = false,
  onDelete,
}: {
  label: string;
  to: string;
  active?: boolean;
  onDelete?: () => void;
}) {
  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDelete) {
      onDelete();
    }
  };

  return (
    <Link to={to}>
      <div
        className={`flex items-center gap-2 px-2 py-2 rounded-lg cursor-pointer transition text-sm group
        ${active ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-blue-300"}`}
      >
        <MessageSquare size={14} className="flex-shrink-0" />
        <span className="font-medium truncate block flex-1">{label}</span>
        {onDelete && (
          <button
            onClick={handleDelete}
            className={`opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded hover:text-white
              ${active ? "text-white" : "text-gray-500"}`}
            aria-label="Delete conversation"
          >
            <X size={14} />
          </button>
        )}
      </div>
    </Link>
  );
});
