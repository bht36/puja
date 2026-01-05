import { useState } from "react";
import { Button } from "../common/Button";
import { Link, useNavigate } from "react-router-dom";
import { authAPI } from "../../services/api";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await authAPI.forgotPassword(email);
      navigate("/forgot-password-otp", { state: { email } });
    } catch (err) {
      setError(err.message || "Something went wrong");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Forgot Password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your registered email to receive OTP
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {error && (
            <div className="text-red-500 text-center text-sm">{error}</div>
          )}

          <div>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <Button type="submit" disabled={loading} fullWidth>{loading ? "Sending..." : "Send OTP"}</Button>

          <div className="text-center">
            <Link to="/login" className="text-blue-600 hover:text-blue-500">
              Back to Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
