import { useState } from "react";
import { Link } from "react-router-dom";
import { useAdminReports } from "../../hooks/useAdminReports";
import { REPRESENTATIVE_REPORT_REASON_LABELS } from "../../utils/constants";

const STATUS_TABS = [
  { key: "pending", label: "Pending" },
  { key: "reviewed", label: "Reviewed" },
  { key: "dismissed", label: "Dismissed" },
];

const STATUS_BADGE_STYLES = {
  pending: "bg-amber-50 text-amber-700",
  reviewed: "bg-green-50 text-green-700",
  dismissed: "bg-[#F1F5F9] text-[#64748B]",
};

const STATUS_LABELS = {
  pending: "⏳ Pending",
  reviewed: "✅ Reviewed",
  dismissed: "Dismissed",
};

function ReportCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 animate-pulse">
      <div className="h-3 w-24 bg-[#E2E8F0] rounded mb-4" />
      <div className="h-4 w-3/4 bg-[#E2E8F0] rounded mb-2" />
      <div className="h-3 w-1/2 bg-[#E2E8F0] rounded mb-4" />
      <div className="h-3 w-20 bg-[#E2E8F0] rounded" />
    </div>
  );
}

export default function RepresentativeReports() {
  const [status, setStatus] = useState("pending");
  const { data: reports, isLoading, isError } = useAdminReports(status);

  return (
    <div>
      <h1 className="font-display font-800 text-[#1E293B] text-3xl mb-1">
        Representative Reports
      </h1>
      <p className="text-[13px] text-[#64748B] mb-6">
        Citizen reports filed against representatives.
      </p>

      <div className="flex items-center gap-2 mb-6">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setStatus(tab.key)}
            className={`text-[12px] font-600 px-3 py-1.5 rounded-full border transition-colors ${
              status === tab.key
                ? "bg-[#0F766E] border-[#0F766E] text-white"
                : "bg-white border-[#E2E8F0] text-[#64748B] hover:border-[#0F766E]/40"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {isError && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl mb-6">
          <span className="text-lg shrink-0">⚠️</span>
          <p className="text-[13px] text-[#DC2626] leading-relaxed">
            Couldn't load reports. Please refresh and try again.
          </p>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-4">
        {isLoading &&
          Array.from({ length: 3 }).map((_, i) => (
            <ReportCardSkeleton key={i} />
          ))}

        {reports?.map((report) => (
          <Link
            key={report._id}
            to={`/admin/representative-reports/${report._id}`}
            className="bg-white rounded-2xl border border-[#E2E8F0] p-5 hover:shadow-md transition-shadow block"
          >
            <div className="flex items-center justify-between mb-3">
              <span
                className={`text-[11px] font-600 px-2 py-0.5 rounded-full ${STATUS_BADGE_STYLES[report.status]}`}
              >
                {STATUS_LABELS[report.status]}
              </span>
              <span className="text-[12px] text-[#64748B]">
                {new Date(report.createdAt).toLocaleDateString()}
              </span>
            </div>

            <h3 className="font-600 text-[#1E293B] text-[15px] mb-1 leading-snug">
              {report.reportedRepresentative?.name || "Unknown representative"}
            </h3>

            <p className="text-[12px] text-[#64748B] mb-3">
              {report.community?.name || "Unknown community"}
            </p>

            <div className="mb-3">
              <span className="text-[11px] font-600 px-2 py-0.5 rounded-full bg-red-50 text-[#DC2626]">
                {REPRESENTATIVE_REPORT_REASON_LABELS[report.reason] ||
                  report.reason}
              </span>
            </div>

            <div className="flex items-center gap-2 pt-3 border-t border-[#E2E8F0]">
              <div className="w-7 h-7 rounded-full bg-[#0F766E]/10 text-[#0F766E] font-700 text-[11px] flex items-center justify-center">
                {report.reportedBy?.name?.[0]?.toUpperCase() || "?"}
              </div>
              <div className="min-w-0">
                <div className="text-[13px] font-500 text-[#1E293B] truncate">
                  Reported by {report.reportedBy?.name || "Unknown"}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {!isLoading && !isError && reports?.length === 0 && (
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-10 text-center">
          <div className="text-3xl mb-2">🎉</div>
          <p className="text-[14px] font-600 text-[#1E293B] mb-1">
            No {status} reports
          </p>
          <p className="text-[13px] text-[#64748B]">
            {status === "pending"
              ? "There are no reports waiting for review."
              : "Nothing to show here yet."}
          </p>
        </div>
      )}
    </div>
  );
}
