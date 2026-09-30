import { useState } from "react";
import { Link } from "react-router-dom";
import {
  useAdminCommunities,
  useCreateCommunity,
} from "../../hooks/useAdminCommunities";

const LEVEL_FILTERS = [
  { key: "", label: "All levels" },
  { key: "city", label: "City" },
  { key: "community", label: "Community" },
];

const STATUS_FILTERS = [
  { key: "", label: "All statuses" },
  { key: "active", label: "Active" },
  { key: "unrepresented", label: "Unrepresented" },
];

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

function StatusBadge({ status }) {
  return (
    <span
      className={`text-[11px] font-600 px-2 py-0.5 rounded-full ${
        status === "active"
          ? "bg-green-50 text-green-700"
          : "bg-amber-50 text-amber-700"
      }`}
    >
      {status === "active" ? "Active" : "Unrepresented"}
    </span>
  );
}

function CommunityCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 animate-pulse">
      <div className="h-3 w-20 bg-[#E2E8F0] rounded mb-4" />
      <div className="h-4 w-3/4 bg-[#E2E8F0] rounded mb-3" />
      <div className="h-3 w-1/2 bg-[#E2E8F0] rounded" />
    </div>
  );
}

function CreateCommunityForm({ onClose }) {
  const [form, setForm] = useState({ name: "", level: "community", parent: "" });
  const [error, setError] = useState("");

  // The parent field only applies to communities, and needs an existing city's id —
  // fetching that list is out of scope here, so admins type/paste the city id directly.
  const createMutation = useCreateCommunity();

  const update = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async () => {
    setError("");

    if (!form.name.trim()) {
      setError("Name is required");
      return;
    }

    if (form.level === "community" && !form.parent.trim()) {
      setError("A parent city id is required for a community");
      return;
    }

    try {
      await createMutation.mutateAsync({
        name: form.name.trim(),
        level: form.level,
        parent: form.level === "community" ? form.parent.trim() : undefined,
      });
      onClose();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Couldn't create this community. Please try again.",
      );
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] civic-shadow p-5 mb-6">
      <h2 className="font-display font-700 text-[#1E293B] text-[15px] mb-4">
        Add a community
      </h2>

      {error && (
        <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg mb-4">
          <span className="text-lg shrink-0">⚠️</span>
          <p className="text-[13px] text-[#DC2626] leading-relaxed">{error}</p>
        </div>
      )}

      <div className="grid sm:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-[13px] font-600 text-[#1E293B] mb-1.5">
            Name
          </label>
          <input
            value={form.name}
            onChange={update("name")}
            placeholder="e.g. Wuse Zone 5"
            className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-[14px] text-[#1E293B] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E]"
          />
        </div>

        <div>
          <label className="block text-[13px] font-600 text-[#1E293B] mb-1.5">
            Level
          </label>
          <select
            value={form.level}
            onChange={update("level")}
            className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-[14px] text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E] appearance-none cursor-pointer"
          >
            <option value="community">Community</option>
            <option value="city">City</option>
          </select>
        </div>

        {form.level === "community" && (
          <div>
            <label className="block text-[13px] font-600 text-[#1E293B] mb-1.5">
              Parent city id
            </label>
            <input
              value={form.parent}
              onChange={update("parent")}
              placeholder="City's _id"
              className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-[14px] text-[#1E293B] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E] font-mono"
            />
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleSubmit}
          disabled={createMutation.isPending}
          className="bg-[#0F766E] hover:bg-[#115E59] text-white font-600 text-sm px-5 py-2.5 rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {createMutation.isPending ? "Creating..." : "Create community"}
        </button>
        <button
          onClick={onClose}
          className="text-[#64748B] hover:text-[#1E293B] font-600 text-sm px-5 py-2.5 rounded-xl transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default function Communities() {
  const [level, setLevel] = useState("");
  const [status, setStatus] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);

  const filters = { level: level || undefined, status: status || undefined };
  const { data: communities, isLoading, isError } = useAdminCommunities(filters);

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4 mb-1">
        <h1 className="font-display font-800 text-[#1E293B] text-2xl sm:text-3xl">
          Communities
        </h1>
        <button
          onClick={() => setShowCreateForm((v) => !v)}
          className="shrink-0 bg-[#0F766E] hover:bg-[#115E59] text-white font-600 text-[13px] px-4 py-2 rounded-lg transition-colors"
        >
          {showCreateForm ? "Close" : "+ Add Community"}
        </button>
      </div>
      <p className="text-[13px] text-[#64748B] mb-6">
        {communities?.length ?? 0} communities on CivicPulse.
      </p>

      {showCreateForm && (
        <CreateCommunityForm onClose={() => setShowCreateForm(false)} />
      )}

      <div className="flex flex-wrap items-center gap-2 mb-4">
        {LEVEL_FILTERS.map((f) => (
          <FilterPill
            key={f.key || "all-levels"}
            label={f.label}
            active={level === f.key}
            onClick={() => setLevel(f.key)}
          />
        ))}

        <span className="w-px h-4 bg-[#E2E8F0] mx-1" />

        {STATUS_FILTERS.map((f) => (
          <FilterPill
            key={f.key || "all-statuses"}
            label={f.label}
            active={status === f.key}
            onClick={() => setStatus(f.key)}
          />
        ))}
      </div>

      {isError && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl mb-4">
          <span className="text-lg shrink-0">⚠️</span>
          <p className="text-[13px] text-[#DC2626] leading-relaxed">
            Couldn't load communities. Please refresh and try again.
          </p>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-4">
        {isLoading &&
          Array.from({ length: 6 }).map((_, i) => (
            <CommunityCardSkeleton key={i} />
          ))}

        {!isLoading &&
          communities?.map((community) => (
            <Link
              key={community._id}
              to={`/admin/communities/${community._id}`}
              className="bg-white rounded-2xl border border-[#E2E8F0] p-5 hover:shadow-md transition-shadow block"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <span className="text-[11px] font-600 px-2 py-0.5 rounded-full bg-[#F1F5F9] text-[#64748B] capitalize">
                  {community.level}
                </span>
                <StatusBadge status={community.status} />
              </div>

              <h3 className="font-600 text-[#1E293B] text-[15px] mb-1 leading-snug">
                {community.name}
              </h3>

              <p className="text-[12px] text-[#64748B] mb-4">
                {community.parent?.name
                  ? `Under ${community.parent.name}`
                  : "No parent"}
              </p>

              <div className="flex items-center gap-4 pt-3 border-t border-[#E2E8F0] text-[12px] text-[#64748B]">
                <span>👥 {community.memberCount} members</span>
                <span>📌 {community.issueCount} issues</span>
              </div>
            </Link>
          ))}
      </div>

      {!isLoading && !isError && communities?.length === 0 && (
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-10 text-center">
          <div className="text-3xl mb-2">🏘️</div>
          <p className="text-[14px] font-600 text-[#1E293B] mb-1">
            No communities match these filters
          </p>
          <p className="text-[13px] text-[#64748B]">
            Try a different level or status filter.
          </p>
        </div>
      )}
    </div>
  );
}
