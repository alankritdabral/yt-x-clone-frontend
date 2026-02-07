import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import VideoCard from "../components/VideoCard";
import { fetchVideos } from "../api/videoAPI";

const HomePage = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadVideos = async () => {
      try {
        setLoading(true);
        const data = await fetchVideos();
        setVideos(data.data.videos);
      } catch (error) {
        navigate("/login");
        console.error("Error fetching videos:", error.message);
      } finally {
        setLoading(false);
      }
    };

    loadVideos();
  }, [navigate]);

  return (
    <div className="pt-4">
      <div className="px-4 md:px-6 py-4 max-w-[1800px] w-full">
        {loading ? (
          /* ---------- Skeleton Loader ---------- */
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-video bg-[#2a2a2a] rounded-xl" />
                <div className="mt-3 h-4 bg-[#2a2a2a] rounded w-3/4" />
                <div className="mt-2 h-3 bg-[#242424] rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : videos.length > 0 ? (
          /* ---------- Video Grid ---------- */
          <div
            className="
              grid gap-6
              grid-cols-1
              sm:grid-cols-2
              md:grid-cols-3
              lg:grid-cols-4
              xl:grid-cols-5
              2xl:grid-cols-6
            "
          >
            {videos.map((video) => (
              <VideoCard key={video._id} video={video} />
            ))}
          </div>
        ) : (
          /* ---------- Empty State ---------- */
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <p className="text-lg mb-2">No videos found</p>
            <p className="text-sm text-gray-500">
              Videos will appear here once uploaded.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
