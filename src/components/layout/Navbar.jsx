import { NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function Navbar() {
  const { isAuthenticated, user } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#E2E8F0]">
      <div className="w-[85%] mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
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

          <NavLink
            className="font-display font-800 text-[#1E293B] text-[15px] tracking-tight"
            to={"/"}
          >
            CivicPulse
          </NavLink>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-sm text-[#64748B]">
          <a href="#how" className="hover:text-[#1E293B] transition-colors">
            How it works
          </a>
          <a
            href="#features"
            className="hover:text-[#1E293B] transition-colors"
          >
            Features
          </a>
          <a href="#impact" className="hover:text-[#1E293B] transition-colors">
            Impact
          </a>
          <NavLink
            to="/about"
            className="hover:text-[#1E293B] transition-colors"
          >
            About
          </NavLink>
          <NavLink
            to="/contact"
            className="hover:text-[#1E293B] transition-colors"
          >
            Contact Us
          </NavLink>
        </nav>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <NavLink
              to="/citizen-home"
              className="flex items-center gap-2 text-[13px] font-600 bg-[#0F766E] hover:bg-[#115E59] text-white px-4 py-2 rounded-lg transition-colors"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="w-4 h-4"
              >
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              {user?.name ? `Hi, ${user.name.split(" ")[0]}` : "Dashboard"}
            </NavLink>
          ) : (
            <>
              <NavLink
                to={"/login"}
                className="text-[13px] font-500 text-[#64748B] hover:text-[#1E293B] transition-colors"
              >
                Log in
              </NavLink>

              <NavLink
                to={"/signup"}
                className="text-[13px] font-600 bg-[#0F766E] hover:bg-[#115E59] text-white px-4 py-2 rounded-lg transition-colors"
              >
                Get Started
              </NavLink>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
