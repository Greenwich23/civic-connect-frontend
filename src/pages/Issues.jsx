import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useIssues } from "../hooks/useIssues";
import IssueCard from "../components/issue/IssueCard";
import IssueCardSkeleton from "../components/issue/IssueCardSkeleton";

const CATEGORIES = [
  { key: "all", label: "All", icon: null },
  { key: "roads", label: "Roads & Transportation", icon: "🚗" },
  { key: "waste", label: "Waste Management", icon: "♻️" },
  { key: "lighting", label: "Street Lighting", icon: "💡" },
  { key: "water", label: "Water", icon: "💧" },
  { key: "safety", label: "Safety", icon: "🛡️" },
  { key: "environment", label: "Environment", icon: "🌿" },
  { key: "public", label: "Public", icon: "🏛️" },
];

const SCOPES = [
  { key: "mine", label: "My Community" },
  { key: "nearby", label: "Nearby" },
  { key: "city", label: "Abuja City" },
  { key: "all", label: "All Nigeria" },
];

export default function Issues() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("");
  const [sort, setSort] = useState("trending");
  const [scope, setScope] = useState("mine");

  const filters = {
    search: search || undefined,
    category: category !== "all" ? category : undefined,
    status: status || undefined,
    sort,
    community:
      scope === "mine" ? user?.community?._id || user?.community : undefined,
    scope: scope !== "mine" ? scope : undefined,
  };

  const { data: issues, isLoading, isFetching } = useIssues(filters);

  const communityName = user?.community?.name || "your area";
  const issueCount = issues?.length ?? 0;

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="font-display font-800 text-[#1E293B] text-3xl mb-1">
            Community Issues
          </h1>
          <p className="text-[13px] text-[#64748B]">
            📍 {communityName}, Abuja · {issueCount} issues found
          </p>
        </div>

        {scope === "mine" && (
          <button
            onClick={() => navigate("/report-issue")}
            className="flex items-center gap-1.5 bg-[#0F766E] hover:bg-[#115E59] text-white text-[13px] font-600 px-4 py-2.5 rounded-lg transition-colors shrink-0"
          >
            + Report Issue
          </button>
        )}
      </div>

      {/* Filter panel */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 mb-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]">
              🔍
            </span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search issues..."
              className="w-full pl-9 pr-4 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E]"
            />
          </div>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="px-4 py-2.5 bg-white border border-[#E2E8F0] rounded-lg text-[13px] text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 cursor-pointer"
          >
            <option value="">All Status</option>
            <option value="reported">Reported</option>
            <option value="under_review">Under Review</option>
            <option value="action_planned">Action Planned</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-4 py-2.5 bg-white border border-[#E2E8F0] rounded-lg text-[13px] text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 cursor-pointer"
          >
            <option value="trending">Trending</option>
            <option value="most_supported">Most Supported</option>
            <option value="most_discussed">Most Discussed</option>
            <option value="recent">Recently Added</option>
            <option value="resolved">Recently Resolved</option>
          </select>
        </div>

        {/* Category pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setCategory(cat.key)}
              className={`flex items-center gap-1.5 whitespace-nowrap text-[13px] font-500 px-3.5 py-2 rounded-full border transition-colors ${
                category === cat.key
                  ? "bg-[#0F766E] border-[#0F766E] text-white"
                  : "border-[#E2E8F0] text-[#64748B] hover:border-[#0F766E]/30"
              }`}
            >
              {cat.icon && <span>{cat.icon}</span>}
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Scope tabs */}
      <div className="flex items-center gap-2 mb-5">
        {SCOPES.map((s) => (
          <button
            key={s.key}
            onClick={() => setScope(s.key)}
            className={`text-[13px] font-600 px-4 py-2 rounded-full transition-colors ${
              scope === s.key
                ? "bg-[#1E293B] text-white"
                : "bg-white border border-[#E2E8F0] text-[#64748B] hover:border-[#0F766E]/30"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Issue grid */}
      <div className="grid md:grid-cols-3 gap-4">
        {isLoading &&
          Array.from({ length: 6 }).map((_, i) => (
            <IssueCardSkeleton key={i} />
          ))}

        {!isLoading &&
          issues?.map((issue) => (
            <IssueCard
              key={issue._id}
              issue={issue}
              onClick={() => navigate(`/issues/${issue._id}`)}
            />
          ))}
      </div>

      {!isLoading && issues?.length === 0 && (
        <div className="text-center py-16">
          <p className="text-[#94A3B8] text-[14px] mb-3">
            No issues found matching your filters.
          </p>
          <button
            onClick={() => navigate("/report-issue")}
            className="text-[#0F766E] font-600 text-[13px] hover:underline"
          >
            Report an Issue
          </button>
        </div>
      )}

      {isFetching && !isLoading && (
        <div className="text-center text-[12px] text-[#94A3B8] mt-4">
          Updating results...
        </div>
      )}
    </div>
  );
}
