import { useState } from "react";
import { useNavigate } from "react-router-dom";
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

export default function ForgotPassword() {
  const navigate = useNavigate();
  const { forgotPassword } = useAuth();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    setError("");

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      await forgotPassword(email.trim().toLowerCase());
      setSubmitted(true);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Something went wrong. Please try again.",
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
          {submitted ? (
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
                Check your email
              </h1>
              <p className="text-[#64748B] text-sm mb-7 text-center leading-relaxed">
                If an account exists for{" "}
                <span className="font-600 text-[#1E293B]">{email}</span>,
                we've sent a link to reset your password. It expires in 30
                minutes.
              </p>
              <button
                onClick={() => navigate("/login")}
                className="w-full bg-[#0F766E] hover:bg-[#115E59] text-white font-600 text-[14px] py-3 rounded-lg transition-colors"
              >
                Back to Log In
              </button>
            </>
          ) : (
            <>
              <h1 className="font-display font-800 text-[#1E293B] text-2xl mb-1">
                Forgot your password?
              </h1>
              <p className="text-[#64748B] text-sm mb-7">
                Enter the email address on your account and we'll send you a
                link to reset your password.
              </p>

              {error && (
                <div className="mb-5 px-3.5 py-2.5 bg-red-50 border border-red-200 rounded-lg text-[13px] text-[#DC2626]">
                  {error}
                </div>
              )}

              <div onKeyDown={handleKeyDown}>
                <label className="block text-[13px] font-500 text-[#1E293B] mb-1.5">
                  Email address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-3.5 py-2.5 bg-white border border-[#E2E8F0] rounded-lg text-[14px] text-[#1E293B] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E]"
                />
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="mt-6 w-full bg-[#0F766E] hover:bg-[#115E59] text-white font-600 text-[14px] py-3 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>

              <p className="text-center text-[13px] text-[#64748B] mt-6">
                <button
                  onClick={() => navigate("/login")}
                  className="text-[#0F766E] font-600 hover:underline"
                >
                  ← Back to Log In
                </button>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
