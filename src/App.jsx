import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState, lazy, Suspense } from "react";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

/* -------- Lazy-loaded pages -------- */
const HomePage = lazy(() => import("./pages/HomePage"));
const VideoPage = lazy(() => import("./pages/VideoPage"));
const UploadPage = lazy(() => import("./pages/UploadPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const SearchPage = lazy(() => import("./pages/SearchPage"));
const PlaylistPage = lazy(() => import("./pages/PlaylistPage"));
const TweetFeedPage = lazy(() => import("./pages/TweetFeedPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const WatchHistory = lazy(() => import("./pages/WatchHistory"));
const LikedVideos = lazy(() => import("./pages/LikedVideos"));

/* ---------- Protected Route ---------- */
const ProtectedRoute = ({ isLoggedIn, children }) => {
  if (!isLoggedIn) {
    alert("Please login to continue");
    return <Navigate to="/login" replace />;
  }

  return children;
};

/* ---------- Loading fallback ---------- */
const Loader = () => (
  <div className="flex items-center justify-center h-full text-gray-400">
    Loading...
  </div>
);

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  /* ---------- Restore session ---------- */
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const storedUser = localStorage.getItem("user");

        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setIsLoggedIn(true);

          const API = import.meta.env.VITE_API_BASE_URL;

          const res = await fetch(`${API}/users/refresh-token`, {
            method: "POST",
            credentials: "include",
          });

          if (!res.ok) throw new Error("Refresh failed");
        }
      } catch (err) {
        console.error(err);
        localStorage.removeItem("user");
        setUser(null);
        setIsLoggedIn(false);
      }
    };

    restoreSession();
  }, []);

  return (
    <div className="flex flex-col h-screen bg-[#0f0f0f] text-white">
      <Navbar
        user={user}
        setUser={setUser}
        setIsLoggedIn={setIsLoggedIn}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <main className="flex-1 overflow-y-auto px-6 py-6">
          <Suspense fallback={<Loader />}>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/watch/:videoId" element={<VideoPage />} />
              <Route path="/profile/:username" element={<ProfilePage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/playlist/:id" element={<PlaylistPage />} />
              <Route path="/tweets" element={<TweetFeedPage />} />

              {/* Protected routes */}
              <Route
                path="/upload"
                element={
                  <ProtectedRoute isLoggedIn={isLoggedIn}>
                    <UploadPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/history"
                element={
                  <ProtectedRoute isLoggedIn={isLoggedIn}>
                    <WatchHistory />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/liked-videos"
                element={
                  <ProtectedRoute isLoggedIn={isLoggedIn}>
                    <LikedVideos />
                  </ProtectedRoute>
                }
              />

              {/* Login */}
              <Route
                path="/login"
                element={
                  isLoggedIn ? (
                    <Navigate to="/" />
                  ) : (
                    <LoginPage
                      setIsLoggedIn={setIsLoggedIn}
                      setUser={setUser}
                    />
                  )
                }
              />

              {/* Register */}
              <Route path="/register" element={<RegisterPage />} />

              {/* 404 */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </div>
  );
}

export default App;
