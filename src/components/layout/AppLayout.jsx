import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";
import { useNotifications } from "../../hooks/useNotifications.js";
import { useMyConversations } from "../../hooks/useMessages.js";

function SidebarLink({ to, icon, label, badge, disabled }) {
  if (disabled) {
    return (
      <span className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] text-[#CBD5E1] cursor-not-allowed">
        <span className="w-5">{icon}</span>
        <span className="flex-1">{label}</span>
      </span>
    );
  }

  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] transition-colors ${
          isActive
            ? "bg-[#0F766E]/10 text-[#0F766E] font-600"
            : "text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#1E293B]"
        }`
      }
    >
      <span className="w-5">{icon}</span>
      <span className="flex-1">{label}</span>
      {badge > 0 && (
        <span className="bg-[#DC2626] text-white text-[10px] font-700 min-w-[18px] h-[18px] flex items-center justify-center rounded-full px-1">
          {badge > 99 ? "99+" : badge}
        </span>
      )}
    </NavLink>
  );
}

export default function AppLayout() {
  const { user, logout, pendingApplication } = useAuth();
  const navigate = useNavigate();
  const { data: notificationsData } = useNotifications();
  const { data: conversations } = useMyConversations();

  const unreadCount = notificationsData?.unreadCount || 0;
  const unreadMessageCount =
    conversations?.reduce((sum, c) => sum + (c.unreadCount || 0), 0) || 0;

  // `user.community` is null when nothing's joined yet — `typeof null` is
  // "object" in JS, so a typeof check here would wrongly read "no
  // community" as "has one". This reads correctly whether community is
  // null, an unpopulated id string, or a populated object.
  const communityId = user?.community?._id || user?.community;

  const hasPendingApplication = pendingApplication?.status === "pending";

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 border-r border-[#E2E8F0] bg-white flex flex-col p-4">
        <button
          onClick={() => navigate("/citizen-home")}
          className="flex items-center gap-2.5 mb-8 px-1"
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
          <span className="font-800 text-[#1E293B] text-[15px]">
            CivicPulse
          </span>
        </button>

        <div className="flex items-center justify-between mb-6 px-1">
          <span className="text-[13px] text-[#1E293B] font-500 flex items-center gap-1">
            📍{" "}
            {user?.community?.name
              ? `${user.community.name}${
                  user.community.parent?.name
                    ? `, ${user.community.parent.name}`
                    : ""
                }`
              : "No community"}
          </span>
          <button
            onClick={() => navigate("/communities")}
            disabled={hasPendingApplication}
            title={
              hasPendingApplication
                ? "You have a pending application — resolve it before changing communities"
                : undefined
            }
            className="text-[12px] text-[#0F766E] font-600 hover:underline disabled:text-[#94A3B8] disabled:no-underline disabled:cursor-not-allowed"
          >
            Change
          </button>
        </div>

        <nav className="space-y-1 flex-1">
          <SidebarLink to="/citizen-home" icon="🏠" label="Home" />
          <SidebarLink to="/issues" icon="⏱️" label="Issues" />

          <SidebarLink
            to={communityId ? `/communities/${communityId}` : "#"}
            icon="📢"
            label="My Community"
            disabled={!communityId}
          />

          <SidebarLink to="/discussions" icon="💬" label="Discussions" />
          <SidebarLink to="/proposals" icon="✅" label="Proposals" />
          <SidebarLink to="/saved-issues" icon="📑" label="Saved Issues" />

          {user?.role === "representative" && (
            <SidebarLink to="/my-queue" icon="📋" label="My Queue" />
          )}

          <div className="text-[11px] font-600 text-[#94A3B8] uppercase tracking-wider mt-6 mb-2 px-3">
            Personal
          </div>
          <SidebarLink
            to="/notifications"
            icon="🔔"
            label="Notifications"
            badge={unreadCount}
          />
          <SidebarLink
            to="/messages"
            icon="✉️"
            label="Messages"
            badge={unreadMessageCount}
          />
        </nav>

        <div className="pt-4 border-t border-[#E2E8F0] space-y-1">
          <SidebarLink to="/profile" icon="👤" label="Profile" />
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#DC2626] transition-colors"
          >
            <span className="w-5">🚪</span>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="flex items-center justify-end gap-4 px-6 py-4 border-b border-[#E2E8F0] bg-white">
          {/* <div className="relative flex-1 max-w-md">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]">
              🔍
            </span>
            <input
              placeholder="Search community issues..."
              className="w-full pl-9 pr-4 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E]"
            />
          </div> */}

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/notifications")}
              className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#F8FAFC] cursor-pointer"
            >
              🔔
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-[#DC2626] rounded-full" />
              )}
            </button>

            <div
              className="w-9 h-9 rounded-full bg-[#0F766E]/10 text-[#0F766E] font-700 text-[13px] flex items-center justify-center cursor-pointer"
              onClick={() => navigate("/profile")}
            >
              {user?.name
                ?.split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2) || "U"}
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
