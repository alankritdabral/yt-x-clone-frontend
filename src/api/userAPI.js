// User API calls
import apiClient from './axiosClient'

const userAPI = {
  // TODO: Register a new user
  register: (data) => apiClient.post('/users/register', data),

  // TODO: Login user
  login: (data) => apiClient.post('/users/login', data),

  // TODO: Logout user
  logout: () => apiClient.post('/users/logout'),

  // TODO: Get current user profile
  getCurrentUser: () => apiClient.get('/users/current-user'),

  // TODO: Get user by ID
  getUserById: (userId) => apiClient.get(`/users/c/${userId}`),

  // TODO: Update user profile
  updateProfile: (data) => apiClient.patch('/users/account', data),

  // TODO: Update user avatar
  updateAvatar: (formData) => apiClient.patch('/users/avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),

  // TODO: Update user cover image
  updateCoverImage: (formData) => apiClient.patch('/users/cover-image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),

  // TODO: Change user password
  changePassword: (data) => apiClient.post('/users/change-password', data),

  // TODO: Refresh access token
  refreshToken: () => apiClient.post('/users/refresh-token'),

  // TODO: Get user watch history
  getWatchHistory: () => apiClient.get('/users/watch-history'),

  // TODO: Clear watch history
  clearWatchHistory: () => apiClient.post('/users/watch-history/clear'),
}

export default userAPI
