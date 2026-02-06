import { useEffect, useState } from "react";
import VideoCard from "../components/VideoCard";

const API = import.meta.env.VITE_API_BASE_URL;

const WatchHistory = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await fetch(
                    `${API}/users/history`,
                    { credentials: "include" }
                );

                const data = await res.json();
                setHistory(data.data || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
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
                <div className="grid gap-6
                        sm:grid-cols-2
                        md:grid-cols-3
                        lg:grid-cols-4">
                    {history.map((video) => (
                        <VideoCard key={video._id} video={video} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default WatchHistory;
