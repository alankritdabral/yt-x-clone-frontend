import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/userAPI";

const LoginPage = ({ setIsLoggedIn, setUser }) => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (loading) return;

    setError("");

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    try {
      setLoading(true);

      const data = await loginUser(email, password);

      setIsLoggedIn(true);
      setUser(data.data.user);

      localStorage.setItem("user", JSON.stringify(data.data.user));

      navigate("/");
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-[#0f0f0f] px-4">
      <div className="w-full max-w-md bg-[#181818] border border-[#2a2a2a] rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center mb-6 text-white">
          Login to <span className="text-red-600">YT-X</span>
        </h1>

        {error && (
          <div className="mb-4 text-sm text-red-400 bg-red-900/30 border border-red-800 px-4 py-2 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="
                w-full px-4 py-2 rounded-lg
                bg-[#202020] border border-[#2a2a2a]
                text-white placeholder-gray-500
                focus:outline-none focus:ring-2 focus:ring-red-600
              "
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="
                  w-full px-4 py-2 rounded-lg pr-10
                  bg-[#202020] border border-[#2a2a2a]
                  text-white placeholder-gray-500
                  focus:outline-none focus:ring-2 focus:ring-red-600
                "
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-400"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {/* Options */}
          <div className="flex items-center justify-between text-sm text-gray-400">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="rounded bg-[#202020]" />
              Remember me
            </label>
            <a href="#" className="text-red-500 hover:underline">
              Forgot password?
            </a>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="
              w-full py-2 rounded-lg
              bg-red-600 hover:bg-red-700
              text-white font-semibold
              transition disabled:opacity-60
            "
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Social login */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 mb-3">
            Or login with
          </p>

          <div className="flex gap-3">
            <button className="flex-1 py-2 border border-[#2a2a2a] rounded-lg hover:bg-[#242424] transition">
              Google
            </button>
            <button className="flex-1 py-2 border border-[#2a2a2a] rounded-lg hover:bg-[#242424] transition">
              GitHub
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-gray-400">
          Don’t have an account?{" "}
          <a href="/register" className="text-red-500 hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
