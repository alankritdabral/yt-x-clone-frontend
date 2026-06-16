import { Menu, Search, Video, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

/* Use VITE env for production builds */
const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

const Navbar = ({
  sidebarOpen,
  setSidebarOpen,
}) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");

  /* ======================
     Search Handler
  ====================== */
  const handleSearch = () => {
    const q = searchText.trim();
    if (!q) return;
    navigate(`/search?q=${encodeURIComponent(q)}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  /* ======================
     Logout Handler
  ====================== */
  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  /* ======================
     Avatar URL
  ====================== */
  const avatarUrl = (() => {
    if (!user?.avatar) return null;

    if (user.avatar.startsWith("http")) return user.avatar;

    return `${API_BASE}${user.avatar.startsWith("/") ? "" : "/"}${user.avatar
      }`;
  })();

  return (
    <nav
      className="
        fixed top-0 left-0 right-0 z-50 h-14
        bg-[#0f0f0f]/95 backdrop-blur-md
        border-b border-[#2a2a2a]/50
      "
    >
      <div className="flex items-center justify-between h-full px-3 md:px-5">
        {/* LEFT */}
        <div className="flex items-center gap-3 md:gap-5">
          <button
            aria-label="Toggle sidebar"
            className="p-2.5 rounded-full hover:bg-[#272727] transition-colors"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu size={20} className="text-[#f1f1f1]" strokeWidth={2} />
          </button>

          <Link
            to="/"
            className="flex items-center gap-1 rounded-md transition-opacity hover:opacity-80"
          >
            <svg
              width="32"
              viewBox="0 0 512 320"
              xmlns="http://www.w3.org/2000/svg"
              className="h-6"
            >
              <rect
                x="56"
                y="40"
                width="400"
                height="240"
                rx="60"
                fill="#FF0000"
              />
              <line
                x1="196"
                y1="110"
                x2="316"
                y2="210"
                stroke="#FFFFFF"
                strokeWidth="28"
                strokeLinecap="round"
              />
              <line
                x1="316"
                y1="110"
                x2="196"
                y2="210"
                stroke="#FFFFFF"
                strokeWidth="28"
                strokeLinecap="round"
              />
            </svg>
            <span className="text-xl font-semibold tracking-tighter text-white ml-0.5">YT-X</span>
          </Link>
        </div>

        {/* CENTER SEARCH */}
        <div className="hidden sm:flex items-center flex-1 max-w-2xl mx-6">
          <div className="flex w-full group">
            <div className="flex w-full rounded-l-full border border-[#303030] bg-[#121212] overflow-hidden focus-within:border-[#1c62b9] focus-within:ml-0 transition-colors ml-0">
               {/* Optional Search icon that appears on focus could go here, omitting for simplicity */}
              <input
                type="text"
                placeholder="Search"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onKeyDown={handleKeyDown}
                className="
                  w-full px-5 py-2.5
                  bg-transparent
                  text-[15px] text-white placeholder-gray-400
                  focus:outline-none
                "
              />
            </div>
            <button
              onClick={handleSearch}
              aria-label="Search"
              className="
                px-5 py-2.5
                border border-l-0 border-[#303030]
                rounded-r-full
                bg-[#222222]
                hover:bg-[#303030]
                transition-colors
                flex items-center justify-center
              "
            >
              <Search size={19} className="text-[#f1f1f1]" strokeWidth={2} />
            </button>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Mobile search */}
          <button
            onClick={handleSearch}
            className="sm:hidden p-2.5 rounded-full hover:bg-[#272727] transition-colors"
          >
            <Search size={20} className="text-[#f1f1f1]" strokeWidth={2} />
          </button>

          {/* Upload */}
          <Link
            to="/upload"
            className="p-2.5 rounded-full hover:bg-[#272727] transition-colors"
            aria-label="Upload video"
          >
            <Video size={20} className="text-[#f1f1f1]" strokeWidth={2} />
          </Link>

          {/* Sign in / Sign out */}
          {user ? (
            <button
              onClick={handleLogout}
              className="px-3.5 py-1.5 text-[14px] font-medium rounded-full border border-[#303030] hover:bg-[#272727] transition-colors"
            >
              Sign out
            </button>
          ) : (
            <Link
              to="/login"
              className="px-3.5 py-1.5 text-[14px] font-medium text-blue-400 border border-[#303030] rounded-full hover:bg-[#263850]/40 hover:border-transparent transition-colors flex items-center gap-2"
            >
              <User size={16} />
              Sign in
            </Link>
          )}

          {/* Avatar */}
          <Link to={`/profile/${user?._id || ""}`} className="ml-1">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="avatar"
                className="
                  w-8 h-8 rounded-full object-cover
                  hover:ring-1 hover:ring-offset-1 hover:ring-offset-[#0f0f0f] hover:ring-white transition-all
                "
              />
            ) : (
              <div
                className="
                  w-8 h-8 rounded-full
                  bg-[#272727]
                  text-white
                  flex items-center justify-center
                  hover:bg-[#303030] transition-colors
                "
              >
                <User size={16} />
              </div>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
