import { useEffect, useState } from "react";
import VideoCard from "../components/VideoCard";
import { fetchLikedVideos } from "../api/videoAPI";

const LikedVideos = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLikedVideos = async () => {
      try {
        const data = await fetchLikedVideos();
        setVideos(data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadLikedVideos();
  }, []);

  if (loading) {
    return (
      <div className="px-4 md:px-6 py-6 max-w-[1800px] w-full">
        <div className="animate-pulse grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i}>
              <div className="aspect-video bg-[#2a2a2a] rounded-xl" />
              <div className="mt-3 h-4 bg-[#2a2a2a] rounded w-3/4" />
              <div className="mt-2 h-3 bg-[#242424] rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 md:px-6 py-6 max-w-[1800px] w-full">
      <h1 className="text-2xl md:text-3xl font-semibold mb-8 text-white">
        Liked Videos
      </h1>

      {videos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <p className="text-lg mb-2">
            You haven't liked any videos yet
          </p>
          <p className="text-sm text-gray-500">
            Like videos to see them here.
          </p>
        </div>
      ) : (
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
      )}
    </div>
  );
};

export default LikedVideos;
