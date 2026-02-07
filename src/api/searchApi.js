const API = import.meta.env.VITE_API_BASE_URL + "/search";

export const searchContent = async (query, type = "video") => {
  const response = await fetch(
    `${API}?q=${encodeURIComponent(query)}&type=${type}`
  );

  if (!response.ok) {
    throw new Error("Search failed");
  }

  const data = await response.json();
  return data?.data || [];
};
