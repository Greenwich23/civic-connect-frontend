import { Link, useNavigate, useParams } from "react-router-dom";
import { useRepresentativeResolvedIssues } from "../../hooks/useAdminRepresentativePerformance";

const DISPUTE_THRESHOLD = 30;

function IssueRowSkeleton() {
  return (
    <div className="p-4 animate-pulse">
      <div className="h-4 w-2/3 bg-[#E2E8F0] rounded mb-2" />
      <div className="h-3 w-1/3 bg-[#E2E8F0] rounded" />
    </div>
  );
}

export default function RepresentativePerformanceDetail() {
  const { userId } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useRepresentativeResolvedIssues(userId);

  const backButton = (
    <button
      onClick={() => navigate("/admin/representative-performance")}
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
      Back to representative performance
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

  if (isError || !data) {
    return (
      <div className="max-w-3xl">
        {backButton}
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
          <span className="text-lg shrink-0">⚠️</span>
          <p className="text-[13px] text-[#DC2626] leading-relaxed">
            Couldn't load this representative's resolved issues.
          </p>
        </div>
      </div>
    );
  }

  const { representative, community, issues } = data;

  return (
    <div className="max-w-3xl">
      {backButton}

      <div className="mb-6">
        <h1 className="font-display font-800 text-[#1E293B] text-2xl md:text-3xl mb-1">
          {representative.name}
        </h1>
        <p className="text-[13px] text-[#64748B]">
          {representative.email}
          {community?.name && ` · Representing ${community.name}`}
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-[#E2E8F0] civic-shadow overflow-hidden">
        <div className="px-4 py-3 border-b border-[#E2E8F0] bg-[#F8FAFC]">
          <h2 className="text-[11px] font-600 text-[#94A3B8] uppercase tracking-wider">
            Resolved Issues ({issues.length})
          </h2>
        </div>

        {isLoading &&
          Array.from({ length: 3 }).map((_, i) => <IssueRowSkeleton key={i} />)}

        {!isLoading && issues.length === 0 && (
          <div className="p-10 text-center">
            <div className="text-3xl mb-2">📌</div>
            <p className="text-[14px] font-600 text-[#1E293B] mb-1">
              No resolved issues yet
            </p>
            <p className="text-[13px] text-[#64748B]">
              This representative hasn't marked any issues resolved.
            </p>
          </div>
        )}

        {!isLoading && issues.length > 0 && (
          <div className="divide-y divide-[#E2E8F0]">
            {issues.map((issue) => {
              const isFlagged =
                issue.totalResponses > 0 &&
                issue.disputedPercent >= DISPUTE_THRESHOLD;

              return (
                <Link
                  key={issue._id}
                  to={`/admin/issues/${issue._id}`}
                  className="flex items-center justify-between gap-4 p-4 hover:bg-[#F8FAFC] transition-colors"
                >
                  <div className="min-w-0">
                    <div className="text-[13px] font-600 text-[#1E293B] truncate">
                      {issue.title}
                    </div>
                    <div className="text-[12px] text-[#64748B]">
                      Resolved{" "}
                      {issue.resolvedAt
                        ? new Date(issue.resolvedAt).toLocaleDateString()
                        : "—"}
                      {" · "}
                      {issue.totalResponses}{" "}
                      {issue.totalResponses === 1 ? "response" : "responses"}
                      {issue.averageRating != null && ` · ★ ${issue.averageRating}`}
                    </div>
                  </div>

                  {issue.totalResponses > 0 && (
                    <span
                      className={`shrink-0 text-[11px] font-600 px-2 py-0.5 rounded-full ${
                        isFlagged
                          ? "bg-red-50 text-[#DC2626]"
                          : "bg-green-50 text-green-700"
                      }`}
                    >
                      {issue.disputedPercent}% disputed
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
