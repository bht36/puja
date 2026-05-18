import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { authAPI } from "../../services/api";
import AuthLayout from "./shared/AuthLayout";
import { PasswordField, PasswordStrength } from "./shared/FormFields";
import { AuthButton, MessageAlert } from "./shared/AuthButton";

export default function ResetPasswordNew() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";
  const reset_token = location.state?.reset_token || "";

  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!email || !reset_token) navigate("/forgot-password");
  }, [email, navigate]);

  const validate = () => {
    if (password.length < 8) return "Password must be at least 8 characters.";
    if (password !== passwordConfirm) return "Passwords do not match.";
    return "";
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }
    setError(""); setLoading(true);
    try {
      await authAPI.resetPassword({ email, password, password_confirm: passwordConfirm, reset_token });
      navigate("/login", { state: { message: "Password reset successful! Please sign in." } });
    } catch (err) {
      setError(err.message || "Something went wrong.");
    }
    setLoading(false);
  };

  return (
    <AuthLayout title="Set new password" subtitle="Create a strong password for your account">
      {error && <MessageAlert type="error" message={error} />}

      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        <div>
          <PasswordField
            label="New password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="At least 8 characters"
            required
          />
          <PasswordStrength password={password} />
        </div>

        <PasswordField
          label="Confirm new password"
          value={passwordConfirm}
          onChange={e => setPasswordConfirm(e.target.value)}
          placeholder="Repeat your password"
          required
        />

        <AuthButton loading={loading} type="submit">
          {loading ? "Resetting..." : "Reset Password"}
        </AuthButton>
      </form>
    </AuthLayout>
  );
}
