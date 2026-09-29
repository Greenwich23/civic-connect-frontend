// hooks/useRepresentativeReport.js
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as api from "../apis/representativeReportApi.js";

export function useReportRepresentative() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => api.reportRepresentative(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["representative-reports", "mine"],
      });
    },
  });
}

export function useMyReports() {
  return useQuery({
    queryKey: ["representative-reports", "mine"],
    queryFn: async () => {
      const { data } = await api.getMyReports();
      return data.reports;
    },
  });
}
