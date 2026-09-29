import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as adminCommunitiesApi from "../apis/adminCommunitiesApi.js";

// ── List page (Communities.jsx) ─────────────────────────

export function useAdminCommunities(filters = {}) {
  return useQuery({
    queryKey: ["admin", "communities", filters],
    queryFn: async () => {
      const { data } = await adminCommunitiesApi.getAllCommunities(filters);
      return data.communities;
    },
  });
}

// ── Detail page (CommunityDetail.jsx) ───────────────────

export function useAdminCommunity(communityId, params = {}) {
  return useQuery({
    queryKey: ["admin", "community", communityId, params],
    queryFn: async () => {
      const { data } = await adminCommunitiesApi.getCommunityById(
        communityId,
        params,
      );
      return data;
    },
    enabled: !!communityId,
    keepPreviousData: true,
  });
}

export function useCreateCommunity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => adminCommunitiesApi.createCommunity(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "communities"] });
    },
  });
}

export function useUpdateCommunity(communityId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) =>
      adminCommunitiesApi.updateCommunity(communityId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "communities"] });
      queryClient.invalidateQueries({
        queryKey: ["admin", "community", communityId],
      });
    },
  });
}
