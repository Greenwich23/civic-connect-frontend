import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as adminModerationApi from "../apis/adminModerationApi.js";

// ── List page (Moderation.jsx) ───────────────────────────

export function useFlaggedComments(filters = {}) {
  return useQuery({
    queryKey: ["admin", "moderation", "flagged", filters],
    queryFn: async () => {
      const { data } = await adminModerationApi.getFlaggedComments(filters);
      return data;
    },
    keepPreviousData: true,
  });
}

export function useModerateComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ commentId, moderationStatus }) =>
      adminModerationApi.moderateComment(commentId, { moderationStatus }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "moderation", "flagged"],
      });
    },
  });
}
