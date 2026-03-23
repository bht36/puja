import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const from = location.state?.from?.pathname || "/";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await login(formData);
    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-[#0F0C08]">
      {/* Cinematic Spiritual Background */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=1600&h=900&fit=crop&crop=center"
          alt="Spiritual backdrop"
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#0F0C08]/80 via-[#1a0e05]/60 to-[#0F0C08]/90" />
      </div>

      {/* Glowing orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#D97706]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-red-800/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-900/5 rounded-full blur-[150px] pointer-events-none" />

      {/* Glassmorphic Card */}
      <div className="relative z-10 w-full max-w-md mx-4">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#D97706] to-red-600 shadow-[0_8px_30px_rgba(217,119,6,0.4)] mb-4">
            <span className="text-white text-2xl font-bold">P</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight" style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}>
            पूजा पसल
          </h1>
          <p className="text-[#A8A29E] text-sm mt-1 font-medium">Your Sacred Spiritual Store</p>
        </div>

        <div className="bg-white/8 backdrop-blur-2xl border border-white/10 rounded-[32px] p-8 shadow-[0_32px_80px_rgba(0,0,0,0.5)]">
          <h2 className="text-2xl font-bold text-white mb-1">Welcome back</h2>
          <p className="text-[#A8A29E] text-sm mb-8">
            New here?{" "}
            <Link to="/register" className="text-[#D97706] hover:text-[#F59E0B] font-semibold transition-colors">
              Create an account
            </Link>
          </p>

          {error && (
            <div className="mb-6 px-4 py-3 rounded-2xl bg-red-900/30 border border-red-700/50 text-red-300 text-sm font-medium flex items-center gap-3">
              <span className="text-red-400">⚠</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-[#D6D3D1] mb-2">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="you@example.com"
                className="w-full px-4 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-[#6B7280] focus:outline-none focus:border-[#D97706]/60 focus:bg-white/8 transition-all text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#D6D3D1] mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Enter your password"
                  className="w-full px-4 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-[#6B7280] focus:outline-none focus:border-[#D97706]/60 focus:bg-white/8 transition-all text-sm pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#78716C] hover:text-[#D97706] transition-colors"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  )}
                </button>
              </div>
            </div>

            <div className="text-right">
              <Link to="/forgot-password" className="text-sm text-[#D97706] hover:text-[#F59E0B] font-medium transition-colors">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#D97706] to-red-600 text-white font-bold text-base tracking-wide hover:from-[#B45309] hover:to-red-700 active:scale-[0.98] transition-all shadow-[0_8px_30px_rgba(217,119,6,0.35)] hover:shadow-[0_8px_30px_rgba(217,119,6,0.5)] disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-3">
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                  Signing in...
                </span>
              ) : "Sign In"}
            </button>
          </form>
        </div>

        <p className="text-center text-[#57534E] text-xs mt-6">
          🙏 Connecting souls with sacred traditions
        </p>
      </div>
    </div>
  );
}
