import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as adminReportsApi from "../apis/adminReportsApi.js";

// ── List page (RepresentativeReports.jsx) ────────────────

export function useAdminReports(status) {
  return useQuery({
    queryKey: ["admin", "representative-reports", status || "all"],
    queryFn: async () => {
      const { data } = await adminReportsApi.getReports(status);
      return data.reports;
    },
    refetchInterval: 30000, // near-live polling, no WebSockets needed — also feeds the sidebar badge
  });
}

// ── Detail page (RepresentativeReportDetail.jsx) ─────────

export function useAdminReport(reportId) {
  return useQuery({
    queryKey: ["admin", "representative-report", reportId],
    queryFn: async () => {
      const { data } = await adminReportsApi.getReportById(reportId);
      return data;
    },
    enabled: !!reportId,
  });
}

export function useReviewReport(reportId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => adminReportsApi.reviewReport(reportId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "representative-reports"],
      });
      queryClient.invalidateQueries({
        queryKey: ["admin", "representative-report", reportId],
      });
      // removal demotes the representative and may reset the community's status
      queryClient.invalidateQueries({ queryKey: ["communities"] });
    },
  });
}
