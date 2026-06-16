import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/userAPI";

const RegisterPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });

  const [avatar, setAvatar] = useState(null);
  const [coverImage, setCoverImage] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (loading) return;

    setError("");

    if (!avatar) return setError("Avatar is required");

    if (formData.password !== formData.confirmPassword)
      return setError("Passwords do not match");

    if (!formData.agreeToTerms)
      return setError("Please agree to terms");

    try {
      setLoading(true);

      const data = new FormData();
      data.append("fullName", formData.fullName);
      data.append("username", formData.username);
      data.append("email", formData.email);
      data.append("password", formData.password);
      data.append("avatar", avatar);

      if (coverImage) data.append("coverImage", coverImage);

      await registerUser(data);

      alert("Account created successfully!");
      navigate("/login");
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f0f0f] px-4 py-8">
      <div
        className="
          w-full max-w-md
          bg-[#121212] border border-[#2a2a2a]/60 rounded-3xl shadow-xl
          p-8 sm:p-10
          overflow-y-auto max-h-[95vh] custom-scrollbar
          text-white
        "
      >
        <h1 className="text-[28px] font-bold text-center mb-8 tracking-tight text-white">
          Join <span className="text-red-500">YT-X</span>
        </h1>

        {error && (
          <div className="mb-5 text-[13px] text-red-400 bg-red-950/40 border border-red-900/50 px-4 py-3 rounded-xl flex items-center gap-2">
             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-alert-circle"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-5">
          {/* Full Name */}
          <div>
            <label className="block text-[13px] font-medium text-gray-400 mb-1.5 ml-1">
              Full Name
            </label>
            <input
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter full name"
              className="
                w-full px-4 py-3 rounded-xl
                bg-[#1a1a1a] border border-[#333333]
                placeholder-gray-500
                focus:outline-none focus:border-[#1c62b9] focus:bg-[#202020]
                transition-colors
              "
              required
            />
          </div>

          {/* Username */}
          <div>
            <label className="block text-[13px] font-medium text-gray-400 mb-1.5 ml-1">
              Username
            </label>
            <input
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Choose username"
              className="
                w-full px-4 py-3 rounded-xl
                bg-[#1a1a1a] border border-[#333333]
                placeholder-gray-500
                focus:outline-none focus:border-[#1c62b9] focus:bg-[#202020]
                transition-colors
              "
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-[13px] font-medium text-gray-400 mb-1.5 ml-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
              className="
                w-full px-4 py-3 rounded-xl
                bg-[#1a1a1a] border border-[#333333]
                placeholder-gray-500
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
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create password"
                className="
                  w-full px-4 py-3 rounded-xl pr-12
                  bg-[#1a1a1a] border border-[#333333]
                  placeholder-gray-500
                  focus:outline-none focus:border-[#1c62b9] focus:bg-[#202020]
                  transition-colors
                "
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-300 transition-colors p-2"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-[13px] font-medium text-gray-400 mb-1.5 ml-1">
              Confirm Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm password"
              className="
                w-full px-4 py-3 rounded-xl
                bg-[#1a1a1a] border border-[#333333]
                placeholder-gray-500
                focus:outline-none focus:border-[#1c62b9] focus:bg-[#202020]
                transition-colors
              "
              required
            />
          </div>

          {/* Avatar */}
          <div>
            <label className="block text-[13px] font-medium text-gray-400 mb-1.5 ml-1">
              Avatar (required)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setAvatar(e.target.files[0])}
              className="text-[13px] text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#202020] file:text-white hover:file:bg-[#272727] transition-colors cursor-pointer"
              required
            />
          </div>

          {/* Cover */}
          <div>
            <label className="block text-[13px] font-medium text-gray-400 mb-1.5 ml-1">
              Cover Image (optional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setCoverImage(e.target.files[0])}
              className="text-[13px] text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#202020] file:text-white hover:file:bg-[#272727] transition-colors cursor-pointer"
            />
          </div>

          {/* Terms */}
          <label className="flex items-center gap-2 text-[13px] text-gray-400 pt-2 hover:text-gray-300 transition-colors cursor-pointer">
            <input
              type="checkbox"
              name="agreeToTerms"
              checked={formData.agreeToTerms}
              onChange={handleChange}
              className="rounded bg-[#202020] border-[#333333] text-[#1c62b9] focus:ring-[#1c62b9] focus:ring-offset-[#121212]"
            />
            I agree to the Terms & Conditions
          </label>

          {/* Submit */}
          <button
            disabled={loading}
            className="
              w-full py-3 mt-4 rounded-xl
              bg-[#1c62b9] hover:bg-blue-600
              font-medium transition-all
              disabled:opacity-60 disabled:cursor-not-allowed
            "
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p className="mt-8 text-center text-[13px] text-gray-400">
          Already have an account?{" "}
          <a href="/login" className="text-[#1c62b9] hover:text-blue-400 font-medium transition-colors">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
