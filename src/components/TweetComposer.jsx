import { useState } from "react";
import { createTweet } from "../api/tweetAPI";

const TweetComposer = ({ onTweetCreated }) => {
  const [content, setContent] = useState("");
  const [posting, setPosting] = useState(false);

  const handlePost = async () => {
    if (!content.trim()) return;

    try {
      setPosting(true);
      await createTweet(content);
      setContent("");
      onTweetCreated();
    } catch (err) {
      alert(err.message);
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="bg-[#1e1e1e] rounded-xl p-4">
      <textarea
        placeholder="What's happening?"
        className="w-full bg-transparent outline-none text-white resize-none"
        rows={3}
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <div className="flex justify-end mt-3">
        <button
          onClick={handlePost}
          disabled={posting}
          className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-full text-sm font-medium disabled:opacity-50"
        >
          {posting ? "Posting..." : "Tweet"}
        </button>
      </div>
    </div>
  );
};

export default TweetComposer;
