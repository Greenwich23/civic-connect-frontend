import { useState } from "react";
import {
  useResolutionStats,
  useMyResolutionFeedback,
  useSubmitResolutionFeedback,
} from "../../hooks/useResolution";

const VERDICT_OPTIONS = [
  {
    value: "fixed",
    label: "The problem has been fixed",
    icon: "✅",
  },
  {
    value: "partially_fixed",
    label: "Partially fixed",
    icon: "🟡",
  },
  {
    value: "still_exists",
    label: "The problem still exists",
    icon: "❌",
  },
];

const VERDICT_LABELS = {
  fixed: "fixed",
  partially_fixed: "partially fixed",
  still_exists: "still unresolved",
};

const VERDICT_BAR_STYLES = {
  fixed: "bg-green-500",
  partially_fixed: "bg-amber-400",
  still_exists: "bg-[#DC2626]",
};

const DISPUTE_BADGE_STYLES = {
  confirmed: "bg-green-50 text-green-700",
  disputed: "bg-red-50 text-[#DC2626]",
  mixed: "bg-[#F1F5F9] text-[#64748B]",
};

const DISPUTE_LABELS = {
  confirmed: "✅ Confirmed Resolved",
  disputed: "⚠️ Disputed",
  mixed: "Mixed Feedback",
};

function StarRating({ value, onChange, size = "text-xl" }) {
  const [hovered, setHovered] = useState(0);
  const interactive = !!onChange;

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= (hovered || value);

        return (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onClick={() => onChange?.(star)}
            onMouseEnter={() => interactive && setHovered(star)}
            onMouseLeave={() => interactive && setHovered(0)}
            className={`${size} leading-none ${
              interactive ? "cursor-pointer" : "cursor-default"
            } ${filled ? "text-amber-400" : "text-[#E2E8F0]"}`}
          >
            ★
          </button>
        );
      })}
    </div>
  );
}

