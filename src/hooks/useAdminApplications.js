import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as adminApplicationsApi from "../apis/adminApplicationsApi.js";

// ── List page (RepresentativeApplications.jsx) ──────────

export function useAdminApplications() {
  return useQuery({
    queryKey: ["admin", "applications"],
    queryFn: async () => {
      const { data } = await adminApplicationsApi.getPendingApplications();
      return data.applications;
    },
    refetchInterval: 30000, // near-live polling, no WebSockets needed — also feeds the sidebar badge
  });
}

// ── Detail page (RepresentativeApplicationDetail.jsx) ───

export function useAdminApplication(applicationId) {
  return useQuery({
    queryKey: ["admin", "application", applicationId],
    queryFn: async () => {
      const { data } = await adminApplicationsApi.getApplicationById(
        applicationId,
      );
      return data.application;
    },
    enabled: !!applicationId,
  });
}

export function useReviewApplication(applicationId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) =>
      adminApplicationsApi.reviewApplication(applicationId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "applications"] });
      queryClient.invalidateQueries({
        queryKey: ["admin", "application", applicationId],
      });
      // approval creates/activates a community and promotes a user
      queryClient.invalidateQueries({ queryKey: ["communities"] });
    },
  });
}
