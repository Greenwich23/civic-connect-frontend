/* eslint-disable no-unused-vars */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApplyForRepresentative } from "../hooks/useRepresentativeApplication";

export default function CreateCommunityRequest() {
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    communityName: "",
    yearsInCommunity: "",
    proofOfResidence: null,
    phoneNumber: "",
    nin: "",
    passportPhoto: null,
    statement: "",
  });

  const [previews, setPreviews] = useState({
    proofOfResidence: null,
    passportPhoto: null,
  });

  const update = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
  };

  const formatPhoneNumber = (digits) => {
    const parts = [];
    if (digits.length > 0) parts.push(digits.slice(0, 3));
    if (digits.length > 3) parts.push(digits.slice(3, 6));
    if (digits.length > 6) parts.push(digits.slice(6, 10));
    return parts.join(" ");
  };

  const updatePhoneNumber = (e) => {
    const digitsOnly = e.target.value.replace(/\D/g, "").slice(0, 11);
    const formatted =
      digitsOnly.length > 0 ? `+234 ${formatPhoneNumber(digitsOnly)}` : "";
    setForm((f) => ({ ...f, phoneNumber: formatted }));
  };

  const updateNIN = (e) => {
    const digitsOnly = e.target.value.replace(/\D/g, "").slice(0, 11);
    setForm((f) => ({ ...f, nin: digitsOnly }));
  };

  const updateFile = (field) => (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setForm((f) => ({ ...f, [field]: file }));
    setPreviews((p) => ({ ...p, [field]: URL.createObjectURL(file) }));
  };

  const removeFile = (field) => () => {
    setForm((f) => ({ ...f, [field]: null }));
    setPreviews((p) => ({ ...p, [field]: null }));
  };

  const applyMutation = useApplyForRepresentative();
  const [submitError, setSubmitError] = useState("");

  const handleSubmit = async () => {
    setSubmitError("");
    const payload = new FormData();
    payload.append("communityName", form.communityName);
    payload.append("yearsInCommunity", form.yearsInCommunity);
    payload.append("phoneNumber", form.phoneNumber);
    payload.append("nin", form.nin);
    payload.append("statement", form.statement);
    payload.append("proofOfResidence", form.proofOfResidence);
    payload.append("passportPhoto", form.passportPhoto);

    try {
      await applyMutation.mutateAsync(payload);
      setSubmitted(true);
    } catch (err) {
      setSubmitError(
        err.response?.data?.message ||
          "Couldn't submit your request. Please try again.",
      );
    }
  };

  const isValid =
    form.communityName &&
    form.yearsInCommunity &&
    form.nin.length === 11 &&
    form.statement &&
    form.passportPhoto &&
    form.proofOfResidence;

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto px-4 md:px-8 py-16 text-center">
        <div className="w-20 h-20 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto mb-6">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="#B45309"
            strokeWidth="2"
            className="w-10 h-10"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>

        <div className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 text-[12px] font-600 px-3 py-1 rounded-full mb-4">
          ⏳ Pending Review
        </div>

        <h2 className="font-display font-800 text-[#1E293B] text-2xl mb-2">
          Community creation request submitted
        </h2>

        <p className="text-[#64748B] text-[15px] leading-relaxed mb-6">
          Your request for{" "}
          <span className="font-600 text-[#1E293B]">{form.communityName}</span>{" "}
          is currently under review by our administration team. This process
          typically takes 2–5 business days.
        </p>

        <div className="bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] p-4 text-left mb-8">
          <div className="text-[12px] font-600 text-[#94A3B8] uppercase tracking-wider mb-3">
            What happens next
          </div>

          <div className="space-y-2">
            {[
              "Our team will verify your proof of residence and identity",
              "You will receive a notification when a decision is made",
              "If approved, your community goes live immediately",
              "If rejected, we will explain the reason so you can reapply",
            ].map((step, i) => (
              <div
                key={i}
                className="flex items-start gap-2.5 text-[13px] text-[#64748B]"
              >
                <span className="w-5 h-5 rounded-full bg-[#E2E8F0] text-[#94A3B8] font-700 text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </span>
                {step}
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => navigate("/citizen-home")}
          className="bg-[#0F766E] hover:bg-[#115E59] text-white font-600 text-sm px-6 py-2.5 rounded-xl transition-colors"
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 md:px-8 py-6 md:py-8 pt-[50px] pb-[50px]">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-[#64748B] text-sm hover:text-[#1E293B] mb-6 transition-colors"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="w-4 h-4"
        >
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
        Back
      </button>

      <div className="mb-8">
        <h1 className="font-display font-800 text-[#1E293B] text-2xl md:text-3xl mb-2">
          Create a Community
        </h1>
        <p className="text-[#64748B] text-[14px] leading-relaxed">
          Submit a request to create a new community on CivicPulse. Your
          information will be reviewed by an administrator before the community
          is created.
        </p>
      </div>

      <div className="flex gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl mb-6">
        <span className="text-xl shrink-0">ℹ️</span>
        <p className="text-[13px] text-amber-800 leading-relaxed">
          Community creation requests are manually reviewed to ensure CivicPulse
          communities are managed by genuine local residents. Approval typically
          takes 2–5 business days. You will be notified of the outcome.
        </p>
      </div>

      {submitError && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl mb-6">
          <span className="text-lg shrink-0">⚠️</span>
          <p className="text-[13px] text-[#DC2626] leading-relaxed">
            {submitError}
          </p>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 civic-shadow space-y-5">
        {/* Community Name */}
        <div>
          <label className="block text-[13px] font-600 text-[#1E293B] mb-1.5">
            Community Name <span className="text-[#DC2626]">*</span>
          </label>
          <input
            required
            value={form.communityName}
            onChange={update("communityName")}
            placeholder="e.g. Wuse Zone 5, Abuja"
            className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-[14px] text-[#1E293B] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E]"
          />
          <p className="text-[11px] text-[#94A3B8] mt-1">
            Use the commonly known local name for this area
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-[13px] font-600 text-[#1E293B] mb-1.5">
              Years in Community <span className="text-[#DC2626]">*</span>
            </label>
            <select
              value={form.yearsInCommunity}
              onChange={update("yearsInCommunity")}
              className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-[14px] text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E] appearance-none cursor-pointer"
            >
              <option value="">Select...</option>
              <option>Less than 1 year</option>
              <option>1–2 years</option>
              <option>3–5 years</option>
              <option>6–10 years</option>
              <option>More than 10 years</option>
            </select>
          </div>

          <div>
            <label className="block text-[13px] font-600 text-[#1E293B] mb-1.5">
              Phone Number <span className="text-[#DC2626]">*</span>
            </label>
            <input
              type="tel"
              inputMode="numeric"
              value={form.phoneNumber}
              onChange={updatePhoneNumber}
              placeholder="+234 800 000 0000"
              className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-[14px] text-[#1E293B] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E]"
            />
          </div>
        </div>

        <div>
          <label className="block text-[13px] font-600 text-[#1E293B] mb-1.5">
            National Identification Number (NIN){" "}
            <span className="text-[#DC2626]">*</span>
          </label>
          <input
            type="text"
            inputMode="numeric"
            value={form.nin}
            onChange={updateNIN}
            onKeyDown={(e) => {
              if (
                !/[0-9]/.test(e.key) &&
                ![
                  "Backspace",
                  "Delete",
                  "ArrowLeft",
                  "ArrowRight",
                  "Tab",
                ].includes(e.key)
              ) {
                e.preventDefault();
              }
            }}
            placeholder="Enter your 11-digit NIN"
            maxLength={11}
            className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-[14px] text-[#1E293B] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E] font-mono tracking-wider"
          />
          <p className="text-[11px] text-[#94A3B8] mt-1">
            Used for identity verification only. Stored securely and never
            shared publicly.
          </p>
        </div>

        {/* Proof of Residence */}
        <div>
          <label className="block text-[13px] font-600 text-[#1E293B] mb-1.5">
            Proof of Residence <span className="text-[#DC2626]">*</span>
          </label>

          {previews.proofOfResidence ? (
            <div className="relative w-full rounded-xl border border-[#E2E8F0] overflow-hidden">
              <img
                src={previews.proofOfResidence}
                alt="Proof of residence preview"
                className="w-full h-48 object-cover"
              />
              <button
                type="button"
                onClick={removeFile("proofOfResidence")}
                className="absolute top-2 right-2 bg-white/90 hover:bg-white text-[#DC2626] text-[12px] font-600 px-2.5 py-1 rounded-lg shadow-sm"
              >
                Remove
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center gap-2 w-full h-32 border-2 border-dashed border-[#E2E8F0] rounded-xl cursor-pointer hover:border-[#0F766E]/40 hover:bg-[#0F766E]/[0.02] transition-colors">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="#94A3B8"
                strokeWidth="2"
                className="w-6 h-6"
              >
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              <span className="text-[13px] text-[#64748B] font-500">
                Click to upload a photo
              </span>
              <span className="text-[11px] text-[#94A3B8]">
                Utility bill, tenancy agreement, or government letter — JPG or
                PNG
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={updateFile("proofOfResidence")}
                className="hidden"
              />
            </label>
          )}
        </div>

        {/* Passport Photo */}
        <div>
          <label className="block text-[13px] font-600 text-[#1E293B] mb-1.5">
            Passport Photo <span className="text-[#DC2626]">*</span>
          </label>

          {previews.passportPhoto ? (
            <div className="relative w-32 h-32 rounded-xl border border-[#E2E8F0] overflow-hidden">
              <img
                src={previews.passportPhoto}
                alt="Passport photo preview"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={removeFile("passportPhoto")}
                className="absolute top-1.5 right-1.5 bg-white/90 hover:bg-white text-[#DC2626] text-[11px] font-600 px-2 py-0.5 rounded-md shadow-sm"
              >
                Remove
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center gap-2 w-32 h-32 border-2 border-dashed border-[#E2E8F0] rounded-xl cursor-pointer hover:border-[#0F766E]/40 hover:bg-[#0F766E]/[0.02] transition-colors">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="#94A3B8"
                strokeWidth="2"
                className="w-6 h-6"
              >
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21v-1a8 8 0 0116 0v1" />
              </svg>
              <span className="text-[11px] text-[#64748B] font-500 text-center px-2">
                Upload photo
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={updateFile("passportPhoto")}
                className="hidden"
              />
            </label>
          )}
        </div>

        {/* Statement */}
        <div>
          <label className="block text-[13px] font-600 text-[#1E293B] mb-1.5">
            Statement / Reason for Creating this Community{" "}
            <span className="text-[#DC2626]">*</span>
          </label>
          <textarea
            value={form.statement}
            onChange={update("statement")}
            placeholder="Explain why you want to create this community on CivicPulse, what issues affect it, and how you plan to help manage it..."
            rows={5}
            className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-[14px] text-[#1E293B] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E] resize-none"
          />
          <p className="text-[11px] text-[#94A3B8] mt-1">
            Minimum 100 characters. Be specific about the community and your
            connection to it.
          </p>
        </div>

        <div className="pt-2 border-t border-[#E2E8F0]">
          <p className="text-[12px] text-[#94A3B8] mb-4">
            By submitting this form, you confirm that all information provided
            is accurate and truthful. Providing false information may result in
            rejection and account suspension.
          </p>

          <div className="flex gap-3">
            <button
              onClick={() => navigate(-1)}
              className="px-5 py-2.5 border border-[#E2E8F0] text-[#64748B] text-sm font-500 rounded-xl hover:border-[#0F766E]/30 hover:text-[#0F766E] transition-colors"
            >
              Cancel
            </button>

            <button
              onClick={handleSubmit}
              disabled={!isValid || applyMutation.isPending}
              className="flex-1 bg-[#0F766E] hover:bg-[#115E59] text-white font-600 text-[14px] py-2.5 rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {applyMutation.isPending
                ? "Submitting..."
                : "Submit Community Request"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
