import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCommunities } from "../hooks/useCommunities";
import { useAuth } from "../hooks/useAuth";

export default function ChangeCommunity() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [switching, setSwitching] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();
  const { user, joinCommunity, pendingApplication } = useAuth();
  const { communities, loading, error: fetchError } = useCommunities();

  // `typeof null === "object"` in JS, so a typeof check here would wrongly
  // treat "no community" as "has one" — this reads correctly whether
  // community is null, an unpopulated id string, or a populated object.
  const currentCommunityId = user?.community?._id || user?.community;

  const hasPendingApplication = pendingApplication?.status === "pending";

  const currentCommunityName = user?.community?.name || null;
  const currentCityName = user?.community?.parent?.name || null;

  const filtered = communities.filter((community) => {
    const parentName = community.parent?.name || "";
    return (
      community.name.toLowerCase().includes(search.toLowerCase()) ||
      parentName.toLowerCase().includes(search.toLowerCase())
    );
  });

  const selectedCommunity = communities.find((c) => c._id === selected);

  const handleSwitch = async () => {
    if (!selected || selected === currentCommunityId) return;

    setError("");
    setSwitching(true);

    try {
      await joinCommunity(selected);
      setSuccess(true);
      setTimeout(() => navigate("/citizen-home"), 1200);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Couldn't switch communities. Please try again.",
      );
    } finally {
      setSwitching(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-lg mx-auto text-center py-20">
        <div className="w-16 h-16 rounded-full bg-[#0F766E]/10 flex items-center justify-center mx-auto mb-5">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="#0F766E"
            strokeWidth="2.5"
            className="w-8 h-8"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <h2 className="font-display font-800 text-[#1E293B] text-2xl mb-2">
          Community changed
        </h2>

        <p className="text-[#64748B] text-[14px]">
          You're now part of{" "}
          <span className="font-600 text-[#1E293B]">
            {selectedCommunity?.name}
          </span>
          . Taking you home...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-[#64748B] text-sm hover:text-[#1E293B] mb-5 transition-colors"
      >
        ← Back
      </button>

      <h1 className="font-display font-800 text-[#1E293B] text-2xl sm:text-3xl mb-1">
        Change Community
      </h1>
      <p className="text-[13px] text-[#64748B] mb-6">
        Switch the community you report issues in and see on your home feed.
      </p>

      {/* Current community */}
      {currentCommunityName && (
        <div className="bg-[#0F766E]/5 border border-[#0F766E]/20 rounded-2xl p-4 mb-5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#0F766E] text-white flex items-center justify-center text-[16px] shrink-0">
            📍
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-600 text-[#0F766E] uppercase tracking-wider">
              Current community
            </div>
            <div className="font-600 text-[#1E293B] text-[15px] mt-0.5">
              {currentCommunityName}
              {currentCityName ? `, ${currentCityName}` : ""}
            </div>
          </div>
        </div>
      )}

      {/* What changes notice */}
      <div className="flex gap-3 p-4 bg-amber-50 border border-amber-200 rounded-2xl mb-6">
        <span className="text-lg shrink-0">ℹ️</span>
        <div className="text-[13px] text-amber-800 leading-relaxed">
          <p className="font-600 mb-1">What changes when you switch</p>
          <ul className="space-y-0.5 list-disc list-inside">
            <li>New issues you report will be filed under the new community</li>
            <li>You'll only be able to propose solutions there</li>
            <li>
              Your existing reports, comments, and votes stay exactly where they
              are
            </li>
          </ul>
        </div>
      </div>

      {error && (
        <div className="mb-5 px-3.5 py-2.5 bg-red-50 border border-red-200 rounded-lg text-[13px] text-[#DC2626]">
          {error}
        </div>
      )}

      {hasPendingApplication ? (
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-8 text-center">
          <div className="text-3xl mb-2">⏳</div>
          <h2 className="font-600 text-[#1E293B] text-[15px] mb-1">
            You have a pending application
          </h2>
          <p className="text-[13px] text-[#64748B] max-w-sm mx-auto">
            {pendingApplication.applicationType === "found_new_community"
              ? "You've applied to create a new community. You can't join a different one until an admin approves or rejects that request."
              : "You've applied to represent a community. You can't join a different one until an admin approves or rejects that request."}
          </p>
          <button
            onClick={() => navigate("/signup/community-request")}
            className="mt-4 text-[13px] font-600 text-[#0F766E] hover:underline"
          >
            View application status →
          </button>
        </div>
      ) : (
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5">
        <h2 className="font-600 text-[#1E293B] text-[15px] mb-4">
          Choose a new community
        </h2>

        {/* Search */}
        <div className="relative mb-4">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]">
            🔍
          </span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name..."
            className="w-full pl-9 pr-4 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-[13px] text-[#1E293B] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E]"
          />
        </div>

        {/* Community list */}
        <div className="space-y-2 max-h-80 overflow-y-auto pr-1 mb-5">
          {loading &&
            [1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-[62px] bg-[#F1F5F9] rounded-xl animate-pulse"
              />
            ))}

          {fetchError && !loading && (
            <div className="py-6 text-center text-[#DC2626] text-[13px]">
              Couldn't load communities. Please refresh and try again.
            </div>
          )}

          {!loading &&
            !fetchError &&
            filtered.map((community) => {
              const isCurrent = community._id === currentCommunityId;
              const isSelected = selected === community._id;

              return (
                <button
                  key={community._id}
                  onClick={() => !isCurrent && setSelected(community._id)}
                  disabled={isCurrent}
                  className={`w-full text-left flex items-center gap-3 p-3.5 rounded-xl border-2 transition-colors ${
                    isCurrent
                      ? "border-[#E2E8F0] bg-[#F8FAFC] opacity-60 cursor-not-allowed"
                      : isSelected
                        ? "border-[#0F766E] bg-[#0F766E]/5"
                        : "border-[#E2E8F0] hover:border-[#0F766E]/30"
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm shrink-0 ${
                      isSelected
                        ? "bg-[#0F766E] text-white"
                        : "bg-[#F1F5F9] text-[#64748B]"
                    }`}
                  >
                    📍
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-600 text-[#1E293B] text-[13px]">
                        {community.name}
                        {community.parent?.name
                          ? `, ${community.parent.name}`
                          : ""}
                      </span>

                      {isCurrent && (
                        <span className="text-[10px] font-600 px-2 py-0.5 rounded-full bg-[#0F766E]/10 text-[#0F766E] shrink-0">
                          Current
                        </span>
                      )}
                    </div>

                    <div className="text-[11px] text-[#64748B] mt-0.5">
                      {(community.memberCount ?? 0).toLocaleString()} members ·{" "}
                      {community.issueCount ?? 0} active issues
                    </div>
                  </div>

                  {isSelected && (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#0F766E"
                      strokeWidth="2.5"
                      className="w-4 h-4 shrink-0"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </button>
              );
            })}

          {!loading && !fetchError && filtered.length === 0 && (
            <div className="py-6 text-center text-[#94A3B8] text-[13px]">
              No communities found matching "{search}"
            </div>
          )}
        </div>

        {/* Can't find community */}
        <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl flex items-center gap-3 mb-5">
          <span className="text-base shrink-0">🏗️</span>

          <div className="flex-1 min-w-0">
            <div className="text-[12px] font-500 text-[#1E293B]">
              Can't find your community?
            </div>
            <div className="text-[11px] text-[#64748B]">
              You can request to create a new one instead.
            </div>
          </div>

          <button
            onClick={() => navigate("/signup/community-request")}
            className="text-[11px] text-[#0F766E] font-600 hover:underline shrink-0"
          >
            Create one
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-4 border-t border-[#E2E8F0]">
          <button
            onClick={() => navigate(-1)}
            className="px-5 py-2.5 border border-[#E2E8F0] text-[#64748B] text-[13px] font-500 rounded-lg hover:border-[#0F766E]/30 hover:text-[#0F766E] transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={handleSwitch}
            disabled={!selected || switching}
            className="flex-1 bg-[#0F766E] hover:bg-[#115E59] text-white font-600 text-[14px] py-2.5 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {switching
              ? "Switching..."
              : selected
                ? `Switch to ${selectedCommunity?.name}`
                : "Select a Community to Continue"}
          </button>
        </div>
      </div>
      )}
    </div>
  );
}
