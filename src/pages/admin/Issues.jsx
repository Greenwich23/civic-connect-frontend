import { useState } from "react";
import { Link } from "react-router-dom";
import { useAdminIssues } from "../../hooks/useAdminIssues";

const CATEGORIES = [
  { key: "", label: "All categories" },
  { key: "roads", label: "Roads & Transportation" },
  { key: "waste", label: "Waste Management" },
  { key: "lighting", label: "Street Lighting" },
  { key: "water", label: "Water" },
  { key: "safety", label: "Safety" },
  { key: "environment", label: "Environment" },
  { key: "public", label: "Public" },
];

const STATUS_FILTERS = [
  { key: "", label: "All statuses" },
  { key: "reported", label: "Reported" },
  { key: "under_review", label: "Under Review" },
  { key: "action_planned", label: "Action Planned" },
  { key: "in_progress", label: "In Progress" },
  { key: "resolved", label: "Resolved" },
];

const STATUS_BADGE_STYLES = {
  reported: "bg-blue-50 text-blue-700",
  under_review: "bg-amber-50 text-amber-700",
  action_planned: "bg-purple-50 text-purple-700",
  in_progress: "bg-orange-50 text-orange-700",
  resolved: "bg-green-50 text-green-700",
};

const STATUS_LABELS = {
  reported: "Reported",
  under_review: "Under Review",
  action_planned: "Action Planned",
  in_progress: "In Progress",
  resolved: "Resolved",
};

function FilterPill({ active, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`text-[12px] font-600 px-3 py-1.5 rounded-full border transition-colors ${
        active
          ? "bg-[#0F766E] border-[#0F766E] text-white"
          : "bg-white border-[#E2E8F0] text-[#64748B] hover:border-[#0F766E]/40"
      }`}
    >
      {label}
    </button>
  );
}

// Native <table> layout and a CSS grid don't share a width algorithm, so a
// <thead> sized by the browser's table auto-layout never lines up with a
// <colSpan> row rendered as its own independent grid — the header and rows
// need to be built from the exact same grid template, hence the row-list
// layout below instead of a real <table>.
const ISSUE_GRID_COLS = "grid-cols-[2fr_1.2fr_1fr_1fr_0.9fr] min-w-[760px]";

function IssueRowSkeleton() {
  return (
    <div className={`grid ${ISSUE_GRID_COLS} border-b border-[#E2E8F0] last:border-0`}>
      <div className="px-4 py-3.5 col-span-5">
        <div className="h-4 w-full bg-[#E2E8F0] rounded animate-pulse" />
      </div>
    </div>
  );
}

