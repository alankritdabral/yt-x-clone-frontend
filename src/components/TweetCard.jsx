import { deleteTweet } from "../api/tweetAPI";

const TweetCard = ({ tweet, refreshTweets }) => {
    const handleDelete = async () => {
        if (!window.confirm("Delete this tweet?")) return;

        try {
            await deleteTweet(tweet._id);
            refreshTweets();
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <div className="bg-[#1e1e1e] rounded-xl p-4">
            {/* Header */}
            <div className="flex justify-between items-center mb-2">
                <div className="font-semibold text-white">
                    @{tweet.owner?.username || "user"}
                </div>

                <button
                    onClick={handleDelete}
                    className="text-red-400 hover:text-red-500 text-sm"
                >
                    Delete
                </button>
            </div>

            {/* Content */}
            <p className="text-gray-300 whitespace-pre-wrap">
                {tweet.content}
            </p>

            {/* Footer */}
            <div className="text-gray-500 text-xs mt-3">
                {new Date(tweet.createdAt).toLocaleString()}
            </div>
        </div>
    );
};

export default TweetCard;
