// src/components/Sidebar.jsx
import { useNavigate, useLocation } from "react-router-dom";
import {
  Home,
  Compass,
  PlaySquare,
  Clock,
  ThumbsUp,
} from "lucide-react";

const sidebarItems = [
  { label: "Home", icon: Home, path: "/" },
  { label: "Explore", icon: Compass, path: "/search" },
  { label: "Playlist", icon: PlaySquare, path: "/playlist/subscriptions" },
  { label: "Watch History", icon: Clock, path: "/history" },
  { label: "Liked Videos", icon: ThumbsUp, path: "/liked-videos" },
];

const SidebarItem = ({ icon: Icon, label, active, onClick, sidebarOpen }) => (
  <div
    onClick={onClick}
    className={`
      flex items-center gap-5 px-4 py-2 mx-2 rounded-lg cursor-pointer
      ${active ? "bg-gray-200 font-semibold" : "hover:bg-gray-100"}
    `}
  >
    <Icon size={22} />
    {sidebarOpen && <span className="text-sm">{label}</span>}
  </div>
);

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside
      className={`
        fixed top-14 left-0 h-[calc(100vh-56px)]
        bg-white border-r border-gray-200
        transition-all duration-300 z-40
        ${sidebarOpen ? "w-56" : "w-20"}
      `}
    >
      <div className="py-2">
        {sidebarItems.map((item) => (
          <SidebarItem
            key={item.label}
            icon={item.icon}
            label={item.label}
            sidebarOpen={sidebarOpen}
            active={location.pathname === item.path}
            onClick={() => {
              navigate(item.path);
              setSidebarOpen(false); // auto-close on mobile
            }}
          />
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
