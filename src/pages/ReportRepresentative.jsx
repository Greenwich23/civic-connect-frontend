import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useReportRepresentative } from "../hooks/useRepresentativeReport";

const DETAILS_MIN_LENGTH = 20;

const REASONS = [
  { key: "inactive", label: "Inactive", description: "Not responding to or acting on issues" },
  { key: "inappropriate_conduct", label: "Inappropriate Conduct", description: "Disrespectful or unprofessional behavior" },
  { key: "false_resolution", label: "False Resolution", description: "Marked an issue resolved without actually fixing it" },
  { key: "identity_concern", label: "Identity Concern", description: "Doubts about who this person really is" },
  { key: "other", label: "Other", description: "Something else" },
];

export default function ReportRepresentative() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const communityId = searchParams.get("community");

  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const { mutate, isPending, error } = useReportRepresentative();

  const errorMessage = error?.response?.data?.message;

  const canSubmit =
    !!communityId && !!reason && details.trim().length >= DETAILS_MIN_LENGTH;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canSubmit) return;

    mutate(
      { communityId, reason, details: details.trim() },
      { onSuccess: () => setSubmitted(true) },
    );
  };

  if (!communityId) {
    return (
      <div className="max-w-lg mx-auto">
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 text-center">
          <div className="text-2xl mb-2">⚠️</div>
          <p className="text-[14px] font-600 text-[#1E293B] mb-1">
            No community specified
          </p>
          <p className="text-[13px] text-[#64748B] mb-4">
            Go to your community page and use the Report link there.
          </p>
          <button
            onClick={() => navigate("/citizen-home")}
            className="text-[13px] font-600 text-[#0F766E] hover:underline"
          >
            Back to home
          </button>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto">
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 text-center">
          <div className="text-3xl mb-3">✅</div>
          <p className="text-[15px] font-600 text-[#1E293B] mb-1">
            Report submitted
          </p>
          <p className="text-[13px] text-[#64748B] mb-5">
            An admin will review this report. You'll be notified once it's
            been looked at.
          </p>
          <button
            onClick={() => navigate(`/communities/${communityId}`)}
            className="bg-[#0F766E] hover:bg-[#115E59] text-white text-[13px] font-600 px-4 py-2.5 rounded-lg transition-colors"
          >
            Back to community
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="font-display font-800 text-[#1E293B] text-2xl mb-1">
        Report Representative
      </h1>
      <p className="text-[13px] text-[#64748B] mb-6">
        Tell us what's wrong. Reports are reviewed by an admin, not shown
        publicly.
      </p>

      {errorMessage && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl mb-4">
          <span className="text-lg shrink-0">⚠️</span>
          <p className="text-[13px] text-[#DC2626] leading-relaxed">
            {errorMessage}
          </p>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl border border-[#E2E8F0] p-6 space-y-5"
      >
        <div>
          <label className="block text-[13px] font-600 text-[#1E293B] mb-2">
            Reason
          </label>
          <div className="space-y-2">
            {REASONS.map((r) => (
              <button
                key={r.key}
                type="button"
                onClick={() => setReason(r.key)}
                className={`w-full text-left px-3.5 py-2.5 rounded-lg border transition-colors ${
                  reason === r.key
                    ? "border-[#0F766E] bg-[#0F766E]/5"
                    : "border-[#E2E8F0] hover:border-[#0F766E]/40"
                }`}
              >
                <div className="text-[13px] font-600 text-[#1E293B]">
                  {r.label}
                </div>
                <div className="text-[12px] text-[#64748B]">
                  {r.description}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-[13px] font-600 text-[#1E293B] mb-2">
            Details
          </label>
          <textarea
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            rows={5}
            placeholder="Describe what happened..."
            className="w-full px-3.5 py-2.5 bg-white border border-[#E2E8F0] rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E] resize-none"
          />
          <div
            className={`text-[11px] mt-1 ${
              details.trim().length < DETAILS_MIN_LENGTH
                ? "text-[#94A3B8]"
                : "text-green-700"
            }`}
          >
            {details.trim().length}/{DETAILS_MIN_LENGTH} characters minimum
          </div>
        </div>

        <button
          type="submit"
          disabled={!canSubmit || isPending}
          className="w-full bg-[#0F766E] hover:bg-[#115E59] text-white text-[13px] font-600 px-4 py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? "Submitting..." : "Submit Report"}
        </button>
      </form>
    </div>
  );
}
