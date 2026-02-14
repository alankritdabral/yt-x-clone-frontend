const API = import.meta.env.VITE_API_BASE_URL;

/* -------- Login User -------- */
export const loginUser = async (email, password) => {
  const response = await fetch(`${API}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || "Login failed");
  }

  return response.json();
};

/* -------- Logout User -------- */
export const logoutUser = async () => {
  const response = await fetch(`${API}/users/logout`, {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || "Logout failed");
  }

  return response.json();
};

/* ---------- Register ---------- */
export const registerUser = async (formData) => {
  const response = await fetch(`${API}/users/register`, {
    method: "POST",
    body: formData,
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Registration failed");
  }

  return result;
};

/* ---------- Current User ---------- */
export const fetchCurrentUser = async () => {
  const res = await fetch(`${API}/users/current-user`, {
    credentials: "include",
  });

  if (!res.ok) throw new Error("Failed to fetch user");

  const data = await res.json();
  return data.data;
};

/* ---------- Watch History ---------- */
export const fetchWatchHistory = async () => {
  const res = await fetch(`${API}/users/history`, {
    credentials: "include",
  });

  if (!res.ok) throw new Error("Failed history");

  const data = await res.json();
  return data.data || [];
};

/* ---------- Videos by Owner ---------- */
export const fetchVideosByOwner = async (ownerId) => {
  const res = await fetch(`${API}/videos`, {
    credentials: "include",
  });

  if (!res.ok) throw new Error("Failed videos");

  const result = await res.json();
  const allVideos = result.data.videos || [];

  return allVideos.filter((v) => v.owner?._id === ownerId);
};
