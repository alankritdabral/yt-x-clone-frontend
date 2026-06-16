import apiClient from "./axiosClient";

export const toggleSubscription = async (channelId) => {
  const response = await apiClient.post(`/subscriptions/toggle/${channelId}`);
  return response.data;
};
