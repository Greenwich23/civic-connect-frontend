import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";

function SidebarLink({ to, icon, label }) {
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
    </NavLink>
  );
}

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const initials =
    user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "A";

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 border-r border-[#E2E8F0] bg-white flex flex-col p-4">
        <button
          onClick={() => navigate("/admin-home")}
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
          <span className="text-[10px] font-700 text-[#0F766E] bg-[#0F766E]/10 rounded px-1.5 py-0.5 uppercase tracking-wider">
            Admin
          </span>
        </button>

        <nav className="space-y-1 flex-1">
          <SidebarLink to="/admin-home" icon="📊" label="Dashboard" />
          <SidebarLink
            to="/admin/representative-applications"
            icon="📝"
            label="Representative Applications"
          />
          <SidebarLink to="/admin/users" icon="👥" label="User Management" />
          <SidebarLink to="/admin/moderation" icon="🛡️" label="Moderation" />
          <SidebarLink to="/admin/communities" icon="🏘️" label="Communities" />
        </nav>

        <div className="pt-4 border-t border-[#E2E8F0] space-y-1">
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
          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right leading-tight">
              <div className="text-[13px] font-600 text-[#1E293B]">
                {user?.name || "Admin"}
              </div>
              <div className="text-[11px] text-[#64748B]">Administrator</div>
            </div>

            <div className="w-9 h-9 rounded-full bg-[#0F766E]/10 text-[#0F766E] font-700 text-[13px] flex items-center justify-center">
              {initials}
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
