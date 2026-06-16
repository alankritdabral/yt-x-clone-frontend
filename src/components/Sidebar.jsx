// src/components/Sidebar.jsx
import { useNavigate, useLocation } from "react-router-dom";
import {
  Home,
  Compass,
  PlaySquare,
  Clock,
  ThumbsUp,
  MessageSquare,
} from "lucide-react";

const sidebarItems = [
  { label: "Home", icon: Home, path: "/" },
  { label: "Explore", icon: Compass, path: "/search" },
  { label: "Playlist", icon: PlaySquare, path: "/playlist/subscriptions" },
  { label: "Watch History", icon: Clock, path: "/history" },
  { label: "Liked Videos", icon: ThumbsUp, path: "/liked-videos" },
  { label: "Messages", icon: MessageSquare, path: "/tweets" },
];

// eslint-disable-next-line no-unused-vars
const SidebarItem = ({ icon: Icon, label, active, onClick, sidebarOpen }) => (
  <div
    onClick={onClick}
    className={`
      flex items-center gap-4 px-4 py-2.5 mx-2 rounded-xl cursor-pointer
      transition-all duration-200
      ${active
        ? "bg-[#272727] text-white font-medium"
        : "text-[#f1f1f1] hover:bg-[#272727] hover:text-white"
      }
    `}
  >
    <Icon size={22} strokeWidth={active ? 2.5 : 2} className={active ? "text-white" : "text-[#aaaaaa]"} />

    {sidebarOpen && (
      <span className="text-[15px] whitespace-nowrap">{label}</span>
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
    transition-all duration-300 z-40
    overflow-y-auto custom-scrollbar

    w-60
    transform

    /* Mobile slide */
    ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}

    /* Desktop behavior */
    md:translate-x-0
    ${sidebarOpen ? "md:w-60" : "md:w-[72px]"}
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
