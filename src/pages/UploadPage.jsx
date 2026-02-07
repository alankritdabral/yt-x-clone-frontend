import { useState, useRef, useEffect } from "react";
import { uploadVideo } from "../api/videoAPI";

const UploadPage = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    videoFile: null,
    thumbnail: null,
    category: "general",
    isPublished: true,
  });

  const [videoPreview, setVideoPreview] = useState(null);
  const [thumbPreview, setThumbPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const xhrRef = useRef(null);
  const videoInputRef = useRef(null);

  /* ---------------- CLEANUP ---------------- */
  useEffect(() => {
    return () => {
      if (videoPreview) URL.revokeObjectURL(videoPreview);
      if (thumbPreview) URL.revokeObjectURL(thumbPreview);
    };
  }, [videoPreview, thumbPreview]);

  /* ---------------- INPUT HANDLING ---------------- */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (!files || !files[0]) return;

    const file = files[0];

    if (name === "videoFile" && file.size > 500 * 1024 * 1024) {
      alert("Max video size 500MB");
      return;
    }

    if (name === "thumbnail" && file.size > 5 * 1024 * 1024) {
      alert("Max thumbnail size 5MB");
      return;
    }

    setFormData((p) => ({ ...p, [name]: file }));

    if (name === "videoFile") {
      setVideoPreview(URL.createObjectURL(file));
    }

    if (name === "thumbnail") {
      setThumbPreview(URL.createObjectURL(file));
    }
  };

  /* ---------------- DRAG & DROP ---------------- */
  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;

    if (!file.type.startsWith("video/")) {
      alert("Only video files allowed");
      return;
    }

    if (file.size > 500 * 1024 * 1024) {
      alert("Max video size 500MB");
      return;
    }

    setFormData((p) => ({ ...p, videoFile: file }));
    setVideoPreview(URL.createObjectURL(file));
  };

  /* ---------------- VALIDATION ---------------- */
  const validate = () => {
    if (!formData.title.trim()) {
      alert("Title required");
      return false;
    }

    if (formData.title.length < 3) {
      alert("Title must be at least 3 characters");
      return false;
    }

    if (!formData.videoFile) {
      alert("Video required");
      return false;
    }

    return true;
  };

  /* ---------------- CANCEL UPLOAD ---------------- */
  const cancelUpload = () => {
    if (xhrRef.current) {
      xhrRef.current.abort();
    }
    setUploading(false);
    setUploadProgress(0);
  };

  /* ---------------- RESET ---------------- */
  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      videoFile: null,
      thumbnail: null,
      category: "general",
      isPublished: true,
    });

    setVideoPreview(null);
    setThumbPreview(null);
    setUploadProgress(0);
  };

  /* ---------------- UPLOAD ---------------- */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const data = new FormData();
    Object.entries(formData).forEach(([k, v]) => {
      if (v !== null) data.append(k, v);
    });

    setUploading(true);

    uploadVideo({
      formData: data,
      xhrRef,
      onProgress: setUploadProgress,
      onSuccess: () => {
        setUploading(false);
        alert("Upload successful!");
        resetForm();
      },
      onError: () => {
        setUploading(false);
        alert("Upload failed");
      },
    });
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="max-w-5xl w-full p-6 text-white">
      <h1 className="text-3xl font-bold mb-6">
        Upload Video
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* DROP ZONE */}
        <div
          onClick={() => videoInputRef.current.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className="
            border-2 border-dashed border-[#2a2a2a]
            rounded-lg p-8 text-center
            bg-[#202020]
            cursor-pointer
            hover:bg-[#242424]
            transition
          "
        >
          <p className="font-medium text-gray-300">
            Drag & Drop or Click to Upload Video
          </p>

          <input
            ref={videoInputRef}
            type="file"
            accept="video/*"
            name="videoFile"
            onChange={handleFileChange}
            hidden
          />
        </div>

        {/* VIDEO PREVIEW */}
        {videoPreview && (
          <video
            src={videoPreview}
            controls
            className="w-full max-h-96 rounded-lg"
          />
        )}

        {/* TITLE */}
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleInputChange}
          className="
            w-full bg-[#202020]
            border border-[#2a2a2a]
            p-3 rounded-lg
            placeholder-gray-500
            focus:outline-none focus:border-red-600
          "
        />

        {/* DESCRIPTION */}
        <textarea
          name="description"
          rows="4"
          placeholder="Description"
          value={formData.description}
          onChange={handleInputChange}
          className="
            w-full bg-[#202020]
            border border-[#2a2a2a]
            p-3 rounded-lg
            placeholder-gray-500
            focus:outline-none focus:border-red-600
          "
        />

        {/* THUMBNAIL */}
        <div
          onClick={() => document.getElementById("thumbInput").click()}
          className="
            border-2 border-dashed border-[#2a2a2a]
            rounded-lg p-6 text-center
            bg-[#202020]
            cursor-pointer
            hover:bg-[#242424]
            transition
          "
        >
          <p className="font-medium text-gray-300">
            Click to Upload Thumbnail
          </p>

          <input
            id="thumbInput"
            type="file"
            accept="image/*"
            name="thumbnail"
            onChange={handleFileChange}
            hidden
          />

          {thumbPreview && (
            <img
              src={thumbPreview}
              alt="Thumbnail preview"
              className="w-60 w-full mt-4 rounded-lg"
            />
          )}
        </div>

        {/* CATEGORY */}
        <select
          name="category"
          value={formData.category}
          onChange={handleInputChange}
          className="
            bg-[#202020]
            border border-[#2a2a2a]
            p-3 rounded-lg
            focus:outline-none focus:border-red-600
          "
        >
          <option value="general">General</option>
          <option value="gaming">Gaming</option>
          <option value="music">Music</option>
          <option value="education">Education</option>
        </select>

        {/* PUBLISH */}
        <label className="flex gap-2 items-center text-gray-400">
          <input
            type="checkbox"
            checked={formData.isPublished}
            onChange={(e) =>
              setFormData((p) => ({
                ...p,
                isPublished: e.target.checked,
              }))
            }
          />
          Publish now
        </label>

        {/* PROGRESS */}
        {uploading && (
          <div>
            <progress value={uploadProgress} max="100" className="w-full" />
            <p className="mt-1">{uploadProgress}%</p>

            <button
              type="button"
              onClick={cancelUpload}
              className="text-red-500 mt-2"
            >
              Cancel Upload
            </button>
          </div>
        )}

        {/* SUBMIT */}
        <button
          disabled={uploading}
          className="
            bg-red-600 hover:bg-red-700
            text-white px-6 py-3 rounded-lg
            disabled:opacity-50 transition
          "
        >
          {uploading ? "Uploading..." : "Upload Video"}
        </button>
      </form>
    </div>
  );
};

export default UploadPage;
