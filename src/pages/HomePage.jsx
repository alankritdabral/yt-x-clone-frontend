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
    <div className="pt-2 md:pt-4">
      <div className="px-4 md:px-6 py-4 max-w-[2000px] w-full mx-auto">
        {loading ? (
          /* ---------- Skeleton Loader ---------- */
          <div className="grid gap-x-4 gap-y-10 sm:gap-x-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="animate-pulse flex flex-col gap-3">
                <div className="aspect-video bg-[#202020] rounded-2xl w-full" />
                <div className="flex gap-3 items-start">
                  <div className="w-9 h-9 bg-[#202020] rounded-full shrink-0 mt-0.5" />
                  <div className="flex flex-col gap-2 w-full">
                    <div className="h-4 bg-[#202020] rounded w-[90%]" />
                    <div className="h-4 bg-[#202020] rounded w-[60%]" />
                    <div className="h-3 bg-[#202020] rounded w-[40%] mt-1" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : videos.length > 0 ? (
          /* ---------- Video Grid ---------- */
          <div
            className="
              grid gap-x-4 gap-y-10
              sm:gap-x-6
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
