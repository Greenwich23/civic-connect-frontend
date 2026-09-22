import { Link } from "react-router-dom";
import { useAdminApplications } from "../../hooks/useAdminApplications";
import { APPLICATION_TYPE_LABELS } from "../../utils/constants";

function ApplicationCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 animate-pulse">
      <div className="h-3 w-24 bg-[#E2E8F0] rounded mb-4" />
      <div className="h-4 w-3/4 bg-[#E2E8F0] rounded mb-2" />
      <div className="h-3 w-1/2 bg-[#E2E8F0] rounded mb-4" />
      <div className="h-3 w-20 bg-[#E2E8F0] rounded" />
    </div>
  );
}

export default function RepresentativeApplications() {
  const { data: applications, isLoading, isError } = useAdminApplications();

  return (
    <div>
      <h1 className="font-display font-800 text-[#1E293B] text-3xl mb-1">
        Representative Applications
      </h1>
      <p className="text-[13px] text-[#64748B] mb-6">
        {applications?.length ?? 0} pending{" "}
        {applications?.length === 1 ? "application" : "applications"} awaiting
        review.
      </p>

      {isError && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl mb-6">
          <span className="text-lg shrink-0">⚠️</span>
          <p className="text-[13px] text-[#DC2626] leading-relaxed">
            Couldn't load applications. Please refresh and try again.
          </p>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-4">
        {isLoading &&
          Array.from({ length: 3 }).map((_, i) => (
            <ApplicationCardSkeleton key={i} />
          ))}

        {applications?.map((application) => (
          <Link
            key={application._id}
            to={`/admin/representative-applications/${application._id}`}
            className="bg-white rounded-2xl border border-[#E2E8F0] p-5 hover:shadow-md transition-shadow block"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-600 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700">
                ⏳ Pending Review
              </span>
              <span className="text-[12px] text-[#64748B]">
                {new Date(application.createdAt).toLocaleDateString()}
              </span>
            </div>

            <h3 className="font-600 text-[#1E293B] text-[15px] mb-1 leading-snug">
              {application.proposedCommunityName ||
                application.community?.name ||
                "Unnamed community"}
            </h3>

            <p className="text-[12px] text-[#64748B] mb-3">
              {APPLICATION_TYPE_LABELS[application.applicationType] ||
                application.applicationType}
              {application.proposedParent?.name &&
                ` · under ${application.proposedParent.name}`}
            </p>

            <div className="flex items-center gap-2 pt-3 border-t border-[#E2E8F0]">
              <div className="w-7 h-7 rounded-full bg-[#0F766E]/10 text-[#0F766E] font-700 text-[11px] flex items-center justify-center">
                {application.applicant?.name?.[0]?.toUpperCase() || "?"}
              </div>
              <div className="min-w-0">
                <div className="text-[13px] font-500 text-[#1E293B] truncate">
                  {application.applicant?.name || "Unknown applicant"}
                </div>
                <div className="text-[11px] text-[#94A3B8] truncate">
                  {application.applicant?.email}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {!isLoading && !isError && applications?.length === 0 && (
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-10 text-center">
          <div className="text-3xl mb-2">🎉</div>
          <p className="text-[14px] font-600 text-[#1E293B] mb-1">
            All caught up
          </p>
          <p className="text-[13px] text-[#64748B]">
            There are no applications waiting for review.
          </p>
        </div>
      )}
    </div>
  );
}
