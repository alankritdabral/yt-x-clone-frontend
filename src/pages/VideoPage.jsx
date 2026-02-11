import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  fetchVideo,
  registerView,
  toggleVideoLike,
} from "../api/videoAPI";

import {
  fetchComments,
  createComment,
  removeComment,
} from "../api/commentAPI";

const API = import.meta.env.VITE_API_BASE_URL || "";

const VideoPage = () => {
  const { videoId } = useParams();

  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);

  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  const [subscribed, setSubscribed] = useState(false);
  const [subscribersCount, setSubscribersCount] = useState(0);

  const [showFullDesc, setShowFullDesc] = useState(false);

  const [showPlaylistPopup, setShowPlaylistPopup] = useState(false);
  const [playlists, setPlaylists] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);


  /* ---------------- Fetch Data ---------------- */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) setIsLoggedIn(false);

        const videoInfo = await fetchVideo(videoId);

        setVideo(videoInfo);
        setLikesCount(videoInfo?.likesCount || 0);
        setLiked(videoInfo?.isLiked || false);
        setSubscribed(videoInfo?.isSubscribed || false);

        if (videoInfo?.owner?._id) {
          const subRes = await fetch(
            `${API}/subscriptions/c/${videoInfo.owner._id}`,
            { credentials: "include" }
          );

          const subData = await subRes.json();
          setSubscribersCount(subData.data?.length || 0);
        }

        setComments(await fetchComments(videoId));
        if (isLoggedIn) {
          await fetch(`${API}/users/history/${videoId}`, {
            method: "POST",
            credentials: "include",
          });
          
          registerView(videoId);
        }

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [videoId]);

  /* ---------------- Playlist ---------------- */
  const openPlaylistPopup = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user?._id) return;

      const res = await fetch(
        `${API}/playlist/user/${user._id}`,
        { credentials: "include" }
      );

      const data = await res.json();
      setPlaylists(data.data || []);
      setShowPlaylistPopup(true);
    } catch (err) {
      console.error(err);
    }
  };

  const addToPlaylist = async (playlistId) => {
    await fetch(
      `${API}/playlist/${playlistId}/videos/${videoId}`,
      { method: "PATCH", credentials: "include" }
    );

    setShowPlaylistPopup(false);
  };

  /* ---------------- Like ---------------- */
  const toggleLike = async () => {
    const prev = liked;

    setLiked(!prev);
    setLikesCount((c) => (prev ? Math.max(c - 1, 0) : c + 1));

    try {
      const data = await toggleVideoLike(videoId);
      setLiked(data.liked);
      setLikesCount(data.likesCount);
    } catch {
      setLiked(prev);
    }
  };

  /* ---------------- Subscribe ---------------- */
  const toggleSubscribe = async () => {
    if (!video?.owner?._id) return;

    const prev = subscribed;

    setSubscribed(!prev);
    setSubscribersCount((c) =>
      prev ? Math.max(c - 1, 0) : c + 1
    );

    try {
      await fetch(
        `${API}/subscriptions/c/${video.owner._id}`,
        { method: "POST", credentials: "include" }
      );
    } catch {
      setSubscribed(prev);
    }
  };

  /* ---------------- Comments ---------------- */
  const addComment = async () => {
    if (!newComment.trim()) return;

    const comment = await createComment(videoId, newComment);
    setComments((prev) => [comment, ...prev]);
    setNewComment("");
  };

  const deleteComment = async (id) => {
    await removeComment(id);
    setComments((prev) => prev.filter((c) => c._id !== id));
  };

  const toggleCommentLike = async (id) => {
    setComments((prev) =>
      prev.map((c) =>
        c._id === id
          ? {
            ...c,
            isLiked: !c.isLiked,
            likesCount: c.isLiked
              ? Math.max((c.likesCount || 1) - 1, 0)
              : (c.likesCount || 0) + 1,
          }
          : c
      )
    );

    await fetch(`${API}/likes/toggle/c/${id}`, {
      method: "POST",
      credentials: "include",
    });
  };

  if (loading)
    return <p className="p-6 text-gray-400">Loading...</p>;
  if (!video)
    return <p className="p-6 text-gray-400">Video not found</p>;

  const videoUrl = video.videoFile.startsWith("http")
    ? video.videoFile
    : `${API}${video.videoFile}`;

  return (
    <div className="max-w-6xl w-full px-4 py-4 text-white">

      {/* Video */}
      <video
        src={videoUrl}
        controls
        autoPlay
        className="w-full rounded-xl bg-black"
      />

      {/* Title */}
      <h1 className="text-xl font-semibold mt-4">
        {video.title}
      </h1>

      {/* Channel + Actions */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mt-3">

        <div className="flex items-center gap-3">
          <img
            src={video.owner?.avatar}
            className="w-10 h-10 rounded-full"
            alt=""
          />

          <div>
            <p className="font-semibold">
              {video.owner?.username}
            </p>
            <p className="text-sm text-gray-400">
              {subscribersCount} subscribers
            </p>
          </div>

          <button
            onClick={toggleSubscribe}
            className={`ml-3 px-4 py-2 rounded-full transition ${subscribed
              ? "bg-[#2a2a2a]"
              : "bg-red-600 hover:bg-red-700"
              }`}
          >
            {subscribed ? "Subscribed" : "Subscribe"}
          </button>
        </div>

        <div className="flex gap-3">
          <button
            onClick={toggleLike}
            className="px-4 py-2 bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded-full"
          >
            👍 {likesCount}
          </button>

          <button
            onClick={openPlaylistPopup}
            className="px-4 py-2 bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded-full"
          >
            ➕ Playlist
          </button>
        </div>
      </div>

      {/* Description */}
      <div className="bg-[#202020] rounded-xl p-4 mt-4">
        <p className="font-semibold text-sm mb-2 text-gray-300">
          {(video.views || 0).toLocaleString()} views •{" "}
          {new Date(video.createdAt).toLocaleDateString()}
        </p>

        <p className="whitespace-pre-line text-gray-300">
          {showFullDesc
            ? video.description
            : video.description?.slice(0, 180)}
        </p>

        {video.description?.length > 180 && (
          <button
            className="mt-2 text-sm font-semibold text-gray-400 hover:text-white"
            onClick={() => setShowFullDesc(!showFullDesc)}
          >
            {showFullDesc ? "Show less" : "Show more"}
          </button>
        )}
      </div>

      {/* Comment Input */}
      <div className="mt-6 flex gap-3">
        <input
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add comment..."
          className="
            flex-1 bg-[#202020]
            border border-[#2a2a2a]
            rounded px-3 py-2
            placeholder-gray-500
          "
        />
        <button
          onClick={addComment}
          className="px-4 bg-red-600 hover:bg-red-700 rounded"
        >
          Comment
        </button>
      </div>

      {/* Comments */}
      <div className="space-y-4 mt-6">
        {comments.map((c) => (
          <div key={c._id} className="flex gap-3">
            <img
              src={c.owner?.avatar}
              className="w-10 h-10 rounded-full"
              alt=""
            />

            <div className="flex-1">
              <p className="font-semibold">
                {c.owner?.username}
              </p>

              <p className="text-gray-300">{c.content}</p>

              <div className="flex gap-4 mt-1 text-sm text-gray-400">
                <button onClick={() => toggleCommentLike(c._id)}>
                  👍 {c.likesCount || 0}
                </button>

                <button
                  onClick={() => deleteComment(c._id)}
                  className="text-red-500"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Playlist Popup */}
      {showPlaylistPopup && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center"
          onClick={() => setShowPlaylistPopup(false)}
        >
          <div
            className="bg-[#181818] border border-[#2a2a2a] p-6 rounded w-80"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-semibold mb-3">
              Add to Playlist
            </h2>

            {playlists.map((p) => (
              <button
                key={p._id}
                onClick={() => addToPlaylist(p._id)}
                className="block w-full text-left py-2 hover:bg-[#242424] px-2 rounded"
              >
                {p.name}
              </button>
            ))}

            <button
              onClick={() => setShowPlaylistPopup(false)}
              className="mt-4 text-sm text-gray-400"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPage;
