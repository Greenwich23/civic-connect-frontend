import { useQuery } from "@tanstack/react-query";
import { getPublicStats } from "../apis/publicStatsApi";

export function usePublicStats() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["public", "stats"],
    queryFn: async () => {
      const { data } = await getPublicStats();
      return data;
    },
    staleTime: 1000 * 60 * 5,
  });

  return { stats: data || null, loading: isLoading, error: isError };
}
