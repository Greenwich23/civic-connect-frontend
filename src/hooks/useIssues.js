import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as issueApi from "../apis/issuesApi.js";

// ── List page (Issues.jsx) ──────────────────────────────

export function useIssues(filters = {}, options = {}) {
  return useQuery({
    queryKey: ["issues", filters],
    queryFn: async () => {
      const { data } = await issueApi.getAllIssues(filters);
      return data.issues;
    },
    keepPreviousData: true,
    ...options,
  });
}

// ── Single issue detail page (IssueDetail.jsx) ──────────

export function useIssue(issueId) {
  return useQuery({
    queryKey: ["issue", issueId],
    queryFn: async () => {
      const { data } = await issueApi.getIssueById(issueId);
      return data.issue;
    },
    enabled: !!issueId,
  });
}

export function useComments(issueId) {
  return useQuery({
    queryKey: ["issue", issueId, "comments"],

    queryFn: async () => {
      const { data } = await issueApi.getComments(issueId);
      return data.comments;
    },

    enabled: !!issueId,

    // Check for new comments every 15 seconds
    // refetchInterval: 15000,

    // Keep checking even if the user changes browser tabs
    refetchIntervalInBackground: true,
  });
}

// export function useProposals(issueId) {
//   return useQuery({
//     queryKey: ["issue", issueId, "proposals"],
//     queryFn: async () => {
//       const { data } = await issueApi.getProposals(issueId);
//       return data.proposals;
//     },
//     enabled: !!issueId,
//   });
// }

// export function useVoteStatus(targetType, targetId) {
//   return useQuery({
//     queryKey: ["vote", targetType, targetId],
//     queryFn: async () => {
//       const { data } = await issueApi.getVoteStatus(targetType, targetId);
//       return data;
//     },
//     enabled: !!targetId,
//   });
// }

// export function useCastVote(targetType, targetId) {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: (value) => issueApi.castVote(targetType, targetId, value),
//     onSuccess: () => {
//       queryClient.invalidateQueries({
//         queryKey: ["vote", targetType, targetId],
//       });
//       queryClient.invalidateQueries({ queryKey: ["issue", targetId] });
//     },
//   });
// }

export function useCreateIssue() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData) => issueApi.createIssue(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["issues"] });
    },
  });
}

export function useTrendingIssues(communityId, options = {}) {
  return useQuery({
    queryKey: ["issues", "trending", communityId],

    queryFn: async () => {
      const data = await issueApi.getTrendingIssues(communityId);

      return data.issues;
    },

    enabled: !!communityId,
    ...options,
  });
}

export function useMyIssues() {
  return useQuery({
    queryKey: ["issues", "mine"],
    queryFn: () => issueApi.getMyIssues(),
  });
}

export function useUpdateIssueStatus(issueId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => issueApi.updateIssueStatus(issueId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["issue", issueId] });
      queryClient.invalidateQueries({ queryKey: ["issues"] });
    },
  });
}
