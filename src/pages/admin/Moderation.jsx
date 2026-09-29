import { useState } from "react";
import { Link } from "react-router-dom";
import {
  useFlaggedComments,
  useModerateComment,
  useFlaggedMessages,
  useModerateMessage,
} from "../../hooks/useAdminModeration";

function CardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 animate-pulse">
      <div className="h-3 w-40 bg-[#E2E8F0] rounded mb-4" />
      <div className="h-4 w-full bg-[#E2E8F0] rounded mb-2" />
      <div className="h-4 w-2/3 bg-[#E2E8F0] rounded" />
    </div>
  );
}

function TabButton({ active, label, count, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`text-[13px] font-600 px-4 py-2 rounded-lg transition-colors ${
        active
          ? "bg-[#0F766E] text-white"
          : "text-[#64748B] hover:bg-[#F8FAFC]"
      }`}
    >
      {label}
      {count > 0 && (
        <span
          className={`ml-1.5 text-[11px] ${active ? "text-white/80" : "text-[#94A3B8]"}`}
        >
          ({count})
        </span>
      )}
    </button>
  );
}

function Pagination({ pagination, page, setPage, isFetching }) {
  if (!pagination || pagination.totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between mt-4">
      <p className="text-[12px] text-[#64748B]">
        Page {pagination.page} of {pagination.totalPages}
      </p>
      <div className="flex gap-2">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page <= 1 || isFetching}
          className="text-[12px] font-600 px-3 py-1.5 rounded-lg border border-[#E2E8F0] text-[#64748B] hover:border-[#0F766E]/40 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <button
          onClick={() => setPage((p) => Math.min(p + 1, pagination.totalPages))}
          disabled={page >= pagination.totalPages || isFetching}
          className="text-[12px] font-600 px-3 py-1.5 rounded-lg border border-[#E2E8F0] text-[#64748B] hover:border-[#0F766E]/40 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
}

