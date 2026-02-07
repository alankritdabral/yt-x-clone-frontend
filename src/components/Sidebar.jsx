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
      flex items-center gap-4 px-4 py-2 mx-2 rounded-lg cursor-pointer
      transition-colors
      ${active
        ? "bg-[#242424] text-white font-medium"
        : "text-gray-400 hover:bg-[#242424] hover:text-white"
      }
    `}
  >
    <Icon size={22} />

    {sidebarOpen && (
      <span className="text-sm whitespace-nowrap">{label}</span>
    )}
  </div>
);

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <>
      {/* ---------- Mobile Overlay ---------- */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`
          fixed top-14 left-0 h-[calc(100vh-56px)]
          bg-[#0f0f0f]
          border-r border-[#2a2a2a]
          transition-all duration-300 z-40

          /* Desktop */
          hidden md:block
          ${sidebarOpen ? "w-56" : "w-20"}

          /* Mobile slide-in */
          md:translate-x-0
          ${sidebarOpen ? "translate-x-0 w-56" : "-translate-x-full"}
        `}
      >
        <div className="py-3 space-y-1">
          {sidebarItems.map((item) => (
            <SidebarItem
              key={item.label}
              icon={item.icon}
              label={item.label}
              sidebarOpen={sidebarOpen}
              active={location.pathname === item.path}
              onClick={() => {
                navigate(item.path);
                setSidebarOpen(false);
              }}
            />
          ))}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
