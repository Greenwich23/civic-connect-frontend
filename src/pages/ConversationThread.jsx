import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  useConversationMessages,
  useSendMessage,
  useReportMessage,
} from "../hooks/useMessages";

const REPORT_REASONS = [
  { value: "spam", label: "Spam or advertising" },
  { value: "harassment", label: "Harassment or bullying" },
  { value: "misinformation", label: "False information" },
  { value: "off_topic", label: "Off-topic or irrelevant" },
  { value: "other", label: "Something else" },
];

function ReportMessageModal({ isLoading, error, onSubmit, onCancel }) {
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [validationError, setValidationError] = useState("");

  const handleSubmit = () => {
    if (!reason) {
      setValidationError("Choose a reason for reporting this message.");
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
          Report message
        </h3>
        <p className="text-[13px] text-[#64748B] leading-relaxed mb-4">
          Let us know why this message shouldn't have been sent.
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
          placeholder="Tell us more about what's wrong with this message..."
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

function MessageBubble({ message, isOwn, onReport }) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[75%] ${isOwn ? "items-end" : "items-start"} flex flex-col`}>
        <div
          className={`px-3.5 py-2.5 text-[13px] leading-relaxed whitespace-pre-wrap ${
            isOwn
              ? "bg-[#0F766E] text-white rounded-2xl rounded-br-sm"
              : "bg-[#F8FAFC] border border-[#E2E8F0] text-[#1E293B] rounded-2xl rounded-bl-sm"
          }`}
        >
          {message.content}
        </div>

        <div className="flex items-center gap-2 mt-1 px-1">
          <span className="text-[10px] text-[#94A3B8]">
            {new Date(message.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>

          {!isOwn && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowMenu((prev) => !prev)}
                className="text-[10px] text-[#94A3B8] hover:text-[#DC2626]"
              >
                Report
              </button>

              {showMenu && (
                <div className="absolute left-0 top-4 z-10 w-28 bg-white border border-[#E2E8F0] rounded-lg shadow-lg py-1">
                  <button
                    type="button"
                    onClick={() => {
                      onReport(message._id);
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-3 py-1.5 text-[11px] text-[#DC2626] hover:bg-red-50"
                  >
                    Report message
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ConversationThread() {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const currentUserId = user?._id || user?.id;

  const { data, isLoading, isError } = useConversationMessages(conversationId);
  const sendMessage = useSendMessage(conversationId);
  const reportMessage = useReportMessage(conversationId);

  const [text, setText] = useState("");
  const [reportTargetId, setReportTargetId] = useState(null);
  const [reportError, setReportError] = useState("");

  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [data?.messages?.length]);

  const handleSend = async () => {
    const content = text.trim();
    if (!content) return;

    try {
      await sendMessage.mutateAsync(content);
      setText("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleReport = (messageId) => {
    setReportError("");
    setReportTargetId(messageId);
  };

  const submitReport = async ({ reason, details }) => {
    try {
      await reportMessage.mutateAsync({
        messageId: reportTargetId,
        reason,
        details,
      });
      setReportTargetId(null);
    } catch (error) {
      console.error("Failed to report message:", error);
      setReportError("Couldn't report this message. Please try again.");
    }
  };

  const backButton = (
    <button
      onClick={() => navigate("/messages")}
      className="flex items-center gap-1.5 text-[#64748B] text-sm hover:text-[#1E293B] mb-4 transition-colors"
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
      Back to messages
    </button>
  );

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto">
        {backButton}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 animate-pulse space-y-3">
          <div className="h-4 w-1/3 bg-[#E2E8F0] rounded" />
          <div className="h-32 bg-[#F1F5F9] rounded" />
        </div>
      </div>
    );
  }

  if (isError || !data?.conversation) {
    return (
      <div className="max-w-2xl mx-auto">
        {backButton}
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
          <span className="text-lg shrink-0">⚠️</span>
          <p className="text-[13px] text-[#DC2626] leading-relaxed">
            Couldn't load this conversation. You may not have access to it.
          </p>
        </div>
      </div>
    );
  }

  const { conversation, representative, messages } = data;

  const isCitizenViewer =
    String(conversation.citizen?._id || conversation.citizen) ===
    String(currentUserId);

  const otherPartyName = isCitizenViewer
    ? representative?.name || "Representative"
    : conversation.citizen?.name || "Citizen";

  const otherPartyInitial = otherPartyName?.[0]?.toUpperCase() || "?";

  return (
    <div className="max-w-2xl mx-auto">
      {backButton}

      <div className="bg-white rounded-2xl border border-[#E2E8F0] civic-shadow overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-3 p-4 border-b border-[#E2E8F0]">
          <div className="w-10 h-10 rounded-full bg-[#0F766E]/10 text-[#0F766E] font-700 text-[14px] flex items-center justify-center shrink-0">
            {otherPartyInitial}
          </div>
          <div className="min-w-0">
            <div className="text-[14px] font-600 text-[#1E293B] truncate">
              {otherPartyName}
              {!isCitizenViewer && (
                <span className="text-[11px] font-500 text-[#94A3B8]">
                  {" "}
                  · Citizen
                </span>
              )}
              {isCitizenViewer && (
                <span className="text-[11px] font-500 text-[#94A3B8]">
                  {" "}
                  · Representative
                </span>
              )}
            </div>
            <div className="text-[12px] text-[#64748B] truncate">
              {conversation.community?.name}
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="max-h-[55vh] overflow-y-auto p-4 space-y-3">
          {messages.length === 0 ? (
            <div className="text-center py-10">
              <div className="text-2xl mb-2">👋</div>
              <p className="text-[13px] text-[#64748B]">
                Say hello — this is the start of your conversation with{" "}
                {otherPartyName}.
              </p>
            </div>
          ) : (
            messages.map((message) => (
              <MessageBubble
                key={message._id}
                message={message}
                isOwn={
                  String(message.sender?._id || message.sender) ===
                  String(currentUserId)
                }
                onReport={handleReport}
              />
            ))
          )}
          <div ref={bottomRef} />
        </div>

        {/* Composer */}
        <div className="border-t border-[#E2E8F0] p-3">
          {sendMessage.isError && (
            <p className="text-[11px] text-[#DC2626] mb-2 px-1">
              Failed to send. Please try again.
            </p>
          )}
          <div className="flex items-end gap-2">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Message ${otherPartyName}...`}
              rows={1}
              maxLength={2000}
              disabled={sendMessage.isPending}
              className="flex-1 resize-none rounded-xl border border-[#CBD5E1] px-3.5 py-2.5 text-[13px] text-[#1E293B] placeholder:text-[#94A3B8] outline-none focus:border-[#0F766E] focus:ring-1 focus:ring-[#0F766E] disabled:bg-[#F8FAFC]"
            />
            <button
              type="button"
              onClick={handleSend}
              disabled={!text.trim() || sendMessage.isPending}
              className="px-4 py-2.5 rounded-xl text-[13px] font-600 bg-[#0F766E] text-white hover:bg-[#115E59] transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
            >
              {sendMessage.isPending ? "..." : "Send"}
            </button>
          </div>
        </div>
      </div>

      {reportTargetId && (
        <ReportMessageModal
          isLoading={reportMessage.isPending}
          error={reportError}
          onSubmit={submitReport}
          onCancel={() => setReportTargetId(null)}
        />
      )}
    </div>
  );
}
