import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function Logo() {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate("/")}
      className="flex items-center gap-2.5 mb-8"
    >
      <div className="w-8 h-8 rounded-lg bg-[#0F766E] flex items-center justify-center">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="w-4.5 h-4.5 text-white"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      </div>
      <span className="font-display font-800 text-[#1E293B] text-[15px] tracking-tight">
        CivicPulse
      </span>
    </button>
  );
}

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const { resetPassword } = useAuth();

  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    setError("");

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await resetPassword({ token, newPassword });
      setSubmitted(true);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Couldn't reset your password. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#F8FAFC] pt-[50px] pb-[50px]">
      <div className="w-full max-w-md">
        <Logo />

        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 sm:p-8 civic-shadow">
          {!token ? (
            <>
              <h1 className="font-display font-800 text-[#1E293B] text-2xl mb-1">
                Invalid reset link
              </h1>
              <p className="text-[#64748B] text-sm mb-7">
                This link is missing its reset token. Request a new one to
                continue.
              </p>
              <button
                onClick={() => navigate("/forgot-password")}
                className="w-full bg-[#0F766E] hover:bg-[#115E59] text-white font-600 text-[14px] py-3 rounded-lg transition-colors"
              >
                Request New Link
              </button>
            </>
          ) : submitted ? (
            <>
              <div className="w-16 h-16 rounded-full bg-green-50 border border-green-200 flex items-center justify-center mx-auto mb-5">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#15803D"
                  strokeWidth="2"
                  className="w-8 h-8"
                >
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
              <h1 className="font-display font-800 text-[#1E293B] text-2xl mb-1 text-center">
                Password reset
              </h1>
              <p className="text-[#64748B] text-sm mb-7 text-center">
                Your password has been reset successfully. You can now log in
                with your new password.
              </p>
              <button
                onClick={() => navigate("/login")}
                className="w-full bg-[#0F766E] hover:bg-[#115E59] text-white font-600 text-[14px] py-3 rounded-lg transition-colors"
              >
                Go to Log In
              </button>
            </>
          ) : (
            <>
              <h1 className="font-display font-800 text-[#1E293B] text-2xl mb-1">
                Reset your password
              </h1>
              <p className="text-[#64748B] text-sm mb-7">
                Choose a new password for your account.
              </p>

              {error && (
                <div className="mb-5 px-3.5 py-2.5 bg-red-50 border border-red-200 rounded-lg text-[13px] text-[#DC2626]">
                  {error}
                </div>
              )}

              <div className="space-y-4" onKeyDown={handleKeyDown}>
                <div>
                  <label className="block text-[13px] font-500 text-[#1E293B] mb-1.5">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    className="w-full px-3.5 py-2.5 bg-white border border-[#E2E8F0] rounded-lg text-[14px] text-[#1E293B] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E]"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-500 text-[#1E293B] mb-1.5">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    placeholder="Repeat new password"
                    className="w-full px-3.5 py-2.5 bg-white border border-[#E2E8F0] rounded-lg text-[14px] text-[#1E293B] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E]"
                  />
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="mt-6 w-full bg-[#0F766E] hover:bg-[#115E59] text-white font-600 text-[14px] py-3 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
