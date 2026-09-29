import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as adminIssuesApi from "../apis/adminIssuesApi.js";

// ── List page (Issues.jsx) ───────────────────────────────

export function useAdminIssues(filters = {}) {
  return useQuery({
    queryKey: ["admin", "issues", filters],
    queryFn: async () => {
      const { data } = await adminIssuesApi.getAllIssues(filters);
      return data;
    },
    keepPreviousData: true,
  });
}

// ── Detail page (IssueDetail.jsx) ────────────────────────

export function useAdminIssue(issueId) {
  return useQuery({
    queryKey: ["admin", "issue", issueId],
    queryFn: async () => {
      const { data } = await adminIssuesApi.getIssueById(issueId);
      return data;
    },
    enabled: !!issueId,
  });
}

export function useUpdateIssueStatusAdmin(issueId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => adminIssuesApi.updateIssueStatus(issueId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "issue", issueId] });
      queryClient.invalidateQueries({ queryKey: ["admin", "issues"] });
    },
  });
}

export function useModerateIssue(issueId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => adminIssuesApi.moderateIssue(issueId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "issue", issueId] });
      queryClient.invalidateQueries({ queryKey: ["admin", "issues"] });
    },
  });
}
