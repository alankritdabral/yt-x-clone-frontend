// Subscription API calls
import apiClient from './axiosClient'

const subscriptionAPI = {
  // TODO: Toggle subscription to channel
  toggleSubscription: (channelId) => apiClient.post(`/subscriptions/c/${channelId}`),

  // TODO: Get channel subscribers count
  getChannelSubscribers: (channelId) => apiClient.get(`/subscriptions/c/${channelId}`),

  // TODO: Get user subscriptions
  getUserSubscriptions: (userId) => apiClient.get(`/subscriptions/u/${userId}`),

  // TODO: Get subscribed channels list
  getSubscribedChannels: (params) => apiClient.get('/subscriptions', { params }),

  // TODO: Check if subscribed to channel
  isSubscribed: (channelId) => apiClient.get(`/subscriptions/c/${channelId}/status`),
}

export default subscriptionAPI
