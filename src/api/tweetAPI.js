// Tweet API calls
import apiClient from './axiosClient'

const tweetAPI = {
  // TODO: Get all tweets with pagination
  getAllTweets: (params) => apiClient.get('/tweets', { params }),

  // TODO: Get user tweets
  getUserTweets: (userId) => apiClient.get(`/tweets/user/${userId}`, { params }),

  // TODO: Create a tweet
  createTweet: (data) => apiClient.post('/tweets', data),

  // TODO: Update tweet
  updateTweet: (tweetId, data) => apiClient.patch(`/tweets/${tweetId}`, data),

  // TODO: Delete tweet
  deleteTweet: (tweetId) => apiClient.delete(`/tweets/${tweetId}`),

  // TODO: Get tweet by ID
  getTweetById: (tweetId) => apiClient.get(`/tweets/${tweetId}`),

  // TODO: Get timeline tweets
  getTimeline: (params) => apiClient.get('/tweets/timeline', { params }),
}

export default tweetAPI
