import { useState, useRef, useEffect } from "react";

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

  // ---------------- CLEANUP (prevent memory leaks) ----------------
  useEffect(() => {
    return () => {
      if (videoPreview) URL.revokeObjectURL(videoPreview);
      if (thumbPreview) URL.revokeObjectURL(thumbPreview);
    };
  }, [videoPreview, thumbPreview]);

  // ---------------- INPUT HANDLING ----------------
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (!files || !files[0]) return;

    const file = files[0];

    // Size limits
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

  // ---------------- DRAG & DROP ----------------
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

  // ---------------- VALIDATION ----------------
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

  // ---------------- RESET FORM ----------------
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

  // ---------------- UPLOAD ----------------
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const data = new FormData();
    Object.entries(formData).forEach(([k, v]) => {
      if (v !== null) data.append(k, v);
    });

    const xhr = new XMLHttpRequest();
    xhrRef.current = xhr;

    xhr.open("POST", import.meta.env.VITE_API_BASE_URL + "/videos/upload");

    // send cookies if using auth
    xhr.withCredentials = true;

    const startTime = Date.now();

    xhr.upload.onprogress = (e) => {
      if (!e.lengthComputable) return;

      const percent = Math.round((e.loaded * 100) / e.total);
      setUploadProgress(percent);

      const seconds = (Date.now() - startTime) / 1000;
      const speed = (e.loaded / 1024 / 1024 / seconds).toFixed(2);
      console.log(`${speed} MB/s`);
    };

    xhr.onload = () => {
      setUploading(false);

      if (xhr.status === 201) {
        alert("Upload successful!");
        resetForm();
        // todo send to vido player
      } else {
        alert("Upload failed");
      }
    };

    xhr.onerror = () => {
      setUploading(false);
      alert("Upload error");
    };

    setUploading(true);
    xhr.send(data);
  };

  const cancelUpload = () => {
    xhrRef.current?.abort();
    setUploading(false);
    setUploadProgress(0);
  };

  // ---------------- UI ----------------
  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Upload Video</h1>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* DROP ZONE */}
        <div
          onClick={() => videoInputRef.current.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className="border-2 border-dashed rounded-lg p-8 text-center bg-gray-50 cursor-pointer hover:bg-gray-100"
        >
          <p className="font-medium">Drag & Drop or Click to Upload</p>

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
          className="w-full border p-3 rounded-lg"
        />

        {/* DESCRIPTION */}
        <textarea
          name="description"
          rows="4"
          placeholder="Description"
          value={formData.description}
          onChange={handleInputChange}
          className="w-full border p-3 rounded-lg"
        />

        {/* THUMBNAIL UPLOAD */}
        <div
          onClick={() => document.getElementById("thumbInput").click()}
          className="border-2 border-dashed rounded-lg p-6 text-center bg-gray-50 cursor-pointer hover:bg-gray-100"
        >
          <p className="font-medium">Click to Upload Thumbnail</p>

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
              className="w-60 mx-auto mt-4 rounded-lg"
            />
          )}
        </div>


        {/* CATEGORY */}
        <select
          name="category"
          value={formData.category}
          onChange={handleInputChange}
          className="border p-3 rounded-lg"
        >
          <option value="general">General</option>
          <option value="gaming">Gaming</option>
          <option value="music">Music</option>
          <option value="education">Education</option>
        </select>

        {/* PUBLISH */}
        <label className="flex gap-2 items-center">
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
            <p>{uploadProgress}%</p>

            <button
              type="button"
              onClick={cancelUpload}
              className="text-red-500"
            >
              Cancel Upload
            </button>
          </div>
        )}

        {/* SUBMIT */}
        <button
          disabled={uploading}
          className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 disabled:opacity-50"
        >
          {uploading ? "Uploading..." : "Upload Video"}
        </button>

      </form>
    </div>
  );
};

export default UploadPage;
