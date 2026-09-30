import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useCommunity } from "../hooks/useCommunities";
import { useMyConversations, useStartConversation } from "../hooks/useMessages";

function timeAgo(dateString) {
  const diffMs = Date.now() - new Date(dateString).getTime();
  const minutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

function ConversationRowSkeleton() {
  return (
    <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 animate-pulse flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-[#E2E8F0] shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-3.5 w-1/3 bg-[#E2E8F0] rounded" />
        <div className="h-3 w-2/3 bg-[#F1F5F9] rounded" />
      </div>
    </div>
  );
}

// Representative view — an inbox of every citizen who has messaged them
function RepresentativeInbox() {
  const { data: conversations, isLoading, isError } = useMyConversations();

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="font-display font-800 text-[#1E293B] text-2xl sm:text-3xl mb-1">
        Messages
      </h1>
      <p className="text-[13px] text-[#64748B] mb-6">
        Private messages from citizens in your community.
      </p>

      {isError && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl mb-4">
          <span className="text-lg shrink-0">⚠️</span>
          <p className="text-[13px] text-[#DC2626] leading-relaxed">
            Couldn't load your messages. Please refresh and try again.
          </p>
        </div>
      )}

      <div className="space-y-3">
        {isLoading &&
          Array.from({ length: 3 }).map((_, i) => (
            <ConversationRowSkeleton key={i} />
          ))}

        {!isLoading &&
          conversations?.map((conversation) => (
            <Link
              key={conversation._id}
              to={`/messages/${conversation._id}`}
              className="flex items-center gap-3 bg-white border border-[#E2E8F0] rounded-2xl p-4 hover:shadow-md transition-shadow"
            >
              <div className="w-10 h-10 rounded-full bg-[#0F766E]/10 text-[#0F766E] font-700 text-[13px] flex items-center justify-center shrink-0">
                {conversation.citizen?.name?.[0]?.toUpperCase() || "?"}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[13px] font-600 text-[#1E293B] truncate">
                    {conversation.citizen?.name || "Unknown citizen"}
                  </span>
                  {conversation.lastMessage && (
                    <span className="text-[11px] text-[#94A3B8] shrink-0">
                      {timeAgo(conversation.lastMessage.createdAt)}
                    </span>
                  )}
                </div>
                <p className="text-[12px] text-[#64748B] truncate">
                  {conversation.lastMessage?.content || "No messages yet"}
                </p>
              </div>

              {conversation.unreadCount > 0 && (
                <span className="bg-[#0F766E] text-white text-[10px] font-700 min-w-[18px] h-[18px] flex items-center justify-center rounded-full px-1 shrink-0">
                  {conversation.unreadCount > 99
                    ? "99+"
                    : conversation.unreadCount}
                </span>
              )}
            </Link>
          ))}
      </div>

      {!isLoading && !isError && conversations?.length === 0 && (
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-10 text-center">
          <div className="text-3xl mb-2">💬</div>
          <p className="text-[14px] font-600 text-[#1E293B] mb-1">
            No messages yet
          </p>
          <p className="text-[13px] text-[#64748B]">
            Citizens in your community can message you privately — you'll see
            their threads here.
          </p>
        </div>
      )}
    </div>
  );
}

// Citizen view — resumes their one thread with the community's representative,
// or offers to start it
function CitizenEntry() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const myCommunityId = user?.community?._id || user?.community || null;
  const { community: myCommunity, loading: communityLoading } =
    useCommunity(myCommunityId);

  const { data: conversations, isLoading: conversationsLoading } =
    useMyConversations();
  const startConversation = useStartConversation();
  const [startError, setStartError] = useState("");

  // Already has a thread — jump straight into it instead of showing this page
  useEffect(() => {
    if (conversations?.length > 0) {
      navigate(`/messages/${conversations[0]._id}`, { replace: true });
    }
  }, [conversations, navigate]);

  const handleStart = async () => {
    setStartError("");
    try {
      const { data } = await startConversation.mutateAsync();
      navigate(`/messages/${data.conversation._id}`);
    } catch (err) {
      setStartError(
        err.response?.data?.message ||
          "Couldn't start a conversation. Please try again.",
      );
    }
  };

  if (conversationsLoading || communityLoading) {
    return (
      <div className="max-w-lg mx-auto px-4 py-24 text-center text-[#64748B] text-sm">
        Loading...
      </div>
    );
  }

  // Conversations exist — the redirect effect above will navigate away
  if (conversations?.length > 0) return null;

  return (
    <div className="max-w-lg mx-auto px-4 md:px-8 py-16 text-center">
      <div className="w-16 h-16 rounded-full bg-[#0F766E]/10 text-[#0F766E] flex items-center justify-center mx-auto mb-6 text-2xl">
        💬
      </div>

      <h1 className="font-display font-800 text-[#1E293B] text-2xl mb-2">
        Message Your Representative
      </h1>

      {!myCommunityId ? (
        <>
          <p className="text-[#64748B] text-[15px] leading-relaxed mb-6">
            You're not part of a community yet, so there's no representative
            to message.
          </p>
          <button
            onClick={() => navigate("/communities")}
            className="bg-[#0F766E] hover:bg-[#115E59] text-white font-600 text-sm px-6 py-2.5 rounded-xl transition-colors"
          >
            Join a Community
          </button>
        </>
      ) : myCommunity?.status !== "active" ? (
        <p className="text-[#64748B] text-[15px] leading-relaxed">
          <span className="font-600 text-[#1E293B]">{myCommunity?.name}</span>{" "}
          doesn't have a representative right now, so there's no one to
          message yet.
        </p>
      ) : (
        <>
          <p className="text-[#64748B] text-[15px] leading-relaxed mb-6">
            Send a private message to {myCommunity?.name}'s representative —
            for anything that isn't tied to a specific reported issue.
          </p>

          {startError && (
            <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl mb-6 text-left">
              <span className="text-lg shrink-0">⚠️</span>
              <p className="text-[13px] text-[#DC2626] leading-relaxed">
                {startError}
              </p>
            </div>
          )}

          <button
            onClick={handleStart}
            disabled={startConversation.isPending}
            className="bg-[#0F766E] hover:bg-[#115E59] text-white font-600 text-sm px-6 py-2.5 rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {startConversation.isPending
              ? "Starting..."
              : "Message My Representative"}
          </button>
        </>
      )}
    </div>
  );
}

export default function Messages() {
  const { user } = useAuth();

  const isActiveRep =
    user?.role === "representative" && user?.representativeInfo?.isActive;

  return isActiveRep ? <RepresentativeInbox /> : <CitizenEntry />;
}
