import { useState, useEffect } from "react";
import VideoCard from "../components/VideoCard"; // adjust path if needed

const tabs = ["Home", "Videos", "Playlists", "About"];

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("Home");
  const [user, setUser] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch current user
  const fetchUser = async () => {
    try {
      const res = await fetch(
        "http://localhost:8000/api/v1/users/current-user",
        { credentials: "include" }
      );

      const result = await res.json();
      setUser(result.data);

      return result.data; // return user for next step
    } catch (err) {
      console.error("User fetch error:", err);
    }
  };

  // Fetch videos of current user
  const fetchVideos = async (userId) => {
    try {
      const res = await fetch(
        "http://localhost:8000/api/v1/videos",
        { credentials: "include" }
      );

      const result = await res.json();
      const allVideos = result.data.videos || [];

      const myVideos = allVideos.filter(
        (v) => v.owner?._id === userId
      );

      setVideos(myVideos);
    } catch (err) {
      console.error("Videos fetch error:", err);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      const userData = await fetchUser();
      if (userData?._id) {
        await fetchVideos(userData._id);
      }
      setLoading(false);
    };

    loadData();
  }, []);

  if (loading) return <div className="p-10">Loading...</div>;

  return (
    <div className="w-full bg-[#F6F0D7] min-h-screen">
      {/* Banner */}
      <div className="h-48 md:h-60 bg-gray-300">
        <img
          src={user?.coverImage}
          alt="Banner"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Channel Info */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-6 gap-4">
          <div className="flex items-center gap-5">
            <img
              src={user?.avatar}
              alt="Avatar"
              className="w-24 h-24 rounded-full object-cover"
            />

            <div>
              <h1 className="text-2xl font-bold">
                {user?.fullName}
              </h1>

              <p className="text-sm text-gray-600">
                @{user?.username} • {videos.length} videos
              </p>
            </div>
          </div>

          <button className="bg-black text-white px-6 py-2 rounded-full hover:bg-gray-900 w-fit">
            Subscribe
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-300 flex gap-6 text-sm font-medium">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 ${activeTab === tab
                  ? "border-b-2 border-black text-black"
                  : "text-gray-500 hover:text-black"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="py-6">
          {(activeTab === "Home" ||
            activeTab === "Videos") && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">


                {videos.map((video) => (
                  <VideoCard key={video._id} video={video} />
                ))}
              </div>
            )}

          {activeTab === "About" && (
            <div className="max-w-xl text-sm text-gray-700 space-y-2">
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
