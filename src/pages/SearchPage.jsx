import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import VideoCard from "../components/VideoCard";

const API = "http://localhost:8000/api/v1";

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("q") || ""
  );
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterType, setFilterType] = useState("video");

  /* ===============================
     Perform Search
  =============================== */
  useEffect(() => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setLoading(true);

        // update URL
        setSearchParams({ q: searchQuery });

        const response = await fetch(
          `${API}/search?q=${searchQuery}&type=${filterType}`
        );

        const data = await response.json();

        // API returns data.data
        setResults(data?.data || []);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setLoading(false);
      }
    }, 400); // debounce

    return () => clearTimeout(timer);
  }, [searchQuery, filterType, setSearchParams]);

  return (
    <div className="p-4">
      {/* ================= Filters ================= */}
      <div className="flex gap-3 mb-4">
        <input
          type="text"
          className="border p-2 flex-1 rounded"
          placeholder="Search videos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <select
          className="border p-2 rounded"
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
        <p>Searching...</p>
      ) : results.length > 0 ? (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {results.map((result) => (
            <VideoCard key={result._id} video={result} />
          ))}
        </div>
      ) : searchQuery ? (
        <p>No results found for "{searchQuery}"</p>
      ) : (
        <p>Start typing to search</p>
      )}
    </div>
  );
};

export default SearchPage;
