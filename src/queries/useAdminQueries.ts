import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAdminUsers,
  resetAndSeedDb,
  type AdminUserListItem,
  type DbResetAndSeedResult,
} from "@/api/admin";
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

/**
 * DB 초기화 + 더미 데이터 생성 (local/dev 전용)
 * POST /dev/tools/db/reset-and-seed
 */
export function useResetAndSeedDb() {
  const queryClient = useQueryClient();
  return useMutation<DbResetAndSeedResult, Error>({
    mutationFn: resetAndSeedDb,
    onSuccess: () => {
      // 모든 캐시 초기화 — DB가 완전히 바뀌었으므로
      queryClient.clear();
    },
  });
}
