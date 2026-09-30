/* eslint-disable no-unused-vars */
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useIssues, useTrendingIssues } from "../hooks/useIssues.js";

function StatCard({ value, label, color }) {
  const colorMap = {
    slate: "bg-[#F1F5F9] text-[#1E293B]",
    amber: "bg-amber-50 text-amber-700",
    blue: "bg-blue-50 text-blue-700",
    green: "bg-green-50 text-green-700",
  };

  return (
    <div className={`rounded-xl p-5 ${colorMap[color]}`}>
      <div className="text-3xl font-800">{value}</div>
      <div className="text-[13px] mt-1 opacity-80">{label}</div>
    </div>
  );
}

function IssueCard({
  id,
  image,
  categoryIcon,
  category,
  status,
  statusColor,
  title,
  location,
  supports,
  comments,
  onClick,
}) {
  const statusColorMap = {
    reported: "bg-blue-50 text-blue-700",
    under_review: "bg-amber-50 text-amber-700",
    action_planned: "bg-purple-50 text-purple-700",
    in_progress: "bg-orange-50 text-orange-700",
    resolved: "bg-green-50 text-green-700",
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
    >
      {image && (
        <img src={image} alt={title} className="w-full h-36 object-cover" />
      )}

      <div className="p-4">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <span className="text-[12px] text-[#64748B] flex items-center gap-1">
            {categoryIcon} {category}
          </span>

          <span
            className={`text-[11px] font-600 px-2 py-0.5 rounded-full ${
              statusColorMap[statusColor] || "bg-slate-100 text-slate-600"
            }`}
          >
            {status}
          </span>
        </div>

        <h3 className="font-600 text-[#1E293B] text-[14px] mb-2 leading-snug">
          {title}
        </h3>

        <div className="flex items-center justify-between text-[12px] text-[#64748B]">
          <span className="truncate">
            📍 {location || "Location not provided"}
          </span>

          <span className="flex items-center gap-3 shrink-0 ml-2">
            <span>▲ {supports}</span>
            <span>💬 {comments}</span>
          </span>
        </div>
      </div>
    </div>
  );
}

/*
=========================================================
HELPER FUNCTIONS
=========================================================
*/

function formatStatus(status) {
  const labels = {
    reported: "Reported",
    under_review: "Under Discussion",
    action_planned: "Action Planned",
    in_progress: "In Progress",
    resolved: "Resolved",
  };

  return (
    labels[status] ||
    status
      ?.replace(/_/g, " ")
      ?.replace(/\b\w/g, (char) => char.toUpperCase()) ||
    "Reported"
  );
}

function getStatusColor(status) {
  const colors = {
    reported: "reported",
    under_review: "under_review",
    action_planned: "action_planned",
    in_progress: "in_progress",
    resolved: "resolved",
  };

  return colors[status] || "reported";
}

function getStatusBadgeStyle(status) {
  const styles = {
    reported: "bg-blue-50 text-blue-700",
    under_review: "bg-amber-50 text-amber-700",
    action_planned: "bg-purple-50 text-purple-700",
    in_progress: "bg-orange-50 text-orange-700",
    resolved: "bg-green-50 text-green-700",
  };

  return styles[status] || "bg-slate-100 text-slate-600";
}

function getCategoryIcon(category) {
  const icons = {
    roads: "🚗",
    transportation: "🚗",
    "roads & transportation": "🚗",
    lighting: "💡",
    "street lighting": "💡",
    waste: "♻️",
    "waste management": "♻️",
    water: "💧",
    sanitation: "🚰",
    security: "🛡️",
    safety: "🛡️",
    environment: "🌳",
    electricity: "⚡",
    drainage: "🌊",
  };

  const normalized = category?.toLowerCase();
  return icons[normalized] || "📌";
}

function getCategoryLabel(category) {
  const labels = {
    roads: "Roads & Transportation",
    lighting: "Street Lighting",
    waste: "Waste Management",
    water: "Water",
    safety: "Safety",
    environment: "Environment",
    public: "Public Facilities",
  };

  return labels[category] || category || "Community Issue";
}

function getIssueLocation(issue) {
  if (issue.locationText) {
    return issue.locationText;
  }

  if (issue.location) {
    if (typeof issue.location === "string") {
      return issue.location;
    }

    return (
      issue.location.name ||
      issue.location.address ||
      issue.location.text ||
      "Location not provided"
    );
  }

  if (issue.community) {
    if (typeof issue.community === "string") {
      return issue.community;
    }

    return issue.community.parent?.name
      ? `${issue.community.name}, ${issue.community.parent.name}`
      : issue.community.name || "Location not provided";
  }

  return "Location not provided";
}

function getSupportCount(issue) {
  return (
    issue.supportCount ??
    issue.supports ??
    issue.supportCountTotal ??
    issue.voteCounts?.support ??
    0
  );
}

