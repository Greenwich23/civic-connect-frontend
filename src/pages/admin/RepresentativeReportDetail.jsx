import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useAdminReport, useReviewReport } from "../../hooks/useAdminReports";
import { REPRESENTATIVE_REPORT_REASON_LABELS } from "../../utils/constants";

const STATUS_BADGE_STYLES = {
  pending: "bg-amber-50 text-amber-700",
  reviewed: "bg-green-50 text-green-700",
  dismissed: "bg-[#F1F5F9] text-[#64748B]",
};

const STATUS_LABELS = {
  pending: "⏳ Pending",
  reviewed: "✅ Reviewed",
  dismissed: "Dismissed",
};

function Field({ label, children }) {
  return (
    <div>
      <div className="text-[12px] font-600 text-[#94A3B8] uppercase tracking-wider mb-1">
        {label}
      </div>
      <div className="text-[14px] text-[#1E293B]">{children || "—"}</div>
    </div>
  );
}

export default function RepresentativeReportDetail() {
  const { reportId } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useAdminReport(reportId);
  const reviewMutation = useReviewReport(reportId);

  const [reviewNote, setReviewNote] = useState("");
  const [actionError, setActionError] = useState("");
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);

  const backButton = (
    <button
      onClick={() => navigate("/admin/representative-reports")}
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
      Back to reports
    </button>
  );

  if (isLoading) {
    return (
      <div className="max-w-3xl">
        {backButton}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 animate-pulse space-y-4">
          <div className="h-6 w-1/2 bg-[#E2E8F0] rounded" />
          <div className="h-4 w-1/3 bg-[#E2E8F0] rounded" />
          <div className="h-40 bg-[#E2E8F0] rounded" />
        </div>
      </div>
    );
  }

  if (isError || !data?.report) {
    return (
      <div className="max-w-3xl">
        {backButton}
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
          <span className="text-lg shrink-0">⚠️</span>
          <p className="text-[13px] text-[#DC2626] leading-relaxed">
            Couldn't load this report.
          </p>
        </div>
      </div>
    );
  }

  const { report, totalReportsAgainstRepresentative } = data;
  const isPending = report.status === "pending";

  const submitReview = async (decision, removeRepresentative) => {
    setActionError("");
    setShowRemoveConfirm(false);

    try {
      await reviewMutation.mutateAsync({
        decision,
        reviewNote: reviewNote.trim() || undefined,
        removeRepresentative: !!removeRepresentative,
      });
      navigate("/admin/representative-reports");
    } catch (err) {
      setActionError(
        err.response?.data?.message ||
          "Couldn't submit your decision. Please try again.",
      );
    }
  };

  return (
    <div className="max-w-3xl">
      {backButton}

      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display font-800 text-[#1E293B] text-2xl md:text-3xl mb-1">
            {report.reportedRepresentative?.name || "Unknown representative"}
          </h1>
          <p className="text-[13px] text-[#64748B]">
            {REPRESENTATIVE_REPORT_REASON_LABELS[report.reason] ||
              report.reason}{" "}
            · Submitted {new Date(report.createdAt).toLocaleDateString()}
          </p>
        </div>
        <span
          className={`shrink-0 text-[12px] font-600 px-3 py-1 rounded-full ${STATUS_BADGE_STYLES[report.status]}`}
        >
          {STATUS_LABELS[report.status]}
        </span>
      </div>

      <div className="space-y-6">
        {/* Representative */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 civic-shadow">
          <h2 className="font-display font-700 text-[#1E293B] text-[15px] mb-4">
            Reported Representative
          </h2>
          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Name">{report.reportedRepresentative?.name}</Field>
            <Field label="Email">{report.reportedRepresentative?.email}</Field>
            <Field label="Community">{report.community?.name}</Field>
            <Field label="Other reports against this representative">
              {totalReportsAgainstRepresentative}
            </Field>
          </div>
        </div>

        {/* Reporter & details */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 civic-shadow">
          <h2 className="font-display font-700 text-[#1E293B] text-[15px] mb-4">
            Report Details
          </h2>
          <div className="grid sm:grid-cols-2 gap-5 mb-5">
            <Field label="Reported by">{report.reportedBy?.name}</Field>
            <Field label="Reason">
              {REPRESENTATIVE_REPORT_REASON_LABELS[report.reason] ||
                report.reason}
            </Field>
            {report.relatedIssue && (
              <Field label="Related issue">
                <Link
                  to={`/admin/issues/${report.relatedIssue._id}`}
                  className="text-[#0F766E] hover:underline"
                >
                  {report.relatedIssue.title}
                </Link>
              </Field>
            )}
          </div>
          <div>
            <div className="text-[12px] font-600 text-[#94A3B8] uppercase tracking-wider mb-1">
              Details
            </div>
            <p className="text-[14px] text-[#1E293B] leading-relaxed whitespace-pre-wrap">
              {report.details}
            </p>
          </div>
        </div>

        {/* Decision */}
        {isPending ? (
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 civic-shadow">
            <h2 className="font-display font-700 text-[#1E293B] text-[15px] mb-4">
              Your decision
            </h2>

            {actionError && (
              <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl mb-4">
                <span className="text-lg shrink-0">⚠️</span>
                <p className="text-[13px] text-[#DC2626] leading-relaxed">
                  {actionError}
                </p>
              </div>
            )}

            <label className="block text-[13px] font-600 text-[#1E293B] mb-1.5">
              Review note
            </label>
            <textarea
              rows={4}
              value={reviewNote}
              onChange={(e) => setReviewNote(e.target.value)}
              placeholder="Internal note — not shared with the reporter."
              className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-[14px] text-[#1E293B] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E] resize-none"
            />

            <div className="flex flex-wrap gap-3 mt-4">
              <button
                onClick={() => submitReview("dismissed", false)}
                disabled={reviewMutation.isPending}
                className="bg-white border border-[#E2E8F0] text-[#64748B] hover:border-[#0F766E]/40 font-600 text-sm px-6 py-2.5 rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                Dismiss
              </button>
              <button
                onClick={() => submitReview("reviewed", false)}
                disabled={reviewMutation.isPending}
                className="bg-[#0F766E] hover:bg-[#115E59] text-white font-600 text-sm px-6 py-2.5 rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {reviewMutation.isPending ? "Saving..." : "Mark Reviewed"}
              </button>
              <button
                onClick={() => setShowRemoveConfirm(true)}
                disabled={reviewMutation.isPending}
                className="bg-white border border-[#DC2626] text-[#DC2626] hover:bg-red-50 font-600 text-sm px-6 py-2.5 rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                Mark Reviewed & Remove Representative
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 civic-shadow">
            <h2 className="font-display font-700 text-[#1E293B] text-[15px] mb-4">
              Review outcome
            </h2>
            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="Reviewed by">{report.reviewedBy?.name}</Field>
              <Field label="Reviewed on">
                {report.reviewedAt &&
                  new Date(report.reviewedAt).toLocaleDateString()}
              </Field>
            </div>
            {report.reviewNote && (
              <div className="mt-5">
                <Field label="Review note">{report.reviewNote}</Field>
              </div>
            )}
          </div>
        )}
      </div>

      {showRemoveConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 max-w-sm w-full civic-shadow">
            <h3 className="font-display font-700 text-[#1E293B] text-[16px] mb-2">
              Remove this representative?
            </h3>
            <p className="text-[13px] text-[#64748B] leading-relaxed mb-6">
              This will revoke{" "}
              <span className="font-600 text-[#1E293B]">
                {report.reportedRepresentative?.name || "this representative"}
              </span>
              's representative status and mark {report.community?.name || "their community"}{" "}
              as unrepresented. This can't be undone from here.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowRemoveConfirm(false)}
                disabled={reviewMutation.isPending}
                className="flex-1 bg-white border border-[#E2E8F0] text-[#64748B] hover:border-[#0F766E]/40 font-600 text-sm px-4 py-2.5 rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={() => submitReview("reviewed", true)}
                disabled={reviewMutation.isPending}
                className="flex-1 bg-[#DC2626] hover:bg-red-700 text-white font-600 text-sm px-4 py-2.5 rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {reviewMutation.isPending ? "Removing..." : "Remove Representative"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
