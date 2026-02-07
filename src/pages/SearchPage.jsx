import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import VideoCard from "../components/VideoCard";
import { searchContent } from "../api/searchApi";

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("q") || ""
  );
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterType, setFilterType] = useState("video");

  useEffect(() => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setLoading(true);

        setSearchParams({ q: searchQuery });

        const data = await searchContent(
          searchQuery,
          filterType
        );

        setResults(data);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery, filterType, setSearchParams]);

  return (
    <div className="px-4 md:px-6 py-6 max-w-[1800px] w-full text-white">
      {/* ================= Filters ================= */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <input
          type="text"
          className="
            bg-[#202020]
            border border-[#2a2a2a]
            px-4 py-2 rounded-lg
            flex-1
            placeholder-gray-500
            focus:outline-none focus:border-red-600
          "
          placeholder="Search videos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <select
          className="
            bg-[#202020]
            border border-[#2a2a2a]
            px-4 py-2 rounded-lg
            focus:outline-none focus:border-red-600
          "
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="video">Videos</option>
          <option value="all">All</option>
          <option value="user">Users</option>
          <option value="tweet">Tweets</option>
          <option value="playlist">Playlists</option>
        </select>
      </div>

      {/* ================= Results ================= */}
      {loading ? (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-video bg-[#2a2a2a] rounded-xl" />
              <div className="mt-3 h-4 bg-[#2a2a2a] rounded w-3/4" />
              <div className="mt-2 h-3 bg-[#242424] rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : results.length > 0 ? (
        <div
          className="
            grid gap-6
            grid-cols-1
            sm:grid-cols-2
            md:grid-cols-3
            lg:grid-cols-4
            xl:grid-cols-5
          "
        >
          {results.map((result) => (
            <VideoCard key={result._id} video={result} />
          ))}
        </div>
      ) : searchQuery ? (
        <div className="text-gray-400 py-12 text-center">
          No results found for
          <span className="text-white">
            {" "}“{searchQuery}”
          </span>
        </div>
      ) : (
        <div className="text-gray-500 py-12 text-center">
          Start typing to search videos, users, or playlists.
        </div>
      )}
    </div>
  );
};

export default SearchPage;
