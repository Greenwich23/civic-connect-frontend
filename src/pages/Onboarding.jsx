/* eslint-disable no-unused-vars */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCommunities } from "../hooks/useCommunities";
import { useAuth } from "../hooks/useAuth";

function Logo({ onNavigate }) {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate("/landing")}
      className="flex items-center gap-2.5 mb-8"
    >
      <div className="w-8 h-8 rounded-lg bg-[#0F766E] flex items-center justify-center">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="w-4.5 h-4.5 text-white"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      </div>

      <span className="font-display font-800 text-[#1E293B] text-[15px] tracking-tight">
        CivicPulse
      </span>
    </button>
  );
}

export default function Onboarding({ onNavigate }) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { communities, loading, error: fetchError } = useCommunities();
  const { joinCommunity, pendingApplication } = useAuth();

  const hasPendingApplication = pendingApplication?.status === "pending";

  const filtered = communities.filter((community) => {
    const parentName = community.parent?.name || "";
    return (
      community.name.toLowerCase().includes(search.toLowerCase()) ||
      parentName.toLowerCase().includes(search.toLowerCase())
    );
  });

  const selectedCommunity = communities.find((c) => c._id === selected);

  const handleJoin = async () => {
    if (!selected) return;
    setError("");
    setJoining(true);

    try {
      await joinCommunity(selected);
      navigate("/citizen-home");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Couldn't join this community. Please try again.",
      );
    } finally {
      setJoining(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#F8FAFC]">
      <div className="w-full max-w-lg">
        <Logo onNavigate={onNavigate} />

        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 sm:p-8 civic-shadow">
          {/* Steps indicator */}
          <div className="flex items-center gap-2 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-[#0F766E] flex items-center justify-center">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="3"
                  className="w-3 h-3"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <span className="text-[12px] text-[#64748B]">Account</span>
            </div>

            <div className="flex-1 h-px bg-[#E2E8F0]" />

            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-[#0F766E] flex items-center justify-center">
                <span className="text-[10px] text-white font-700">2</span>
              </div>
              <span className="text-[12px] font-600 text-[#0F766E]">
                Join Community
              </span>
            </div>

            <div className="flex-1 h-px bg-[#E2E8F0]" />

            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-[#E2E8F0] flex items-center justify-center">
                <span className="text-[10px] text-[#94A3B8] font-700">3</span>
              </div>
              <span className="text-[12px] text-[#94A3B8]">Done</span>
            </div>
          </div>

          <h1 className="font-display font-800 text-[#1E293B] text-2xl mb-1">
            Join a community
          </h1>

          <p className="text-[#64748B] text-sm mb-5">
            Select an approved community to join. Only verified communities are
            shown here.
          </p>

          {error && (
            <div className="mb-4 px-3.5 py-2.5 bg-red-50 border border-red-200 rounded-lg text-[13px] text-[#DC2626]">
              {error}
            </div>
          )}

          {hasPendingApplication && (
            <div className="mb-4 px-3.5 py-2.5 bg-amber-50 border border-amber-200 rounded-lg text-[13px] text-amber-800">
              You have a pending{" "}
              {pendingApplication.applicationType === "found_new_community"
                ? "community creation"
                : "representative"}{" "}
              request. You can't join a community until it's approved or
              rejected.{" "}
              <button
                onClick={() => navigate("/signup/community-request")}
                className="font-600 hover:underline"
              >
                View status
              </button>
            </div>
          )}

          {/* Search */}
          <div className="relative mb-4">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name..."
              className="w-full pl-9 pr-4 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-[13px] text-[#1E293B] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E]"
            />
          </div>

          {/* Community list */}
          <div className="space-y-2 max-h-64 overflow-y-auto pr-1 mb-4">
            {loading && (
              <div className="py-6 text-center text-[#94A3B8] text-[13px]">
                Loading communities...
              </div>
            )}

            {fetchError && !loading && (
              <div className="py-6 text-center text-[#DC2626] text-[13px]">
                Couldn't load communities. Please refresh and try again.
              </div>
            )}

            {!loading &&
              !fetchError &&
              filtered.map((community) => (
                <button
                  key={community._id}
                  onClick={() => setSelected(community._id)}
                  disabled={hasPendingApplication}
                  className={`w-full text-left flex items-center gap-3 p-3.5 rounded-xl border-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                    selected === community._id
                      ? "border-[#0F766E] bg-[#0F766E]/5"
                      : "border-[#E2E8F0] hover:border-[#0F766E]/30"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0 ${
                      selected === community._id
                        ? "bg-[#0F766E] text-white"
                        : "bg-[#F8FAFC] text-[#64748B]"
                    }`}
                  >
                    📍
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="font-600 text-[#1E293B] text-[13px]">
                      {community.name}
                      {community.parent?.name
                        ? `, ${community.parent.name}`
                        : ""}
                    </div>
                    <div className="text-[11px] text-[#64748B] mt-0.5">
                      {(community.memberCount ?? 0).toLocaleString()} members ·{" "}
                      {community.issueCount ?? 0} active issues
                    </div>
                  </div>

                  {selected === community._id && (
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
              ))}

            {!loading && !fetchError && filtered.length === 0 && (
              <div className="py-6 text-center text-[#94A3B8] text-[13px]">
                No communities found matching "{search}"
              </div>
            )}
          </div>

          {/* Can't find community */}
          <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg flex items-center gap-3 mb-5">
            <span className="text-base">🏗️</span>

            <div className="flex-1 min-w-0">
              <div className="text-[12px] font-500 text-[#1E293B]">
                Can't find your community?
              </div>
              <div className="text-[11px] text-[#64748B]">
                You can request to create a new community instead.
              </div>
            </div>

            <button
              onClick={() => navigate("/signup/community-request")}
              className="text-[11px] text-[#0F766E] font-600 hover:underline shrink-0"
            >
              Create one
            </button>
          </div>

          {/* Join button */}
          <button
            onClick={handleJoin}
            disabled={!selected || joining || hasPendingApplication}
            className="w-full bg-[#0F766E] hover:bg-[#115E59] text-white font-600 text-[14px] py-3 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {joining
              ? "Joining..."
              : selected
                ? `Join ${selectedCommunity?.name}`
                : "Select a Community to Continue"}
          </button>
        </div>
      </div>
    </div>
  );
}
