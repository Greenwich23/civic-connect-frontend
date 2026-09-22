import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useAdminOverview } from "../../hooks/useAdminStats";
import { useAdminApplications } from "../../hooks/useAdminApplications";
import { useFlaggedComments } from "../../hooks/useAdminModeration";
import { APPLICATION_TYPE_LABELS } from "../../utils/constants";

function StatCard({ value, label, color }) {
  const colorMap = {
    slate: "bg-[#F1F5F9] text-[#1E293B]",
    amber: "bg-amber-50 text-amber-700",
    blue: "bg-blue-50 text-blue-700",
    green: "bg-green-50 text-green-700",
    purple: "bg-purple-50 text-purple-700",
  };

  return (
    <div className={`rounded-xl p-5 ${colorMap[color]}`}>
      <div className="text-3xl font-800">{value}</div>
      <div className="text-[13px] mt-1 opacity-80">{label}</div>
    </div>
  );
}

function StatCardSkeleton() {
  return (
    <div className="rounded-xl p-5 bg-[#F1F5F9] animate-pulse">
      <div className="h-8 w-12 bg-[#E2E8F0] rounded mb-2" />
      <div className="h-4 w-24 bg-[#E2E8F0] rounded" />
    </div>
  );
}

function PreviewSection({ title, icon, viewAllTo, children }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-700 text-[#1E293B] text-[17px] flex items-center gap-2">
          {icon} {title}
        </h2>
        <Link
          to={viewAllTo}
          className="text-[13px] text-[#0F766E] font-600 hover:underline"
        >
          View all →
        </Link>
      </div>
      <div className="bg-white rounded-2xl border border-[#E2E8F0] civic-shadow divide-y divide-[#E2E8F0]">
        {children}
      </div>
    </div>
  );
}

function PreviewRowSkeleton() {
  return (
    <div className="p-4 animate-pulse">
      <div className="h-4 w-2/3 bg-[#E2E8F0] rounded mb-2" />
      <div className="h-3 w-1/3 bg-[#E2E8F0] rounded" />
    </div>
  );
}

function PreviewEmpty({ icon, message }) {
  return (
    <div className="p-8 text-center">
      <div className="text-2xl mb-1">{icon}</div>
      <p className="text-[13px] text-[#64748B]">{message}</p>
    </div>
  );
}

export default function AdminHome() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: overview, isLoading: overviewLoading, isError: overviewError } =
    useAdminOverview();

  const { data: applications, isLoading: applicationsLoading } =
    useAdminApplications();

  const { data: flaggedData, isLoading: flaggedLoading } = useFlaggedComments(
    { limit: 4 },
  );

  const stats = overview
    ? [
        { value: overview.totalIssues, label: "Total Issues", color: "slate" },
        {
          value: overview.resolvedIssues,
          label: "Resolved Issues",
          color: "green",
        },
        { value: overview.totalUsers, label: "Total Users", color: "blue" },
        {
          value: overview.activeRepresentatives,
          label: "Active Representatives",
          color: "purple",
        },
        {
          value: overview.pendingApplications,
          label: "Pending Applications",
          color: "amber",
        },
      ]
    : [];

  const pendingPreview = applications?.slice(0, 4) || [];
  const flaggedPreview = flaggedData?.comments?.slice(0, 4) || [];

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display font-800 text-[#1E293B] text-3xl mb-1">
          Welcome back, {user?.name?.split(" ")[0] || "Admin"}
        </h1>
        <p className="text-[13px] text-[#64748B]">
          Here's what's happening across CivicPulse.
        </p>
      </div>

      {overviewError && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-6 text-[13px]">
          We couldn't load platform stats right now. Please try again.
        </div>
      )}

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {overviewLoading
          ? Array.from({ length: 5 }).map((_, index) => (
              <StatCardSkeleton key={index} />
            ))
          : stats.map((stat) => <StatCard key={stat.label} {...stat} />)}
      </div>

      {/* PREVIEWS */}
      <div className="grid md:grid-cols-2 gap-6">
        <PreviewSection
          title="Pending Applications"
          icon="📝"
          viewAllTo="/admin/representative-applications"
        >
          {applicationsLoading && (
            <>
              <PreviewRowSkeleton />
              <PreviewRowSkeleton />
              <PreviewRowSkeleton />
            </>
          )}

          {!applicationsLoading && pendingPreview.length === 0 && (
            <PreviewEmpty
              icon="🎉"
              message="No applications waiting for review."
            />
          )}

          {!applicationsLoading &&
            pendingPreview.map((application) => (
              <button
                key={application._id}
                onClick={() =>
                  navigate(
                    `/admin/representative-applications/${application._id}`,
                  )
                }
                className="w-full text-left p-4 hover:bg-[#F8FAFC] transition-colors"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-[13px] font-600 text-[#1E293B] truncate">
                      {application.proposedCommunityName ||
                        application.community?.name ||
                        "Unnamed community"}
                    </div>
                    <div className="text-[12px] text-[#64748B] truncate">
                      {application.applicant?.name || "Unknown applicant"} ·{" "}
                      {APPLICATION_TYPE_LABELS[application.applicationType] ||
                        application.applicationType}
                    </div>
                  </div>
                  <span className="shrink-0 text-[11px] font-600 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700">
                    ⏳ Pending
                  </span>
                </div>
              </button>
            ))}
        </PreviewSection>

        <PreviewSection
          title="Recently Flagged"
          icon="🚩"
          viewAllTo="/admin/moderation"
        >
          {flaggedLoading && (
            <>
              <PreviewRowSkeleton />
              <PreviewRowSkeleton />
              <PreviewRowSkeleton />
            </>
          )}

          {!flaggedLoading && flaggedPreview.length === 0 && (
            <PreviewEmpty icon="🎉" message="No flagged comments right now." />
          )}

          {!flaggedLoading &&
            flaggedPreview.map((comment) => (
              <button
                key={comment._id}
                onClick={() => navigate("/admin/moderation")}
                className="w-full text-left p-4 hover:bg-[#F8FAFC] transition-colors"
              >
                <div className="text-[13px] text-[#1E293B] mb-1 line-clamp-1">
                  {comment.content}
                </div>
                <div className="text-[12px] text-[#64748B] truncate">
                  {comment.author?.name || "Unknown user"}
                  {comment.issue?.title && ` · on ${comment.issue.title}`}
                </div>
              </button>
            ))}
        </PreviewSection>
      </div>
    </div>
  );
}