function getCommentCount(issue) {
  return issue.commentCount ?? issue.commentsCount ?? issue.comments ?? 0;
}

function timeAgo(dateString) {
  if (!dateString) return "";
  const diffMs = Date.now() - new Date(dateString).getTime();
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (days === 0) return "Today";
  if (days === 1) return "1 day ago";
  if (days < 7) return `${days} days ago`;

  const weeks = Math.floor(days / 7);
  if (weeks === 1) return "1 week ago";
  return `${weeks} weeks ago`;
}

/*
=========================================================
RECENT ISSUE ROW (list style)
=========================================================
*/

function RecentIssueRow({ issue, onClick }) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl border border-[#E2E8F0] p-5 hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
        <span className="text-[12px] text-[#64748B] flex items-center gap-1.5">
          {getCategoryIcon(issue.category)} {getCategoryLabel(issue.category)}
        </span>

        <span
          className={`text-[11px] font-600 px-2.5 py-1 rounded-full ${getStatusBadgeStyle(
            issue.status,
          )}`}
        >
          {formatStatus(issue.status)}
        </span>
      </div>

      <h3 className="font-600 text-[#1E293B] text-[15px] mb-2">
        {issue.title}
      </h3>

      <div className="flex items-center justify-between text-[12px] text-[#64748B]">
        <span>📍 {getIssueLocation(issue)}</span>
        <span className="flex items-center gap-3 shrink-0">
          <span>▲ {getSupportCount(issue)}</span>
          <span>💬 {getCommentCount(issue)}</span>
        </span>
      </div>

      <div className="text-[11px] text-[#94A3B8] mt-2">
        {timeAgo(issue.createdAt)}
      </div>
    </div>
  );
}

/*
=========================================================
MOST SUPPORTED (sidebar)
=========================================================
*/

function MostSupportedItem({ rank, issue, onClick }) {
  return (
    <div
      onClick={onClick}
      className="flex items-start gap-3 p-3 rounded-xl hover:bg-[#F8FAFC] cursor-pointer transition-colors"
    >
      <div className="w-6 h-6 rounded-full bg-[#0F766E]/10 text-[#0F766E] font-700 text-[11px] flex items-center justify-center shrink-0 mt-0.5">
        {rank}
      </div>
      <div className="min-w-0">
        <p className="text-[13px] font-600 text-[#1E293B] leading-snug">
          {issue.title}
        </p>
        <p className="text-[11px] text-[#64748B] mt-1">
          ▲ {getSupportCount(issue)} supporters
        </p>
      </div>
    </div>
  );
}

/*
=========================================================
RECENTLY RESOLVED (sidebar)
=========================================================
*/

function ResolvedItem({ issue, onClick }) {
  return (
    <div
      onClick={onClick}
      className="flex items-start gap-2.5 p-3 rounded-xl hover:bg-green-50/60 cursor-pointer transition-colors"
    >
      <span className="text-green-600 shrink-0 mt-0.5">✅</span>
      <p className="text-[13px] text-[#1E293B] leading-snug">{issue.title}</p>
    </div>
  );
}

/*
=========================================================
CITIZEN HOME
=========================================================
*/

