import apiClient from "./axiosClient";

/* -------- Login User -------- */
export const loginUser = async (email, password) => {
  const response = await apiClient.post("/users/login", { email, password });
  return response.data;
};

/* -------- Logout User -------- */
export const logoutUser = async () => {
  const response = await apiClient.post("/users/logout");
  return response.data;
};

/* ---------- Register ---------- */
export const registerUser = async (formData) => {
  const response = await apiClient.post("/users/register", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

/* ---------- Current User ---------- */
export const fetchCurrentUser = async () => {
  const response = await apiClient.get("/users/current-user");
  return response.data.data;
};

/* ---------- Watch History ---------- */
export const fetchWatchHistory = async () => {
  const response = await apiClient.get("/users/history");
  return response.data.data || [];
};
