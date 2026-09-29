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
      queryClient.invalidateQueries({
        queryKey: ["representative-application", "mine"],
      });
    },
  });
}

// The logged-in user's most recent application, whatever its status —
// used by CreateCommunityRequest.jsx to show a status view instead of the
// form once a request has already been submitted.
export function useMyApplication() {
  return useQuery({
    queryKey: ["representative-application", "mine"],
    queryFn: async () => {
      const { data } = await api.getMyApplication();
      return data.application;
    },
  });
}
