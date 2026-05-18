import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import AuthLayout from "./shared/AuthLayout";
import { InputField } from "./shared/FormFields";
import { AuthButton, MessageAlert } from "./shared/AuthButton";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!email || !/\S+@\S+\.\S+/.test(email)) { setError("Enter a valid email address."); return; }
    setError(""); setLoading(true);
    const result = await forgotPassword(email);
    if (result.success) navigate("/forgot-password-otp", { state: { email } });
    else setError(result.error);
    setLoading(false);
  };

  return (
    <AuthLayout title="Forgot password?" subtitle="We'll send a verification code to your email">
      {error && <MessageAlert type="error" message={error} />}

      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        <InputField
          label="Email address"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
        />

        <AuthButton loading={loading} type="submit">
          {loading ? "Sending..." : "Send Verification Code"}
        </AuthButton>
      </form>

      <p className="text-center text-sm text-[#78716C] mt-6">
        <Link to="/login" className="text-[#C28142] font-semibold hover:text-[#A66B35] transition-colors">
          ← Back to sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
