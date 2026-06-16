import { useNavigate } from "react-router-dom";
import { useState } from "react";

const API = import.meta.env.VITE_API_BASE_URL || "";

const timeAgo = (date) => {
  const seconds = Math.floor((Date.now() - new Date(date)) / 1000);

  const intervals = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
  ];

  for (const i of intervals) {
    const count = Math.floor(seconds / i.seconds);
    if (count >= 1) return `${count} ${i.label}${count > 1 ? "s" : ""} ago`;
  }
  return "just now";
};

const getThumbnailUrl = (video) => {
  if (!video?.thumbnail) return "https://via.placeholder.com/320x180";
  if (video.thumbnail.startsWith("http")) return video.thumbnail;
  return `${API}${video.thumbnail}`;
};

const getAvatarUrl = (video) => {
  if (!video?.owner?.avatar) return "https://via.placeholder.com/40";
  if (video.owner.avatar.startsWith("http")) return video.owner.avatar;
  return `${API}/${video.owner.avatar}`;
};

const formatViews = (views = 0) => {
  if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}M`;
  if (views >= 1_000) return `${(views / 1_000).toFixed(1)}K`;
  return views;
};

const VideoCard = ({ video }) => {
  const navigate = useNavigate();

  const [showPlaylistPopup, setShowPlaylistPopup] = useState(false);
  const [playlists, setPlaylists] = useState([]);
  const [newPlaylistName, setNewPlaylistName] = useState("");

  const handleClick = () => {
    navigate(`/watch/${video?._id}`);
  };

  /* ---------- Playlist ---------- */
  const openPlaylistPopup = async (e) => {
    e.stopPropagation();

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user?._id) return;

      const res = await fetch(
        `${API}/playlist/user/${user._id}`,
        { credentials: "include" }
      );

      const data = await res.json();
      setPlaylists(data.data || []);
      setShowPlaylistPopup(true);
    } catch (err) {
      console.error(err);
    }
  };

  const addToPlaylist = async (playlistId) => {
    try {
      await fetch(
        `${API}/playlist/${playlistId}/videos/${video._id}`,
        {
          method: "PATCH",
          credentials: "include",
        }
      );

      setShowPlaylistPopup(false);
    } catch (err) {
      console.error(err);
    }
  };

  const createPlaylist = async () => {
    if (!newPlaylistName.trim()) return;

    try {
      const res = await fetch(`${API}/playlist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name: newPlaylistName }),
      });

      const data = await res.json();
      const playlist = data.data;

      await fetch(
        `${API}/playlist/${playlist._id}/videos/${video._id}`,
        {
          method: "PATCH",
          credentials: "include",
        }
      );

      setPlaylists((prev) => [...prev, playlist]);
      setNewPlaylistName("");
      setShowPlaylistPopup(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div
        onClick={handleClick}
        className="cursor-pointer group flex flex-col gap-3"
      >
        {/* Thumbnail */}
        <div className="relative rounded-2xl overflow-hidden bg-[#202020] aspect-video">
          <img
            src={getThumbnailUrl(video)}
            alt={video?.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />

          {/* Playlist button */}
          <button
            onClick={openPlaylistPopup}
            className="
              absolute top-2 right-2
              bg-black/70 hover:bg-black/90
              text-white px-2.5 py-1.5 rounded-lg
              opacity-0 group-hover:opacity-100
              backdrop-blur-sm
              transition-all duration-200
            "
            title="Add to Playlist"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-list-plus"><path d="M11 12H3"/><path d="M16 6H3"/><path d="M16 18H3"/><path d="M18 9v6"/><path d="M21 12h-6"/></svg>
          </button>

          {video?.duration && (
            <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs font-medium px-1.5 py-0.5 rounded-md backdrop-blur-sm">
              {Number(video.duration).toFixed(2)}
            </span>
          )}
        </div>

        {/* Info */}
        <div className="flex gap-3 items-start">
          <img
            src={getAvatarUrl(video)}
            alt={video?.owner?.username}
            className="w-9 h-9 rounded-full object-cover shrink-0 mt-0.5 border border-transparent hover:border-gray-600 transition-colors"
          />

          <div className="flex flex-col flex-1">
            <h3 className="text-[15px] font-semibold leading-tight line-clamp-2 text-[#f1f1f1] group-hover:text-white transition-colors">
              {video?.title}
            </h3>

            <div className="mt-1 text-sm text-[#aaaaaa]">
              <p className="hover:text-white transition-colors cursor-pointer w-max">
                {video?.owner?.username}
              </p>

              <div className="flex items-center gap-1.5 text-[13px] mt-0.5">
                <span>{formatViews(video?.views)} views</span>
                <span className="text-[10px]">•</span>
                <span>{timeAgo(video?.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ---------- Playlist Popup ---------- */}
      {showPlaylistPopup && (
        <div
          className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
          onClick={() => setShowPlaylistPopup(false)}
        >
          <div
            className="
              bg-[#181818]
              border border-[#2a2a2a]
              p-5 rounded-lg w-80 text-white
            "
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-semibold mb-3">
              Save to playlist
            </h3>

            <div className="max-h-48 overflow-y-auto">
              {playlists.map((p) => (
                <div
                  key={p._id}
                  className="p-2 mb-2 rounded cursor-pointer hover:bg-[#242424]"
                  onClick={() => addToPlaylist(p._id)}
                >
                  {p.name}
                </div>
              ))}
            </div>

            {/* Create playlist */}
            <div className="mt-3 border-t border-[#2a2a2a] pt-3">
              <input
                value={newPlaylistName}
                onChange={(e) =>
                  setNewPlaylistName(e.target.value)
                }
                placeholder="New playlist name"
                className="
                  w-full bg-[#202020]
                  border border-[#2a2a2a]
                  px-3 py-2 rounded mb-2
                  placeholder-gray-500
                  focus:outline-none focus:border-red-600
                "
              />

              <button
                onClick={createPlaylist}
                className="w-full bg-red-600 hover:bg-red-700 py-2 rounded"
              >
                Create playlist
              </button>
            </div>

            <button
              onClick={() => setShowPlaylistPopup(false)}
              className="mt-3 w-full bg-[#242424] py-2 rounded hover:bg-[#2f2f2f]"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default VideoCard;
