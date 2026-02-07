import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import VideoCard from "../components/VideoCard";

const API = import.meta.env.VITE_API_BASE_URL;
 
const HomePage = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);

        const response = await fetch(`${API}/videos`, {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          const text = await response.text();
          throw new Error(text);
        }

        const data = await response.json();
        setVideos(data.data.videos);
      } catch (error) {
        // ✅ Redirect if not logged in
        navigate("/login");
        console.error("Error fetching videos:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [navigate]);

  return (
    <div className="pt-4">
      <div className="px-6 py-4 max-w-[1600px] mx-auto">
        {loading ? (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-video bg-gray-300 rounded-xl" />
                <div className="mt-3 h-4 bg-gray-300 rounded w-3/4" />
                <div className="mt-2 h-3 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : videos.length > 0 ? (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
            {videos.map((video) => (
              <VideoCard key={video._id} video={video} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No videos found</p>
        )}
      </div>
    </div>
  );
};

export default HomePage;
