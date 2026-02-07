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
    <div className="min-h-screen bg-white text-black">
      <div className="flex justify-between items-center px-6 py-4 border-b">
        <h1 className="text-2xl font-semibold">Playlists</h1>

        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          Create Playlist
        </button>
      </div>

      {showCreateForm && (
        <div className="p-4 border-b flex gap-2">
          <input
            type="text"
            placeholder="Playlist name"
            value={newPlaylistName}
            onChange={(e) => setNewPlaylistName(e.target.value)}
            className="border px-3 py-2 rounded w-64"
          />

          <button
            onClick={handleCreatePlaylist}
            className="bg-green-600 text-white px-4 rounded"
          >
            Create
          </button>

          <button
            onClick={() => setShowCreateForm(false)}
            className="bg-gray-300 px-4 rounded"
          >
            Cancel
          </button>
        </div>
      )}

      <div className="flex">
        <div className="w-72 border-r h-[calc(100vh-120px)] overflow-y-auto p-4">
          {loading && <p>Loading...</p>}

          {playlists.map((playlist) => (
            <div
              key={playlist._id}
              onClick={() => loadPlaylistDetails(playlist._id)}
              className={`p-3 mb-2 rounded cursor-pointer hover:bg-gray-100 ${selectedPlaylist?._id === playlist._id
                  ? "bg-gray-200"
                  : ""
                }`}
            >
              <h3 className="font-medium">{playlist.name}</h3>

              <p className="text-sm text-gray-500">
                {playlist.videos?.length || 0} videos
              </p>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeletePlaylist(playlist._id);
                }}
                className="text-red-600 text-sm mt-1"
              >
                Delete
              </button>
            </div>
          ))}
        </div>

        <div className="flex-1 p-6">
          {selectedPlaylist ? (
            <>
              <h2 className="text-xl font-semibold mb-6">
                {selectedPlaylist.name}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {selectedPlaylist.videos?.length > 0 ? (
                  selectedPlaylist.videos.map((video) => (
                    <VideoCard key={video._id} video={video} />
                  ))
                ) : (
                  <p>No videos in this playlist</p>
                )}
              </div>
            </>
          ) : (
            <p>Select a playlist</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlaylistPage;
