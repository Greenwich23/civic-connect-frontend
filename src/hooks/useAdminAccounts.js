import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as adminAccountsApi from "../apis/adminAccountsApi.js";

export function useAdminAccounts(filters = {}) {
  return useQuery({
    queryKey: ["admin", "admins", filters],
    queryFn: async () => {
      const { data } = await adminAccountsApi.getAllAdmins(filters);
      return data;
    },
    keepPreviousData: true,
  });
}

export function useCreateAdmin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => adminAccountsApi.createAdmin(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "admins"] });
    },
  });
}

export function useDeactivateAdmin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => adminAccountsApi.deactivateAdmin(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "admins"] });
    },
  });
}

export function useReactivateAdmin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => adminAccountsApi.reactivateAdmin(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "admins"] });
    },
  });
}
