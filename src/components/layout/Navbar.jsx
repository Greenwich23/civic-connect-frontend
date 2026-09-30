import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function Navbar() {
  const { isAuthenticated, user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#E2E8F0]">
      <div className="w-full lg:w-[85%] mx-auto px-4 md:px-8 h-16 flex items-center justify-between gap-2">
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

        <nav className="hidden md:flex items-center gap-4 lg:gap-6 text-sm text-[#64748B]">
          <Link to="/#how" className="hover:text-[#1E293B] transition-colors">
            How it works
          </Link>
          <Link
            to="/#features"
            className="hover:text-[#1E293B] transition-colors"
          >
            Features
          </Link>
          <Link to="/#impact" className="hover:text-[#1E293B] transition-colors">
            Impact
          </Link>
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

        <div className="flex items-center gap-2 sm:gap-3">
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

          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg text-[#1E293B] hover:bg-[#F8FAFC]"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              className="w-5 h-5"
            >
              {menuOpen ? (
                <path d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <nav className="md:hidden border-t border-[#E2E8F0] bg-white px-4 py-3 flex flex-col text-sm text-[#64748B]">
          {[
            { to: "/#how", label: "How it works" },
            { to: "/#features", label: "Features" },
            { to: "/#impact", label: "Impact" },
            { to: "/about", label: "About" },
            { to: "/contact", label: "Contact Us" },
          ].map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={closeMenu}
              className="py-3 border-b border-[#F1F5F9] last:border-b-0 hover:text-[#1E293B]"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
