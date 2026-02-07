import { useState, useEffect } from "react";
import VideoCard from "../components/VideoCard";
import {
  fetchUserPlaylists,
  fetchPlaylistDetails,
  createPlaylist,
  deletePlaylist,
} from "../api/playlistAPI";

const PlaylistPage = () => {
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");

  /* ---------- Load Playlists ---------- */
  const loadPlaylists = async () => {
    try {
      setLoading(true);

      const user = JSON.parse(localStorage.getItem("user"));
      if (!user?._id) return;

      const list = await fetchUserPlaylists(user._id);
      setPlaylists(list);

      if (list.length > 0) {
        loadPlaylistDetails(list[0]._id);
      } else {
        setSelectedPlaylist(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlaylists();
  }, []);

  /* ---------- Playlist Details ---------- */
  const loadPlaylistDetails = async (playlistId) => {
    try {
      const data = await fetchPlaylistDetails(playlistId);
      setSelectedPlaylist(data);
    } catch (err) {
      console.error(err);
    }
  };

  /* ---------- Create Playlist ---------- */
  const handleCreatePlaylist = async () => {
    if (!newPlaylistName.trim()) return;

    try {
      await createPlaylist(newPlaylistName);
      setNewPlaylistName("");
      setShowCreateForm(false);
      loadPlaylists();
    } catch (err) {
      console.error(err);
    }
  };

  /* ---------- Delete Playlist ---------- */
  const handleDeletePlaylist = async (playlistId) => {
    try {
      await deletePlaylist(playlistId);
      loadPlaylists();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#181818] text-white">
      {/* ---------- Header ---------- */}
      <div className="flex justify-between items-center px-6 py-4 border-b border-[#2a2a2a]">
        <h1 className="text-2xl font-semibold">Playlists</h1>

        <button
          onClick={() => setShowCreateForm(true)}
          className="
            bg-red-600 hover:bg-red-700
            px-4 py-2 rounded-lg
            text-white font-medium
            transition
          "
        >
          Create Playlist
        </button>
      </div>

      {/* ---------- Create Playlist Form ---------- */}
      {showCreateForm && (
        <div className="p-4 border-b border-[#2a2a2a] flex flex-wrap gap-2">
          <input
            type="text"
            placeholder="Playlist name"
            value={newPlaylistName}
            onChange={(e) => setNewPlaylistName(e.target.value)}
            className="
              bg-[#202020] border border-[#2a2a2a]
              px-3 py-2 rounded
              text-white placeholder-gray-500
              focus:outline-none focus:border-red-600
              w-64 max-w-full
            "
          />

          <button
            onClick={handleCreatePlaylist}
            className="bg-red-600 px-4 rounded hover:bg-red-700"
          >
            Create
          </button>

          <button
            onClick={() => setShowCreateForm(false)}
            className="bg-[#242424] px-4 rounded hover:bg-[#2f2f2f]"
          >
            Cancel
          </button>
        </div>
      )}

      {/* ---------- Layout ---------- */}
      <div className="flex flex-col md:flex-row">
        {/* ---------- Playlist Sidebar ---------- */}
        <div className="md:w-72 border-r border-[#2a2a2a] h-[calc(100vh-120px)] overflow-y-auto p-4">
          {loading && <p className="text-gray-400">Loading playlists...</p>}

          {playlists.map((playlist) => (
            <div
              key={playlist._id}
              onClick={() => loadPlaylistDetails(playlist._id)}
              className={`
                p-3 mb-2 rounded cursor-pointer
                transition
                ${selectedPlaylist?._id === playlist._id
                  ? "bg-[#242424]"
                  : "hover:bg-[#242424]"
                }
              `}
            >
              <h3 className="font-medium">{playlist.name}</h3>

              <p className="text-sm text-gray-400">
                {playlist.videos?.length || 0} videos
              </p>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeletePlaylist(playlist._id);
                }}
                className="text-red-500 text-sm mt-1 hover:underline"
              >
                Delete
              </button>
            </div>
          ))}
        </div>

        {/* ---------- Playlist Videos ---------- */}
        <div className="flex-1 p-6">
          {selectedPlaylist ? (
            <>
              <h2 className="text-xl font-semibold mb-6">
                {selectedPlaylist.name}
              </h2>

              {selectedPlaylist.videos?.length > 0 ? (
                <div
                  className="
                    grid gap-6
                    grid-cols-1
                    sm:grid-cols-2
                    md:grid-cols-3
                    lg:grid-cols-4
                    xl:grid-cols-5
                  "
                >
                  {selectedPlaylist.videos.map((video) => (
                    <VideoCard key={video._id} video={video} />
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">
                  No videos in this playlist yet.
                </p>
              )}
            </>
          ) : (
            <p className="text-gray-400">
              Select a playlist to view videos.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlaylistPage;
