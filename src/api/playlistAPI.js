import apiClient from "./axiosClient";

/* ---------- Get User Playlists ---------- */
export const fetchUserPlaylists = async (userId) => {
  const response = await apiClient.get(`/playlist/user/${userId}`);
  return response.data.data || [];
};

/* ---------- Playlist Details ---------- */
export const fetchPlaylistDetails = async (playlistId) => {
  const response = await apiClient.get(`/playlist/${playlistId}`);
  return response.data.data;
};

/* ---------- Create Playlist ---------- */
export const createPlaylist = async (name) => {
  const response = await apiClient.post("/playlist", { name });
  return response.data;
};

/* ---------- Delete Playlist ---------- */
export const deletePlaylist = async (playlistId) => {
  const response = await apiClient.delete(`/playlist/${playlistId}`);
  return response.data;
};
