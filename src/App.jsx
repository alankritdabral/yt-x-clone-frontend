import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import { useState, lazy, Suspense } from "react";
import { useAuth } from "./hooks/useAuth";

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
const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, loading } = useAuth();
  
  if (loading) {
    return <div className="flex items-center justify-center h-full text-gray-400">Loading auth...</div>;
  }

  if (!isLoggedIn) {
    alert("Please login to continue");
    return <Navigate to="/login" replace />;
  }
  return children;
};

/* ---------- Loader ---------- */
const Loader = () => (
  <div className="flex items-center justify-center h-full text-gray-400">
    Loading...
  </div>
);

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isLoggedIn, loading } = useAuth();

  if (loading) return <Loader />;

  return (
    <div className="flex flex-col h-screen bg-[#0f0f0f] text-white">
      <Navbar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="flex flex-1 overflow-hidden pt-14">
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <main
          className={`flex-1 overflow-y-auto transition-all duration-300
    ${sidebarOpen ? "md:ml-60" : "md:ml-[72px]"}
  `}
        >
          <Suspense fallback={<Loader />}>
            <Routes>
              {/* Public */}
              <Route path="/" element={<HomePage />} />
              <Route path="/watch/:videoId" element={<VideoPage />} />
              <Route path="/profile/:username" element={<ProfilePage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/playlist/:id" element={<PlaylistPage />} />
              <Route path="/tweets" element={<TweetFeedPage />} />

              {/* Protected */}
              <Route
                path="/upload"
                element={
                  <ProtectedRoute>
                    <UploadPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/history"
                element={
                  <ProtectedRoute>
                    <WatchHistory />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/liked-videos"
                element={
                  <ProtectedRoute>
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
                    <LoginPage />
                  )
                }
              />
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
