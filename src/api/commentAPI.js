import apiClient from "./axiosClient";

/* ---------- Get Comments ---------- */
export const fetchComments = async (videoId) => {
  const response = await apiClient.get(`/comments/${videoId}`);
  return response.data.data?.comments || [];
};

/* ---------- Add Comment ---------- */
export const createComment = async (videoId, content) => {
  const response = await apiClient.post(`/comments/${videoId}`, { content });
  return response.data.data;
};

/* ---------- Delete Comment ---------- */
export const removeComment = async (id) => {
  await apiClient.delete(`/comments/c/${id}`);
};
