import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

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
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-[#0f0f0f] px-4">
      <div className="w-full max-w-md bg-[#121212] border border-[#2a2a2a]/60 rounded-3xl shadow-xl p-8 sm:p-10">
        <h1 className="text-[28px] font-bold text-center mb-8 tracking-tight text-white">
          Sign in to <span className="text-red-500">YT-X</span>
        </h1>

        {error && (
          <div className="mb-5 text-[13px] text-red-400 bg-red-950/40 border border-red-900/50 px-4 py-3 rounded-xl flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-alert-circle"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-[13px] font-medium text-gray-400 mb-1.5 ml-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="
                w-full px-4 py-3 rounded-xl
                bg-[#1a1a1a] border border-[#333333]
                text-white placeholder-gray-500
                focus:outline-none focus:border-[#1c62b9] focus:bg-[#202020]
                transition-colors
              "
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-[13px] font-medium text-gray-400 mb-1.5 ml-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="
                  w-full px-4 py-3 rounded-xl pr-12
                  bg-[#1a1a1a] border border-[#333333]
                  text-white placeholder-gray-500
                  focus:outline-none focus:border-[#1c62b9] focus:bg-[#202020]
                  transition-colors
                "
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-300 transition-colors p-2"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Options */}
          <div className="flex items-center justify-between text-[13px] text-gray-400 pt-1">
            <label className="flex items-center gap-2 cursor-pointer hover:text-gray-300 transition-colors">
              <input type="checkbox" className="rounded bg-[#202020] border-[#333333] text-[#1c62b9] focus:ring-[#1c62b9] focus:ring-offset-[#121212]" />
              Remember me
            </label>
            <a href="#" className="text-[#1c62b9] hover:text-blue-400 transition-colors">
              Forgot password?
            </a>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="
              w-full py-3 mt-2 rounded-xl
              bg-[#1c62b9] hover:bg-blue-600
              text-white font-medium
              transition-all disabled:opacity-60 disabled:cursor-not-allowed
            "
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Social login */}
        <div className="mt-8 text-center">
          <div className="relative flex items-center py-2 mb-4">
            <div className="flex-grow border-t border-[#2a2a2a]"></div>
            <span className="flex-shrink-0 mx-4 text-[#777777] text-xs">Or continue with</span>
            <div className="flex-grow border-t border-[#2a2a2a]"></div>
          </div>

          <div className="flex gap-3">
            <button className="flex-1 py-2.5 border border-[#333333] rounded-xl hover:bg-[#1a1a1a] text-sm font-medium text-gray-300 transition-colors">
              Google
            </button>
            <button className="flex-1 py-2.5 border border-[#333333] rounded-xl hover:bg-[#1a1a1a] text-sm font-medium text-gray-300 transition-colors">
              GitHub
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-[13px] text-gray-400">
          Don’t have an account?{" "}
          <a href="/register" className="text-[#1c62b9] hover:text-blue-400 font-medium transition-colors">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
