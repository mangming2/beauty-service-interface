import { useQuery } from "@tanstack/react-query";
import { getAdminUsers, type AdminUserListItem } from "@/api/admin";
import type { ApiError } from "@/lib/apiClient";

export const adminKeys = {
  all: ["admin"] as const,
  users: () => [...adminKeys.all, "users"] as const,
} as const;

function retryUnless401(failureCount: number, error: unknown): boolean {
  const err = error as ApiError | undefined;
  if (err?.status === 401) return false;
  return failureCount < 2;
}

/**
 * 관리자 유저 전체 목록 조회
 * GET /admin/users
 */
export function useAdminUsers() {
  return useQuery<AdminUserListItem[]>({
    queryKey: adminKeys.users(),
    queryFn: () => getAdminUsers(),
    staleTime: 60 * 1000,
    retry: retryUnless401,
  });
}
