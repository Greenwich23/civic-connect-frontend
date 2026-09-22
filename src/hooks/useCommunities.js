import { useQuery } from "@tanstack/react-query";
import { getJoinableCommunities } from "../apis/communityApi";

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
