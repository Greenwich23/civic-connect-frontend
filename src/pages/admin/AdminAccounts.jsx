import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import {
  useAdminAccounts,
  useCreateAdmin,
  useDeactivateAdmin,
  useReactivateAdmin,
} from "../../hooks/useAdminAccounts";

const STATUS_FILTERS = [
  { key: "", label: "All statuses" },
  { key: "true", label: "Active" },
  { key: "false", label: "Deactivated" },
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

function AdminRowSkeleton() {
  return (
    <tr className="border-b border-[#E2E8F0] last:border-0">
      <td className="px-4 py-3.5" colSpan={4}>
        <div className="h-4 w-full bg-[#E2E8F0] rounded animate-pulse" />
      </td>
    </tr>
  );
}

function CreateAdminForm({ onClose }) {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const createMutation = useCreateAdmin();

  const update = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async () => {
    setError("");

    if (!form.name.trim() || !form.email.trim() || !form.password) {
      setError("Name, email and password are all required.");
      return;
    }

    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    try {
      await createMutation.mutateAsync({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      });
      onClose();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Couldn't create this admin account. Please try again.",
      );
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] civic-shadow p-5 mb-6">
      <h2 className="font-display font-700 text-[#1E293B] text-[15px] mb-1">
        Add an admin
      </h2>
      <p className="text-[12px] text-[#64748B] mb-4">
        They'll log in with this email and password, just like any other
        CivicPulse account — share the password with them directly, it isn't
        shown again.
      </p>

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
            placeholder="Full name"
            className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-[14px] text-[#1E293B] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E]"
          />
        </div>

        <div>
          <label className="block text-[13px] font-600 text-[#1E293B] mb-1.5">
            Email
          </label>
          <input
            type="email"
            value={form.email}
            onChange={update("email")}
            placeholder="admin@example.com"
            className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-[14px] text-[#1E293B] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E]"
          />
        </div>

        <div>
          <label className="block text-[13px] font-600 text-[#1E293B] mb-1.5">
            Password
          </label>
          <input
            type="text"
            value={form.password}
            onChange={update("password")}
            placeholder="At least 8 characters"
            className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-[14px] text-[#1E293B] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E] font-mono"
          />
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleSubmit}
          disabled={createMutation.isPending}
          className="bg-[#0F766E] hover:bg-[#115E59] text-white font-600 text-sm px-5 py-2.5 rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {createMutation.isPending ? "Creating..." : "Create admin"}
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

export default function AdminAccounts() {
  const { user: currentUser } = useAuth();

  const [search, setSearch] = useState("");
  const [isActive, setIsActive] = useState("");
  const [page, setPage] = useState(1);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const filters = {
    search: search.trim() || undefined,
    isActive: isActive || undefined,
    page,
    limit: 20,
  };

  const { data, isLoading, isFetching, isError } = useAdminAccounts(filters);
  const deactivateMutation = useDeactivateAdmin();
  const reactivateMutation = useReactivateAdmin();

  const [actionError, setActionError] = useState("");
  const [pendingId, setPendingId] = useState(null);

  const admins = data?.admins || [];
  const pagination = data?.pagination;

  const updateFilter = (setter) => (value) => {
    setter(value);
    setPage(1);
  };

  const handleToggleActive = async (admin) => {
    setActionError("");
    setPendingId(admin._id);

    const mutation = admin.isActive ? deactivateMutation : reactivateMutation;

    try {
      await mutation.mutateAsync(admin._id);
    } catch (err) {
      setActionError(
        err.response?.data?.message ||
          `Couldn't ${admin.isActive ? "deactivate" : "reactivate"} this admin. Please try again.`,
      );
    } finally {
      setPendingId(null);
    }
  };

  return (
    <div>
      <div className="flex items-start justify-between gap-4 mb-1">
        <h1 className="font-display font-800 text-[#1E293B] text-3xl">
          Admins
        </h1>
        <button
          onClick={() => setShowCreateForm((v) => !v)}
          className="shrink-0 bg-[#0F766E] hover:bg-[#115E59] text-white font-600 text-[13px] px-4 py-2 rounded-lg transition-colors"
        >
          {showCreateForm ? "Close" : "+ Add Admin"}
        </button>
      </div>
      <p className="text-[13px] text-[#64748B] mb-6">
        {pagination?.total ?? 0} admin accounts. Only you, as super admin, can
        see or manage this list.
      </p>

      {showCreateForm && (
        <CreateAdminForm onClose={() => setShowCreateForm(false)} />
      )}

      <div className="relative mb-4 max-w-sm">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]">
          🔍
        </span>
        <input
          value={search}
          onChange={(e) => updateFilter(setSearch)(e.target.value)}
          placeholder="Search by name or email..."
          className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#E2E8F0] rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E]"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-4">
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
            Couldn't load admins. Please refresh and try again.
          </p>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-[#E2E8F0] civic-shadow overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
              <th className="px-4 py-3 text-[11px] font-600 text-[#94A3B8] uppercase tracking-wider">
                Admin
              </th>
              <th className="px-4 py-3 text-[11px] font-600 text-[#94A3B8] uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-[11px] font-600 text-[#94A3B8] uppercase tracking-wider">
                Added
              </th>
              <th className="px-4 py-3 text-[11px] font-600 text-[#94A3B8] uppercase tracking-wider text-right">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading &&
              Array.from({ length: 5 }).map((_, i) => (
                <AdminRowSkeleton key={i} />
              ))}

            {!isLoading &&
              admins.map((admin) => {
                const isSelf = admin._id === currentUser?._id;
                const isPending = pendingId === admin._id;

                return (
                  <tr
                    key={admin._id}
                    className="border-b border-[#E2E8F0] last:border-0 hover:bg-[#F8FAFC]/60"
                  >
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-[#0F766E]/10 text-[#0F766E] font-700 text-[12px] flex items-center justify-center shrink-0">
                          {admin.name?.[0]?.toUpperCase() || "?"}
                        </div>
                        <div className="min-w-0">
                          <div className="text-[13px] font-600 text-[#1E293B] truncate">
                            {admin.name}
                            {isSelf && (
                              <span className="text-[#94A3B8] font-500">
                                {" "}
                                (you)
                              </span>
                            )}
                          </div>
                          <div className="text-[12px] text-[#64748B] truncate">
                            {admin.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <StatusBadge isActive={admin.isActive} />
                    </td>
                    <td className="px-4 py-3.5 text-[13px] text-[#64748B]">
                      {new Date(admin.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <button
                        onClick={() => handleToggleActive(admin)}
                        disabled={isSelf || isPending}
                        title={
                          isSelf
                            ? "You can't deactivate your own account"
                            : undefined
                        }
                        className={`text-[12px] font-600 px-3 py-1.5 rounded-lg border transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                          admin.isActive
                            ? "border-[#DC2626] text-[#DC2626] hover:bg-red-50"
                            : "border-[#0F766E] text-[#0F766E] hover:bg-[#0F766E]/5"
                        }`}
                      >
                        {isPending
                          ? "Saving..."
                          : admin.isActive
                            ? "Deactivate"
                            : "Reactivate"}
                      </button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>

        {!isLoading && admins.length === 0 && (
          <div className="p-10 text-center">
            <div className="text-3xl mb-2">🔑</div>
            <p className="text-[14px] font-600 text-[#1E293B] mb-1">
              No admins match these filters
            </p>
            <p className="text-[13px] text-[#64748B]">
              Try a different search term or status filter.
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
