import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import {
  useAdminUsers,
  useDeactivateUser,
  useReactivateUser,
} from "../../hooks/useAdminUsers";

const ROLE_FILTERS = [
  { key: "", label: "All roles" },
  { key: "citizen", label: "Citizen" },
  { key: "representative", label: "Representative" },
  // { key: "admin", label: "Admin" },
];

const STATUS_FILTERS = [
  { key: "", label: "All statuses" },
  { key: "true", label: "Active" },
  { key: "false", label: "Deactivated" },
];

const ROLE_BADGE_STYLES = {
  citizen: "bg-blue-50 text-blue-700",
  representative: "bg-purple-50 text-purple-700",
  admin: "bg-[#0F766E]/10 text-[#0F766E]",
};

function RoleBadge({ role }) {
  return (
    <span
      className={`text-[11px] font-600 px-2 py-0.5 rounded-full capitalize ${
        ROLE_BADGE_STYLES[role] || "bg-[#F1F5F9] text-[#64748B]"
      }`}
    >
      {role}
    </span>
  );
}

function StatusBadge({ isActive }) {
  return (
    <span
      className={`text-[11px] font-600 px-2 py-0.5 rounded-full ${
        isActive ? "bg-green-50 text-green-700" : "bg-red-50 text-[#DC2626]"
      }`}
    >
      {isActive ? "Active" : "Deactivated"}
    </span>
  );
}

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

function UserRowSkeleton() {
  return (
    <tr className="border-b border-[#E2E8F0] last:border-0">
      <td className="px-4 py-3.5" colSpan={6}>
        <div className="h-4 w-full bg-[#E2E8F0] rounded animate-pulse" />
      </td>
    </tr>
  );
}

export default function UserManagement() {
  const { user: currentUser } = useAuth();

  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [isActive, setIsActive] = useState("");
  const [page, setPage] = useState(1);

  const filters = {
    search: search.trim() || undefined,
    role: role || undefined,
    isActive: isActive || undefined,
    page,
    limit: 20,
  };

  const { data, isLoading, isFetching, isError } = useAdminUsers(filters);
  const deactivateMutation = useDeactivateUser();
  const reactivateMutation = useReactivateUser();

  const [actionError, setActionError] = useState("");
  const [pendingUserId, setPendingUserId] = useState(null);

  const users = data?.users || [];
  const pagination = data?.pagination;

  const updateFilter = (setter) => (value) => {
    setter(value);
    setPage(1);
  };

  const handleToggleActive = async (targetUser) => {
    setActionError("");
    setPendingUserId(targetUser._id);

    const mutation = targetUser.isActive
      ? deactivateMutation
      : reactivateMutation;

    try {
      await mutation.mutateAsync(targetUser._id);
    } catch (err) {
      setActionError(
        err.response?.data?.message ||
          `Couldn't ${targetUser.isActive ? "deactivate" : "reactivate"} this user. Please try again.`,
      );
    } finally {
      setPendingUserId(null);
    }
  };

  return (
    <div>
      <h1 className="font-display font-800 text-[#1E293B] text-2xl sm:text-3xl mb-1">
        User Management
      </h1>
      <p className="text-[13px] text-[#64748B] mb-6">
        {pagination?.total ?? 0} users on CivicPulse.
      </p>

      <div className="relative mb-4 max-w-sm">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]">
          🔍
        </span>
        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Search by name or email..."
          className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#E2E8F0] rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E]"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-4">
        {ROLE_FILTERS.map((f) => (
          <FilterPill
            key={f.key || "all-roles"}
            label={f.label}
            active={role === f.key}
            onClick={() => updateFilter(setRole)(f.key)}
          />
        ))}

        <span className="w-px h-4 bg-[#E2E8F0] mx-1" />

        {STATUS_FILTERS.map((f) => (
          <FilterPill
            key={f.key || "all-statuses"}
            label={f.label}
            active={isActive === f.key}
            onClick={() => updateFilter(setIsActive)(f.key)}
          />
        ))}
      </div>

      {actionError && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl mb-4">
          <span className="text-lg shrink-0">⚠️</span>
          <p className="text-[13px] text-[#DC2626] leading-relaxed">
            {actionError}
          </p>
        </div>
      )}

      {isError && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl mb-4">
          <span className="text-lg shrink-0">⚠️</span>
          <p className="text-[13px] text-[#DC2626] leading-relaxed">
            Couldn't load users. Please refresh and try again.
          </p>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-[#E2E8F0] civic-shadow overflow-x-auto">
        <table className="w-full min-w-[640px] text-left">
          <thead>
            <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
              <th className="px-4 py-3 text-[11px] font-600 text-[#94A3B8] uppercase tracking-wider">
                User
              </th>
              <th className="px-4 py-3 text-[11px] font-600 text-[#94A3B8] uppercase tracking-wider">
                Role
              </th>
              <th className="px-4 py-3 text-[11px] font-600 text-[#94A3B8] uppercase tracking-wider">
                Community
              </th>
              <th className="px-4 py-3 text-[11px] font-600 text-[#94A3B8] uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-[11px] font-600 text-[#94A3B8] uppercase tracking-wider text-right">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading &&
              Array.from({ length: 8 }).map((_, i) => (
                <UserRowSkeleton key={i} />
              ))}

            {!isLoading &&
              users.map((rowUser) => {
                const isSelf = rowUser._id === currentUser?._id;
                const isPending = pendingUserId === rowUser._id;

                return (
                  <tr
                    key={rowUser._id}
                    className="border-b border-[#E2E8F0] last:border-0 hover:bg-[#F8FAFC]/60"
                  >
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-[#0F766E]/10 text-[#0F766E] font-700 text-[12px] flex items-center justify-center shrink-0">
                          {rowUser.name?.[0]?.toUpperCase() || "?"}
                        </div>
                        <div className="min-w-0">
                          <div className="text-[13px] font-600 text-[#1E293B] truncate">
                            {rowUser.name}
                            {isSelf && (
                              <span className="text-[#94A3B8] font-500">
                                {" "}
                                (you)
                              </span>
                            )}
                          </div>
                          <div className="text-[12px] text-[#64748B] truncate">
                            {rowUser.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <RoleBadge role={rowUser.role} />
                    </td>
                    <td className="px-4 py-3.5 text-[13px] text-[#1E293B]">
                      {rowUser.community?.name || (
                        <span className="text-[#94A3B8]">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      <StatusBadge isActive={rowUser.isActive} />
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <button
                        onClick={() => handleToggleActive(rowUser)}
                        disabled={isSelf || isPending}
                        title={
                          isSelf
                            ? "You cannot deactivate your own account"
                            : undefined
                        }
                        className={`text-[12px] font-600 px-3 py-1.5 rounded-lg border transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                          rowUser.isActive
                            ? "border-[#DC2626] text-[#DC2626] hover:bg-red-50"
                            : "border-[#0F766E] text-[#0F766E] hover:bg-[#0F766E]/5"
                        }`}
                      >
                        {isPending
                          ? "Saving..."
                          : rowUser.isActive
                            ? "Deactivate"
                            : "Reactivate"}
                      </button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>

        {!isLoading && users.length === 0 && (
          <div className="p-10 text-center">
            <div className="text-3xl mb-2">🔍</div>
            <p className="text-[14px] font-600 text-[#1E293B] mb-1">
              No users match these filters
            </p>
            <p className="text-[13px] text-[#64748B]">
              Try a different search term, role, or status filter.
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
