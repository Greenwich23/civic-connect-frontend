import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

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
}) {
  return (
    <div>
      <label className="block text-[13px] font-500 text-[#1E293B] mb-1.5">
        {label}
      </label>
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

function OptionCard({ icon, title, description, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
        selected
          ? "border-[#0F766E] bg-[#0F766E]/5"
          : "border-[#E2E8F0] hover:border-[#0F766E]/30 hover:bg-[#F8FAFC]"
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg shrink-0 ${
            selected ? "bg-[#0F766E] text-white" : "bg-[#F8FAFC] text-[#64748B]"
          }`}
        >
          {icon}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="font-600 text-[#1E293B] text-[14px]">{title}</h3>
            {selected && (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="#0F766E"
                strokeWidth="2.5"
                className="w-4 h-4"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
          </div>
          <p className="text-[11px] text-[#64748B] mt-1 leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </button>
  );
}

export default function Signup({ onNavigate }) {
  const [step, setStep] = useState(1);
  const [intent, setIntent] = useState("");
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  const navigate = useNavigate();
  const { register } = useAuth();

  const updateField = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    // clear that field's error as soon as they start correcting it
    if (errors[field]) {
      setErrors((err) => ({ ...err, [field]: "" }));
    }
  };

  const validateStep1 = () => {
    const newErrors = {};

    if (!form.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!form.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(form.password)) {
      newErrors.password =
        "Password must include an uppercase letter, a lowercase letter, and a number";
    }

    if (!form.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (form.confirmPassword !== form.password) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = async () => {
    setServerError("");

    if (step === 1) {
      if (!validateStep1()) return;
      setStep(2);
      return;
    }

    // Step 2 — create the account now, then route based on intent
    if (!intent) return;

    setLoading(true);
    try {
      await register({
        name: `${form.firstName.trim()} ${form.lastName.trim()}`,
        email: form.email.trim().toLowerCase(),
        password: form.password,
      });

      if (intent === "join") navigate("/signup/onboarding");
      if (intent === "create") navigate("/signup/community-request");
      if (intent === "representative") navigate("/representative-request");
    } catch (err) {
      setServerError(
        err.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-full flex items-center justify-center p-4 bg-[#F8FAFC] pt-[50px] pb-[50px]">
      <div className="w-full max-w-lg">
        <Logo onNavigate={onNavigate} />

        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-8 civic-shadow">
          {/* Progress */}
          <div className="flex items-center gap-2 mb-7">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center ${
                step >= 1
                  ? "bg-[#0F766E] text-white"
                  : "bg-[#E2E8F0] text-[#94A3B8]"
              }`}
            >
              {step > 1 ? (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="3"
                  className="w-3.5 h-3.5"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                <span className="text-[10px] font-700">1</span>
              )}
            </div>
            <div className="flex-1 h-px bg-[#E2E8F0]" />
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center ${
                step >= 2
                  ? "bg-[#0F766E] text-white"
                  : "bg-[#E2E8F0] text-[#94A3B8]"
              }`}
            >
              <span className="text-[10px] font-700">2</span>
            </div>
            <div
              className={`text-[11px] ${
                step >= 2 ? "text-[#0F766E] font-600" : "text-[#94A3B8]"
              }`}
            >
              Choose how you'll participate
            </div>
          </div>

          {serverError && (
            <div className="mb-5 px-3.5 py-2.5 bg-red-50 border border-red-200 rounded-lg text-[13px] text-[#DC2626]">
              {serverError}
            </div>
          )}

          {step === 1 && (
            <>
              <h1 className="font-display font-800 text-[#1E293B] text-2xl mb-1">
                Create your CivicPulse account
              </h1>
              <p className="text-[#64748B] text-sm mb-7">
                Create an account first. You can decide how you want to
                participate next.
              </p>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <InputField
                    label="First Name"
                    name="firstName"
                    placeholder="Amara"
                    value={form.firstName}
                    onChange={updateField("firstName")}
                    error={errors.firstName}
                  />
                  <InputField
                    label="Last Name"
                    name="lastName"
                    placeholder="Okafor"
                    value={form.lastName}
                    onChange={updateField("lastName")}
                    error={errors.lastName}
                  />
                </div>

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
                  placeholder="Choose a strong password"
                  value={form.password}
                  onChange={updateField("password")}
                  error={errors.password}
                />

                <InputField
                  label="Confirm Password"
                  type="password"
                  name="confirmPassword"
                  placeholder="Repeat your password"
                  value={form.confirmPassword}
                  onChange={updateField("confirmPassword")}
                  error={errors.confirmPassword}
                />
              </div>

              <button
                onClick={handleContinue}
                className="mt-6 w-full bg-[#0F766E] hover:bg-[#115E59] text-white font-600 text-[14px] py-3 rounded-lg transition-colors"
              >
                Continue
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <h1 className="font-display font-800 text-[#1E293B] text-2xl mb-1">
                How do you want to participate?
              </h1>
              <p className="text-[#64748B] text-sm mb-6">
                Choose what you'd like to do on CivicPulse. You can change your
                community or role later.
              </p>

              <div className="space-y-3">
                <OptionCard
                  icon="🏘️"
                  title="Join a Community"
                  description="Join an existing approved community and participate in local discussions, report issues, and support solutions."
                  selected={intent === "join"}
                  onClick={() => setIntent("join")}
                />
                <OptionCard
                  icon="🏗️"
                  title="Create a Community"
                  description="Request to create a new community that isn't currently available on CivicPulse."
                  selected={intent === "create"}
                  onClick={() => setIntent("create")}
                />
                <OptionCard
                  icon="🏛️"
                  title="Become a Representative"
                  description="Request representative access for an existing community. Your request will be reviewed before approval."
                  selected={intent === "representative"}
                  onClick={() => setIntent("representative")}
                />
              </div>

              <button
                onClick={handleContinue}
                disabled={!intent || loading}
                className="mt-6 w-full bg-[#0F766E] hover:bg-[#115E59] text-white font-600 text-[14px] py-3 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {loading
                  ? "Creating your account..."
                  : intent === "join"
                    ? "Choose a Community"
                    : intent === "create"
                      ? "Create Community Request"
                      : intent === "representative"
                        ? "Request Representative Access"
                        : "Choose an Option to Continue"}
              </button>

              <button
                onClick={() => setStep(1)}
                disabled={loading}
                className="w-full mt-3 text-[13px] text-[#64748B] hover:text-[#0F766E] transition-colors"
              >
                ← Back
              </button>
            </>
          )}

          <p className="text-center text-[13px] text-[#64748B] mt-6">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-[#0F766E] font-600 hover:underline"
            >
              Log in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
