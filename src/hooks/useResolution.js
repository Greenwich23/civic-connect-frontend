import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as resolutionApi from "../apis/resolutionApi.js";

// ── Community Verdict summary (ResolutionFeedback.jsx) ──

export function useResolutionStats(issueId) {
  return useQuery({
    queryKey: ["issue", issueId, "resolution", "stats"],
    queryFn: async () => {
      const { data } = await resolutionApi.getResolutionStats(issueId);
      return data;
    },
    enabled: !!issueId,
  });
}

// ── The logged-in citizen's own feedback, if any ────────

export function useMyResolutionFeedback(issueId) {
  return useQuery({
    queryKey: ["issue", issueId, "resolution", "mine"],
    queryFn: async () => {
      const { data } = await resolutionApi.getMyFeedback(issueId);
      return data.resolution;
    },
    enabled: !!issueId,
  });
}

export function useSubmitResolutionFeedback(issueId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData) => resolutionApi.submitFeedback(issueId, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["issue", issueId, "resolution", "stats"],
      });
      queryClient.invalidateQueries({
        queryKey: ["issue", issueId, "resolution", "mine"],
      });
      // The issue itself doesn't change, but this keeps everything under
      // one predictable "refresh the issue" trigger, same as votes/proposals do.
      queryClient.invalidateQueries({ queryKey: ["issue", issueId] });
    },
  });
}
