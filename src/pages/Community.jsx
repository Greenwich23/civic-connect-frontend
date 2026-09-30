import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axiosClient from "../apis/axiosClient";
import { useIssues } from "../hooks/useIssues";
import { useAuth } from "../hooks/useAuth";
import IssueCard from "../components/issue/IssueCard";
import IssueCardSkeleton from "../components/issue/IssueCardSkeleton";

function useCommunityProfile(communityId) {
  return useQuery({
    queryKey: ["community", communityId, "profile"],
    queryFn: async () => {
      const { data } = await axiosClient.get(
        `/communities/${communityId}/profile`,
      );
      return data;
    },
    enabled: !!communityId,
  });
}

export default function CommunityPage() {
  const { communityId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data, isLoading } = useCommunityProfile(communityId);
  const { data: recentIssues, isLoading: issuesLoading } = useIssues({
    community: communityId,
    sort: "recent",
  });

  if (isLoading) {
    return (
      <div className="p-6 text-[#94A3B8] text-sm">Loading community...</div>
    );
  }

  if (!data?.community) {
    return (
      <div className="p-6 text-[#DC2626] text-sm">Community not found.</div>
    );
  }

  const { community, stats, representative } = data;

  // getCurrentUser populates `community` into a full object ({ _id, name,
  // parent }), not a plain id string — comparing the object itself would
  // always fail, so the underlying id has to be unwrapped first.
  const userCommunityId = user?.community?._id || user?.community;

  const canReportRepresentative =
    !!representative &&
    !!userCommunityId &&
    String(userCommunityId) === String(community._id) &&
    String(user._id) !== String(representative._id);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-display font-800 text-[#1E293B] text-2xl mb-1">
              {community.name}
              {community.parent?.name ? `, ${community.parent.name}` : ""}
            </h1>
            <span
              className={`text-[11px] font-600 px-2.5 py-1 rounded-full ${
                community.status === "active"
                  ? "bg-green-50 text-green-700"
                  : "bg-amber-50 text-amber-700"
              }`}
            >
              {community.status === "active" ? "Represented" : "Unrepresented"}
            </span>
          </div>

          <button
            onClick={() => navigate("/report-issue")}
            className="bg-[#0F766E] hover:bg-[#115E59] text-white text-[13px] font-600 px-4 py-2.5 rounded-lg transition-colors"
          >
            + Report an Issue
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-6">
          <div className="bg-[#F8FAFC] rounded-xl p-4 text-center">
            <div className="text-2xl font-800 text-[#1E293B]">
              {stats.memberCount}
            </div>
            <div className="text-[12px] text-[#64748B] mt-1">Members</div>
          </div>
          <div className="bg-[#F8FAFC] rounded-xl p-4 text-center">
            <div className="text-2xl font-800 text-[#1E293B]">
              {stats.issueCount}
            </div>
            <div className="text-[12px] text-[#64748B] mt-1">
              Issues Reported
            </div>
          </div>
          <div className="bg-[#F8FAFC] rounded-xl p-4 text-center">
            <div className="text-2xl font-800 text-green-700">
              {stats.resolvedCount}
            </div>
            <div className="text-[12px] text-[#64748B] mt-1">Resolved</div>
          </div>
        </div>
      </div>

      {/* Representative card */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 mb-6">
        <h2 className="font-600 text-[#1E293B] text-[15px] mb-4">
          Community Representative
        </h2>

        {representative ? (
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#0F766E]/10 text-[#0F766E] font-700 text-xl flex items-center justify-center overflow-hidden shrink-0">
              {representative.avatarUrl ? (
                <img
                  src={representative.avatarUrl}
                  alt={representative.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                representative.name?.charAt(0)?.toUpperCase()
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-600 text-[#1E293B] text-[15px]">
                  {representative.name}
                </span>
                {representative.representativeInfo?.isVerifiedOfficial && (
                  <span className="text-[10px] font-600 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700">
                    ✓ Verified Official
                    {representative.representativeInfo.officialTitle &&
                      ` · ${representative.representativeInfo.officialTitle}`}
                  </span>
                )}
              </div>
              <div className="text-[12px] text-[#64748B]">
                Representative since{" "}
                {new Date(
                  representative.representativeInfo?.appointedAt,
                ).toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </div>
            </div>
            {canReportRepresentative && (
              <button
                onClick={() =>
                  navigate(
                    `/report-representative?community=${community._id}`,
                  )
                }
                className="text-[12px] font-600 text-[#DC2626] hover:underline shrink-0"
              >
                Report
              </button>
            )}
          </div>
        ) : (
          <div className="text-center py-6">
            <div className="text-2xl mb-2">🏛️</div>
            <p className="text-[13px] text-[#64748B]">
              This community doesn't have an active representative yet.
            </p>
            <button
              onClick={() => navigate("/signup/community-request")}
              className="mt-3 text-[13px] font-600 text-[#0F766E] hover:underline"
            >
              Apply to represent this community
            </button>
          </div>
        )}
      </div>

      {/* Recent issues */}
      <div>
        <h2 className="font-600 text-[#1E293B] text-[17px] mb-4">
          Recent Issues
        </h2>
        {issuesLoading ? (
          <div className="grid md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <IssueCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-4">
            {recentIssues?.slice(0, 6).map((issue) => (
              <IssueCard
                key={issue._id}
                issue={issue}
                onClick={() => navigate(`/issues/${issue._id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
