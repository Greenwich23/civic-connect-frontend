/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import { useMyIssues } from "../hooks/useIssues.js";

export default function Profile() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: myIssuesData, isLoading, isError } = useMyIssues();

  const myIssues = myIssuesData?.issues || [];

  const firstName = user?.name?.split(" ")[0] || "User";

  // `user.community` is null when the user hasn't joined one — note that
  // `typeof null === "object"` in JS, so checking `typeof` here would
  // incorrectly treat "no community" as "has one". Reading straight off
  // optional chaining is safe for null, an unpopulated id string, or a
  // populated object alike.
  const hasCommunity = !!user?.community?.name;
  const communityName = user?.community?.name || "No community";
  const city = user?.community?.parent?.name || "";

  const issuesReported = myIssues.length;

  const resolvedIssues = myIssues.filter(
    (issue) => issue.status === "resolved",
  ).length;

  const activeIssues = myIssues.filter(
    (issue) => issue.status !== "resolved",
  ).length;

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-8 py-6 md:py-8">
      {/* Header */}
      <h1 className="font-display font-800 text-[#1E293B] text-2xl md:text-3xl mb-8">
        Your Profile
      </h1>

      {/* Profile Card */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 civic-shadow mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-2xl bg-[#0F766E]/15 text-[#0F766E] font-display font-800 text-2xl flex items-center justify-center shrink-0 overflow-hidden">
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-full h-full object-cover"
              />
            ) : (
              user?.name?.charAt(0)?.toUpperCase() || "U"
            )}
          </div>

          {/* User information */}
          <div className="flex-1">
            <h2 className="font-display font-800 text-xl text-[#1E293B]">
              {user?.name || "User"}
            </h2>

            <div className="text-sm text-[#64748B] mt-1">
              {communityName}
              {city && `, ${city}`}
            </div>

            <div className="flex flex-wrap items-center gap-2 mt-3">
              <span className="text-xs font-600 px-2.5 py-1 rounded-full bg-[#0F766E]/10 text-[#0F766E]">
                {user?.role === "representative"
                  ? "Community Representative"
                  : user?.role === "admin"
                    ? "Administrator"
                    : "Community Member"}
              </span>

              {user?.createdAt && (
                <span className="text-xs text-[#64748B]">
                  Member since{" "}
                  {new Date(user.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate("/profile/edit")}
            className="px-4 py-2 rounded-xl border border-[#E2E8F0] text-sm font-600 text-[#1E293B] hover:bg-[#F8FAFC] transition"
          >
            Edit Profile
          </button>
        </div>
      </div>

      {/* Impact Stats */}
      <div className="bg-gradient-to-br from-[#0F766E] to-[#115E59] rounded-2xl p-6 text-white mb-6">
        <h3 className="font-display font-800 text-lg mb-5">
          Your Community Impact
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <ImpactStat
            label="Issues Reported"
            value={issuesReported}
            icon="📢"
          />

          <ImpactStat label="Active Issues" value={activeIssues} icon="📋" />

          <ImpactStat label="Resolved" value={resolvedIssues} icon="✓" />

          <ImpactStat
            label="Community"
            value={hasCommunity ? "Joined" : "None"}
            icon="🏘️"
          />
        </div>
      </div>

      {/* Reported Issues */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 civic-shadow">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-display font-800 text-lg text-[#1E293B]">
            Your Reported Issues
          </h3>

          <button
            type="button"
            onClick={() => navigate("/issues")}
            className="text-sm font-600 text-[#0F766E] hover:text-[#115E59]"
          >
            View all →
          </button>
        </div>

        {isLoading && (
          <div className="space-y-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-20 rounded-xl bg-[#F1F5F9] animate-pulse"
              />
            ))}
          </div>
        )}

        {isError && (
          <div className="rounded-xl bg-red-50 border border-red-100 p-4 text-sm text-red-700">
            Unable to load your reported issues.
          </div>
        )}

        {!isLoading && !isError && myIssues.length === 0 && (
          <div className="text-center py-8">
            <div className="text-3xl mb-2">📢</div>

            <p className="font-600 text-[#1E293B]">
              You haven't reported any issues yet.
            </p>

            <p className="text-sm text-[#64748B] mt-1">
              Report a problem in your community and start making an impact.
            </p>

            <button
              type="button"
              onClick={() => navigate("/issues/report")}
              className="mt-4 px-4 py-2 rounded-xl bg-[#0F766E] text-white text-sm font-600 hover:bg-[#115E59]"
            >
              Report an Issue
            </button>
          </div>
        )}

        {!isLoading && !isError && myIssues.length > 0 && (
          <div className="space-y-3">
            {myIssues.slice(0, 3).map((issue) => (
              <button
                key={issue._id}
                type="button"
                onClick={() => navigate(`/issues/${issue._id}`)}
                className="w-full text-left p-4 rounded-xl border border-[#E2E8F0] hover:bg-[#F8FAFC] transition"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h4 className="font-600 text-sm text-[#1E293B] truncate">
                      {issue.title}
                    </h4>

                    <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-[#64748B]">
                      <span>
                        ▲ {issue.supportCount || issue.supporters || 0}{" "}
                        supporters
                      </span>

                      <span>·</span>

                      <span>
                        💬 {issue.commentCount || issue.comments || 0}
                      </span>

                      {issue.createdAt && (
                        <>
                          <span>·</span>
                          <span>
                            {new Date(issue.createdAt).toLocaleDateString()}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <StatusBadge status={issue.status} />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ImpactStat({ label, value, icon }) {
  return (
    <div className="bg-white/10 rounded-xl p-4">
      <div className="text-xl mb-2">{icon}</div>

      <div className="text-2xl font-800">{value}</div>

      <div className="text-xs text-white/75 mt-1">{label}</div>
    </div>
  );
}

function StatusBadge({ status }) {
  const statusMap = {
    reported: {
      label: "Reported",
      className: "bg-slate-100 text-slate-700",
    },

    under_review: {
      label: "Under Review",
      className: "bg-amber-50 text-amber-700",
    },

    action_planned: {
      label: "Action Planned",
      className: "bg-blue-50 text-blue-700",
    },

    in_progress: {
      label: "In Progress",
      className: "bg-orange-50 text-orange-700",
    },

    resolved: {
      label: "Resolved",
      className: "bg-green-50 text-green-700",
    },
  };

  const current = statusMap[status] || {
    label: status || "Reported",
    className: "bg-slate-100 text-slate-700",
  };

  return (
    <span
      className={`shrink-0 text-[11px] font-600 px-2.5 py-1 rounded-full ${current.className}`}
    >
      {current.label}
    </span>
  );
}
