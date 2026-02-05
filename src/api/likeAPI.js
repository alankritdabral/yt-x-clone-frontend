// Like API calls
import apiClient from './axiosClient'

const likeAPI = {
  // TODO: Toggle video like
  toggleVideoLike: (videoId) => apiClient.post(`/likes/toggle/v/${videoId}`),

  // TODO: Get video likes count
  getVideoLikes: (videoId) => apiClient.get(`/likes/videos/${videoId}`),

  // TODO: Toggle comment like
  toggleCommentLike: (commentId) => apiClient.post(`/likes/toggle/c/${commentId}`),

  // TODO: Toggle tweet like
  toggleTweetLike: (tweetId) => apiClient.post(`/likes/toggle/tweets/${tweetId}`),

  // TODO: Get user liked videos
  getLikedVideos: (params) => apiClient.get('/likes/videos', { params }),
}

export default likeAPI
