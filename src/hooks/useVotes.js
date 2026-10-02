import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as votesApi from "../apis/votesApi.js";

export function useVoteStatus(targetType, targetId) {
  return useQuery({
    queryKey: ["vote", targetType, targetId],
    queryFn: async () => {
      const { data } = await votesApi.getVoteStatus(targetType, targetId);
      return data;
    },
    enabled: !!targetId,
  });
}

export function useCastVote(targetType, targetId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (value) => votesApi.castVote(targetType, targetId, value),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["vote", targetType, targetId],
      });

      // Refresh the parent object's supportCount/opposeCount
      if (targetType === "Issue") {
        queryClient.invalidateQueries({ queryKey: ["issue", targetId] });
        queryClient.invalidateQueries({ queryKey: ["issues"] });
      }

      if (targetType === "Proposal") {
        // Proposals are always fetched by issue — invalidate the parent issue's proposal list
        queryClient.invalidateQueries({ queryKey: ["issue"], exact: false });
        // Proposals page lists proposals under ["proposals", "community"]
        queryClient.invalidateQueries({ queryKey: ["proposals"] });
        queryClient.invalidateQueries({ queryKey: ["proposal", targetId] });
      }
    },
  });
}

export function useRemoveVote(targetType, targetId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => votesApi.removeVote(targetType, targetId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["vote", targetType, targetId],
      });

      if (targetType === "Issue") {
        queryClient.invalidateQueries({ queryKey: ["issue", targetId] });
      }

      if (targetType === "Proposal") {
        queryClient.invalidateQueries({ queryKey: ["issue"], exact: false });
        queryClient.invalidateQueries({ queryKey: ["proposals"] });
        queryClient.invalidateQueries({ queryKey: ["proposal", targetId] });
      }
    },
  });
}
