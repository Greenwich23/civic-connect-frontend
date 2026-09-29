import { useQuery } from "@tanstack/react-query";
import * as adminRepresentativePerformanceApi from "../apis/adminRepresentativePerformanceApi.js";

// ── List page (RepresentativePerformance.jsx) ───────────

export function useRepresentativePerformance() {
  return useQuery({
    queryKey: ["admin", "representative-performance"],
    queryFn: async () => {
      const { data } =
        await adminRepresentativePerformanceApi.getRepresentativePerformance();
      return data.performance;
    },
    refetchInterval: 30000, // near-live polling, no WebSockets needed — also feeds the sidebar badge
  });
}

// ── Detail page (RepresentativePerformanceDetail.jsx) ───

export function useRepresentativeResolvedIssues(userId) {
  return useQuery({
    queryKey: ["admin", "representative-performance", userId, "issues"],
    queryFn: async () => {
      const { data } =
        await adminRepresentativePerformanceApi.getRepresentativeResolvedIssues(
          userId,
        );
      return data;
    },
    enabled: !!userId,
  });
}