export default function Issues() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [category, setCategory] = useState("");
  const [moderationStatus, setModerationStatus] = useState("");
  const [page, setPage] = useState(1);

  const filters = {
    search: search.trim() || undefined,
    status: status || undefined,
    category: category || undefined,
    moderationStatus: moderationStatus || undefined,
    page,
    limit: 20,
  };

  const { data, isLoading, isFetching, isError } = useAdminIssues(filters);

  const issues = data?.issues || [];
  const pagination = data?.pagination;

  const updateFilter = (setter) => (value) => {
    setter(value);
    setPage(1);
  };

  return (
    <div>
      <h1 className="font-display font-800 text-[#1E293B] text-2xl sm:text-3xl mb-1">
        Issues
      </h1>
      <p className="text-[13px] text-[#64748B] mb-6">
        {pagination?.total ?? 0} issues reported across CivicPulse.
      </p>

      <div className="relative mb-4 max-w-sm">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]">
          🔍
        </span>
        <input
          value={search}
          onChange={(e) => updateFilter(setSearch)(e.target.value)}
          placeholder="Search by title or description..."
          className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#E2E8F0] rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E]"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-4">
        {STATUS_FILTERS.map((f) => (
          <FilterPill
            key={f.key || "all-statuses"}
            label={f.label}
            active={status === f.key}
            onClick={() => updateFilter(setStatus)(f.key)}
          />
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <select
          value={category}
          onChange={(e) => updateFilter(setCategory)(e.target.value)}
          className="px-3 py-2 bg-white border border-[#E2E8F0] rounded-lg text-[12px] font-600 text-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E] cursor-pointer"
        >
          {CATEGORIES.map((c) => (
            <option key={c.key || "all-categories"} value={c.key}>
              {c.label}
            </option>
          ))}
        </select>

        <div className="flex items-center gap-1">
          <FilterPill
            label="All"
            active={moderationStatus === ""}
            onClick={() => updateFilter(setModerationStatus)("")}
          />
          <FilterPill
            label="Visible"
            active={moderationStatus === "visible"}
            onClick={() => updateFilter(setModerationStatus)("visible")}
          />
          <FilterPill
            label="Hidden"
            active={moderationStatus === "hidden"}
            onClick={() => updateFilter(setModerationStatus)("hidden")}
          />
        </div>
      </div>

      {isError && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl mb-4">
          <span className="text-lg shrink-0">⚠️</span>
          <p className="text-[13px] text-[#DC2626] leading-relaxed">
            Couldn't load issues. Please refresh and try again.
          </p>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-[#E2E8F0] civic-shadow overflow-x-auto">
        <div className={`grid ${ISSUE_GRID_COLS} border-b border-[#E2E8F0] bg-[#F8FAFC]`}>
          <div className="px-4 py-3 text-[11px] font-600 text-[#94A3B8] uppercase tracking-wider">
            Issue
          </div>
          <div className="px-4 py-3 text-[11px] font-600 text-[#94A3B8] uppercase tracking-wider">
            Reporter
          </div>
          <div className="px-4 py-3 text-[11px] font-600 text-[#94A3B8] uppercase tracking-wider">
            Community
          </div>
          <div className="px-4 py-3 text-[11px] font-600 text-[#94A3B8] uppercase tracking-wider">
            Status
          </div>
          <div className="px-4 py-3 text-[11px] font-600 text-[#94A3B8] uppercase tracking-wider">
            Reported
          </div>
        </div>

        {isLoading &&
          Array.from({ length: 8 }).map((_, i) => <IssueRowSkeleton key={i} />)}

        {!isLoading &&
          issues.map((issue) => (
            <Link
              key={issue._id}
              to={`/admin/issues/${issue._id}`}
              className={`grid ${ISSUE_GRID_COLS} items-center border-b border-[#E2E8F0] last:border-0 hover:bg-[#F8FAFC]/60 transition-colors`}
            >
              <div className="px-4 py-3.5 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-600 text-[#1E293B] truncate">
                    {issue.title}
                  </span>
                  {issue.moderationStatus === "hidden" && (
                    <span className="shrink-0 text-[10px] font-600 px-1.5 py-0.5 rounded-full bg-[#F1F5F9] text-[#64748B]">
                      Hidden
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-[#94A3B8] capitalize">
                  {issue.category}
                </div>
              </div>
              <div className="px-4 py-3.5 text-[13px] text-[#1E293B] truncate">
                {issue.reportedBy?.name || "Unknown"}
              </div>
              <div className="px-4 py-3.5 text-[13px] text-[#1E293B] truncate">
                {issue.community?.name
                  ? `${issue.community.name}${
                      issue.community.parent?.name
                        ? `, ${issue.community.parent.name}`
                        : ""
                    }`
                  : "—"}
              </div>
              <div className="px-4 py-3.5">
                <span
                  className={`text-[11px] font-600 px-2 py-0.5 rounded-full ${STATUS_BADGE_STYLES[issue.status]}`}
                >
                  {STATUS_LABELS[issue.status]}
                </span>
              </div>
              <div className="px-4 py-3.5 text-[12px] text-[#64748B]">
                {new Date(issue.createdAt).toLocaleDateString()}
              </div>
            </Link>
          ))}

        {!isLoading && issues.length === 0 && (
          <div className="p-10 text-center">
            <div className="text-3xl mb-2">🔍</div>
            <p className="text-[14px] font-600 text-[#1E293B] mb-1">
              No issues match these filters
            </p>
            <p className="text-[13px] text-[#64748B]">
              Try a different search term, status, or category.
            </p>
          </div>
        )}
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-[12px] text-[#64748B]">
            Page {pagination.page} of {pagination.totalPages}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page <= 1 || isFetching}
              className="text-[12px] font-600 px-3 py-1.5 rounded-lg border border-[#E2E8F0] text-[#64748B] hover:border-[#0F766E]/40 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() =>
                setPage((p) => Math.min(p + 1, pagination.totalPages))
              }
              disabled={page >= pagination.totalPages || isFetching}
              className="text-[12px] font-600 px-3 py-1.5 rounded-lg border border-[#E2E8F0] text-[#64748B] hover:border-[#0F766E]/40 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
