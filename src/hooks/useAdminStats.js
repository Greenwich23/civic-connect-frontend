import { useQuery } from "@tanstack/react-query";
import * as adminStatsApi from "../apis/adminStatsApi.js";

// ── Dashboard (AdminHome.jsx) ────────────────────────────

export function useAdminOverview() {
  return useQuery({
    queryKey: ["admin", "stats", "overview"],
    queryFn: async () => {
      const { data } = await adminStatsApi.getPlatformOverview();
      return data.overview;
    },
  });
}

// ── Communities page ─────────────────────────────────────

export function useAdminCommunityBreakdown() {
  return useQuery({
    queryKey: ["admin", "stats", "communities"],
    queryFn: async () => {
      const { data } = await adminStatsApi.getCommunityBreakdown();
      return data.communities;
    },
  });
}
