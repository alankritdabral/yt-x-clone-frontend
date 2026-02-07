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

    if (loading)
        return <p className="p-4">Loading history...</p>;

    return (
        <div className="max-w-7xl mx-auto px-4 mt-6">
            <h1 className="text-2xl font-semibold mb-6">
                Watch history
            </h1>

            {history.length === 0 ? (
                <p className="text-gray-500">
                    No watch history yet.
                </p>
            ) : (
                <div
                    className="grid gap-6
            sm:grid-cols-2
            md:grid-cols-3
            lg:grid-cols-4"
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
