import { Link } from "react-router-dom";
import { useRepresentativePerformance } from "../../hooks/useAdminRepresentativePerformance";

function StatusBadge({ row }) {
  if (row.totalResponses === 0) {
    return (
      <span className="text-[11px] font-600 px-2 py-0.5 rounded-full bg-[#F1F5F9] text-[#64748B]">
        No feedback yet
      </span>
    );
  }

  if (row.flagged) {
    return (
      <span className="text-[11px] font-600 px-2 py-0.5 rounded-full bg-red-50 text-[#DC2626]">
        ⚠️ Flagged
      </span>
    );
  }

  return (
    <span className="text-[11px] font-600 px-2 py-0.5 rounded-full bg-green-50 text-green-700">
      ✓ Healthy
    </span>
  );
}

// Same fix as admin/Issues.jsx — a native <table> and a CSS grid size
// columns independently, so header and rows never line up. Header and rows
// are built from plain divs sharing one grid template instead.
const REP_GRID_COLS = "grid-cols-[1.6fr_1.2fr_0.8fr_0.8fr_0.8fr_1fr] min-w-[760px]";

function RepRowSkeleton() {
  return (
    <div className={`grid ${REP_GRID_COLS} border-b border-[#E2E8F0] last:border-0`}>
      <div className="px-4 py-3.5 col-span-6">
        <div className="h-4 w-full bg-[#E2E8F0] rounded animate-pulse" />
      </div>
    </div>
  );
}

export default function RepresentativePerformance() {
  const { data: performance, isLoading, isError } =
    useRepresentativePerformance();

  const flaggedCount = performance?.filter((row) => row.flagged).length ?? 0;

  return (
    <div>
      <h1 className="font-display font-800 text-[#1E293B] text-2xl sm:text-3xl mb-1">
        Representative Performance
      </h1>
      <p className="text-[13px] text-[#64748B] mb-6">
        How resolved issues actually hold up, based on citizen feedback —
        worst dispute rate first.
        {flaggedCount > 0 && (
          <span className="text-[#DC2626] font-600">
            {" "}
            {flaggedCount} {flaggedCount === 1 ? "representative" : "representatives"} flagged for a high dispute rate.
          </span>
        )}
      </p>

      {isError && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl mb-4">
          <span className="text-lg shrink-0">⚠️</span>
          <p className="text-[13px] text-[#DC2626] leading-relaxed">
            Couldn't load representative performance. Please refresh and try
            again.
          </p>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-[#E2E8F0] civic-shadow overflow-x-auto">
        <div className={`grid ${REP_GRID_COLS} border-b border-[#E2E8F0] bg-[#F8FAFC]`}>
          <div className="px-4 py-3 text-[11px] font-600 text-[#94A3B8] uppercase tracking-wider">
            Representative
          </div>
          <div className="px-4 py-3 text-[11px] font-600 text-[#94A3B8] uppercase tracking-wider">
            Community
          </div>
          <div className="px-4 py-3 text-[11px] font-600 text-[#94A3B8] uppercase tracking-wider text-right">
            Resolved
          </div>
          <div className="px-4 py-3 text-[11px] font-600 text-[#94A3B8] uppercase tracking-wider text-right">
            Avg Rating
          </div>
          <div className="px-4 py-3 text-[11px] font-600 text-[#94A3B8] uppercase tracking-wider text-right">
            Disputed
          </div>
          <div className="px-4 py-3 text-[11px] font-600 text-[#94A3B8] uppercase tracking-wider">
            Status
          </div>
        </div>

        {isLoading &&
          Array.from({ length: 6 }).map((_, i) => <RepRowSkeleton key={i} />)}

        {!isLoading &&
          performance?.map((row) => (
            <Link
              key={row.representative._id}
              to={`/admin/representative-performance/${row.representative._id}`}
              className={`grid ${REP_GRID_COLS} items-center border-b border-[#E2E8F0] last:border-0 hover:bg-[#F8FAFC]/60 transition-colors`}
            >
              <div className="px-4 py-3.5 min-w-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#0F766E]/10 text-[#0F766E] font-700 text-[12px] flex items-center justify-center shrink-0">
                    {row.representative.name?.[0]?.toUpperCase() || "?"}
                  </div>
                  <div className="min-w-0">
                    <div className="text-[13px] font-600 text-[#1E293B] truncate">
                      {row.representative.name}
                    </div>
                    <div className="text-[12px] text-[#64748B] truncate">
                      {row.representative.email}
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-4 py-3.5 text-[13px] text-[#1E293B] truncate">
                {row.community?.name || "—"}
              </div>
              <div className="px-4 py-3.5 text-[13px] text-[#1E293B] text-right">
                {row.resolvedIssueCount}
              </div>
              <div className="px-4 py-3.5 text-[13px] text-[#1E293B] text-right">
                {row.averageRating != null ? `★ ${row.averageRating}` : "—"}
              </div>
              <div className="px-4 py-3.5 text-[13px] text-right">
                <span
                  className={
                    row.flagged ? "text-[#DC2626] font-600" : "text-[#1E293B]"
                  }
                >
                  {row.totalResponses > 0 ? `${row.disputedPercent}%` : "—"}
                </span>
              </div>
              <div className="px-4 py-3.5">
                <StatusBadge row={row} />
              </div>
            </Link>
          ))}

        {!isLoading && performance?.length === 0 && (
          <div className="p-10 text-center">
            <div className="text-3xl mb-2">🏛️</div>
            <p className="text-[14px] font-600 text-[#1E293B] mb-1">
              No active representatives yet
            </p>
            <p className="text-[13px] text-[#64748B]">
              Performance data will show up here once representatives are
              approved and start resolving issues.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
