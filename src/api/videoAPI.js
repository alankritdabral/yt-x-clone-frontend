// Video API calls
import apiClient from './axiosClient'

const videoAPI = {
  // TODO: Get all videos with pagination and filters
  getAllVideos: (params) => apiClient.get('/videos', { params }),

  // TODO: Get video by ID
  getVideoById: (videoId) => apiClient.get(`/videos/${videoId}`),

  // TODO: Publish a video
  publishVideo: (formData) => apiClient.post('/videos', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),

  // TODO: Update video details
  updateVideo: (videoId, data) => apiClient.patch(`/videos/${videoId}`, data),

  // TODO: Update video thumbnail
  updateThumbnail: (videoId, formData) => apiClient.patch(`/videos/${videoId}/thumbnail`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),

  // TODO: Delete video
  deleteVideo: (videoId) => apiClient.delete(`/videos/${videoId}`),

  // TODO: Toggle publish status
  togglePublishStatus: (videoId) => apiClient.patch(`/videos/toggle/publish/${videoId}`),

  // TODO: Get videos by user
  getUserVideos: (userId) => apiClient.get(`/videos/user/${userId}`),

  // TODO: Increment video views
  incrementViews: (videoId) => apiClient.post(`/videos/${videoId}/views`),

  // TODO: Search videos
  searchVideos: (query, params) => apiClient.get('/videos/search', {
    params: { q: query, ...params },
  }),

  // TODO: Get trending videos
  getTrendingVideos: (params) => apiClient.get('/videos/trending', { params }),

  // TODO: Get category videos
  getCategoryVideos: (category, params) => apiClient.get(`/videos/category/${category}`, { params }),
}

export default videoAPI