function CommunityVerdict({ issueId }) {
  const { data: stats, isLoading } = useResolutionStats(issueId);

  if (isLoading) {
    return (
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 animate-pulse">
        <div className="h-3 w-32 bg-[#E2E8F0] rounded mb-3" />
        <div className="h-4 w-full bg-[#F1F5F9] rounded mb-2" />
        <div className="h-4 w-full bg-[#F1F5F9] rounded" />
      </div>
    );
  }

  const totalResponses = stats?.totalResponses ?? 0;
  const breakdown = stats?.verdictBreakdown || {
    fixed: 0,
    partially_fixed: 0,
    still_exists: 0,
  };

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="text-[11px] font-600 text-[#94A3B8] uppercase tracking-wider">
          Community Verdict
        </div>
        {stats?.disputeStatus && (
          <span
            className={`text-[11px] font-600 px-2 py-0.5 rounded-full ${DISPUTE_BADGE_STYLES[stats.disputeStatus]}`}
          >
            {DISPUTE_LABELS[stats.disputeStatus]}
          </span>
        )}
      </div>

      {totalResponses === 0 ? (
        <p className="text-[13px] text-[#94A3B8]">
          No one has confirmed this resolution yet — be the first to weigh in.
        </p>
      ) : (
        <>
          <div className="flex items-center gap-2 mb-4">
            <StarRating value={Math.round(stats.averageRating)} size="text-base" />
            <span className="text-[13px] font-600 text-[#1E293B]">
              {stats.averageRating?.toFixed(1)}
            </span>
            <span className="text-[12px] text-[#94A3B8]">
              ({totalResponses} {totalResponses === 1 ? "response" : "responses"})
            </span>
          </div>

          <div className="space-y-2">
            {VERDICT_OPTIONS.map((option) => {
              const count = breakdown[option.value] || 0;
              const percent = totalResponses
                ? Math.round((count / totalResponses) * 100)
                : 0;

              return (
                <div key={option.value}>
                  <div className="flex items-center justify-between text-[11px] text-[#64748B] mb-1">
                    <span>
                      {option.icon} {VERDICT_LABELS[option.value]}
                    </span>
                    <span className="font-600 text-[#1E293B]">
                      {percent}% · {count}
                    </span>
                  </div>
                  <div className="h-1.5 bg-[#F1F5F9] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${VERDICT_BAR_STYLES[option.value]}`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

function MyFeedbackSummary({ feedback }) {
  const verdictMessage =
    feedback.verdict === "fixed"
      ? "You confirmed this was fixed"
      : feedback.verdict === "partially_fixed"
        ? "You reported this as partially fixed"
        : "You reported this as still unresolved";

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4">
      <div className="text-[11px] font-600 text-[#94A3B8] uppercase tracking-wider mb-2">
        Your Feedback
      </div>
      <p className="text-[13px] text-[#1E293B] font-600 mb-1">
        {verdictMessage} on{" "}
        {new Date(feedback.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}
      </p>
      <StarRating value={feedback.rating} size="text-sm" />
      {feedback.comment && (
        <p className="text-[13px] text-[#64748B] leading-relaxed mt-2">
          "{feedback.comment}"
        </p>
      )}
    </div>
  );
}

function FeedbackForm({ issueId }) {
  const submitFeedback = useSubmitResolutionFeedback(issueId);

  const [rating, setRating] = useState(0);
  const [verdict, setVerdict] = useState("");
  const [comment, setComment] = useState("");
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");

  const updatePhoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhoto(file);
    setPreview(URL.createObjectURL(file));
  };

  const removePhoto = () => {
    setPhoto(null);
    setPreview(null);
  };

  const handleSubmit = async () => {
    setError("");

    if (!rating) {
      setError("Select a star rating");
      return;
    }

    if (!verdict) {
      setError("Choose whether the problem is actually resolved");
      return;
    }

    const formData = new FormData();
    formData.append("rating", rating);
    formData.append("verdict", verdict);
    if (comment.trim()) formData.append("comment", comment.trim());
    if (photo) formData.append("photo", photo);

    try {
      await submitFeedback.mutateAsync(formData);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Couldn't submit your feedback. Please try again.",
      );
    }
  };

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4">
      <div className="text-[11px] font-600 text-[#94A3B8] uppercase tracking-wider mb-3">
        Confirm This Resolution
      </div>

      {error && <p className="text-[12px] text-[#DC2626] mb-3">{error}</p>}

      <div className="mb-3">
        <label className="block text-[12px] font-600 text-[#1E293B] mb-1.5">
          How well was this resolved?
        </label>
        <StarRating value={rating} onChange={setRating} />
      </div>

      <div className="mb-3 space-y-1.5">
        {VERDICT_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => setVerdict(option.value)}
            className={`w-full text-left flex items-center gap-2 text-[13px] font-500 px-3 py-2 rounded-lg border transition-colors ${
              verdict === option.value
                ? "border-[#0F766E] bg-[#0F766E]/5 text-[#1E293B]"
                : "border-[#E2E8F0] text-[#64748B] hover:border-[#0F766E]/30"
            }`}
          >
            <span>{option.icon}</span>
            {option.label}
          </button>
        ))}
      </div>

      <div className="mb-3">
        <label className="block text-[12px] font-600 text-[#1E293B] mb-1.5">
          Comment{" "}
          <span className="text-[#94A3B8] font-500">(optional)</span>
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share any details about the current state of this issue..."
          rows={3}
          className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-[13px] text-[#1E293B] placeholder-[#94A3B8] resize-none focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E]"
        />
      </div>

      <div className="mb-4">
        <label className="block text-[12px] font-600 text-[#1E293B] mb-1.5">
          Photo <span className="text-[#94A3B8] font-500">(optional)</span>
        </label>

        {preview ? (
          <div className="relative w-32 h-32 rounded-xl border border-[#E2E8F0] overflow-hidden">
            <img
              src={preview}
              alt="Resolution evidence preview"
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={removePhoto}
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
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <span className="text-[11px] text-[#64748B] font-500 text-center px-2">
              Upload photo
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={updatePhoto}
              className="hidden"
            />
          </label>
        )}
      </div>

      <button
        onClick={handleSubmit}
        disabled={submitFeedback.isPending}
        className="w-full bg-[#0F766E] hover:bg-[#115E59] text-white text-[13px] font-600 py-2.5 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {submitFeedback.isPending ? "Submitting..." : "Submit Feedback"}
      </button>
    </div>
  );
}

export default function ResolutionFeedback({ issueId }) {
  const { data: myFeedback, isLoading: myFeedbackLoading } =
    useMyResolutionFeedback(issueId);

  return (
    <div className="space-y-4">
      <CommunityVerdict issueId={issueId} />

      {!myFeedbackLoading &&
        (myFeedback ? (
          <MyFeedbackSummary feedback={myFeedback} />
        ) : (
          <FeedbackForm issueId={issueId} />
        ))}
    </div>
  );
}
