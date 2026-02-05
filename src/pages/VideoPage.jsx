import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const API = "http://localhost:8000/api/v1";

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

  /* ---------------- Fetch Data ---------------- */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const videoRes = await fetch(`${API}/videos/${videoId}`, {
          credentials: "include",
        });

        const videoData = await videoRes.json();
        const videoInfo = videoData.data;

        setVideo(videoInfo);
        setLikesCount(videoInfo?.likesCount || 0);
        setLiked(videoInfo?.isLiked || false);
        setSubscribed(videoInfo?.isSubscribed || false);

        /* Subscriber count */
        if (videoInfo?.owner?._id) {
          const subRes = await fetch(
            `${API}/subscriptions/c/${videoInfo.owner._id}`,
            { credentials: "include" }
          );

          const subData = await subRes.json();
          setSubscribersCount(subData.data?.length || 0);
        }

        /* Comments */
        const commentRes = await fetch(`${API}/comments/${videoId}`, {
          credentials: "include",
        });

        const commentData = await commentRes.json();
        setComments(commentData.data?.comments || []);

        /* History */
        await fetch(`${API}/users/history/${videoId}`, {
          method: "POST",
          credentials: "include",
        });
        // View Count
        if (!videoId) return;

        fetch(`${API}/videos/view/${videoId}`, {
          method: "POST",
          credentials: "include",
        });

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

    alert("Added to playlist");
    setShowPlaylistPopup(false);
  };

  /* ---------------- Video Like ---------------- */
  const toggleLike = async () => {
    const prev = liked;

    setLiked(!prev);
    setLikesCount((c) => (prev ? Math.max(c - 1, 0) : c + 1));

    try {
      const res = await fetch(
        `${API}/likes/toggle/v/${videoId}`,
        { method: "POST", credentials: "include" }
      );

      const data = await res.json();
      setLiked(data.data.liked);
      setLikesCount(data.data.likesCount);
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

  /* ---------------- Add Comment ---------------- */
  const addComment = async () => {
    if (!newComment.trim()) return;

    const res = await fetch(`${API}/comments/${videoId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ content: newComment }),
    });

    const data = await res.json();

    setComments((prev) => [data.data, ...prev]);
    setNewComment("");
  };

  /* ---------------- Delete Comment ---------------- */
  const deleteComment = async (id) => {
    await fetch(`${API}/comments/c/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    setComments((prev) => prev.filter((c) => c._id !== id));
  };

  /* ---------------- Comment Like ---------------- */
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

  if (loading) return <p className="p-4">Loading...</p>;
  if (!video) return <p className="p-4">Video not found</p>;

  const videoUrl = video.videoFile.startsWith("http")
    ? video.videoFile
    : `http://localhost:8000${video.videoFile}`;

  return (
    <div className="max-w-5xl mx-auto px-4 mt-4">
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
      <div className="flex justify-between items-center mt-3">
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
            <p className="text-sm text-gray-500">
              {subscribersCount} subscribers
            </p>
          </div>

          <button
            onClick={toggleSubscribe}
            className={`ml-4 px-4 py-2 rounded-full text-white ${subscribed ? "bg-gray-500" : "bg-black"
              }`}
          >
            {subscribed ? "Subscribed" : "Subscribe"}
          </button>
        </div>

        <div className="flex gap-3">
          <button
            onClick={toggleLike}
            className="px-4 py-2 bg-gray-200 rounded-full"
          >
            👍 {likesCount}
          </button>

          <button
            onClick={openPlaylistPopup}
            className="px-4 py-2 bg-gray-200 rounded-full"
          >
            ➕ Playlist
          </button>
        </div>
      </div>

      {/* Description */}
      <div className="bg-gray-100 rounded-xl p-4 mt-4">
        <p className="font-semibold text-sm mb-2 text-left">
          {(video.views || 0).toLocaleString()} views •{" "}
          {new Date(video.createdAt).toLocaleDateString()}
        </p>

        <p className="whitespace-pre-line text-left">
          {showFullDesc
            ? video.description
            : video.description?.slice(0, 150)}
        </p>

        {video.description?.length > 150 && (
          <button
            className="mt-2 text-sm font-semibold"
            onClick={() => setShowFullDesc(!showFullDesc)}
          >
            {showFullDesc ? "Show less" : "Show more"}
          </button>
        )}
      </div>

      {/* Add Comment */}
      <div className="mt-6 flex gap-3">
        <input
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add comment..."
          className="flex-1 border rounded px-3 py-2"
        />
        <button
          onClick={addComment}
          className="px-4 bg-black text-white rounded"
        >
          Comment
        </button>
      </div>

      {/* Comments */}
      <div className="space-y-4 mt-6">
        {comments.map((c) => (
          <div key={c._id} className="flex gap-3">
            <img
              src={
                c.owner?.avatar ||
                "https://via.placeholder.com/40"
              }
              className="w-10 h-10 rounded-full"
              alt=""
            />

            <div className="flex-1 text-left">
              <p className="font-semibold ">
                {c.owner?.username}
              </p>

              <p>{c.content}</p>

              <div className="flex gap-4 mt-1 text-sm">
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
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-80">
            <h2 className="font-semibold mb-3">
              Add to Playlist
            </h2>

            {playlists.map((p) => (
              <button
                key={p._id}
                onClick={() => addToPlaylist(p._id)}
                className="block w-full text-left py-2 hover:bg-gray-100 px-2 rounded"
              >
                {p.name}
              </button>
            ))}

            <button
              onClick={() => setShowPlaylistPopup(false)}
              className="mt-4 text-sm text-gray-500"
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
