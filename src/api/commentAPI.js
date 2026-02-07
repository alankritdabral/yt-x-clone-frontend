const API = import.meta.env.VITE_API_BASE_URL;

/* ---------- Get Comments ---------- */
export const fetchComments = async (videoId) => {
  const res = await fetch(`${API}/comments/${videoId}`, {
    credentials: "include",
  });

  const data = await res.json();
  return data.data?.comments || [];
};

/* ---------- Add Comment ---------- */
export const createComment = async (videoId, content) => {
  const res = await fetch(`${API}/comments/${videoId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ content }),
  });

  const data = await res.json();
  return data.data;
};

/* ---------- Delete Comment ---------- */
export const removeComment = async (id) => {
  await fetch(`${API}/comments/c/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
};