export default function CitizenHome() {
  const { user, pendingApplication } = useAuth();
  const navigate = useNavigate();

  // `typeof null === "object"` in JS, so a typeof check here would wrongly
  // treat "no community" as "has one" — this reads correctly whether
  // community is null, an unpopulated id string, or a populated object.
  const communityId = user?.community?._id || user?.community;

  const hasCommunity = !!communityId;
  const hasPendingApplication = pendingApplication?.status === "pending";

  const firstName = user?.name?.split(" ")[0] || "there";
  const communityName = user?.community?.name || null;
  const cityName = user?.community?.parent?.name || null;

  /*
   * Get actual issues from backend — only fetch when a community exists
   */
  const {
    data: issues = [],
    isLoading: issuesLoading,
    isError: issuesError,
  } = useIssues(hasCommunity ? { community: communityId } : undefined, {
    enabled: hasCommunity,
  });

  const {
    data: trendingIssues = [],
    isLoading: trendingLoading,
    isError: trendingError,
  } = useTrendingIssues(communityId, { enabled: hasCommunity });

  const { data: recentIssues = [], isLoading: recentLoading } = useIssues(
    { community: communityId, sort: "recent" },
    { enabled: hasCommunity },
  );

  const { data: mostSupported = [], isLoading: supportedLoading } = useIssues(
    { community: communityId, sort: "most_supported" },
    { enabled: hasCommunity },
  );

  const { data: resolvedIssues = [], isLoading: resolvedLoading } = useIssues(
    { community: communityId, status: "resolved", sort: "resolved" },
    { enabled: hasCommunity },
  );

  /*
  =========================================================
  STATS
  =========================================================
  */

  const activeIssues = issues.filter(
    (issue) => issue.status !== "resolved",
  ).length;

  const underDiscussion = issues.filter(
    (issue) => issue.status === "under_review",
  ).length;

  const inProgress = issues.filter(
    (issue) => issue.status === "in_progress",
  ).length;

  const resolved = issues.filter((issue) => issue.status === "resolved").length;

  const stats = [
    { value: activeIssues, label: "Active Issues", color: "slate" },
    { value: underDiscussion, label: "Under Discussion", color: "amber" },
    { value: inProgress, label: "In Progress", color: "blue" },
    { value: resolved, label: "Resolved", color: "green" },
  ];

  /*
  =========================================================
  PREPARE TRENDING ISSUES
  =========================================================
  */

  const formattedTrendingIssues = trendingIssues.map((issue) => ({
    id: issue._id,
    image: issue.images?.length > 0 ? issue.images[0] : null,
    categoryIcon: getCategoryIcon(issue.category),
    category: issue.category || "Community Issue",
    status: formatStatus(issue.status),
    statusColor: getStatusColor(issue.status),
    title: issue.title,
    location: getIssueLocation(issue),
    supports: getSupportCount(issue),
    comments: getCommentCount(issue),
  }));

  return (
    <div>
      {/* GREETING */}
      <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
        <div>
          <h1 className="font-display font-800 text-[#1E293B] text-2xl flex items-center gap-2">
            Good morning, {firstName} 👋
          </h1>
          <p className="text-[13px] text-[#64748B] mt-1 flex items-center gap-1.5">
            {hasCommunity ? (
              <>
                📍 {communityName}
                {cityName ? `, ${cityName}` : ""}
              </>
            ) : (
              <>You haven't joined a community yet</>
            )}
            {!hasPendingApplication && (
              <button
                className="text-[#0F766E] font-600 hover:underline ml-1"
                onClick={() =>
                  navigate(
                    hasCommunity ? "/communities" : "/signup/onboarding",
                  )
                }
              >
                {hasCommunity ? "Change community" : "Join one"}
              </button>
            )}
          </p>
        </div>

        <button
          onClick={() => navigate("/report-issue")}
          disabled={!hasCommunity}
          title={
            !hasCommunity ? "Join a community first to report an issue" : ""
          }
          className="flex items-center gap-1.5 bg-[#0F766E] hover:bg-[#115E59] text-white text-[13px] font-600 px-4 py-2.5 rounded-lg transition-colors shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          + Report an Issue
        </button>
      </div>

      {/* PENDING COMMUNITY APPLICATION */}
      {pendingApplication?.status === "pending" && (
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
          <span className="text-xl shrink-0">⏳</span>
          <div>
            <div className="font-600 text-[#1E293B] text-[14px]">
              {pendingApplication.applicationType === "found_new_community"
                ? "Community creation request pending"
                : "Representative application pending"}
            </div>
            <p className="text-[13px] text-amber-800 mt-0.5">
              Your request for{" "}
              <span className="font-600">
                {pendingApplication.proposedCommunityName ||
                  pendingApplication.community?.name ||
                  "your community"}
              </span>{" "}
              is under review by an administrator.
            </p>
          </div>
        </div>
      )}

      {!hasCommunity ? (
        /* NO COMMUNITY — lighter, explore-only view */
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-10 text-center">
          <div className="text-3xl mb-2">🌍</div>
          <h3 className="font-600 text-[#1E293B] text-[15px]">
            Explore issues across Nigeria
          </h3>
          <p className="text-[13px] text-[#64748B] mt-1 mb-4">
            You're not tied to a specific community yet, but you can still
            browse, support, and comment on issues anywhere.
          </p>
          <button
            onClick={() => navigate("/issues")}
            className="bg-[#0F766E] hover:bg-[#115E59] text-white text-[13px] font-600 px-5 py-2.5 rounded-lg transition-colors"
          >
            Browse All Issues
          </button>
        </div>
      ) : (
        <>
          {/* STATS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {issuesLoading
              ? Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className="rounded-xl p-5 bg-[#F1F5F9] animate-pulse"
                  >
                    <div className="h-8 w-12 bg-[#E2E8F0] rounded mb-2" />
                    <div className="h-4 w-24 bg-[#E2E8F0] rounded" />
                  </div>
                ))
              : stats.map((stat) => <StatCard key={stat.label} {...stat} />)}
          </div>

          {issuesError && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-6 text-[13px]">
              We couldn't load your community issues right now. Please try
              again.
            </div>
          )}

          {/* TRENDING */}
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <h2 className="font-700 text-[#1E293B] text-[17px] flex items-center gap-2">
              🔥 Trending in {communityName}
            </h2>

            <button
              onClick={() => navigate("/issues")}
              className="text-[13px] text-[#0F766E] font-600 hover:underline"
            >
              View all →
            </button>
          </div>

          {trendingLoading ? (
            <div className="grid md:grid-cols-3 gap-4 mb-10">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden animate-pulse"
                >
                  <div className="w-full h-36 bg-[#F1F5F9]" />
                  <div className="p-4">
                    <div className="h-4 w-32 bg-[#F1F5F9] rounded mb-3" />
                    <div className="h-5 w-full bg-[#F1F5F9] rounded mb-2" />
                    <div className="h-5 w-3/4 bg-[#F1F5F9] rounded mb-4" />
                    <div className="h-4 w-full bg-[#F1F5F9] rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : trendingError ? (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-[13px] text-red-700 mb-10">
              We couldn't load trending issues.
            </div>
          ) : formattedTrendingIssues.length === 0 ? (
            <div className="bg-white border border-[#E2E8F0] rounded-2xl p-8 text-center mb-10">
              <div className="text-3xl mb-2">📭</div>
              <h3 className="font-600 text-[#1E293B] text-[14px]">
                No trending issues yet
              </h3>
              <p className="text-[13px] text-[#64748B] mt-1">
                Issues from your community will appear here as people start
                supporting and discussing them.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-4 mb-10">
              {formattedTrendingIssues.slice(0, 3).map((issue) => (
                <IssueCard
                  key={issue.id}
                  {...issue}
                  onClick={() => navigate(`/issues/${issue.id}`)}
                />
              ))}
            </div>
          )}

          {/* RECENT ISSUES + SIDEBAR */}
          <div className="grid grid-cols-[minmax(0,1fr)] lg:grid-cols-[minmax(0,1fr)_320px] gap-6">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                <h2 className="font-700 text-[#1E293B] text-[18px]">
                  Recent Issues
                </h2>
                <button
                  onClick={() => navigate("/issues")}
                  className="text-[13px] text-[#0F766E] font-600 hover:underline"
                >
                  Browse all →
                </button>
              </div>

              {recentLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="bg-white rounded-2xl border border-[#E2E8F0] p-5 animate-pulse"
                    >
                      <div className="h-3 w-1/3 bg-[#F1F5F9] rounded mb-3" />
                      <div className="h-5 w-3/4 bg-[#F1F5F9] rounded mb-3" />
                      <div className="h-3 w-1/2 bg-[#F1F5F9] rounded" />
                    </div>
                  ))}
                </div>
              ) : recentIssues.length === 0 ? (
                <div className="bg-white border border-[#E2E8F0] rounded-2xl p-8 text-center">
                  <div className="text-3xl mb-2">📭</div>
                  <h3 className="font-600 text-[#1E293B] text-[14px]">
                    No issues reported yet
                  </h3>
                  <p className="text-[13px] text-[#64748B] mt-1">
                    Be the first to report a problem in {communityName}.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentIssues.slice(0, 4).map((issue) => (
                    <RecentIssueRow
                      key={issue._id}
                      issue={issue}
                      onClick={() => navigate(`/issues/${issue._id}`)}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4">
                <h3 className="font-700 text-[#1E293B] text-[15px] mb-2 px-1">
                  Most Supported
                </h3>

                {supportedLoading ? (
                  <div className="space-y-3 p-2">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="h-12 bg-[#F1F5F9] rounded-xl animate-pulse"
                      />
                    ))}
                  </div>
                ) : mostSupported.length === 0 ? (
                  <p className="text-[12px] text-[#94A3B8] px-2 py-3">
                    No issues yet.
                  </p>
                ) : (
                  <div className="space-y-1">
                    {mostSupported.slice(0, 3).map((issue, i) => (
                      <MostSupportedItem
                        key={issue._id}
                        rank={i + 1}
                        issue={issue}
                        onClick={() => navigate(`/issues/${issue._id}`)}
                      />
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4">
                <h3 className="font-700 text-[#1E293B] text-[15px] mb-2 px-1 flex items-center gap-1.5">
                  Recently Resolved
                  <span className="text-green-600">✅</span>
                </h3>

                {resolvedLoading ? (
                  <div className="space-y-3 p-2">
                    {[1, 2].map((i) => (
                      <div
                        key={i}
                        className="h-10 bg-[#F1F5F9] rounded-xl animate-pulse"
                      />
                    ))}
                  </div>
                ) : resolvedIssues.length === 0 ? (
                  <p className="text-[12px] text-[#94A3B8] px-2 py-3">
                    Nothing resolved yet.
                  </p>
                ) : (
                  <div className="space-y-1">
                    {resolvedIssues.slice(0, 3).map((issue) => (
                      <ResolvedItem
                        key={issue._id}
                        issue={issue}
                        onClick={() => navigate(`/issues/${issue._id}`)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
