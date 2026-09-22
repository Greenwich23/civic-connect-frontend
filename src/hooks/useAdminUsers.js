import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as adminUsersApi from "../apis/adminUsersApi.js";

// ── List page (UserManagement.jsx) ──────────────────────

export function useAdminUsers(filters = {}) {
  return useQuery({
    queryKey: ["admin", "users", filters],
    queryFn: async () => {
      const { data } = await adminUsersApi.getAllUsers(filters);
      return data;
    },
    keepPreviousData: true,
  });
}

export function useAdminUser(userId) {
  return useQuery({
    queryKey: ["admin", "user", userId],
    queryFn: async () => {
      const { data } = await adminUsersApi.getUserById(userId);
      return data.user;
    },
    enabled: !!userId,
  });
}

export function useDeactivateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId) => adminUsersApi.deactivateUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });
}

export function useReactivateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId) => adminUsersApi.reactivateUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });
}
