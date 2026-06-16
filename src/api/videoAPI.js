import apiClient from "./axiosClient";

/* -------- Get All Videos -------- */
export const fetchVideos = async () => {
  const response = await apiClient.get("/videos");
  return response.data;
};

/* -------- Get Liked Videos -------- */
export const fetchLikedVideos = async () => {
  const response = await apiClient.get("/likes/videos");
  return response.data;
};

/* ---------- Videos by Owner ---------- */
export const fetchVideosByOwner = async (ownerId) => {
  const response = await apiClient.get("/videos");
  const allVideos = response.data.data.videos || [];
  return allVideos.filter((v) => v.owner?._id === ownerId);
};

/* ---------- Upload Video ---------- */
export const uploadVideo = ({
  formData,
  onProgress,
  onSuccess,
  onError,
  abortController,
}) => {
  // Using axios for upload to benefit from progress events and interceptors
  return apiClient.post("/videos/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    signal: abortController?.signal,
    onUploadProgress: (progressEvent) => {
      if (onProgress) {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(percent);
      }
    }
  })
  .then(onSuccess)
  .catch((error) => {
    if (error.name === 'CanceledError') {
      console.log('Upload cancelled');
    } else {
      onError(error);
    }
  });
};

/* ---------- Register View ---------- */
export const registerView = async (videoId) => {
  return apiClient.post(`/videos/view/${videoId}`);
};

/* ---------- Toggle Like ---------- */
export const toggleVideoLike = async (videoId) => {
  const response = await apiClient.post(`/likes/toggle/v/${videoId}`);
  return response.data.data;
};

/* ---------- Get Video ---------- */
export const fetchVideo = async (videoId) => {
  const response = await apiClient.get(`/videos/${videoId}`);
  return response.data.data;
};
