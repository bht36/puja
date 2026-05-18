import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import AuthLayout from "./shared/AuthLayout";
import { InputField, PasswordField } from "./shared/FormFields";
import { AuthButton, MessageAlert } from "./shared/AuthButton";
import { validateForm, isValid } from "../../utils/validators";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const from = location.state?.from?.pathname || "/";
  const successMsg = location.state?.message || "";

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(false);

  const handleChange = e => setFormData(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    const errors = validateForm(formData, ['email', 'password']);
    if (!isValid(errors)) { setError(Object.values(errors)[0]); return; }
    setError(""); setLoading(true);
    const result = await login(formData);
    if (result.success) navigate(from, { replace: true });
    else setError(result.error);
    setLoading(false);
  };

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to your account">
      {successMsg && <MessageAlert type="success" message={successMsg} />}
      {error && <MessageAlert type="error" message={error} />}

      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        <InputField
          label="Email address"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="you@example.com"
          autoComplete="email"
          required
        />

        <PasswordField
          label="Password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter your password"
          autoComplete="current-password"
          required
        />

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={remember}
              onChange={e => setRemember(e.target.checked)}
              className="w-4 h-4 rounded border-[#E7E5E4] accent-[#C28142]"
            />
            <span className="text-sm text-[#57534E]">Remember me</span>
          </label>
          <Link to="/forgot-password" className="text-sm text-[#C28142] hover:text-[#A66B35] font-medium transition-colors">
            Forgot password?
          </Link>
        </div>

        <AuthButton loading={loading} type="submit">
          {loading ? "Signing in..." : "Sign In"}
        </AuthButton>
      </form>

      <p className="text-center text-sm text-[#78716C] mt-6">
        Don't have an account?{" "}
        <Link to="/register" className="text-[#C28142] font-semibold hover:text-[#A66B35] transition-colors">
          Create one
        </Link>
      </p>
    </AuthLayout>
  );
}
