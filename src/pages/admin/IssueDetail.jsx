import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useAdminIssue,
  useUpdateIssueStatusAdmin,
  useModerateIssue,
} from "../../hooks/useAdminIssues";

const STATUS_OPTIONS = [
  { value: "reported", label: "Reported" },
  { value: "under_review", label: "Under Review" },
  { value: "action_planned", label: "Action Planned" },
  { value: "in_progress", label: "In Progress" },
  { value: "resolved", label: "Resolved" },
];

const STATUS_BADGE_STYLES = {
  reported: "bg-blue-50 text-blue-700",
  under_review: "bg-amber-50 text-amber-700",
  action_planned: "bg-purple-50 text-purple-700",
  in_progress: "bg-orange-50 text-orange-700",
  resolved: "bg-green-50 text-green-700",
};

const STATUS_LABELS = {
  reported: "Reported",
  under_review: "Under Review",
  action_planned: "Action Planned",
  in_progress: "In Progress",
  resolved: "Resolved",
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

export default function IssueDetail() {
  const { issueId } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useAdminIssue(issueId);
  const updateStatus = useUpdateIssueStatusAdmin(issueId);
  const moderateIssue = useModerateIssue(issueId);

  const [newStatus, setNewStatus] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [statusError, setStatusError] = useState("");

  const [moderationError, setModerationError] = useState("");

  const backButton = (
    <button
      onClick={() => navigate("/admin/issues")}
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
      Back to issues
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

  if (isError || !data?.issue) {
    return (
      <div className="max-w-3xl">
        {backButton}
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
          <span className="text-lg shrink-0">⚠️</span>
          <p className="text-[13px] text-[#DC2626] leading-relaxed">
            Couldn't load this issue. It may have been removed.
          </p>
        </div>
      </div>
    );
  }

  const { issue, commentCount, proposalCount, representative } = data;
  const isHidden = issue.moderationStatus === "hidden";

  const handleUpdateStatus = async () => {
    setStatusError("");

    if (!newStatus) {
      setStatusError("Select a status to update to");
      return;
    }

    try {
      await updateStatus.mutateAsync({
        status: newStatus,
        message: statusMessage.trim() || undefined,
      });
      setNewStatus("");
      setStatusMessage("");
    } catch (err) {
      setStatusError(
        err.response?.data?.message ||
          "Couldn't update status. Please try again.",
      );
    }
  };

  const handleToggleModeration = async () => {
    setModerationError("");

    try {
      await moderateIssue.mutateAsync({
        moderationStatus: isHidden ? "visible" : "hidden",
      });
    } catch (err) {
      setModerationError(
        err.response?.data?.message ||
          "Couldn't update this issue. Please try again.",
      );
    }
  };

  return (
    <div className="max-w-3xl">
      {backButton}

      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display font-800 text-[#1E293B] text-2xl md:text-3xl mb-1">
            {issue.title}
          </h1>
          <p className="text-[13px] text-[#64748B] capitalize">
            {issue.category} · Reported{" "}
            {new Date(issue.createdAt).toLocaleDateString()}
          </p>
        </div>

        <div className="flex flex-col items-end gap-2 shrink-0">
          <span
            className={`text-[12px] font-600 px-3 py-1 rounded-full ${STATUS_BADGE_STYLES[issue.status]}`}
          >
            {STATUS_LABELS[issue.status]}
          </span>
          {isHidden && (
            <span className="text-[11px] font-600 px-2 py-0.5 rounded-full bg-[#F1F5F9] text-[#64748B]">
              Hidden from citizens
            </span>
          )}
        </div>
      </div>

      <div className="space-y-6">
        {/* Reporter & community */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 civic-shadow">
          <h2 className="font-display font-700 text-[#1E293B] text-[15px] mb-4">
            Reported By
          </h2>
          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Name">{issue.reportedBy?.name}</Field>
            <Field label="Email">{issue.reportedBy?.email}</Field>
            <Field label="Community">
              {issue.community?.name}
              {issue.community?.parent?.name &&
                `, ${issue.community.parent.name}`}
            </Field>
            <Field label="Representative">
              {representative
                ? `${representative.name} (${representative.email})`
                : "No active representative"}
            </Field>
            <Field label="Comments">{commentCount}</Field>
            <Field label="Proposals">{proposalCount}</Field>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 civic-shadow">
          <h2 className="font-display font-700 text-[#1E293B] text-[15px] mb-3">
            Description
          </h2>
          <p className="text-[14px] text-[#1E293B] leading-relaxed whitespace-pre-wrap">
            {issue.description}
          </p>
        </div>

        {/* Images */}
        {issue.images?.length > 0 && (
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 civic-shadow">
            <h2 className="font-display font-700 text-[#1E293B] text-[15px] mb-4">
              Evidence
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {issue.images.map((url, i) => (
                <a
                  key={i}
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  className="block rounded-xl border border-[#E2E8F0] overflow-hidden hover:shadow-md transition-shadow"
                >
                  <img
                    src={url}
                    alt={`Evidence ${i + 1}`}
                    className="w-full h-48 object-cover"
                  />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Status history */}
        {issue.statusHistory?.length > 0 && (
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 civic-shadow">
            <h2 className="font-display font-700 text-[#1E293B] text-[15px] mb-4">
              Status History
            </h2>
            <div className="space-y-3">
              {issue.statusHistory
                .slice()
                .reverse()
                .map((entry, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span
                      className={`shrink-0 text-[11px] font-600 px-2 py-0.5 rounded-full ${STATUS_BADGE_STYLES[entry.status]}`}
                    >
                      {STATUS_LABELS[entry.status] || entry.status}
                    </span>
                    <div className="min-w-0">
                      <p className="text-[12px] text-[#64748B]">
                        {entry.updatedBy?.name || "Unknown"}
                        {" · "}
                        {new Date(entry.updatedAt).toLocaleDateString()}
                      </p>
                      {entry.message && (
                        <p className="text-[13px] text-[#1E293B] mt-0.5">
                          {entry.message}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Admin actions */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 civic-shadow">
          <h2 className="font-display font-700 text-[#1E293B] text-[15px] mb-4">
            Admin Actions
          </h2>

          {statusError && (
            <div className="flex items-start gap-2.5 p-3 bg-red-50 border border-red-200 rounded-lg mb-4">
              <span className="text-base shrink-0">⚠️</span>
              <p className="text-[12px] text-[#DC2626] leading-relaxed">
                {statusError}
              </p>
            </div>
          )}

          <label className="block text-[13px] font-600 text-[#1E293B] mb-1.5">
            Change status
          </label>
          <select
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-[14px] text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E] appearance-none cursor-pointer mb-3"
          >
            <option value="">Select a status...</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>

          <textarea
            value={statusMessage}
            onChange={(e) => setStatusMessage(e.target.value)}
            placeholder="Optional note for the community explaining this update..."
            rows={3}
            className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-[14px] text-[#1E293B] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E] resize-none mb-3"
          />

          <button
            onClick={handleUpdateStatus}
            disabled={!newStatus || updateStatus.isPending}
            className="bg-[#0F766E] hover:bg-[#115E59] text-white font-600 text-sm px-5 py-2.5 rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {updateStatus.isPending ? "Updating..." : "Update Status"}
          </button>

          <div className="border-t border-[#E2E8F0] mt-5 pt-5">
            {moderationError && (
              <div className="flex items-start gap-2.5 p-3 bg-red-50 border border-red-200 rounded-lg mb-4">
                <span className="text-base shrink-0">⚠️</span>
                <p className="text-[12px] text-[#DC2626] leading-relaxed">
                  {moderationError}
                </p>
              </div>
            )}

            <p className="text-[12px] text-[#64748B] mb-3">
              {isHidden
                ? "This issue is hidden — citizens can't see it anywhere on CivicPulse."
                : "Hide this issue if it's spam, a duplicate, or otherwise doesn't belong — it disappears from every citizen-facing screen immediately, and can be restored any time."}
            </p>

            <button
              onClick={handleToggleModeration}
              disabled={moderateIssue.isPending}
              className={`text-[13px] font-600 px-5 py-2.5 rounded-xl border transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                isHidden
                  ? "border-[#0F766E] text-[#0F766E] hover:bg-[#0F766E]/5"
                  : "border-[#DC2626] text-[#DC2626] hover:bg-red-50"
              }`}
            >
              {moderateIssue.isPending
                ? "Saving..."
                : isHidden
                  ? "Restore Issue"
                  : "Hide Issue"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
