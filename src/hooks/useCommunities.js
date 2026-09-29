import { useQuery } from "@tanstack/react-query";
import {
  getJoinableCommunities,
  getCommunityById,
  getAllCommunities,
} from "../apis/communityApi";

export function useCommunities() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["communities", "joinable"],
    queryFn: async () => {
      const { data } = await getJoinableCommunities();
      return data.communities;
    },
    staleTime: 1000 * 60 * 5,
  });

  return {
    communities: data || [],
    loading: isLoading,
    error: isError ? error : null,
  };
}

// A single community's full details (including status) — used by
// CreateCommunityRequest.jsx's "represent existing" mode to check whether
// the logged-in user's own community currently has no representative.
export function useCommunity(communityId) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["community", communityId],
    queryFn: async () => {
      const { data } = await getCommunityById(communityId);
      return data.community;
    },
    enabled: !!communityId,
  });

  return {
    community: data || null,
    loading: isLoading,
    error: isError ? error : null,
  };
}

// Every city-level community (the anchors "Abuja", "Lagos", etc. sit under)
// — used to let a citizen pick which city their new community belongs to.
export function useCities() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["communities", "cities"],
    queryFn: async () => {
      const { data } = await getAllCommunities({ level: "city" });
      return data.communities;
    },
    staleTime: 1000 * 60 * 5,
  });

  return {
    cities: data || [],
    loading: isLoading,
    error: isError ? error : null,
  };
}
