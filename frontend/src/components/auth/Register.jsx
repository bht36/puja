import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    first_name: "",
    last_name: "",
    password: "",
    password_confirm: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await register(formData);
    if (result.success) {
      navigate("/verify-otp", { state: { email: result.email } });
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const InputField = ({ label, name, type = "text", placeholder, required = false }) => (
    <div>
      <label className="block text-sm font-semibold text-[#D6D3D1] mb-2">{label}</label>
      <input
        type={type}
        name={name}
        value={formData[name]}
        onChange={handleChange}
        required={required}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-[#6B7280] focus:outline-none focus:border-[#D97706]/60 focus:bg-white/8 transition-all text-sm"
      />
    </div>
  );

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-[#0F0C08] py-8 px-4">
      {/* Cinematic Spiritual Background */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=1600&h=900&fit=crop&crop=center"
          alt="Spiritual backdrop"
          className="w-full h-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#0F0C08]/85 via-[#1a0e05]/65 to-[#0F0C08]/90" />
      </div>

      {/* Glowing orbs */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#D97706]/8 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-red-800/8 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-lg">
        {/* Logo */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#D97706] to-red-600 shadow-[0_8px_30px_rgba(217,119,6,0.4)] mb-3">
            <span className="text-white text-xl font-bold">P</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight" style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}>
            पूजा पसल
          </h1>
          <p className="text-[#A8A29E] text-xs mt-1">Begin your sacred journey</p>
        </div>

        <div className="bg-white/8 backdrop-blur-2xl border border-white/10 rounded-[32px] p-8 shadow-[0_32px_80px_rgba(0,0,0,0.5)]">
          <h2 className="text-2xl font-bold text-white mb-1">Create account</h2>
          <p className="text-[#A8A29E] text-sm mb-6">
            Already have one?{" "}
            <Link to="/login" className="text-[#D97706] hover:text-[#F59E0B] font-semibold transition-colors">
              Sign in
            </Link>
          </p>

          {error && (
            <div className="mb-5 px-4 py-3 rounded-2xl bg-red-900/30 border border-red-700/50 text-red-300 text-sm font-medium flex items-center gap-3">
              <span className="text-red-400">⚠</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <InputField label="Email Address" name="email" type="email" placeholder="you@example.com" required />
            <InputField label="Username" name="username" placeholder="Choose a username" required />

            <div className="grid grid-cols-2 gap-4">
              <InputField label="First Name" name="first_name" placeholder="First name" required />
              <InputField label="Last Name" name="last_name" placeholder="Last name" required />
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
                  placeholder="Create a strong password"
                  className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-[#6B7280] focus:outline-none focus:border-[#D97706]/60 transition-all text-sm pr-12"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#78716C] hover:text-[#D97706] transition-colors">
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#D6D3D1] mb-2">Confirm Password</label>
              <input
                type="password"
                name="password_confirm"
                value={formData.password_confirm}
                onChange={handleChange}
                required
                placeholder="Confirm your password"
                className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-[#6B7280] focus:outline-none focus:border-[#D97706]/60 transition-all text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#D97706] to-red-600 text-white font-bold text-base tracking-wide hover:from-[#B45309] hover:to-red-700 active:scale-[0.98] transition-all shadow-[0_8px_30px_rgba(217,119,6,0.35)] hover:shadow-[0_8px_30px_rgba(217,119,6,0.5)] disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-3">
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                  Creating account...
                </span>
              ) : "Create Account"}
            </button>
          </form>
        </div>

        <p className="text-center text-[#57534E] text-xs mt-5">
          🙏 Connecting souls with sacred traditions
        </p>
      </div>
    </div>
  );
}
