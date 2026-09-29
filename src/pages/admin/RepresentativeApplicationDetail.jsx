import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useAdminApplication,
  useReviewApplication,
} from "../../hooks/useAdminApplications";
import { APPLICATION_TYPE_LABELS } from "../../utils/constants";

const STATUS_BADGE_STYLES = {
  pending: "bg-amber-50 text-amber-700",
  approved: "bg-green-50 text-green-700",
  rejected: "bg-red-50 text-red-700",
};

const STATUS_LABELS = {
  pending: "⏳ Pending Review",
  approved: "✅ Approved",
  rejected: "Rejected",
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

function DocumentImage({ title, url }) {
  return (
    <div>
      <div className="text-[13px] font-600 text-[#1E293B] mb-1.5">{title}</div>
      {url ? (
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="block rounded-xl border border-[#E2E8F0] overflow-hidden hover:shadow-md transition-shadow"
        >
          <img src={url} alt={title} className="w-full h-64 object-cover" />
        </a>
      ) : (
        <div className="flex items-center justify-center h-32 rounded-xl border-2 border-dashed border-[#E2E8F0] text-[13px] text-[#94A3B8]">
          Not provided
        </div>
      )}
    </div>
  );
}

export default function RepresentativeApplicationDetail() {
  const { applicationId } = useParams();
  const navigate = useNavigate();

  const { data: application, isLoading, isError } =
    useAdminApplication(applicationId);
  const reviewMutation = useReviewApplication(applicationId);

  const [reviewNote, setReviewNote] = useState("");
  const [actionError, setActionError] = useState("");
  const [grantOfficialVerification, setGrantOfficialVerification] =
    useState(false);

  const handleReview = async (decision) => {
    setActionError("");

    // the applicant is told the reason on rejection, so require one
    if (decision === "rejected" && !reviewNote.trim()) {
      setActionError("Add a review note explaining why this was rejected.");
      return;
    }

    try {
      await reviewMutation.mutateAsync({
        decision,
        reviewNote: reviewNote.trim() || undefined,
        grantOfficialVerification:
          decision === "approved" ? grantOfficialVerification : undefined,
      });
      navigate("/admin/representative-applications");
    } catch (err) {
      setActionError(
        err.response?.data?.message ||
          "Couldn't submit your decision. Please try again.",
      );
    }
  };

  const backButton = (
    <button
      onClick={() => navigate("/admin/representative-applications")}
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
      Back to applications
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

  if (isError || !application) {
    return (
      <div className="max-w-3xl">
        {backButton}
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
          <span className="text-lg shrink-0">⚠️</span>
          <p className="text-[13px] text-[#DC2626] leading-relaxed">
            Couldn't load this application. It may have been withdrawn by the
            applicant.
          </p>
        </div>
      </div>
    );
  }

  const isPending = application.status === "pending";
  const communityName =
    application.proposedCommunityName || application.community?.name;

  return (
    <div className="max-w-3xl">
      {backButton}

      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display font-800 text-[#1E293B] text-2xl md:text-3xl mb-1">
            {communityName || "Application"}
          </h1>
          <p className="text-[13px] text-[#64748B]">
            {APPLICATION_TYPE_LABELS[application.applicationType] ||
              application.applicationType}{" "}
            · Submitted {new Date(application.createdAt).toLocaleDateString()}
          </p>
        </div>
        <span
          className={`shrink-0 text-[12px] font-600 px-3 py-1 rounded-full ${
            STATUS_BADGE_STYLES[application.status]
          }`}
        >
          {STATUS_LABELS[application.status]}
        </span>
      </div>

      <div className="space-y-6">
        {/* Applicant */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 civic-shadow">
          <h2 className="font-display font-700 text-[#1E293B] text-[15px] mb-4">
            Applicant
          </h2>
          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Name">{application.applicant?.name}</Field>
            <Field label="Email">{application.applicant?.email}</Field>
            <Field label="Phone number">{application.phoneNumber}</Field>
            <Field label="Years in community">
              {application.yearsInCommunity}
            </Field>
            {application.proposedParent?.name && (
              <Field label="Proposed parent">
                {application.proposedParent.name}
              </Field>
            )}
          </div>

          <div className="mt-5 p-4 rounded-xl bg-red-50 border border-red-200">
            <div className="flex items-center justify-between mb-1.5">
              <div className="text-[12px] font-600 text-[#DC2626] uppercase tracking-wider">
                National Identification Number (NIN)
              </div>
              <span className="text-[11px] font-700 text-[#DC2626] bg-white border border-red-200 rounded-full px-2 py-0.5">
                🔒 Sensitive — Admin Only
              </span>
            </div>
            <div className="font-mono tracking-wider text-[16px] text-[#1E293B]">
              {application.nin || "—"}
            </div>
          </div>
        </div>

        {/* Statement */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 civic-shadow">
          <h2 className="font-display font-700 text-[#1E293B] text-[15px] mb-3">
            Statement
          </h2>
          <p className="text-[14px] text-[#1E293B] leading-relaxed whitespace-pre-wrap">
            {application.statement}
          </p>
        </div>

        {/* Documents */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 civic-shadow">
          <h2 className="font-display font-700 text-[#1E293B] text-[15px] mb-4">
            Documents
          </h2>
          <div className="grid sm:grid-cols-2 gap-5">
            <DocumentImage
              title="Passport photo"
              url={application.passportPhotoUrl}
            />
            <DocumentImage
              title="Proof of residence"
              url={application.proofOfResidenceUrl}
            />
          </div>
        </div>

        {/* Official status claim */}
        {application.claimsOfficialStatus && (
          <div className="bg-white rounded-2xl border border-amber-200 p-6 civic-shadow">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-700 text-[#1E293B] text-[15px]">
                Local Government / Council Claim
              </h2>
              <span className="text-[11px] font-700 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700">
                Claims Official Status
              </span>
            </div>

            <div className="grid sm:grid-cols-2 gap-5 mb-5">
              <Field label="Official title">
                {application.officialTitle}
              </Field>
            </div>

            <DocumentImage
              title="Proof of official position"
              url={application.officialDocumentUrl}
            />

            <p className="text-[11px] text-[#94A3B8] mt-3">
              Claiming this doesn't grant anything by itself — review the
              document above and decide below whether to award the "Verified
              Official" badge alongside approval.
            </p>
          </div>
        )}

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
              placeholder="Shared with the applicant in their notification. Required if rejecting."
              className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-[14px] text-[#1E293B] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E] resize-none"
            />

            {application.claimsOfficialStatus && (
              <label className="flex items-start gap-2.5 mt-4 cursor-pointer">
                <input
                  type="checkbox"
                  checked={grantOfficialVerification}
                  onChange={(e) =>
                    setGrantOfficialVerification(e.target.checked)
                  }
                  className="mt-0.5 w-4 h-4 accent-[#0F766E] cursor-pointer"
                />
                <span>
                  <span className="block text-[13px] font-600 text-[#1E293B]">
                    Grant "Verified Official" badge on approval
                  </span>
                  <span className="block text-[11px] text-[#94A3B8] mt-0.5">
                    Only check this once you've reviewed the document above
                    and are confident it's genuine. It has no effect if you
                    reject this application.
                  </span>
                </span>
              </label>
            )}

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => handleReview("approved")}
                disabled={reviewMutation.isPending}
                className="bg-[#0F766E] hover:bg-[#115E59] text-white font-600 text-sm px-6 py-2.5 rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {reviewMutation.isPending ? "Saving..." : "Approve"}
              </button>
              <button
                onClick={() => handleReview("rejected")}
                disabled={reviewMutation.isPending}
                className="bg-white border border-[#DC2626] text-[#DC2626] hover:bg-red-50 font-600 text-sm px-6 py-2.5 rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                Reject
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 civic-shadow">
            <h2 className="font-display font-700 text-[#1E293B] text-[15px] mb-4">
              Review outcome
            </h2>
            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="Reviewed by">{application.reviewedBy?.name}</Field>
              <Field label="Reviewed on">
                {application.reviewedAt &&
                  new Date(application.reviewedAt).toLocaleDateString()}
              </Field>
            </div>
            {application.reviewNote && (
              <div className="mt-5">
                <Field label="Review note">{application.reviewNote}</Field>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
