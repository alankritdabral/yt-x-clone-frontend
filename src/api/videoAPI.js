const API = import.meta.env.VITE_API_BASE_URL;

/* -------- Get All Videos -------- */
export const fetchVideos = async () => {
  const response = await fetch(`${API}/videos`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text);
  }

  return response.json();
};

/* -------- Get Liked Videos -------- */
export const fetchLikedVideos = async () => {
  const response = await fetch(`${API}/likes/videos`, {
    credentials: "include",
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text);
  }

  return response.json();
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

/* ---------- Upload Video ---------- */
export const uploadVideo = ({
  formData,
  onProgress,
  onSuccess,
  onError,
  xhrRef,
}) => {
  const xhr = new XMLHttpRequest();
  xhrRef.current = xhr;

  xhr.open("POST", `${API}/videos/`);
  xhr.withCredentials = true;

  const startTime = Date.now();

  xhr.upload.onprogress = (e) => {
    if (!e.lengthComputable) return;

    const percent = Math.round((e.loaded * 100) / e.total);
    onProgress(percent);

    const seconds = (Date.now() - startTime) / 1000;
    const speed = (e.loaded / 1024 / 1024 / seconds).toFixed(2);
    console.log(`${speed} MB/s`);
  };

  xhr.onload = () => {
    if (xhr.status === 201) {
      onSuccess();
    } else {
      onError();
    }
  };

  xhr.onerror = onError;

  xhr.send(formData);
};

/* ---------- Register View ---------- */
export const registerView = async (videoId) => {
  await fetch(`${API}/videos/view/${videoId}`, {
    method: "POST",
    credentials: "include",
  });
};

/* ---------- Toggle Like ---------- */
export const toggleVideoLike = async (videoId) => {
  const res = await fetch(`${API}/likes/toggle/v/${videoId}`, {
    method: "POST",
    credentials: "include",
  });

  const data = await res.json();
  return data.data;
};

/* ---------- Get Video ---------- */
export const fetchVideo = async (videoId) => {
  const res = await fetch(`${API}/videos/${videoId}`, {
    credentials: "include",
  });

  if (!res.ok) throw new Error("Video fetch failed");

  const data = await res.json();
  return data.data;
};
