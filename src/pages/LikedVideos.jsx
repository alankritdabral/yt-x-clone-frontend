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
    return <p className="p-4">Loading liked videos...</p>;
  }

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">
        Liked Videos
      </h1>

      {videos.length === 0 ? (
        <p className="text-gray-500">
          You haven't liked any videos yet.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {videos.map((video) => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>
      )}
    </div>
  );
};

export default LikedVideos;
