// Comment API calls
import apiClient from './axiosClient'

const commentAPI = {
  // TODO: Get video comments
  getVideoComments: (videoId, params) => apiClient.get(`/comments/${videoId}`, { params }),

  // TODO: Add comment to video
  addComment: (videoId, data) => apiClient.post(`/comments/${videoId}`, data),

  // TODO: Update comment
  updateComment: (commentId, data) => apiClient.patch(`/comments/c/${commentId}`, data),

  // TODO: Delete comment
  deleteComment: (commentId) => apiClient.delete(`/comments/c/${commentId}`),

  // TODO: Get comment by ID
  getCommentById: (commentId) => apiClient.get(`/comments/c/${commentId}`),
}

export default commentAPI
