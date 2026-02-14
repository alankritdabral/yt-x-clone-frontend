import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchFeedTweets } from "../api/tweetAPI";
import TweetCard from "../components/TweetCard";
import TweetComposer from "../components/TweetComposer";

const TweetFeedPage = () => {
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const loadTweets = async () => {
    try {
      setLoading(true);
      const data = await fetchFeedTweets();
      setTweets(data.data.tweets);
    } catch (error) {
      navigate("/login");
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTweets();
  }, []);

  return (
    <div className="pt-4">
      <div className="px-4 md:px-6 py-4 max-w-[700px] mx-auto w-full">
        {/* Tweet Composer */}
        <TweetComposer onTweetCreated={loadTweets} />

        {loading ? (
          /* ---------- Skeleton ---------- */
          <div className="space-y-4 mt-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse bg-[#1e1e1e] p-4 rounded-xl"
              >
                <div className="h-4 bg-[#2a2a2a] rounded w-1/2 mb-2" />
                <div className="h-3 bg-[#2a2a2a] rounded w-full mb-1" />
                <div className="h-3 bg-[#2a2a2a] rounded w-5/6" />
              </div>
            ))}
          </div>
        ) : tweets.length > 0 ? (
          /* ---------- Tweet Feed ---------- */
          <div className="space-y-4 mt-6">
            {tweets.map((tweet) => (
              <TweetCard
                key={tweet._id}
                tweet={tweet}
                refreshTweets={loadTweets}
              />
            ))}
          </div>
        ) : (
          /* ---------- Empty ---------- */
          <div className="text-center text-gray-400 py-20">
            <p>No tweets yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TweetFeedPage;
