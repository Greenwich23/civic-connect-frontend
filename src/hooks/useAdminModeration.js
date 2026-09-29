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
    refetchInterval: 30000, // near-live polling, no WebSockets needed — also feeds the sidebar badge
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

export function useFlaggedMessages(filters = {}) {
  return useQuery({
    queryKey: ["admin", "moderation", "flaggedMessages", filters],
    queryFn: async () => {
      const { data } = await adminModerationApi.getFlaggedMessages(filters);
      return data;
    },
    keepPreviousData: true,
    refetchInterval: 30000, // near-live polling, no WebSockets needed — also feeds the sidebar badge
  });
}

export function useModerateMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ messageId, moderationStatus }) =>
      adminModerationApi.moderateMessage(messageId, { moderationStatus }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "moderation", "flaggedMessages"],
      });
    },
  });
}
