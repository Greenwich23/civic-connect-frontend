import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as proposalApi from "../apis/proposalApi.js";

export function useProposals(issueId) {
  return useQuery({
    queryKey: ["issue", issueId, "proposals"],
    queryFn: async () => {
      const { data } = await proposalApi.getProposals(issueId);
      return data.proposals;
    },
    enabled: !!issueId,
  });
}

export function useProposal(proposalId) {
  return useQuery({
    queryKey: ["proposal", proposalId],
    queryFn: async () => {
      const { data } = await proposalApi.getProposalById(proposalId);
      return data.proposal;
    },
    enabled: !!proposalId,
  });
}

export function useCreateProposal(issueId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => proposalApi.createProposal(issueId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["issue", issueId, "proposals"],
      });
      queryClient.invalidateQueries({ queryKey: ["issue", issueId] });
    },
  });
}

export function useCommunityProposals() {
  return useQuery({
    queryKey: ["proposals", "community"],
    queryFn: async () => {
      const { data } = await proposalApi.getCommunityProposals();
      return data.proposals;
    },
  });
}
