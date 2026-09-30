/* eslint-disable react-hooks/static-components */
/* eslint-disable no-unused-vars */
/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useIssue } from "../hooks/useIssues.js";
import { useVoteStatus, useCastVote } from "../hooks/useVotes.js";
import { useProposals, useCreateProposal } from "../hooks/useProposals.js";
import {
  useComments,
  useCreateComment,
  useReplyToComment,
  useCommentReplies,
  useUpdateComment,
  useDeleteComment,
  useReportComment,
  usePinComment,
  useUnpinComment,
  useToggleCommentLike,
} from "../hooks/useComments.js";
import { Heart, ThumbsUp, ThumbsDown } from "lucide-react";
import {
  useSaveIssue,
  useIsIssueSaved,
  useUnsaveIssue,
  useSavedIssues,
} from "../hooks/useSavedIssues.js";
import { useAuth } from "../hooks/useAuth.js";
import { useUpdateIssueStatus } from "../hooks/useIssues.js";
import ResolutionFeedback from "../components/issue/ResolutionFeedback.jsx";

const STATUS_STEPS = [
  { key: "reported", label: "Reported" },
  { key: "under_review", label: "Under Review" },
  { key: "action_planned", label: "Action Planned" },
  { key: "in_progress", label: "In Progress" },
  { key: "resolved", label: "Resolved" },
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

function ProgressTimeline({ currentStatus }) {
  const currentIndex = STATUS_STEPS.findIndex((s) => s.key === currentStatus);

  return (
    <div className="space-y-2.5">
      {STATUS_STEPS.map((step, i) => {
        const isDone = i < currentIndex;
        const isCurrent = i === currentIndex;

        return (
          <div key={step.key} className="flex items-center gap-2.5">
            <span
              className={`w-2 h-2 rounded-full shrink-0 ${
                isCurrent
                  ? "bg-[#0F766E]"
                  : isDone
                    ? "bg-[#0F766E]/40"
                    : "bg-[#E2E8F0]"
              }`}
            />

            <span
              className={`text-[13px] ${
                isCurrent
                  ? "text-[#1E293B] font-600"
                  : isDone
                    ? "text-[#64748B]"
                    : "text-[#94A3B8]"
              }`}
            >
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/* =========================================================
   CONFIRM / REPORT MODALS
========================================================= */

function ConfirmModal({
  title,
  message,
  confirmLabel = "Confirm",
  isLoading,
  error,
  onConfirm,
  onCancel,
}) {
  return (
    <div
      className="fixed inset-0 bg-[#0F172A]/40 flex items-center justify-center z-50 p-4"
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-2xl border border-[#E2E8F0] civic-shadow max-w-sm w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="font-display font-800 text-[#1E293B] text-[16px] mb-2">
          {title}
        </h3>
        <p className="text-[13px] text-[#64748B] leading-relaxed mb-5">
          {message}
        </p>

        {error && (
          <div className="flex items-start gap-2.5 p-3 bg-red-50 border border-red-200 rounded-lg mb-4">
            <span className="text-base shrink-0">⚠️</span>
            <p className="text-[12px] text-[#DC2626] leading-relaxed">
              {error}
            </p>
          </div>
        )}

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-lg text-[13px] font-600 text-[#64748B] hover:bg-[#F8FAFC] transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="px-4 py-2 rounded-lg text-[13px] font-600 bg-[#DC2626] hover:bg-red-700 text-white transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? "Deleting..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

const REPORT_REASONS = [
  { value: "spam", label: "Spam or advertising" },
  { value: "harassment", label: "Harassment or bullying" },
  { value: "misinformation", label: "False information" },
  { value: "off_topic", label: "Off-topic or irrelevant" },
  { value: "other", label: "Something else" },
];

function ReportCommentModal({ isLoading, error, onSubmit, onCancel }) {
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [validationError, setValidationError] = useState("");

  const handleSubmit = () => {
    if (!reason) {
      setValidationError("Choose a reason for reporting this comment.");
      return;
    }

    if (reason === "other" && !details.trim()) {
      setValidationError("Add a few details so we know what's wrong.");
      return;
    }

    setValidationError("");
    onSubmit({ reason, details: details.trim() || undefined });
  };

  return (
    <div
      className="fixed inset-0 bg-[#0F172A]/40 flex items-center justify-center z-50 p-4"
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-2xl border border-[#E2E8F0] civic-shadow max-w-sm w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="font-display font-800 text-[#1E293B] text-[16px] mb-1">
          Report comment
        </h3>
        <p className="text-[13px] text-[#64748B] leading-relaxed mb-4">
          Let us know why this comment doesn't belong here.
        </p>

        {(validationError || error) && (
          <div className="flex items-start gap-2.5 p-3 bg-red-50 border border-red-200 rounded-lg mb-4">
            <span className="text-base shrink-0">⚠️</span>
            <p className="text-[12px] text-[#DC2626] leading-relaxed">
              {validationError || error}
            </p>
          </div>
        )}

        <label className="block text-[12px] font-600 text-[#1E293B] mb-1.5">
          Reason
        </label>
        <select
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-[13px] text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E] appearance-none cursor-pointer mb-4"
        >
          <option value="">Select a reason...</option>
          {REPORT_REASONS.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>

        <label className="block text-[12px] font-600 text-[#1E293B] mb-1.5">
          Additional details{" "}
          {reason === "other" ? (
            <span className="text-[#DC2626]">*</span>
          ) : (
            <span className="text-[#94A3B8] font-500">(optional)</span>
          )}
        </label>
        <textarea
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          rows={3}
          maxLength={500}
          placeholder="Tell us more about what's wrong with this comment..."
          className="w-full resize-none px-3.5 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-[13px] text-[#1E293B] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E]"
        />

        <div className="flex justify-end gap-2 mt-5">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-lg text-[13px] font-600 text-[#64748B] hover:bg-[#F8FAFC] transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            className="px-4 py-2 rounded-lg text-[13px] font-600 bg-[#DC2626] hover:bg-red-700 text-white transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? "Reporting..." : "Submit Report"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   DISCUSSION TAB
========================================================= */

function DiscussionTab({ issueId, totalComments }) {
  const { user } = useAuth();
  const currentUserId = user?._id || user?.id;

  const {
    data: comments = [],
    isLoading,
    isFetching,
    error,
  } = useComments(issueId);

  const createComment = useCreateComment(issueId);
  const updateComment = useUpdateComment(issueId);
  const deleteComment = useDeleteComment(issueId);
  const reportComment = useReportComment(issueId);
  const pinComment = usePinComment(issueId);
  const unpinComment = useUnpinComment(issueId);

  // A representative can only pin their own comments, and only within the
  // community they actively represent.
  const representativeCommunityId =
    user?.representativeInfo?.community?._id ||
    user?.representativeInfo?.community;
  const canPinInCommunity =
    user?.role === "representative" && !!user?.representativeInfo?.isActive;

  const [commentText, setCommentText] = useState("");

  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");

  const [expandedReplies, setExpandedReplies] = useState({});

  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingText, setEditingText] = useState("");

  // Delete confirmation
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [deleteError, setDeleteError] = useState("");

  // Report reason + details
  const [reportTargetId, setReportTargetId] = useState(null);
  const [reportError, setReportError] = useState("");

  const handlePostComment = async () => {
    const content = commentText.trim();
    if (!content) return;

    try {
      await createComment.mutateAsync(content);
      setCommentText("");
    } catch (error) {
      console.error("Failed to post comment:", error);
    }
  };

  const handleStartEdit = (comment) => {
    setEditingCommentId(comment._id);
    setEditingText(comment.content);
  };

  const handleSaveEdit = async (commentId) => {
    const content = editingText.trim();
    if (!content) return;

    try {
      await updateComment.mutateAsync({ commentId, content });
      setEditingCommentId(null);
      setEditingText("");
    } catch (error) {
      console.error("Failed to update comment:", error);
    }
  };

  const handleDeleteComment = (commentId) => {
    setDeleteError("");
    setDeleteTargetId(commentId);
  };

  const confirmDeleteComment = async () => {
    try {
      await deleteComment.mutateAsync(deleteTargetId);
      setDeleteTargetId(null);
    } catch (error) {
      console.error("Failed to delete comment:", error);
      setDeleteError("Couldn't delete this comment. Please try again.");
    }
  };

  const handleReportComment = (commentId) => {
    setReportError("");
    setReportTargetId(commentId);
  };

  const submitReportComment = async ({ reason, details }) => {
    try {
      await reportComment.mutateAsync({
        commentId: reportTargetId,
        reason,
        details,
      });
      setReportTargetId(null);
    } catch (error) {
      console.error("Failed to report comment:", error);
      setReportError(
        error.response?.data?.message ||
          "Couldn't report this comment. Please try again.",
      );
    }
  };

  const handlePinComment = async (commentId) => {
    try {
      await pinComment.mutateAsync(commentId);
    } catch (error) {
      console.error("Failed to pin comment:", error);
    }
  };

  const handleUnpinComment = async (commentId) => {
    try {
      await unpinComment.mutateAsync(commentId);
    } catch (error) {
      console.error("Failed to unpin comment:", error);
    }
  };

  if (isLoading && comments.length === 0) {
    return (
      <div className="mt-5">
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 shadow-sm mb-5">
          <div className="flex gap-3">
            <div className="w-9 h-9 rounded-full bg-[#E2E8F0] animate-pulse shrink-0" />
            <div className="flex-1">
              <div className="h-24 bg-[#F1F5F9] rounded-xl animate-pulse" />
              <div className="flex justify-end mt-3">
                <div className="w-28 h-10 bg-[#E2E8F0] rounded-xl animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="bg-white border border-[#E2E8F0] rounded-2xl p-4 shadow-sm"
            >
              <div className="flex gap-3">
                <div className="w-9 h-9 rounded-full bg-[#E2E8F0] animate-pulse shrink-0" />
                <div className="flex-1 space-y-3">
                  <div className="flex justify-between">
                    <div className="w-28 h-4 bg-[#E2E8F0] rounded animate-pulse" />
                    <div className="w-16 h-3 bg-[#F1F5F9] rounded animate-pulse" />
                  </div>
                  <div className="space-y-2">
                    <div className="w-full h-3 bg-[#F1F5F9] rounded animate-pulse" />
                    <div className="w-4/5 h-3 bg-[#F1F5F9] rounded animate-pulse" />
                  </div>
                  <div className="flex gap-4">
                    <div className="w-20 h-3 bg-[#F1F5F9] rounded animate-pulse" />
                    <div className="w-12 h-3 bg-[#F1F5F9] rounded animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-5 bg-red-50 border border-red-100 rounded-xl p-4">
        <p className="text-[13px] text-[#DC2626]">
          Unable to load the community discussion.
        </p>
      </div>
    );
  }

  console.log(comments);

  return (
    <div className="mt-5">
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 shadow-sm mb-5">
        <div className="flex gap-3">
          <div className="w-9 h-9 rounded-full bg-[#0F766E]/10 text-[#0F766E] font-700 text-[12px] flex items-center justify-center shrink-0">
            U
          </div>

          <div className="flex-1">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Share your experience or insight about this issue..."
              rows={3}
              disabled={createComment.isPending}
              className="w-full resize-none rounded-xl border border-[#CBD5E1] bg-white px-4 py-3 text-[13px] text-[#1E293B] placeholder:text-[#94A3B8] outline-none focus:border-[#0F766E] focus:ring-1 focus:ring-[#0F766E] transition-all disabled:bg-[#F8FAFC]"
            />

            <div className="flex items-center justify-between mt-3">
              <span className="text-[11px] text-[#94A3B8]">
                {commentText.length}/2000
              </span>

              <button
                type="button"
                onClick={handlePostComment}
                disabled={
                  !commentText.trim() ||
                  createComment.isPending ||
                  commentText.length > 2000
                }
                className={`px-4 py-2.5 rounded-xl text-[13px] font-600 transition-colors ${
                  commentText.trim() &&
                  !createComment.isPending &&
                  commentText.length <= 2000
                    ? "bg-[#0F766E] text-white hover:bg-[#115E59]"
                    : "bg-[#A7D1CE] text-white cursor-not-allowed"
                }`}
              >
                {createComment.isPending ? "Posting..." : "Post Comment"}
              </button>
            </div>

            {createComment.isError && (
              <p className="text-[12px] text-[#DC2626] mt-2">
                Failed to post your comment. Please try again.
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div>
          <h3 className="font-700 text-[#1E293B] text-[14px]">
            Community Discussion
          </h3>
          <p className="text-[11px] text-[#94A3B8] mt-0.5">
            Share your experience, ideas, and information.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isFetching && comments.length > 0 && (
            <span className="text-[10px] text-[#94A3B8]">Updating...</span>
          )}
          <span className="text-[12px] text-[#64748B]">
            {totalComments ?? comments.length}{" "}
            {(totalComments ?? comments.length) === 1 ? "comment" : "comments"}
          </span>
        </div>
      </div>

      {!comments.length ? (
        <div className="bg-white border border-dashed border-[#CBD5E1] rounded-2xl p-8 text-center">
          <div className="w-12 h-12 rounded-full bg-[#0F766E]/10 text-[#0F766E] flex items-center justify-center mx-auto mb-3 text-xl">
            💬
          </div>
          <h4 className="font-600 text-[#1E293B] text-[14px] mb-1">
            No comments yet
          </h4>
          <p className="text-[12px] text-[#94A3B8] max-w-sm mx-auto">
            Be the first person to share an experience, provide useful
            information, or contribute an idea about this issue.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => {
            const authorName = comment.author?.name || "Community Member";
            // const authorCommunity = comment.community?.name || "Community";

            const initials = authorName
              .split(" ")
              .map((name) => name[0])
              .join("")
              .slice(0, 2)
              .toUpperCase();

            const isEditing = editingCommentId === comment._id;

            return (
              <CommentItem
                key={comment._id}
                comment={comment}
                currentUserId={currentUserId}
                canPinInCommunity={canPinInCommunity}
                representativeCommunityId={representativeCommunityId}
                onPin={handlePinComment}
                onUnpin={handleUnpinComment}
                authorName={authorName}
                // authorCommunity={authorCommunity}
                initials={initials}
                isEditing={isEditing}
                editingText={editingText}
                setEditingText={setEditingText}
                onStartEdit={handleStartEdit}
                onSaveEdit={handleSaveEdit}
                onCancelEdit={() => {
                  setEditingCommentId(null);
                  setEditingText("");
                }}
                onDelete={handleDeleteComment}
                onReport={handleReportComment}
                replyingTo={replyingTo}
                setReplyingTo={setReplyingTo}
                replyText={replyText}
                setReplyText={setReplyText}
                expandedReplies={expandedReplies}
                setExpandedReplies={setExpandedReplies}
              />
            );
          })}
        </div>
      )}

      {deleteTargetId && (
        <ConfirmModal
          title="Delete comment"
          message="Are you sure you want to delete this comment? This can't be undone."
          confirmLabel="Delete"
          isLoading={deleteComment.isPending}
          error={deleteError}
          onConfirm={confirmDeleteComment}
          onCancel={() => setDeleteTargetId(null)}
        />
      )}

      {reportTargetId && (
        <ReportCommentModal
          isLoading={reportComment.isPending}
          error={reportError}
          onSubmit={submitReportComment}
          onCancel={() => setReportTargetId(null)}
        />
      )}
    </div>
  );
}

// Heart toggle with a like count. Updates instantly, then settles on the
// server's numbers; rolls back if the request fails.
function LikeButton({ comment }) {
  const toggleLike = useToggleCommentLike();
  const [state, setState] = useState({
    liked: !!comment.likedByMe,
    count: comment.likeCount ?? 0,
  });

  // Follow the server's values when the comment list refetches
  useEffect(() => {
    setState({
      liked: !!comment.likedByMe,
      count: comment.likeCount ?? 0,
    });
  }, [comment.likedByMe, comment.likeCount]);

  const handleClick = () => {
    if (toggleLike.isPending) return;

    const previous = state;
    setState({
      liked: !previous.liked,
      count: Math.max(0, previous.count + (previous.liked ? -1 : 1)),
    });

    toggleLike.mutate(comment._id, {
      onSuccess: (data) =>
        setState({ liked: data.liked, count: data.likeCount }),
      onError: () => setState(previous),
    });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={state.liked}
      aria-label={state.liked ? "Unlike comment" : "Like comment"}
      className={`flex items-center gap-1.5 text-[12px] transition-colors ${
        state.liked
          ? "text-[#DC2626]"
          : "text-[#64748B] hover:text-[#DC2626]"
      }`}
    >
      <Heart
        size={15}
        className={state.liked ? "fill-[#DC2626]" : ""}
        strokeWidth={2}
      />
      <span>{state.count}</span>
    </button>
  );
}

function ReplyItem({ reply, issueId, depth = 0 }) {
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [showChildReplies, setShowChildReplies] = useState(false);

  const replyMutation = useReplyToComment(issueId, reply._id);
  const { data: childRepliesData, isLoading: childRepliesLoading } =
    useCommentReplies(showChildReplies ? reply._id : null);

  const childReplies = childRepliesData?.replies || [];

  const authorName = reply.author?.name || "Community Member";
  // const authorCommunity = reply.author?.community || "Community";

  // console.log(authorCommunity, "author community");

  const initials = authorName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handlePostReply = async () => {
    const content = replyText.trim();
    if (!content) return;

    try {
      await replyMutation.mutateAsync(content);
      setReplyText("");
      setIsReplying(false);
      setShowChildReplies(true);
    } catch (error) {
      console.error("Failed to post reply:", error);
    }
  };

  return (
    <div className={depth > 0 ? "mt-3 pl-4 border-l-2 border-[#E2E8F0]" : ""}>
      <div className="bg-[#F8FAFC] rounded-xl p-3">
        <div className="flex gap-2.5">
          <div className="w-7 h-7 rounded-full bg-[#DCEDEC] text-[#0F766E] font-700 text-[9px] flex items-center justify-center shrink-0 overflow-hidden">
            {reply.author?.avatarUrl ? (
              <img
                src={reply.author.avatarUrl}
                alt={authorName}
                className="w-full h-full object-cover"
              />
            ) : (
              initials
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="font-600 text-[#1E293B] text-[12px]">
                {authorName}
              </span>

              {reply.author?.role === "representative" && (
                <span className="text-[9px] font-600 px-1.5 py-0.5 rounded-full bg-[#0F766E]/10 text-[#0F766E]">
                  Representative
                </span>
              )}
              {reply.author?.representativeInfo?.isVerifiedOfficial && (
                <span className="text-[9px] font-600 px-1.5 py-0.5 rounded-full bg-amber-50 text-amber-700">
                  ✓ Verified Official
                </span>
              )}
            </div>

            <p className="text-[12px] text-[#64748B] leading-relaxed mt-1">
              {reply.content}
            </p>

            <div className="flex items-center gap-3 mt-1.5">
              <span className="text-[10px] text-[#94A3B8]">
                {reply.createdAt
                  ? new Date(reply.createdAt).toLocaleDateString()
                  : "Recently"}
              </span>

              <LikeButton comment={reply} />

              <button
                type="button"
                onClick={() => {
                  setIsReplying((prev) => !prev);
                  setReplyText("");
                }}
                className="text-[11px] text-[#64748B] hover:text-[#0F766E] transition-colors"
              >
                Reply
              </button>

              {reply.replyCount > 0 && (
                <button
                  type="button"
                  onClick={() => setShowChildReplies((prev) => !prev)}
                  className="text-[11px] text-[#64748B] hover:text-[#0F766E] transition-colors"
                >
                  {showChildReplies
                    ? "Hide replies"
                    : `View replies (${reply.replyCount})`}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Reply-to-reply input */}
        {isReplying && (
          <div className="mt-3 pl-9">
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder={`Reply to ${authorName}...`}
              rows={2}
              maxLength={2000}
              disabled={replyMutation.isPending}
              className="w-full resize-none rounded-xl border border-[#CBD5E1] px-3 py-2.5 text-[12px] text-[#1E293B] placeholder:text-[#94A3B8] outline-none focus:border-[#0F766E] focus:ring-1 focus:ring-[#0F766E] bg-white"
            />

            <div className="flex justify-end gap-2 mt-2">
              <button
                type="button"
                onClick={() => {
                  setIsReplying(false);
                  setReplyText("");
                }}
                className="px-3 py-1.5 rounded-lg text-[11px] font-600 text-[#64748B] hover:bg-white"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handlePostReply}
                disabled={!replyText.trim() || replyMutation.isPending}
                className="px-3 py-1.5 rounded-lg text-[11px] font-600 bg-[#0F766E] text-white hover:bg-[#115E59] disabled:opacity-50"
              >
                {replyMutation.isPending ? "Replying..." : "Post Reply"}
              </button>
            </div>

            {replyMutation.isError && (
              <p className="text-[10px] text-[#DC2626] mt-1.5">
                Failed to post reply. Please try again.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Nested child replies — recursive */}
      {showChildReplies && (
        <div className="mt-2">
          {childRepliesLoading ? (
            <p className="text-[10px] text-[#94A3B8] pl-4">
              Loading replies...
            </p>
          ) : (
            childReplies.map((childReply) => (
              <ReplyItem
                key={childReply._id}
                reply={childReply}
                issueId={issueId}
                depth={depth + 1}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}
/* =========================================================
   COMMENT ITEM
========================================================= */

function CommentItem({
  comment,
  currentUserId,
  canPinInCommunity,
  representativeCommunityId,
  onPin,
  onUnpin,
  authorName,
  initials,
  isEditing,
  editingText,
  setEditingText,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onDelete,
  onReport,
  replyingTo,
  setReplyingTo,
  replyText,
  setReplyText,
  expandedReplies,
  setExpandedReplies,
}) {
  const [showMenu, setShowMenu] = useState(false);

  // Edit/Delete are only for the comment's own author — everyone else
  // should only see Report in the "⋯" menu.
  const isOwner =
    !!currentUserId &&
    !!comment.author?._id &&
    String(comment.author._id) === String(currentUserId);

  // Pinning is for announcements — only the active representative of this
  // comment's own community can pin it, and only on their own comment.
  const canPin =
    isOwner &&
    canPinInCommunity &&
    !!representativeCommunityId &&
    String(comment.community) === String(representativeCommunityId);

  const replyMutation = useReplyToComment(comment.issue, comment._id);

  const { data: repliesData, isLoading: repliesLoading } = useCommentReplies(
    expandedReplies[comment._id] ? comment._id : null,
  );

  const replies = repliesData?.replies || [];

  const handleReply = async () => {
    const content = replyText.trim();
    if (!content) return;

    try {
      await replyMutation.mutateAsync(content);
      setReplyText("");
      setReplyingTo(null);
      setExpandedReplies((prev) => ({ ...prev, [comment._id]: true }));
    } catch (error) {
      console.error("Failed to post reply:", error);
    }
  };

  const toggleReplies = () => {
    setExpandedReplies((prev) => ({
      ...prev,
      [comment._id]: !prev[comment._id],
    }));
  };

  return (
    <div
      className={`rounded-2xl p-4 shadow-sm ${
        comment.isPinned
          ? "bg-amber-50/60 border-2 border-amber-200"
          : "bg-white border border-[#E2E8F0]"
      }`}
    >
      {comment.isPinned && (
        <div className="flex items-center gap-1.5 text-[11px] font-700 text-amber-700 mb-2.5">
          📌 Pinned Announcement
        </div>
      )}

      {/* Only the author sees this — the comment stays visible to everyone
          else exactly as before; a report never hides it by itself, only
          an admin choosing to hide it does. */}
      {comment.moderationStatus === "flagged" && isOwner && (
        <div className="flex items-center gap-1.5 text-[11px] font-600 text-[#94A3B8] mb-2.5">
          🚩 Someone reported this comment — an admin will review it. It's
          still visible to others in the meantime.
        </div>
      )}

      <div className="flex gap-3">
        <div className="w-9 h-9 rounded-full bg-[#DCEDEC] text-[#0F766E] font-700 text-[11px] flex items-center justify-center shrink-0 overflow-hidden">
          {comment.author?.avatarUrl ? (
            <img
              src={comment.author.avatarUrl}
              alt={authorName}
              className="w-full h-full object-cover"
            />
          ) : (
            initials
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-600 text-[#1E293B] text-[13px]">
                {authorName}
              </span>
              {/* &bull; */}
              {/* <span className="font-600 text-[#1E293B] text-[13px]">
                
              </span> */}
              {comment.author?.role === "representative" && (
                <span className="text-[10px] font-600 px-2 py-0.5 rounded-full bg-[#0F766E]/10 text-[#0F766E]">
                  Representative
                </span>
              )}
              {comment.author?.representativeInfo?.isVerifiedOfficial && (
                <span className="text-[10px] font-600 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700">
                  ✓ Verified Official
                </span>
              )}
            </div>

            <span className="text-[11px] text-[#94A3B8] whitespace-nowrap">
              {comment.createdAt
                ? new Date(comment.createdAt).toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : "Recently"}
            </span>
          </div>

          {isEditing ? (
            <div className="mt-3">
              <textarea
                value={editingText}
                onChange={(e) => setEditingText(e.target.value)}
                rows={3}
                maxLength={2000}
                className="w-full resize-none rounded-xl border border-[#CBD5E1] px-3 py-2.5 text-[13px] text-[#1E293B] outline-none focus:border-[#0F766E] focus:ring-1 focus:ring-[#0F766E]"
              />

              <div className="flex justify-end gap-2 mt-2">
                <button
                  type="button"
                  onClick={onCancelEdit}
                  className="px-3 py-2 rounded-lg text-[12px] font-600 text-[#64748B] hover:bg-[#F8FAFC]"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={() => onSaveEdit(comment._id)}
                  disabled={!editingText.trim() || editingText.length > 2000}
                  className="px-3 py-2 rounded-lg text-[12px] font-600 bg-[#0F766E] text-white hover:bg-[#115E59] disabled:opacity-50"
                >
                  Save
                </button>
              </div>
            </div>
          ) : (
            <p className="text-[13px] leading-relaxed text-[#1E293B] mt-2">
              {comment.content}
            </p>
          )}

          {!isEditing && (
            <div className="flex items-center gap-5 mt-3">
              <LikeButton comment={comment} />

              <button
                type="button"
                onClick={() => {
                  setReplyingTo(
                    replyingTo === comment._id ? null : comment._id,
                  );
                  setReplyText("");
                }}
                className="text-[12px] text-[#64748B] hover:text-[#0F766E] transition-colors"
              >
                Reply
              </button>

              <button
                type="button"
                onClick={toggleReplies}
                className="text-[12px] text-[#64748B] hover:text-[#0F766E] transition-colors"
              >
                {expandedReplies[comment._id] ? "Hide replies" : "View replies"}
              </button>

              <div className="relative ml-auto">
                <button
                  type="button"
                  onClick={() => setShowMenu((prev) => !prev)}
                  className="text-[14px] text-[#64748B] hover:text-[#1E293B]"
                >
                  ⋯
                </button>

                {showMenu && (
                  <div className="absolute right-0 top-6 z-20 w-40 bg-white border border-[#E2E8F0] rounded-xl shadow-lg py-1">
                    {canPin && (
                      <button
                        type="button"
                        onClick={() => {
                          if (comment.isPinned) {
                            onUnpin(comment._id);
                          } else {
                            onPin(comment._id);
                          }
                          setShowMenu(false);
                        }}
                        className="w-full text-left px-3 py-2 text-[12px] text-[#B45309] hover:bg-amber-50"
                      >
                        {comment.isPinned
                          ? "📌 Unpin"
                          : "📌 Pin as Announcement"}
                      </button>
                    )}

                    {isOwner && (
                      <>
                        <button
                          type="button"
                          onClick={() => {
                            onStartEdit(comment);
                            setShowMenu(false);
                          }}
                          className="w-full text-left px-3 py-2 text-[12px] text-[#64748B] hover:bg-[#F8FAFC]"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            onDelete(comment._id);
                            setShowMenu(false);
                          }}
                          className="w-full text-left px-3 py-2 text-[12px] text-[#DC2626] hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        onReport(comment._id);
                        setShowMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 text-[12px] text-[#64748B] hover:bg-[#F8FAFC]"
                    >
                      Report
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {replyingTo === comment._id && (
            <div className="mt-4 pl-2 border-l-2 border-[#DCEDEC]">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write a reply..."
                rows={2}
                maxLength={2000}
                disabled={replyMutation.isPending}
                className="w-full resize-none rounded-xl border border-[#CBD5E1] px-3 py-2.5 text-[12px] text-[#1E293B] placeholder:text-[#94A3B8] outline-none focus:border-[#0F766E] focus:ring-1 focus:ring-[#0F766E]"
              />

              <div className="flex justify-end gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => {
                    setReplyingTo(null);
                    setReplyText("");
                  }}
                  className="px-3 py-2 rounded-lg text-[12px] font-600 text-[#64748B] hover:bg-[#F8FAFC]"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleReply}
                  disabled={!replyText.trim() || replyMutation.isPending}
                  className="px-3 py-2 rounded-lg text-[12px] font-600 bg-[#0F766E] text-white hover:bg-[#115E59] disabled:opacity-50"
                >
                  {replyMutation.isPending ? "Replying..." : "Post Reply"}
                </button>
              </div>

              {replyMutation.isError && (
                <p className="text-[11px] text-[#DC2626] mt-2">
                  Failed to post reply. Please try again.
                </p>
              )}
            </div>
          )}

          {expandedReplies[comment._id] && (
            <div className="mt-4 pl-4 border-l-2 border-[#E2E8F0] space-y-3">
              {repliesLoading ? (
                <p className="text-[11px] text-[#94A3B8]">Loading replies...</p>
              ) : replies.length === 0 ? (
                <p className="text-[11px] text-[#94A3B8]">No replies yet.</p>
              ) : (
                replies.map((reply) => (
                  <ReplyItem
                    key={reply._id}
                    reply={reply}
                    issueId={comment.issue}
                    depth={0}
                  />
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   PROPOSALS TAB
========================================================= */

function ProposalForm({ issueId, onClose }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const createProposal = useCreateProposal(issueId);

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim()) return;

    try {
      await createProposal.mutateAsync({
        title: title.trim(),
        description: description.trim(),
      });
      setTitle("");
      setDescription("");
      onClose();
    } catch (error) {
      console.error("Failed to create proposal:", error);
    }
  };

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 mb-4">
      <h4 className="font-600 text-[#1E293B] text-[13px] mb-3">
        Propose a Solution
      </h4>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Proposal title..."
        className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-[13px] text-[#1E293B] placeholder-[#94A3B8] mb-3 focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E]"
      />

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Describe your proposed solution..."
        rows={3}
        className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-[13px] text-[#1E293B] placeholder-[#94A3B8] resize-none mb-3 focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E]"
      />

      {createProposal.isError && (
        <p className="text-[12px] text-[#DC2626] mb-3">
          {createProposal.error?.response?.data?.message ||
            "Failed to submit proposal. Please try again."}
        </p>
      )}

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 rounded-lg text-[12px] font-600 text-[#64748B] hover:bg-[#F8FAFC]"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={
            !title.trim() || !description.trim() || createProposal.isPending
          }
          className="px-4 py-2 rounded-lg text-[12px] font-600 bg-[#0F766E] text-white hover:bg-[#115E59] disabled:opacity-50"
        >
          {createProposal.isPending ? "Submitting..." : "Submit Proposal"}
        </button>
      </div>
    </div>
  );
}

function ProposalsTab({ issueId }) {
  const { user } = useAuth();
  const { data: proposals, isLoading } = useProposals(issueId);
  const [showForm, setShowForm] = useState(false);

  const hasCommunity = !!(
    user?.community?._id ||
    (typeof user?.community === "string" && user.community)
  );

  if (isLoading) {
    return (
      <p className="text-[13px] text-[#94A3B8] py-6">Loading proposals...</p>
    );
  }

  return (
    <div className="space-y-4 py-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-[#64748B] text-[13px]">
          The community has submitted {proposals?.length || 0}{" "}
          {proposals?.length === 1 ? "proposal" : "proposals"} for this issue.
        </p>

        {!showForm && hasCommunity && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-1.5 bg-[#0F766E] hover:bg-[#115E59] text-white text-[12px] font-600 px-4 py-2 rounded-lg transition-colors"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              className="w-3.5 h-3.5"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Propose a Solution
          </button>
        )}

        {!hasCommunity && (
          <span className="text-[12px] text-[#94A3B8]">
            Join a community to propose solutions
          </span>
        )}
      </div>

      {showForm && (
        <ProposalForm issueId={issueId} onClose={() => setShowForm(false)} />
      )}

      {!proposals?.length ? (
        <p className="text-[13px] text-[#94A3B8] py-6 text-center">
          No proposals yet. Be the first to suggest a solution.
        </p>
      ) : (
        proposals.map((proposal, i) => {
          const support = proposal.supportCount || 0;
          const oppose = proposal.opposeCount || 0;
          const total = support + oppose;
          const pct = total > 0 ? Math.round((support / total) * 100) : 0;

          return (
            <ProposalCard
              key={proposal._id}
              proposal={proposal}
              index={i}
              pct={pct}
              total={total}
              support={support}
              oppose={oppose}
            />
          );
        })
      )}
    </div>
  );
}

function ProposalCard({ proposal, index, pct, total, support, oppose }) {
  const { data: voteStatus } = useVoteStatus("Proposal", proposal._id);
  const castVote = useCastVote("Proposal", proposal._id);

  const hasSupported = voteStatus?.value === "support";
  const hasOpposed = voteStatus?.value === "oppose";

  const authorName = proposal.proposedBy?.name || "Community Member";
  const authorInitials = authorName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 civic-shadow">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-7 h-7 rounded-lg bg-[#0F766E]/10 text-[#0F766E] font-display font-700 text-[12px] flex items-center justify-center shrink-0 mt-0.5">
          #{index + 1}
        </div>
        <div className="flex-1">
          <h3 className="font-display font-700 text-[#1E293B] text-[14px] mb-1">
            {proposal.title}
          </h3>
          <p className="text-[#64748B] text-[13px] leading-relaxed">
            {proposal.description}
          </p>
        </div>
      </div>

      <div className="mb-3">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
          <span className="text-[12px] font-600 text-[#0F766E]">
            {pct}% Community Support
          </span>
          <span className="text-[11px] text-[#64748B]">{total} votes</span>
        </div>
        <div className="h-2 bg-[#F1F5F9] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#0F766E] rounded-full transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={() => castVote.mutate("support")}
          disabled={castVote.isPending}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-[12px] font-600 transition-colors ${
            hasSupported
              ? "bg-[#0F766E] text-white"
              : "bg-[#0F766E]/10 text-[#0F766E] hover:bg-[#0F766E]/20"
          }`}
        >
          <ThumbsUp size={14} />
          Support ({support})
        </button>

        <button
          onClick={() => castVote.mutate("oppose")}
          disabled={castVote.isPending}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-[12px] font-500 transition-colors ${
            hasOpposed
              ? "bg-[#64748B] text-white"
              : "bg-[#F1F5F9] text-[#64748B] hover:bg-[#E2E8F0]"
          }`}
        >
          <ThumbsDown size={14} />
          Oppose ({oppose})
        </button>

        {/* Under 600px the proposer drops onto its own line below the buttons */}
        <div className="ml-auto flex items-center gap-2 max-[600px]:ml-0 max-[600px]:basis-full">
          <div className="w-6 h-6 rounded-full bg-[#0F766E]/10 text-[#0F766E] font-700 text-[10px] flex items-center justify-center">
            {authorInitials}
          </div>
          <span className="text-[11px] text-[#64748B]">{authorName}</span>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   TIMELINE TAB
========================================================= */

function TimelineTab({ statusHistory }) {
  if (!statusHistory?.length) {
    return (
      <p className="text-[13px] text-[#94A3B8] py-6">No status updates yet.</p>
    );
  }

  return (
    <div className="space-y-4 py-4">
      {statusHistory.map((entry, i) => (
        <div key={i} className="flex gap-3">
          <div className="w-2 h-2 rounded-full bg-[#0F766E] mt-1.5 shrink-0" />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-600 text-[#1E293B] text-[13px]">
                {STATUS_LABELS[entry.status]}
              </span>
              <span className="text-[11px] text-[#94A3B8]">
                {new Date(entry.updatedAt).toLocaleDateString()}
              </span>
            </div>
            {entry.message && (
              <p className="text-[13px] text-[#64748B] mt-1">{entry.message}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

/* =========================================================
   ISSUE DETAIL
========================================================= */

function FollowButton({ issueId }) {
  const { data: savedIssues } = useSavedIssues();
  const isSaved = useIsIssueSaved(issueId, savedIssues);
  const saveIssue = useSaveIssue();
  const unsaveIssue = useUnsaveIssue();

  const handleToggle = () => {
    if (isSaved) {
      unsaveIssue.mutate(issueId);
    } else {
      saveIssue.mutate(issueId);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={saveIssue.isPending || unsaveIssue.isPending}
      className={`w-full flex items-center justify-center gap-2 text-[13px] font-600 py-2.5 rounded-xl transition-colors ${
        isSaved
          ? "bg-[#0F766E]/10 text-[#0F766E] border border-[#0F766E]/20"
          : "border border-[#E2E8F0] text-[#1E293B] hover:border-[#0F766E]/30 hover:text-[#0F766E]"
      }`}
    >
      🔔 {isSaved ? "Following" : "Follow this Issue"}
    </button>
  );
}

const STATUS_FLOW = [
  "reported",
  "under_review",
  "action_planned",
  "in_progress",
  "resolved",
];

function StatusUpdatePanel({ issue }) {
  const [newStatus, setNewStatus] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const updateStatus = useUpdateIssueStatus(issue._id);

  const currentIndex = STATUS_FLOW.indexOf(issue.status);

  const handlePost = async () => {
    setError("");
    if (!newStatus) {
      setError("Select a status to update to");
      return;
    }

    try {
      await updateStatus.mutateAsync({
        status: newStatus,
        message: message.trim(),
      });
      setMessage("");
      setNewStatus("");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Couldn't update status. Please try again.",
      );
    }
  };

  return (
    <div className="bg-white border border-[#0F766E]/20 rounded-2xl p-4">
      <div className="text-[11px] font-600 text-[#0F766E] uppercase tracking-wider mb-3">
        Representative Action
      </div>

      {error && <p className="text-[12px] text-[#DC2626] mb-2">{error}</p>}

      <select
        value={newStatus}
        onChange={(e) => setNewStatus(e.target.value)}
        className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-[13px] text-[#1E293B] mb-2 focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E]"
      >
        <option value="">Change status...</option>
        {STATUS_FLOW.map((s, i) => (
          <option key={s} value={s} disabled={i < currentIndex}>
            {STATUS_LABELS[s]}
          </option>
        ))}
      </select>

      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Update message for the community..."
        rows={3}
        className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-[13px] text-[#1E293B] placeholder-[#94A3B8] resize-none mb-2 focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E]"
      />

      <button
        onClick={handlePost}
        disabled={!newStatus || updateStatus.isPending}
        className="w-full bg-[#0F766E] hover:bg-[#115E59] text-white text-[13px] font-600 py-2 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {updateStatus.isPending ? "Posting Update..." : "Post Update"}
      </button>
    </div>
  );
}

export default function IssueDetail() {
  const { issueId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState("discussion");
  const [activeImage, setActiveImage] = useState(0);

  const { data: issue, isLoading, error } = useIssue(issueId);
  const { data: voteStatus } = useVoteStatus("Issue", issueId);
  const castVote = useCastVote("Issue", issueId);

  const handleSupport = () => {
    castVote.mutate("support");
  };

  const handlePreviousImage = () => {
    setActiveImage((prev) => (prev === 0 ? issue.images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setActiveImage((prev) => (prev === issue.images.length - 1 ? 0 : prev + 1));
  };

  if (isLoading) {
    return <div className="p-6 text-[#94A3B8] text-sm">Loading issue...</div>;
  }

  if (error || !issue) {
    return <div className="p-6 text-[#DC2626] text-sm">Issue not found.</div>;
  }

  const hasVoted = voteStatus?.value === "support";

  const repCommunityId =
    user?.representativeInfo?.community?._id ||
    user?.representativeInfo?.community;
  const issueCommunityId = issue.community?._id || issue.community;

  const canManageThisIssue =
    user?.role === "representative" &&
    repCommunityId &&
    issueCommunityId &&
    repCommunityId.toString() === issueCommunityId.toString();

  return (
    <div>
      <button
        onClick={() => navigate("/issues")}
        className="flex items-center gap-1.5 text-[#64748B] text-sm hover:text-[#1E293B] mb-4 transition-colors"
      >
        ← Back to Issues
      </button>

      <div className="grid grid-cols-[minmax(0,1fr)] lg:grid-cols-[minmax(0,1fr)_320px] gap-6">
        <div>
          {issue.images?.length > 0 && (
            <div className="mb-5">
              <div className="relative w-full h-72 bg-[#F8FAFC] rounded-2xl overflow-hidden">
                <img
                  src={issue.images[activeImage]}
                  alt={`${issue.title} - image ${activeImage + 1}`}
                  className="w-full h-full object-cover"
                />

                {issue.images.length > 1 && (
                  <button
                    type="button"
                    onClick={handlePreviousImage}
                    aria-label="Previous image"
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 text-[#1E293B] shadow-md flex items-center justify-center text-xl hover:bg-white transition-colors"
                  >
                    ←
                  </button>
                )}

                {issue.images.length > 1 && (
                  <button
                    type="button"
                    onClick={handleNextImage}
                    aria-label="Next image"
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 text-[#1E293B] shadow-md flex items-center justify-center text-xl hover:bg-white transition-colors"
                  >
                    →
                  </button>
                )}

                {issue.images.length > 1 && (
                  <div className="absolute bottom-3 right-3 bg-black/60 text-white text-[11px] font-600 px-2.5 py-1 rounded-full">
                    {activeImage + 1} / {issue.images.length}
                  </div>
                )}
              </div>

              {issue.images.length > 1 && (
                <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                  {issue.images.map((image, index) => (
                    <button
                      key={`${image}-${index}`}
                      type="button"
                      onClick={() => setActiveImage(index)}
                      aria-label={`View image ${index + 1}`}
                      className={`shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                        activeImage === index
                          ? "border-[#0F766E]"
                          : "border-transparent opacity-70 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="text-[12px] text-[#64748B]">
              🚗 {issue.category}
            </span>
            <span
              className={`text-[11px] font-600 px-2.5 py-1 rounded-full ${
                STATUS_BADGE_STYLES[issue.status]
              }`}
            >
              {STATUS_LABELS[issue.status]}
            </span>
          </div>

          <h1 className="font-display font-800 text-[#1E293B] text-2xl mb-2">
            {issue.title}
          </h1>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-[#64748B] mb-5">
            <span>
              📍 {issue.community?.name}
              {issue.community?.parent?.name &&
                `, ${issue.community.parent.name}`}
            </span>
            <span>
              Reported {new Date(issue.createdAt).toLocaleDateString()}
            </span>
          </div>

          <p className="text-[14px] text-[#1E293B] leading-relaxed mb-6">
            {issue.description}
          </p>

          <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-[#E2E8F0]">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[#0F766E]/10 text-[#0F766E] font-700 text-[13px] flex items-center justify-center">
                {issue.reportedBy?.name?.[0]?.toUpperCase() || "U"}
              </div>
              <div>
                <div className="font-600 text-[#1E293B] text-[13px]">
                  {issue.reportedBy?.name}
                </div>
                <div className="text-[11px] text-[#94A3B8]">Issue Reporter</div>
              </div>
            </div>

            <button
              onClick={handleSupport}
              disabled={castVote.isPending}
              className={`flex items-center gap-1.5 text-[13px] font-600 px-4 py-2 rounded-lg border-2 transition-colors ${
                hasVoted
                  ? "bg-[#0F766E] border-[#0F766E] text-white"
                  : "border-[#0F766E] text-[#0F766E] hover:bg-[#0F766E]/5"
              }`}
            >
              <ThumbsUp size={14} />
              {hasVoted ? "Supported" : "Support"} · {issue.supportCount}
            </button>
          </div>

          <div className="flex items-center gap-1 mt-5 border-b border-[#E2E8F0] overflow-x-auto">
            {[
              { key: "discussion", label: "Discussion" },
              { key: "proposals", label: "Proposals" },
              { key: "timeline", label: "Timeline" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2.5 text-[13px] font-600 border-b-2 transition-colors ${
                  activeTab === tab.key
                    ? "border-[#0F766E] text-[#0F766E]"
                    : "border-transparent text-[#64748B] hover:text-[#1E293B]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === "discussion" && <DiscussionTab issueId={issueId} totalComments={issue.commentCount} />}
          {activeTab === "proposals" && <ProposalsTab issueId={issueId} />}
          {activeTab === "timeline" && (
            <TimelineTab statusHistory={issue.statusHistory} />
          )}
        </div>

        <div className="space-y-4">
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4">
            <div className="text-[11px] font-600 text-[#94A3B8] uppercase tracking-wider mb-2">
              Issue Status
            </div>
            <span
              className={`inline-block text-[12px] font-600 px-3 py-1 rounded-full ${
                STATUS_BADGE_STYLES[issue.status]
              }`}
            >
              {STATUS_LABELS[issue.status]}
            </span>
          </div>

          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4">
            <div className="text-[11px] font-600 text-[#94A3B8] uppercase tracking-wider mb-3">
              Participation
            </div>
            <div className="space-y-2 text-[13px]">
              <div className="flex items-center justify-between">
                <span className="text-[#64748B]">▲ Supporters</span>
                <span className="font-600 text-[#1E293B]">
                  {issue.supportCount}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#64748B]">💬 Comments</span>
                <span className="font-600 text-[#1E293B]">
                  {issue.commentCount ?? "-"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#64748B]">💡 Proposals</span>
                <span className="font-600 text-[#1E293B]">
                  {issue.proposalCount ?? "-"}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4">
            <div className="text-[11px] font-600 text-[#94A3B8] uppercase tracking-wider mb-3">
              Quick Progress
            </div>
            <ProgressTimeline currentStatus={issue.status} />
          </div>

          {canManageThisIssue && <StatusUpdatePanel issue={issue} />}

          {issue.status === "resolved" && (
            <ResolutionFeedback issueId={issueId} />
          )}

          <FollowButton issueId={issueId} />
        </div>
      </div>
    </div>
  );
}
