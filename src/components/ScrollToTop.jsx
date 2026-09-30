import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Resets scroll position on every route change. Most pages scroll the
// window itself (PublicLayout), but AppLayout/AdminLayout scroll their own
// <main> instead (it's the one with overflow-y-auto) — so both are reset
// here rather than assuming which one applies.
// If the URL has a hash (e.g. /#features) it scrolls to that section instead,
// so navbar links to home-page sections work from any page.
export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      // Wait a tick so the target page has rendered its sections.
      const timer = setTimeout(() => {
        document
          .getElementById(hash.slice(1))
          ?.scrollIntoView({ behavior: "smooth" });
      }, 50);
      return () => clearTimeout(timer);
    }

    window.scrollTo(0, 0);
    document.querySelector("main")?.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
}
