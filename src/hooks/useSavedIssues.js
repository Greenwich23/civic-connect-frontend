import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as issueApi from "../apis/issuesApi.js";

export function useSavedIssues() {
  return useQuery({
    queryKey: ["issues", "saved"],
    queryFn: async () => {
      const { data } = await issueApi.getSavedIssues();
      return data.issues;
    },
  });
}

export function useIsIssueSaved(issueId, savedIssues) {
  return savedIssues?.some((issue) => issue._id === issueId) ?? false;
}

export function useSaveIssue() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (issueId) => issueApi.saveIssue(issueId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["issues", "saved"] });
    },
  });
}

export function useUnsaveIssue() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (issueId) => issueApi.unsaveIssue(issueId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["issues", "saved"] });
    },
  });
}
