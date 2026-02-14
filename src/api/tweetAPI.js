// src/api/tweetAPI.js

const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

/* ===========================
   Helper: Auth Headers
=========================== */
const getAuthHeaders = () => {
  const token = localStorage.getItem("accessToken");

  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
};

/* ===========================
   Helper: Handle Response
=========================== */
const handleResponse = async (res) => {
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || "Something went wrong");
  }

  return data;
};

/* ===========================
   Create Tweet
=========================== */
export const createTweet = async (content) => {
  const res = await fetch(`${API_BASE}/tweets`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ content }),
  });

  return handleResponse(res);
};

/* ===========================
   Get Feed Tweets
=========================== */
export const fetchFeedTweets = async (page = 1, limit = 10) => {
  const res = await fetch(`${API_BASE}/tweets?page=${page}&limit=${limit}`, {
    headers: getAuthHeaders(),
  });

  return handleResponse(res);
};

/* ===========================
   Get User Tweets
=========================== */
export const fetchUserTweets = async (userId, page = 1, limit = 10) => {
  const res = await fetch(
    `${API_BASE}/tweets/user/${userId}?page=${page}&limit=${limit}`,
    {
      headers: getAuthHeaders(),
    }
  );

  return handleResponse(res);
};

/* ===========================
   Update Tweet
=========================== */
export const updateTweet = async (tweetId, content) => {
  const res = await fetch(`${API_BASE}/tweets/${tweetId}`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify({ content }),
  });

  return handleResponse(res);
};

/* ===========================
   Delete Tweet
=========================== */
export const deleteTweet = async (tweetId) => {
  const res = await fetch(`${API_BASE}/tweets/${tweetId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  return handleResponse(res);
};
