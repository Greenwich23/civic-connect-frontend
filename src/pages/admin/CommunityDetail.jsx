import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  useAdminCommunity,
  useUpdateCommunity,
} from "../../hooks/useAdminCommunities";

const ROLE_BADGE_STYLES = {
  citizen: "bg-blue-50 text-blue-700",
  representative: "bg-purple-50 text-purple-700",
  admin: "bg-[#0F766E]/10 text-[#0F766E]",
};

const ISSUE_STATUS_BADGE_STYLES = {
  reported: "bg-blue-50 text-blue-700",
  under_review: "bg-amber-50 text-amber-700",
  action_planned: "bg-purple-50 text-purple-700",
  in_progress: "bg-orange-50 text-orange-700",
  resolved: "bg-green-50 text-green-700",
};

const ISSUE_STATUS_LABELS = {
  reported: "Reported",
  under_review: "Under Review",
  action_planned: "Action Planned",
  in_progress: "In Progress",
  resolved: "Resolved",
};

function Pagination({ pagination, onPageChange, isFetching }) {
  if (!pagination || pagination.totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-[#E2E8F0]">
      <p className="text-[12px] text-[#64748B]">
        Page {pagination.page} of {pagination.totalPages}
      </p>
      <div className="flex gap-2">
        <button
          onClick={() => onPageChange(Math.max(pagination.page - 1, 1))}
          disabled={pagination.page <= 1 || isFetching}
          className="text-[12px] font-600 px-3 py-1.5 rounded-lg border border-[#E2E8F0] text-[#64748B] hover:border-[#0F766E]/40 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <button
          onClick={() =>
            onPageChange(Math.min(pagination.page + 1, pagination.totalPages))
          }
          disabled={pagination.page >= pagination.totalPages || isFetching}
          className="text-[12px] font-600 px-3 py-1.5 rounded-lg border border-[#E2E8F0] text-[#64748B] hover:border-[#0F766E]/40 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default function CommunityDetail() {
  const { communityId } = useParams();
  const navigate = useNavigate();

  const [membersPage, setMembersPage] = useState(1);
  const [issuesPage, setIssuesPage] = useState(1);

  const { data, isLoading, isFetching, isError } = useAdminCommunity(
    communityId,
    { membersPage, issuesPage, limit: 10 },
  );
  const updateMutation = useUpdateCommunity(communityId);

  const [statusError, setStatusError] = useState("");

  const handleStatusChange = async (status) => {
    setStatusError("");
    try {
      await updateMutation.mutateAsync({ status });
    } catch (err) {
      setStatusError(
        err.response?.data?.message ||
          "Couldn't update this community's status. Please try again.",
      );
    }
  };

  const backButton = (
    <button
      onClick={() => navigate("/admin/communities")}
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
      Back to communities
    </button>
  );

  if (isLoading) {
    return (
      <div className="max-w-4xl">
        {backButton}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 animate-pulse space-y-4">
          <div className="h-6 w-1/2 bg-[#E2E8F0] rounded" />
          <div className="h-4 w-1/3 bg-[#E2E8F0] rounded" />
          <div className="h-32 bg-[#E2E8F0] rounded" />
        </div>
      </div>
    );
  }

  if (isError || !data?.community) {
    return (
      <div className="max-w-4xl">
        {backButton}
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
          <span className="text-lg shrink-0">⚠️</span>
          <p className="text-[13px] text-[#DC2626] leading-relaxed">
            Couldn't load this community. It may have been removed.
          </p>
        </div>
      </div>
    );
  }

  const { community, members, membersPagination, issues, issuesPagination } =
    data;

  return (
    <div className="max-w-4xl">
      {backButton}

      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display font-800 text-[#1E293B] text-2xl md:text-3xl mb-1">
            {community.name}
          </h1>
          <p className="text-[13px] text-[#64748B] capitalize">
            {community.level}
            {community.parent?.name && ` · under ${community.parent.name}`}
          </p>
        </div>

        <div className="text-right shrink-0">
          <label className="block text-[11px] font-600 text-[#94A3B8] uppercase tracking-wider mb-1.5">
            Status
          </label>
          <select
            value={community.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            disabled={updateMutation.isPending}
            className="px-3 py-1.5 bg-white border border-[#E2E8F0] rounded-lg text-[13px] font-600 text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E] cursor-pointer disabled:opacity-60"
          >
            <option value="active">Active</option>
            <option value="unrepresented">Unrepresented</option>
          </select>
        </div>
      </div>

      {statusError && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl mb-6">
          <span className="text-lg shrink-0">⚠️</span>
          <p className="text-[13px] text-[#DC2626] leading-relaxed">
            {statusError}
          </p>
        </div>
      )}

      {/* STATS */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="rounded-xl p-5 bg-[#F1F5F9] text-[#1E293B]">
          <div className="text-3xl font-800">{membersPagination.total}</div>
          <div className="text-[13px] mt-1 opacity-80">Members</div>
        </div>
        <div className="rounded-xl p-5 bg-blue-50 text-blue-700">
          <div className="text-3xl font-800">{issuesPagination.total}</div>
          <div className="text-[13px] mt-1 opacity-80">Issues</div>
        </div>
        <div className="rounded-xl p-5 bg-green-50 text-green-700">
          <div className="text-3xl font-800">
            {issues.filter((i) => i.status === "resolved").length}
          </div>
          <div className="text-[13px] mt-1 opacity-80">Resolved (page)</div>
        </div>
      </div>

      {/* MEMBERS */}
      <div className="mb-6">
        <h2 className="font-700 text-[#1E293B] text-[15px] mb-3">Members</h2>
        <div className="bg-white rounded-2xl border border-[#E2E8F0] civic-shadow overflow-hidden">
          {members.length === 0 ? (
            <div className="p-8 text-center text-[13px] text-[#64748B]">
              No members in this community yet.
            </div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
                  <th className="px-4 py-3 text-[11px] font-600 text-[#94A3B8] uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-4 py-3 text-[11px] font-600 text-[#94A3B8] uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-4 py-3 text-[11px] font-600 text-[#94A3B8] uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {members.map((member) => (
                  <tr
                    key={member._id}
                    className="border-b border-[#E2E8F0] last:border-0"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-[#0F766E]/10 text-[#0F766E] font-700 text-[11px] flex items-center justify-center shrink-0">
                          {member.name?.[0]?.toUpperCase() || "?"}
                        </div>
                        <div className="min-w-0">
                          <div className="text-[13px] font-600 text-[#1E293B] truncate">
                            {member.name}
                          </div>
                          <div className="text-[12px] text-[#64748B] truncate">
                            {member.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-[11px] font-600 px-2 py-0.5 rounded-full capitalize ${
                          ROLE_BADGE_STYLES[member.role] ||
                          "bg-[#F1F5F9] text-[#64748B]"
                        }`}
                      >
                        {member.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-[11px] font-600 px-2 py-0.5 rounded-full ${
                          member.isActive
                            ? "bg-green-50 text-green-700"
                            : "bg-red-50 text-[#DC2626]"
                        }`}
                      >
                        {member.isActive ? "Active" : "Deactivated"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <Pagination
            pagination={membersPagination}
            onPageChange={setMembersPage}
            isFetching={isFetching}
          />
        </div>
      </div>

      {/* ISSUES */}
      <div>
        <h2 className="font-700 text-[#1E293B] text-[15px] mb-3">Issues</h2>
        <div className="bg-white rounded-2xl border border-[#E2E8F0] civic-shadow overflow-hidden">
          {issues.length === 0 ? (
            <div className="p-8 text-center text-[13px] text-[#64748B]">
              No issues reported in this community yet.
            </div>
          ) : (
            <div className="divide-y divide-[#E2E8F0]">
              {issues.map((issue) => (
                <Link
                  key={issue._id}
                  to={`/issues/${issue._id}`}
                  className="flex items-center justify-between gap-4 p-4 hover:bg-[#F8FAFC] transition-colors"
                >
                  <div className="min-w-0">
                    <div className="text-[13px] font-600 text-[#1E293B] truncate">
                      {issue.title}
                    </div>
                    <div className="text-[12px] text-[#64748B]">
                      {new Date(issue.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <span
                    className={`shrink-0 text-[11px] font-600 px-2 py-0.5 rounded-full ${
                      ISSUE_STATUS_BADGE_STYLES[issue.status]
                    }`}
                  >
                    {ISSUE_STATUS_LABELS[issue.status]}
                  </span>
                </Link>
              ))}
            </div>
          )}
          <Pagination
            pagination={issuesPagination}
            onPageChange={setIssuesPage}
            isFetching={isFetching}
          />
        </div>
      </div>
    </div>
  );
}
