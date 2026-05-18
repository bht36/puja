import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import AuthLayout from "./shared/AuthLayout";
import { InputField, PasswordField, PasswordStrength } from "./shared/FormFields";
import { AuthButton, MessageAlert } from "./shared/AuthButton";
import { validateForm, isValid } from "../../utils/validators";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    email: "", first_name: "", last_name: "", password: "", password_confirm: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = e => setFormData(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    const errors = validateForm(formData, ['email', 'first_name', 'last_name', 'password'], ['email', 'first_name', 'last_name', 'password']);
    if (formData.password !== formData.password_confirm) errors.password_confirm = "Passwords do not match.";
    if (!isValid(errors)) { setError(Object.values(errors)[0]); return; }
    setError(""); setLoading(true);
    const result = await register(formData);
    if (result.success) navigate("/verify-otp", { state: { email: result.email } });
    else setError(result.error);
    setLoading(false);
  };

  return (
    <AuthLayout title="Create your account" subtitle="Join Puja Pasal — your spiritual home">
      {error && <MessageAlert type="error" message={error} />}

      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        <InputField label="Email address" type="email" name="email"
          value={formData.email} onChange={handleChange} placeholder="you@example.com" required />

        <div className="grid grid-cols-2 gap-3">
          <InputField label="First name" name="first_name"
            value={formData.first_name} onChange={handleChange} placeholder="First" required />
          <InputField label="Last name" name="last_name"
            value={formData.last_name} onChange={handleChange} placeholder="Last" required />
        </div>

        <div>
          <PasswordField label="Password" name="password"
            value={formData.password} onChange={handleChange} placeholder="Create a strong password" required />
          <PasswordStrength password={formData.password} />
        </div>

        <PasswordField label="Confirm password" name="password_confirm"
          value={formData.password_confirm} onChange={handleChange} placeholder="Repeat your password" required />

        <AuthButton loading={loading} type="submit">
          {loading ? "Creating account..." : "Create Account"}
        </AuthButton>
      </form>

      <p className="text-center text-sm text-[#78716C] mt-6">
        Already have an account?{" "}
        <Link to="/login" className="text-[#C28142] font-semibold hover:text-[#A66B35] transition-colors">Sign in</Link>
      </p>
    </AuthLayout>
  );
}
