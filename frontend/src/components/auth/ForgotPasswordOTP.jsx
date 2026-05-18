import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { authAPI } from "../../services/api";
import AuthLayout from "./shared/AuthLayout";
import OTPInput from "./shared/OTPInput";
import { AuthButton, MessageAlert } from "./shared/AuthButton";

const RESEND_SECONDS = 60;

export default function ForgotPasswordOTP() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";

  const [otp, setOtp] = useState(Array(6).fill(""));
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(RESEND_SECONDS);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (!email) navigate("/forgot-password");
  }, [email]);

  useEffect(() => {
    if (resendTimer <= 0) return;
    const t = setTimeout(() => setResendTimer(p => p - 1), 1000);
    return () => clearTimeout(t);
  }, [resendTimer]);

  const handleSubmit = async e => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length !== 6) { setError("Please enter all 6 digits."); return; }
    setError(""); setLoading(true);
    try {
      const res = await authAPI.verifyResetOTP({ email, otp_code: code });
      navigate("/reset-password-new", { state: { email, reset_token: res.reset_token } });
    } catch (err) {
      setError(err.message || "Invalid or expired OTP.");
    }
    setLoading(false);
  };

  const handleResend = async () => {
    setResending(true); setError("");
    try {
      await authAPI.forgotPassword(email);
      setResendTimer(RESEND_SECONDS);
      setOtp(Array(6).fill(""));
    } catch (err) {
      setError(err.message || "Failed to resend.");
    }
    setResending(false);
  };

  return (
    <AuthLayout title="Enter verification code" subtitle={`A 6-digit code was sent to ${email}`}>
      {error && <MessageAlert type="error" message={error} />}

      <form onSubmit={handleSubmit} className="space-y-6 mt-4">
        <OTPInput value={otp} onChange={setOtp} />

        <AuthButton loading={loading} type="submit">
          {loading ? "Verifying..." : "Verify Code"}
        </AuthButton>
      </form>

      <div className="text-center mt-5">
        {resendTimer > 0 ? (
          <p className="text-sm text-[#78716C]">
            Resend in <span className="font-semibold text-[#C28142]">{resendTimer}s</span>
          </p>
        ) : (
          <button
            onClick={handleResend}
            disabled={resending}
            className="text-sm text-[#C28142] font-semibold hover:text-[#A66B35] transition-colors disabled:opacity-50"
          >
            {resending ? "Sending..." : "Resend code"}
          </button>
        )}
      </div>
    </AuthLayout>
  );
}
