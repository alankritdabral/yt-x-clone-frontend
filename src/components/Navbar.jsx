// src/components/Navbar.jsx
import { Menu, Search, Video, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { logoutUser } from "../api/userAPI";

/* Use VITE env for production builds */
const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

const Navbar = ({
  sidebarOpen,
  setSidebarOpen,
  user,
  setUser,
  setIsLoggedIn,
}) => {
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
  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setIsLoggedIn(false);

    logoutUser()
      .then(() => {
        navigate("/login");
      })
      .catch((error) => {
        console.error("Logout error:", error);
      });
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
        bg-[#0f0f0f]/95 backdrop-blur
        border-b border-[#2a2a2a]
      "
    >
      <div className="flex items-center justify-between h-full px-3 md:px-4">
        {/* LEFT */}
        <div className="flex items-center gap-2 md:gap-4">
          <button
            aria-label="Toggle sidebar"
            className="p-2 rounded-full hover:bg-[#242424] transition"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu size={22} className="text-gray-300" />
          </button>

          <Link
            to="/"
            className="p-1 rounded-md hover:bg-[#242424] transition"
          >
            <svg
              width="40"
              viewBox="0 0 512 320"
              xmlns="http://www.w3.org/2000/svg"
              className="h-8"
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
          </Link>
        </div>

        {/* CENTER SEARCH */}
        <div className="hidden sm:flex items-center flex-1 max-w-xl mx-4">
          <div className="flex w-full">
            <input
              type="text"
              placeholder="Search videos"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={handleKeyDown}
              className="
                w-full px-4 py-2
                bg-[#202020]
                border border-[#2a2a2a]
                rounded-l-full
                text-white placeholder-gray-500
                focus:outline-none focus:border-red-600
              "
            />

            <button
              onClick={handleSearch}
              aria-label="Search"
              className="
                px-5
                border border-l-0 border-[#2a2a2a]
                rounded-r-full
                bg-[#242424]
                hover:bg-[#2f2f2f]
                transition
              "
            >
              <Search size={20} className="text-gray-300" />
            </button>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-1 md:gap-3">
          {/* Mobile search */}
          <button
            onClick={handleSearch}
            className="sm:hidden p-2 rounded-full hover:bg-[#242424]"
          >
            <Search size={20} className="text-gray-300" />
          </button>

          {/* Upload */}
          <Link
            to="/upload"
            className="p-2 rounded-full hover:bg-[#242424] transition"
            aria-label="Upload video"
          >
            <Video size={22} className="text-gray-300" />
          </Link>

          {/* Sign in / Sign out */}
          {user ? (
            <button
              onClick={handleLogout}
              className="px-3 py-1 text-sm rounded-md bg-[#242424] hover:bg-[#2f2f2f] transition"
            >
              Sign out
            </button>
          ) : (
            <Link
              to="/login"
              className="px-3 py-1 text-sm rounded-md bg-[#242424] hover:bg-[#2f2f2f] transition"
            >
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
                  border border-[#2a2a2a]
                  hover:border-red-600 transition
                "
              />
            ) : (
              <div
                className="
                  w-8 h-8 rounded-full
                  bg-[#202020]
                  border border-[#2a2a2a]
                  text-gray-300
                  flex items-center justify-center
                "
              >
                <User size={18} />
              </div>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
