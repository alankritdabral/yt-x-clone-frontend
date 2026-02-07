const API = import.meta.env.VITE_API_BASE_URL + "/playlists";

/* ---------- Get User Playlists ---------- */
export const fetchUserPlaylists = async (userId) => {
  const res = await fetch(`${API}/user/${userId}`, {
    credentials: "include",
  });

  if (!res.ok) throw new Error("Failed to fetch playlists");

  const data = await res.json();
  return data.data || [];
};

/* ---------- Playlist Details ---------- */
export const fetchPlaylistDetails = async (playlistId) => {
  const res = await fetch(`${API}/${playlistId}`, {
    credentials: "include",
  });

  if (!res.ok) throw new Error("Failed playlist details");

  const data = await res.json();
  return data.data;
};

/* ---------- Create Playlist ---------- */
export const createPlaylist = async (name) => {
  const res = await fetch(API, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });

  if (!res.ok) throw new Error("Failed to create playlist");
};

/* ---------- Delete Playlist ---------- */
export const deletePlaylist = async (playlistId) => {
  const res = await fetch(`${API}/${playlistId}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!res.ok) throw new Error("Failed to delete playlist");
};
