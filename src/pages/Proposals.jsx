import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useCommunityProposals } from "../hooks/useProposals";
import { useVoteStatus, useCastVote } from "../hooks/useVotes";

function ProposalRow({ proposal }) {
  const navigate = useNavigate();
  const { data: voteStatus } = useVoteStatus("Proposal", proposal._id);
  const castVote = useCastVote("Proposal", proposal._id);

  const support = proposal.supportCount || 0;
  const oppose = proposal.opposeCount || 0;
  const total = support + oppose;
  const pct = total > 0 ? Math.round((support / total) * 100) : 0;

  const hasSupported = voteStatus?.value === "support";
  const hasOpposed = voteStatus?.value === "oppose";

  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6">
      <h3 className="font-600 text-[#1E293B] text-[16px] mb-3">
        {proposal.title}
      </h3>

      <div className="flex items-center justify-between mb-2">
        <span className="text-[13px] font-600 text-[#0F766E]">
          {pct}% community support
        </span>
        <span className="text-[13px] text-[#64748B]">{total} votes</span>
      </div>

      <div className="h-2 bg-[#F1F5F9] rounded-full overflow-hidden mb-4">
        <div
          className="h-full bg-[#0F766E] rounded-full transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => castVote.mutate("support")}
            disabled={castVote.isPending}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13px] font-600 transition-colors ${
              hasSupported
                ? "bg-[#0F766E] text-white"
                : "bg-[#0F766E]/10 text-[#0F766E] hover:bg-[#0F766E]/20"
            }`}
          >
            👍 Support ({support})
          </button>

          <button
            onClick={() => castVote.mutate("oppose")}
            disabled={castVote.isPending}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13px] font-500 transition-colors ${
              hasOpposed
                ? "bg-amber-100 text-amber-800"
                : "bg-amber-50 text-amber-700 hover:bg-amber-100"
            }`}
          >
            👎 Oppose ({oppose})
          </button>
        </div>

        <button
          onClick={() => navigate(`/issues/${proposal.issue?._id}`)}
          className="text-[13px] font-600 text-[#0F766E] hover:underline"
        >
          View Issue →
        </button>
      </div>
    </div>
  );
}

function ProposalSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 animate-pulse">
      <div className="h-5 w-2/3 bg-[#F1F5F9] rounded mb-4" />
      <div className="h-3 w-1/3 bg-[#F1F5F9] rounded mb-2" />
      <div className="h-2 w-full bg-[#F1F5F9] rounded-full mb-4" />
      <div className="h-9 w-full bg-[#F1F5F9] rounded-lg" />
    </div>
  );
}

export default function CommunityProposals() {
  const { user } = useAuth();
  const communityId = user?.community?._id || user?.community;

  const { data: proposals, isLoading } = useCommunityProposals(communityId);

  return (
    <div>
      <h1 className="font-display font-800 text-[#1E293B] text-3xl mb-1">
        Community Proposals
      </h1>
      <p className="text-[13px] text-[#64748B] mb-6">
        Vote on proposed solutions to active community issues.
      </p>

      {!communityId && (
        <div className="text-center py-16">
          <p className="text-[#94A3B8] text-[14px]">
            Join a community to see proposals.
          </p>
        </div>
      )}

      {communityId && (
        <div className="space-y-4">
          {isLoading &&
            Array.from({ length: 3 }).map((_, i) => (
              <ProposalSkeleton key={i} />
            ))}

          {!isLoading && proposals?.length === 0 && (
            <div className="text-center py-16">
              <p className="text-[#94A3B8] text-[14px]">
                No proposals yet in your community.
              </p>
            </div>
          )}

          {!isLoading &&
            proposals?.map((proposal) => (
              <ProposalRow key={proposal._id} proposal={proposal} />
            ))}
        </div>
      )}
    </div>
  );
}
