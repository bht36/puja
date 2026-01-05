import { useState } from "react";
import { Button } from "../common/Button";
import { useNavigate, useLocation } from "react-router-dom";
import { authAPI } from "../../services/api";

export default function ResetPasswordNew() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== passwordConfirm) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);
    try {
      await authAPI.resetPassword({ email, password, password_confirm: passwordConfirm });
      navigate("/login", { state: { message: "Password reset successful! Please login." } });
    } catch (err) {
      setError(err.message || "Something went wrong");
    }
    setLoading(false);
  };

  if (!email) {
    navigate("/forgot-password");
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Set New Password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Create a new password for your account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {error && (
            <div className="text-red-500 text-center text-sm">{error}</div>
          )}

          <div className="space-y-4">
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="New Password"
              className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              type="password"
              required
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              placeholder="Confirm New Password"
              className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <Button type="submit" disabled={loading} fullWidth>{loading ? "Resetting..." : "Reset Password"}</Button>
        </form>
      </div>
    </div>
  );
}
