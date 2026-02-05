// Playlist API calls
import apiClient from './axiosClient'

const playlistAPI = {
  // TODO: Get user playlists
  getUserPlaylists: (userId) => apiClient.get(`/playlists/user/${userId}`),

  // TODO: Get playlist by ID
  getPlaylistById: (playlistId) => apiClient.get(`/playlists/${playlistId}`),

  // TODO: Create a new playlist
  createPlaylist: (data) => apiClient.post('/playlists', data),

  // TODO: Update playlist
  updatePlaylist: (playlistId, data) => apiClient.patch(`/playlists/${playlistId}`, data),

  // TODO: Delete playlist
  deletePlaylist: (playlistId) => apiClient.delete(`/playlists/${playlistId}`),

  // TODO: Add video to playlist
  addVideoToPlaylist: (playlistId, videoId) => apiClient.patch(`/playlists/add/${videoId}/${playlistId}`),

  // TODO: Remove video from playlist
  removeVideoFromPlaylist: (playlistId, videoId) => apiClient.patch(`/playlists/remove/${videoId}/${playlistId}`),

  // TODO: Get all playlists
  getAllPlaylists: (params) => apiClient.get('/playlists', { params }),
}

export default playlistAPI
