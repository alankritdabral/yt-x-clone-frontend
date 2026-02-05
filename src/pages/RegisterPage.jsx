import { useState } from "react";
import { useNavigate } from "react-router-dom";

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

    if (!avatar) {
      return setError("Avatar is required");
    }

    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match");
    }

    if (!formData.agreeToTerms) {
      return setError("Please agree to terms");
    }

    try {
      setLoading(true);

      const data = new FormData();
      data.append("fullName", formData.fullName);
      data.append("username", formData.username);
      data.append("email", formData.email);
      data.append("password", formData.password);
      data.append("avatar", avatar);

      if (coverImage) {
        data.append("coverImage", coverImage);
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/users/register`,
        {
          method: "POST",
          body: data,
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Registration failed");
      }

      alert("Account created successfully!");
      navigate("/login");
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen overflow-hidden flex items-center justify-center bg-[#F6F0D7] px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 overflow-y-auto max-h-[95vh]">
        <h1 className="text-2xl font-bold text-center mb-6">
          Join <span className="text-red-600">YT-X</span>
        </h1>

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-100 px-4 py-2 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Full Name
            </label>
            <input
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter full name"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
              required
            />
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Username
            </label>
            <input
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Choose username"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create password"
                className="w-full px-4 py-2 border rounded-lg pr-10 focus:ring-2 focus:ring-red-500 outline-none"
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Confirm Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm password"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
              required
            />
          </div>

          {/* Avatar */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Avatar (required)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setAvatar(e.target.files[0])}
              required
            />
          </div>

          {/* Cover */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Cover Image (optional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setCoverImage(e.target.files[0])}
            />
          </div>

          {/* Terms */}
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="agreeToTerms"
              checked={formData.agreeToTerms}
              onChange={handleChange}
            />
            Agree to Terms & Conditions
          </label>

          {/* Submit */}
          <button
            disabled={loading}
            className="w-full py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm">
          Already have an account?{" "}
          <a href="/login" className="text-red-600 hover:underline">
            Login here
          </a>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
