import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Resets scroll position on every route change. Most pages scroll the
// window itself (PublicLayout), but AppLayout/AdminLayout scroll their own
// <main> instead (it's the one with overflow-y-auto) — so both are reset
// here rather than assuming which one applies.
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    document.querySelector("main")?.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
