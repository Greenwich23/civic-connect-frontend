/* eslint-disable no-unused-vars */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useCreateIssue } from "../hooks/useIssues.js";

const STEPS = ["Details", "Category", "Location", "Evidence"];

const CATEGORIES = [
  { key: "roads", label: "Roads & Transportation", icon: "🛣️" },
  { key: "waste", label: "Waste Management", icon: "♻️" },
  { key: "lighting", label: "Street Lighting", icon: "💡" },
  { key: "water", label: "Water", icon: "💧" },
  { key: "safety", label: "Safety", icon: "🛡️" },
  { key: "environment", label: "Environment", icon: "🌿" },
  { key: "public", label: "Public Facilities", icon: "🏛️" },
  { key: "other", label: "Other", icon: "📌" },
];

function StepIndicator({ currentStep }) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-3 sm:flex sm:items-center mb-8">
      {STEPS.map((label, i) => {
        const stepNum = i + 1;
        const isDone = stepNum < currentStep;
        const isCurrent = stepNum === currentStep;

        return (
          <div
            key={label}
            className="flex items-center sm:flex-1 sm:last:flex-none"
          >
            <div className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-700 shrink-0 ${
                  isDone || isCurrent
                    ? "bg-[#0F766E] text-white"
                    : "bg-[#E2E8F0] text-[#94A3B8]"
                }`}
              >
                {isDone ? (
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
                  stepNum
                )}
              </div>
              <span
                className={`text-[13px] ${
                  isCurrent
                    ? "font-600 text-[#0F766E]"
                    : isDone
                      ? "text-[#1E293B]"
                      : "text-[#94A3B8]"
                }`}
              >
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className="hidden sm:block flex-1 h-px bg-[#E2E8F0] mx-3" />
            )}
          </div>
        );
      })}
    </div>
  );
}

function SuccessScreen({ onViewAll, onReportAnother }) {
  return (
    <div className="max-w-lg mx-auto text-center py-16">
      <div className="w-16 h-16 rounded-full bg-[#0F766E]/10 flex items-center justify-center mx-auto mb-6">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="#0F766E"
          strokeWidth="2.5"
          className="w-8 h-8"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>

      <h2 className="font-display font-800 text-[#1E293B] text-2xl mb-2">
        Issue Reported!
      </h2>

      <p className="text-[#64748B] text-[14px] mb-5">
        Your issue has been successfully submitted to the community.
      </p>

      <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 text-[12px] font-600 px-3 py-1.5 rounded-full mb-6">
        ● Reported — Awaiting community review
      </div>

      <p className="text-[#64748B] text-[13px] mb-8 leading-relaxed">
        Other community members can now view, support, and discuss your issue.
        You'll receive notifications as it progresses.
      </p>

      <div className="flex items-center justify-center gap-3">
        <button
          onClick={onViewAll}
          className="bg-[#0F766E] hover:bg-[#115E59] text-white font-600 text-[14px] px-6 py-2.5 rounded-lg transition-colors"
        >
          View All Issues
        </button>
        <button
          onClick={onReportAnother}
          className="border border-[#E2E8F0] text-[#1E293B] font-600 text-[14px] px-6 py-2.5 rounded-lg hover:border-[#0F766E]/30 transition-colors"
        >
          Report Another
        </button>
      </div>
    </div>
  );
}

export default function ReportIssue() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    locationText: "",
    images: [],
  });

  const [imagePreviews, setImagePreviews] = useState([]);

  const navigate = useNavigate();
  const { user } = useAuth();
  const createIssue = useCreateIssue();

  const communityName = user?.community?.name || "your area";

  const updateField = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setForm((f) => ({ ...f, images: [...f.images, ...files] }));
    setImagePreviews((p) => [
      ...p,
      ...files.map((file) => URL.createObjectURL(file)),
    ]);
  };

  const removeImage = (index) => {
    setForm((f) => ({
      ...f,
      images: f.images.filter((_, i) => i !== index),
    }));
    setImagePreviews((p) => p.filter((_, i) => i !== index));
  };

  const canContinueStep1 =
    form.title.trim() && form.description.trim().length >= 20;
  const canContinueStep2 = !!form.category;
  const canContinueStep3 = true; // location defaults to home community, always valid

  const handleNext = () => {
    if (step === 1 && !canContinueStep1) return;
    if (step === 2 && !canContinueStep2) return;
    setStep((s) => s + 1);
  };

  const handleBack = () => {
    if (step === 1) {
      navigate(-1);
      return;
    }
    setStep((s) => s - 1);
  };

  const handleSubmit = async () => {
    setError("");

    const payload = new FormData();
    payload.append("title", form.title.trim());
    payload.append("description", form.description.trim());
    payload.append("category", form.category);
    payload.append("community", user?.community?._id || user?.community);
    if (form.locationText.trim()) {
      payload.append("locationText", form.locationText.trim());
    }
    form.images.forEach((file) => payload.append("images", file));

    try {
      await createIssue.mutateAsync(payload);
      setSubmitted(true);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Couldn't submit your issue. Please try again.",
      );
    }
  };

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      category: "",
      locationText: "",
      images: [],
    });
    setImagePreviews([]);
    setStep(1);
    setSubmitted(false);
    setError("");
  };

  const selectedCategory = CATEGORIES.find((c) => c.key === form.category);

  if (submitted) {
    return (
      <SuccessScreen
        onViewAll={() => navigate("/issues")}
        onReportAnother={resetForm}
      />
    );
  }

  const hasCommunity = !!(
    user?.community?._id ||
    (typeof user?.community === "string" && user.community)
  );

  // ...updateField, handleImageSelect, removeImage, canContinueStep1/2/3,
  // handleNext, handleBack, handleSubmit, resetForm, selectedCategory — all unchanged

  if (submitted) {
    return (
      <SuccessScreen
        onViewAll={() => navigate("/issues")}
        onReportAnother={resetForm}
      />
    );
  }

  // NEW GUARD — blocks direct URL access too, not just the disabled button on CitizenHome
  if (!hasCommunity) {
    return (
      <div className="max-w-md mx-auto text-center py-20">
        <div className="text-3xl mb-3">🏘️</div>
        <h2 className="font-display font-800 text-[#1E293B] text-xl mb-2">
          Join a community first
        </h2>
        <p className="text-[#64748B] text-[14px] mb-6">
          You need to be part of a community to report an issue. If you're
          waiting on a representative application, this will unlock once it's
          approved — or you can join an existing community now.
        </p>
        <button
          onClick={() => navigate("/signup/onboarding")}
          className="bg-[#0F766E] hover:bg-[#115E59] text-white font-600 text-[14px] px-6 py-2.5 rounded-lg transition-colors"
        >
          Join a Community
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <button
        onClick={handleBack}
        className="flex items-center gap-1.5 text-[#64748B] text-sm hover:text-[#1E293B] mb-6 transition-colors"
      >
        ← Back
      </button>

      <h1 className="font-display font-800 text-[#1E293B] text-2xl mb-1">
        Report a Community Issue
      </h1>
      <p className="text-[#64748B] text-sm mb-7">
        Help your community by documenting a local problem.
      </p>

      <StepIndicator currentStep={step} />

      {error && (
        <div className="mb-5 px-3.5 py-2.5 bg-red-50 border border-red-200 rounded-lg text-[13px] text-[#DC2626]">
          {error}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6">
        {/* Step 1 — Details */}
        {step === 1 && (
          <div className="space-y-5">
            <div>
              <label className="block text-[14px] font-600 text-[#1E293B] mb-2">
                What's the problem?
              </label>
              <input
                value={form.title}
                onChange={updateField("title")}
                placeholder="Give your issue a clear, descriptive title..."
                className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-[14px] text-[#1E293B] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E]"
              />
              <p className="text-[12px] text-[#94A3B8] mt-1.5">
                Example: "Broken drainage causing flooding on Ademola Street"
              </p>
            </div>

            <div>
              <label className="block text-[14px] font-600 text-[#1E293B] mb-2">
                Tell us more
              </label>
              <textarea
                value={form.description}
                onChange={updateField("description")}
                placeholder="Describe the issue in detail. When did it start? How does it affect the community? Any relevant history?"
                rows={6}
                className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-[14px] text-[#1E293B] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E] resize-none"
              />
              <p className="text-[12px] text-[#94A3B8] mt-1.5">
                {form.description.trim().length}/20 characters minimum
              </p>
            </div>
          </div>
        )}

        {/* Step 2 — Category */}
        {step === 2 && (
          <div>
            <h3 className="text-[14px] font-600 text-[#1E293B] mb-4">
              What category best describes this issue?
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => setForm((f) => ({ ...f, category: cat.key }))}
                  className={`flex flex-col items-center justify-center gap-2 p-5 rounded-xl border-2 transition-colors ${
                    form.category === cat.key
                      ? "border-[#0F766E] bg-[#0F766E]/5"
                      : "border-[#E2E8F0] hover:border-[#0F766E]/30"
                  }`}
                >
                  <span className="text-2xl">{cat.icon}</span>
                  <span className="text-[12px] font-500 text-[#1E293B] text-center leading-tight">
                    {cat.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3 — Location */}
        {step === 3 && (
          <div className="space-y-4">
            <h3 className="text-[14px] font-600 text-[#1E293B] mb-2">
              Where is this issue located?
            </h3>

            <div className="flex items-center justify-between p-4 bg-[#0F766E]/5 border border-[#0F766E]/20 rounded-xl">
              <div className="flex items-center gap-2">
                <span>📍</span>
                <div>
                  <div className="text-[13px] font-600 text-[#1E293B]">
                    Current location: {communityName}
                  </div>
                  <div className="text-[11px] text-[#64748B]">
                    Using your home community
                  </div>
                </div>
              </div>
            </div>

            <input
              value={form.locationText}
              onChange={updateField("locationText")}
              placeholder="Or enter a specific street or landmark..."
              className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-[14px] text-[#1E293B] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E]"
            />

            <div className="w-full h-48 bg-[#F1F5F9] rounded-xl flex flex-col items-center justify-center text-[#94A3B8]">
              <span className="text-2xl mb-2">🗺️</span>
              <span className="text-[13px]">Map view would appear here</span>
            </div>
          </div>
        )}

        {/* Step 4 — Evidence */}
        {step === 4 && (
          <div className="space-y-5">
            <div>
              <h3 className="text-[14px] font-600 text-[#1E293B] mb-1">
                Add photos (optional but recommended)
              </h3>
              <p className="text-[12px] text-[#64748B] mb-3">
                Visual evidence significantly increases the likelihood of
                action.
              </p>

              <label className="flex flex-col items-center justify-center gap-2 w-full h-36 border-2 border-dashed border-[#E2E8F0] rounded-xl cursor-pointer hover:border-[#0F766E]/40 hover:bg-[#0F766E]/[0.02] transition-colors">
                <span className="text-2xl">📷</span>
                <span className="text-[13px] font-500 text-[#1E293B]">
                  Upload photos
                </span>
                <span className="text-[11px] text-[#94A3B8]">
                  Click to select or drag and drop
                </span>
                <span className="text-[11px] text-[#94A3B8]">
                  JPG, PNG up to 10MB each
                </span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageSelect}
                  className="hidden"
                />
              </label>

              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mt-3">
                  {imagePreviews.map((src, i) => (
                    <div
                      key={i}
                      className="relative aspect-square rounded-lg overflow-hidden border border-[#E2E8F0]"
                    >
                      <img
                        src={src}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => removeImage(i)}
                        className="absolute top-1 right-1 bg-white/90 text-[#DC2626] text-[10px] font-700 w-5 h-5 rounded-full flex items-center justify-center"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4">
              <div className="text-[11px] font-600 text-[#94A3B8] uppercase tracking-wider mb-2">
                Issue Summary
              </div>
              <div className="space-y-1.5 text-[13px]">
                <div className="flex gap-2">
                  <span className="text-[#64748B] w-20 shrink-0">Title:</span>
                  <span className="text-[#1E293B] font-500">{form.title}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-[#64748B] w-20 shrink-0">
                    Category:
                  </span>
                  <span className="text-[#1E293B] font-500">
                    {selectedCategory?.label}
                  </span>
                </div>
                <div className="flex gap-2">
                  <span className="text-[#64748B] w-20 shrink-0">
                    Location:
                  </span>
                  <span className="text-[#1E293B] font-500">
                    {form.locationText || communityName}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer buttons */}
        <div className="flex items-center justify-between pt-6 mt-6 border-t border-[#E2E8F0]">
          <button
            onClick={handleBack}
            className="px-5 py-2.5 border border-[#E2E8F0] text-[#64748B] text-sm font-500 rounded-lg hover:border-[#0F766E]/30 hover:text-[#0F766E] transition-colors"
          >
            {step === 1 ? "Cancel" : "← Back"}
          </button>

          {step < 4 ? (
            <button
              onClick={handleNext}
              disabled={
                (step === 1 && !canContinueStep1) ||
                (step === 2 && !canContinueStep2)
              }
              className="bg-[#0F766E] hover:bg-[#115E59] text-white font-600 text-[14px] px-6 py-2.5 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Continue →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={createIssue.isPending}
              className="bg-[#0F766E] hover:bg-[#115E59] text-white font-600 text-[14px] px-6 py-2.5 rounded-lg transition-colors disabled:opacity-60"
            >
              {createIssue.isPending ? "Submitting..." : "Submit Issue"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
