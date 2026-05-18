import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { authAPI } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import AuthLayout from "./shared/AuthLayout";
import OTPInput from "./shared/OTPInput";
import { AuthButton, MessageAlert } from "./shared/AuthButton";

const RESEND_SECONDS = 60;

export default function VerifyOTP() {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginWithTokens } = useAuth();
  const email = location.state?.email || "";

  const [otp, setOtp] = useState(Array(6).fill(""));
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(RESEND_SECONDS);
  const [resending, setResending] = useState(false);
  const [resendMsg, setResendMsg] = useState("");

  useEffect(() => {
    if (!email) navigate("/register");
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
      const response = await authAPI.verifyOTP({ email, otp_code: code });
      loginWithTokens(response.tokens, response.user);
      navigate("/");
    } catch (err) {
      setError(err.message || "Invalid or expired OTP.");
    }
    setLoading(false);
  };

  const handleResend = async () => {
    setResending(true); setResendMsg(""); setError("");
    try {
      await authAPI.resendOTP(email);
      setResendMsg("A new code has been sent.");
      setResendTimer(RESEND_SECONDS);
      setOtp(Array(6).fill(""));
    } catch (err) {
      setError(err.message || "Failed to resend OTP.");
    }
    setResending(false);
  };

  return (
    <AuthLayout title="Verify your email" subtitle={`Enter the 6-digit code sent to ${email}`}>
      {error && <MessageAlert type="error" message={error} />}
      {resendMsg && <MessageAlert type="success" message={resendMsg} />}

      <form onSubmit={handleSubmit} className="space-y-6 mt-4">
        <OTPInput value={otp} onChange={setOtp} />

        <AuthButton loading={loading} type="submit">
          {loading ? "Verifying..." : "Verify Email"}
        </AuthButton>
      </form>

      <div className="text-center mt-5">
        {resendTimer > 0 ? (
          <p className="text-sm text-[#78716C]">
            Resend code in <span className="font-semibold text-[#C28142]">{resendTimer}s</span>
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
