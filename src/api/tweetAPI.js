import apiClient from "./axiosClient";

/* ===========================
   Create Tweet
=========================== */
export const createTweet = async (content) => {
  const response = await apiClient.post("/tweets", { content });
  return response.data;
};

/* ===========================
   Get Feed Tweets
=========================== */
export const fetchFeedTweets = async (page = 1, limit = 10) => {
  const response = await apiClient.get("/tweets", {
    params: { page, limit }
  });
  return response.data;
};

/* ===========================
   Get User Tweets
=========================== */
export const fetchUserTweets = async (userId, page = 1, limit = 10) => {
  const response = await apiClient.get(`/tweets/user/${userId}`, {
    params: { page, limit }
  });
  return response.data;
};

/* ===========================
   Update Tweet
=========================== */
export const updateTweet = async (tweetId, content) => {
  const response = await apiClient.patch(`/tweets/${tweetId}`, { content });
  return response.data;
};

/* ===========================
   Delete Tweet
=========================== */
export const deleteTweet = async (tweetId) => {
  const response = await apiClient.delete(`/tweets/${tweetId}`);
  return response.data;
};
