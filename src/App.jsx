import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState, lazy, Suspense } from "react";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

/* -------- Lazy-loaded pages (code splitting) -------- */
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
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  return children;
};

/* ---------- Loading fallback ---------- */
const Loader = () => (
  <div className="flex items-center justify-center h-full">
    Loading...
  </div>
);

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  /* ---------- Restore user session ---------- */
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");

      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsLoggedIn(true);
      }
    } catch {
      localStorage.removeItem("user");
    }
  }, []);

  return (
    <div className="flex flex-col h-screen bg-[#F6F0D7]">
      <Navbar
        user={user}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <main
          className={`
            flex-1 overflow-y-auto p-6
            transition-all duration-300
            ${sidebarOpen ? "ml-56" : "ml-20"}
          `}
        >
          <Suspense fallback={<Loader />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/watch/:videoId" element={<VideoPage />} />
              <Route path="/profile/:username" element={<ProfilePage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/playlist/:id" element={<PlaylistPage />} />
              <Route path="/tweets" element={<TweetFeedPage />} />

              {/* Protected Routes */}
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

              <Route
                path="/login"
                element={
                  <LoginPage
                    setIsLoggedIn={setIsLoggedIn}
                    setUser={setUser}
                  />
                }
              />

              <Route path="/register" element={<RegisterPage />} />

              {/* 404 fallback */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </div>
  );
}

export default App;