function CommentsModeration() {
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching, isError } = useFlaggedComments({
    page,
    limit: 20,
  });
  const moderateMutation = useModerateComment();

  const [actionError, setActionError] = useState("");
  const [pendingId, setPendingId] = useState(null);

  const comments = data?.comments || [];
  const pagination = data?.pagination;

  const handleModerate = async (comment, moderationStatus) => {
    setActionError("");
    setPendingId(comment._id);

    try {
      await moderateMutation.mutateAsync({
        commentId: comment._id,
        moderationStatus,
      });
    } catch (err) {
      setActionError(
        err.response?.data?.message ||
          "Couldn't update this comment. Please try again.",
      );
    } finally {
      setPendingId(null);
    }
  };

  return (
    <>
      {actionError && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl mb-4">
          <span className="text-lg shrink-0">⚠️</span>
          <p className="text-[13px] text-[#DC2626] leading-relaxed">
            {actionError}
          </p>
        </div>
      )}

      {isError && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl mb-4">
          <span className="text-lg shrink-0">⚠️</span>
          <p className="text-[13px] text-[#DC2626] leading-relaxed">
            Couldn't load flagged comments. Please refresh and try again.
          </p>
        </div>
      )}

      <div className="space-y-4">
        {isLoading &&
          Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)}

        {!isLoading &&
          comments.map((comment) => {
            const isPending = pendingId === comment._id;

            return (
              <div
                key={comment._id}
                className="bg-white rounded-2xl border border-[#E2E8F0] p-5 civic-shadow"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#0F766E]/10 text-[#0F766E] font-700 text-[12px] flex items-center justify-center shrink-0">
                      {comment.author?.name?.[0]?.toUpperCase() || "?"}
                    </div>
                    <div>
                      <div className="text-[13px] font-600 text-[#1E293B]">
                        {comment.author?.name || "Unknown user"}
                      </div>
                      <div className="text-[12px] text-[#64748B]">
                        {comment.author?.email}
                      </div>
                    </div>
                  </div>

                  <span className="shrink-0 text-[11px] font-600 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700">
                    🚩 Flagged
                    {comment.reportCount > 1 && ` · ${comment.reportCount} reports`}
                  </span>
                </div>

                <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4 mb-3">
                  <p className="text-[14px] text-[#1E293B] leading-relaxed whitespace-pre-wrap">
                    {comment.content}
                  </p>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <div className="text-[12px] text-[#64748B]">
                    On{" "}
                    {comment.issue ? (
                      <Link
                        to={`/issues/${comment.issue._id}`}
                        className="text-[#0F766E] font-600 hover:underline"
                      >
                        {comment.issue.title}
                      </Link>
                    ) : (
                      <span className="text-[#94A3B8]">a deleted issue</span>
                    )}
                    {" · "}
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </div>

                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => handleModerate(comment, "hidden")}
                      disabled={isPending}
                      className="text-[12px] font-600 px-3 py-1.5 rounded-lg border border-[#DC2626] text-[#DC2626] hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isPending ? "Saving..." : "Hide"}
                    </button>
                    <button
                      onClick={() => handleModerate(comment, "visible")}
                      disabled={isPending}
                      className="text-[12px] font-600 px-3 py-1.5 rounded-lg border border-[#0F766E] text-[#0F766E] hover:bg-[#0F766E]/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isPending ? "Saving..." : "Restore"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
      </div>

      {!isLoading && comments.length === 0 && (
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-10 text-center">
          <div className="text-3xl mb-2">🎉</div>
          <p className="text-[14px] font-600 text-[#1E293B] mb-1">
            Nothing to moderate
          </p>
          <p className="text-[13px] text-[#64748B]">
            There are no flagged comments right now.
          </p>
        </div>
      )}

      <Pagination
        pagination={pagination}
        page={page}
        setPage={setPage}
        isFetching={isFetching}
      />
    </>
  );
}

function MessagesModeration() {
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching, isError } = useFlaggedMessages({
    page,
    limit: 20,
  });
  const moderateMutation = useModerateMessage();

  const [actionError, setActionError] = useState("");
  const [pendingId, setPendingId] = useState(null);

  const messages = data?.messages || [];
  const pagination = data?.pagination;

  const handleModerate = async (message, moderationStatus) => {
    setActionError("");
    setPendingId(message._id);

    try {
      await moderateMutation.mutateAsync({
        messageId: message._id,
        moderationStatus,
      });
    } catch (err) {
      setActionError(
        err.response?.data?.message ||
          "Couldn't update this message. Please try again.",
      );
    } finally {
      setPendingId(null);
    }
  };

  return (
    <>
      {actionError && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl mb-4">
          <span className="text-lg shrink-0">⚠️</span>
          <p className="text-[13px] text-[#DC2626] leading-relaxed">
            {actionError}
          </p>
        </div>
      )}

      {isError && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl mb-4">
          <span className="text-lg shrink-0">⚠️</span>
          <p className="text-[13px] text-[#DC2626] leading-relaxed">
            Couldn't load flagged messages. Please refresh and try again.
          </p>
        </div>
      )}

      <div className="space-y-4">
        {isLoading &&
          Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)}

        {!isLoading &&
          messages.map((message) => {
            const isPending = pendingId === message._id;
            const citizen = message.conversation?.citizen;
            const community = message.conversation?.community;

            return (
              <div
                key={message._id}
                className="bg-white rounded-2xl border border-[#E2E8F0] p-5 civic-shadow"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#0F766E]/10 text-[#0F766E] font-700 text-[12px] flex items-center justify-center shrink-0">
                      {message.sender?.name?.[0]?.toUpperCase() || "?"}
                    </div>
                    <div>
                      <div className="text-[13px] font-600 text-[#1E293B]">
                        {message.sender?.name || "Unknown user"}
                        {message.sender?.role === "representative" && (
                          <span className="ml-1.5 text-[10px] font-600 px-1.5 py-0.5 rounded-full bg-[#0F766E]/10 text-[#0F766E]">
                            Representative
                          </span>
                        )}
                      </div>
                      <div className="text-[12px] text-[#64748B]">
                        {message.sender?.email}
                      </div>
                    </div>
                  </div>

                  <span className="shrink-0 text-[11px] font-600 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700">
                    🚩 Flagged
                  </span>
                </div>

                <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4 mb-3">
                  <p className="text-[14px] text-[#1E293B] leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </p>
                </div>

                {message.reportReason && (
                  <p className="text-[12px] text-[#64748B] mb-3">
                    Reported for:{" "}
                    <span className="font-600 text-[#1E293B] capitalize">
                      {message.reportReason.replace("_", " ")}
                    </span>
                    {message.reportDetails && ` — "${message.reportDetails}"`}
                  </p>
                )}

                <div className="flex items-center justify-between gap-4">
                  <div className="text-[12px] text-[#64748B]">
                    Conversation between{" "}
                    <span className="font-600 text-[#1E293B]">
                      {citizen?.name || "a citizen"}
                    </span>{" "}
                    and their representative in{" "}
                    <span className="font-600 text-[#1E293B]">
                      {community?.name || "a community"}
                    </span>
                    {" · "}
                    {new Date(message.createdAt).toLocaleDateString()}
                  </div>

                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => handleModerate(message, "hidden")}
                      disabled={isPending}
                      className="text-[12px] font-600 px-3 py-1.5 rounded-lg border border-[#DC2626] text-[#DC2626] hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isPending ? "Saving..." : "Hide"}
                    </button>
                    <button
                      onClick={() => handleModerate(message, "visible")}
                      disabled={isPending}
                      className="text-[12px] font-600 px-3 py-1.5 rounded-lg border border-[#0F766E] text-[#0F766E] hover:bg-[#0F766E]/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isPending ? "Saving..." : "Restore"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
      </div>

      {!isLoading && messages.length === 0 && (
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-10 text-center">
          <div className="text-3xl mb-2">🎉</div>
          <p className="text-[14px] font-600 text-[#1E293B] mb-1">
            Nothing to moderate
          </p>
          <p className="text-[13px] text-[#64748B]">
            There are no flagged messages right now.
          </p>
        </div>
      )}

      <Pagination
        pagination={pagination}
        page={page}
        setPage={setPage}
        isFetching={isFetching}
      />
    </>
  );
}

export default function Moderation() {
  const [tab, setTab] = useState("comments");

  const { data: commentsData } = useFlaggedComments({ page: 1, limit: 1 });
  const { data: messagesData } = useFlaggedMessages({ page: 1, limit: 1 });

  return (
    <div>
      <h1 className="font-display font-800 text-[#1E293B] text-3xl mb-1">
        Moderation
      </h1>
      <p className="text-[13px] text-[#64748B] mb-6">
        Content citizens have flagged for review.
      </p>

      <div className="flex items-center gap-1 bg-white border border-[#E2E8F0] rounded-xl p-1 mb-5 w-fit">
        <TabButton
          active={tab === "comments"}
          label="Comments"
          count={commentsData?.pagination?.total}
          onClick={() => setTab("comments")}
        />
        <TabButton
          active={tab === "messages"}
          label="Messages"
          count={messagesData?.pagination?.total}
          onClick={() => setTab("messages")}
        />
      </div>

      {tab === "comments" ? <CommentsModeration /> : <MessagesModeration />}
    </div>
  );
}
