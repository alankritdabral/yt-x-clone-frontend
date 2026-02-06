import { useNavigate } from "react-router-dom";
import { useState } from "react";

const API = import.meta.env.VITE_API_BASE_URL;

const VideoCard = ({ video }) => {
  const navigate = useNavigate();

  const [showPlaylistPopup, setShowPlaylistPopup] =
    useState(false);
  const [playlists, setPlaylists] = useState([]);
  const [newPlaylistName, setNewPlaylistName] =
    useState("");

  /* ---------- Helpers ---------- */
  const getThumbnailUrl = () => {
    if (!video?.thumbnail)
      return "https://via.placeholder.com/320x180";

    if (video.thumbnail.startsWith("http"))
      return video.thumbnail;

    return `http://localhost:8000${video.thumbnail}`;
  };

  const getAvatarUrl = () => {
    if (!video?.owner?.avatar)
      return "https://via.placeholder.com/40";

    if (video.owner.avatar.startsWith("http"))
      return video.owner.avatar;

    return `http://localhost:8000/${video.owner.avatar}`;
  };

  const formatViews = (views = 0) => {
    if (views >= 1_000_000)
      return `${(views / 1_000_000).toFixed(1)}M`;
    if (views >= 1_000)
      return `${(views / 1_000).toFixed(1)}K`;
    return views;
  };

  const timeAgo = (date) => {
    const seconds = Math.floor(
      (Date.now() - new Date(date)) / 1000
    );

    const intervals = [
      { label: "year", seconds: 31536000 },
      { label: "month", seconds: 2592000 },
      { label: "day", seconds: 86400 },
      { label: "hour", seconds: 3600 },
      { label: "minute", seconds: 60 },
    ];

    for (const i of intervals) {
      const count = Math.floor(seconds / i.seconds);
      if (count >= 1)
        return `${count} ${i.label}${count > 1 ? "s" : ""
          } ago`;
    }
    return "just now";
  };

  const handleClick = () => {
    navigate(`/watch/${video?._id}`);
  };

  /* ---------- Playlist ---------- */
  const openPlaylistPopup = async (e) => {
    e.stopPropagation();

    try {
      const user = JSON.parse(
        localStorage.getItem("user")
      );
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

      alert("Added to playlist");
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
        body: JSON.stringify({
          name: newPlaylistName,
        }),
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

      alert("Playlist created & video added");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div
        onClick={handleClick}
        className="cursor-pointer"
      >
        {/* Thumbnail */}
        <div className="relative rounded-xl overflow-hidden bg-gray-200 group aspect-[16/10]">
          <img
            src={getThumbnailUrl()}
            alt={video?.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />

          {/* Playlist button */}
          <button
            onClick={openPlaylistPopup}
            className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100"
          >
            ➕
          </button>

          {video?.duration && (
            <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded">
              {Number(video.duration).toFixed(2)}
            </span>
          )}
        </div>

        {/* Info */}
        <div className="mt-3 flex gap-2 items-start">
          <img
            src={getAvatarUrl()}
            alt={video?.owner?.username}
            className="w-9 h-9 rounded-full object-cover shrink-0"
          />

          <div className="flex flex-col flex-1">
            <h3 className="text-sm font-medium leading-snug line-clamp-2 text-left">
              {video?.title}
            </h3>

            <p className="text-xs text-gray-600 mt-1 text-left">
              {video?.owner?.username}
            </p>

            <div className="text-xs text-gray-600 flex items-center gap-1">
              <span>
                {formatViews(video?.views)} views
              </span>
              <span>•</span>
              <span>
                {timeAgo(video?.createdAt)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Playlist Popup */}
      {showPlaylistPopup && (
        <div
          className="fixed inset-0 bg-black/40 flex justify-center items-center z-50"
          onClick={() =>
            setShowPlaylistPopup(false)
          }
        >
          <div
            className="bg-white p-5 rounded w-80"
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            <h3 className="font-semibold mb-3">
              Save to playlist
            </h3>

            {playlists.map((p) => (
              <div
                key={p._id}
                className="p-2 border mb-2 cursor-pointer hover:bg-gray-100"
                onClick={() =>
                  addToPlaylist(p._id)
                }
              >
                {p.name}
              </div>
            ))}

            {/* Create playlist */}
            <div className="mt-3 border-t pt-3">
              <input
                value={newPlaylistName}
                onChange={(e) =>
                  setNewPlaylistName(
                    e.target.value
                  )
                }
                placeholder="New playlist name"
                className="w-full border px-3 py-2 rounded mb-2"
              />

              <button
                onClick={createPlaylist}
                className="w-full bg-black text-white py-2 rounded"
              >
                Create playlist
              </button>
            </div>

            <button
              onClick={() =>
                setShowPlaylistPopup(false)
              }
              className="mt-3 w-full bg-gray-200 py-2 rounded"
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
