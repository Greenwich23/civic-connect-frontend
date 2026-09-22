/* eslint-disable no-unused-vars */
// hooks/useRepresentativeApplication.js
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as api from "../apis/representativeApplicationApi.js";

export function useApplyForRepresentative() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData) => api.applyForRepresentative(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });
}
