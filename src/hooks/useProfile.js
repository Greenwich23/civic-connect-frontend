import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as profileApi from "../apis/profileApi.js";

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData) => profileApi.updateProfile(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });
}
