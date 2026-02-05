// src/components/Navbar.jsx
import { Menu, Search, Bell, Video, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

const API_BASE = "http://localhost:8000";

const Navbar = ({ sidebarOpen, setSidebarOpen, user }) => {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");

  /* ======================
     Search Handler
  ====================== */
  const handleSearch = () => {
    if (!searchText.trim()) return;
    navigate(`/search?q=${searchText}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  /* ======================
     Avatar URL
  ====================== */
  const avatarUrl = (() => {
    if (!user?.avatar) return null;

    if (user.avatar.startsWith("http")) {
      return user.avatar;
    }

    return `${API_BASE}${user.avatar.startsWith("/") ? "" : "/"
      }${user.avatar}`;
  })();


  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-14 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between h-full px-4">

        {/* LEFT */}
        <div className="flex items-center gap-4">
          <button
            className="p-2 rounded-full hover:bg-gray-100"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu size={22} />
          </button>

          <Link to="/" className="p-2 rounded-full hover:bg-gray-100">
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
        <div className="flex items-center flex-1 max-w-xl mx-6">
          <div className="flex w-full">
            <input
              type="text"
              placeholder="Search"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full px-4 py-2 border border-gray-300 rounded-l-full focus:outline-none focus:border-blue-500"
            />

            <button
              onClick={handleSearch}
              className="px-6 border border-l-0 border-gray-300 rounded-r-full bg-gray-100 hover:bg-gray-200"
            >
              <Search size={20} />
            </button>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3">

          <Link
            to="/upload"
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <Video size={22} />
          </Link>

          <button className="p-2 rounded-full hover:bg-gray-100">
            <Bell size={22} />
          </button>

          {/* Avatar */}
          <Link to={`/profile/${user?._id}`}>
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="avatar"
                className="w-8 h-8 rounded-full object-cover border"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center">
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
