import apiClient from "./axiosClient";

export const searchContent = async (query, type = "video") => {
  const response = await apiClient.get("/search", {
    params: { q: query, type }
  });
  return response.data?.data || [];
};
