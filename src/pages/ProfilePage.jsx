import { useState, useEffect } from "react";
import VideoCard from "../components/VideoCard";
import {
  fetchCurrentUser,
  fetchWatchHistory,
} from "../api/userAPI";
import { fetchVideosByOwner } from "../api/videoAPI";

const API = import.meta.env.VITE_API_BASE_URL || "";

const tabs = ["Home", "Videos", "History", "Playlists", "About"];

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("Home");
  const [user, setUser] = useState(null);
  const [videos, setVideos] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subLoading, setSubLoading] = useState(false);

  const toggleSubscribe = async () => {
    if (!user?._id) return;

    try {
      setSubLoading(true);

      await fetch(`${API}/subscriptions/toggle/${user._id}`, {
        method: "POST",
        credentials: "include",
      });

      setIsSubscribed((prev) => !prev);
    } catch (err) {
      console.error("Subscription error:", err);
    } finally {
      setSubLoading(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const userData = await fetchCurrentUser();
        setUser(userData);

        if (userData?._id) {
          const vids = await fetchVideosByOwner(userData._id);
          setVideos(vids);

          const hist = await fetchWatchHistory();
          setHistory(hist);
        }
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading)
    return (
      <div className="p-10 text-gray-400">
        Loading profile...
      </div>
    );

  return (
    <div className="w-full bg-[#181818] text-white min-h-screen">
      {/* ---------- Banner ---------- */}
      <div className="h-48 md:h-60 bg-[#202020]">
        {user?.coverImage && (
          <img
            src={user.coverImage}
            alt="Banner"
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* ---------- Channel Info ---------- */}
      <div className="max-w-7xl w-full px-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-6 gap-4">
          <div className="flex items-center gap-5">
            <img
              src={user?.avatar}
              alt="Avatar"
              className="w-24 h-24 rounded-full object-cover border border-[#2a2a2a]"
            />

            <div>
              <h1 className="text-2xl font-bold">
                {user?.fullName}
              </h1>

              <p className="text-sm text-gray-400">
                @{user?.username} • {videos.length} videos
              </p>
            </div>
          </div>

          {/* Subscribe Button */}
          <button
            onClick={toggleSubscribe}
            disabled={subLoading}
            className={`px-6 py-2 rounded-full font-medium transition ${isSubscribed
                ? "bg-[#2a2a2a] hover:bg-[#3a3a3a]"
                : "bg-red-600 hover:bg-red-700"
              }`}
          >
            {subLoading
              ? "Loading..."
              : isSubscribed
                ? "Subscribed"
                : "Subscribe"}
          </button>
        </div>

        {/* ---------- Tabs ---------- */}
        <div className="border-b border-[#2a2a2a] flex gap-6 text-sm font-medium">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 transition ${activeTab === tab
                  ? "border-b-2 border-red-600 text-white"
                  : "text-gray-500 hover:text-white"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* ---------- Content ---------- */}
        <div className="py-6">
          {(activeTab === "Home" ||
            activeTab === "Videos") && (
              <div
                className="
                grid gap-6
                grid-cols-1
                sm:grid-cols-2
                md:grid-cols-3
                lg:grid-cols-4
              "
              >
                {videos.map((video) => (
                  <VideoCard key={video._id} video={video} />
                ))}
              </div>
            )}

          {/* History */}
          {activeTab === "History" && (
            <div
              className="
                grid gap-6
                grid-cols-1
                sm:grid-cols-2
                md:grid-cols-3
                lg:grid-cols-4
              "
            >
              {history.map((video) => (
                <VideoCard key={video._id} video={video} />
              ))}
            </div>
          )}

          {/* About */}
          {activeTab === "About" && (
            <div className="max-w-xl text-sm text-gray-400 space-y-2">
              <p>Email: {user?.email}</p>
              <p>
                Joined:{" "}
                {new Date(
                  user?.createdAt
                ).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
