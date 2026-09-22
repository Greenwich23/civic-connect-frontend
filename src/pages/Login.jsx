import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { getHomePath } from "../utils/constants";

function Logo({ onNavigate }) {
  return (
    <button
      onClick={() => onNavigate("landing")}
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

function InputField({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  name,
  rightSlot,
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-[13px] font-500 text-[#1E293B]">{label}</label>
        {rightSlot}
      </div>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full px-3.5 py-2.5 bg-white border rounded-lg text-[14px] text-[#1E293B] placeholder-[#94A3B8] focus:outline-none focus:ring-2 transition-colors ${
          error
            ? "border-[#DC2626] focus:ring-[#DC2626]/20 focus:border-[#DC2626]"
            : "border-[#E2E8F0] focus:ring-[#0F766E]/20 focus:border-[#0F766E]"
        }`}
      />
      {error && <p className="text-[12px] text-[#DC2626] mt-1">{error}</p>}
    </div>
  );
}

export default function Login({ onNavigate }) {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const updateField = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    if (errors[field]) {
      setErrors((err) => ({ ...err, [field]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!form.email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!form.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    setServerError("");
    if (!validate()) return;

    setLoading(true);
    try {
      const data = await login({
        email: form.email.trim().toLowerCase(),
        password: form.password,
      });
      navigate(getHomePath(data.user.role));
    } catch (err) {
      setServerError(
        err.response?.data?.message || "Invalid email or password",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <div className="min-h-full flex items-center justify-center p-4 bg-[#F8FAFC] pt-[50px] pb-[50px]">
      <div className="w-full max-w-md">
        <Logo onNavigate={onNavigate} />

        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-8 civic-shadow">
          <h1 className="font-display font-800 text-[#1E293B] text-2xl mb-1">
            Welcome back
          </h1>
          <p className="text-[#64748B] text-sm mb-8">
            Log in to your community account
          </p>

          {serverError && (
            <div className="mb-5 px-3.5 py-2.5 bg-red-50 border border-red-200 rounded-lg text-[13px] text-[#DC2626]">
              {serverError}
            </div>
          )}

          <div className="space-y-4" onKeyDown={handleKeyDown}>
            <InputField
              label="Email address"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={updateField("email")}
              error={errors.email}
            />

            <InputField
              label="Password"
              type="password"
              name="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={updateField("password")}
              error={errors.password}
              rightSlot={
                <button
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                  className="text-[12px] text-[#0F766E] hover:underline"
                >
                  Forgot password?
                </button>
              }
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="mt-6 w-full bg-[#0F766E] hover:bg-[#115E59] text-white font-600 text-[14px] py-3 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Log In"}
          </button>

          <p className="text-center text-[13px] text-[#64748B] mt-6">
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/signup")}
              className="text-[#0F766E] font-600 hover:underline cursor-pointer"
            >
              Create one
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
