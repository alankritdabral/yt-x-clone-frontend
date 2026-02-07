import { useEffect, useState } from "react";
import VideoCard from "../components/VideoCard";
import { fetchWatchHistory } from "../api/userAPI";

const WatchHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const data = await fetchWatchHistory();
        setHistory(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
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
    <div className="px-4 md:px-6 py-6 max-w-[1800px] w-full text-white">
      <h1 className="text-2xl md:text-3xl font-semibold mb-8">
        Watch history
      </h1>

      {history.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <p className="text-lg mb-2">
            No watch history yet
          </p>
          <p className="text-sm text-gray-500">
            Videos you watch will appear here.
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
          {history.map((video) => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>
      )}
    </div>
  );
};

export default WatchHistory;
