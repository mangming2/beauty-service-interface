import { useInfiniteQuery } from "@tanstack/react-query";
import { getAdminUsers, type GetAdminUsersParams } from "@/api/admin";
import type { ApiError } from "@/lib/apiClient";

export const adminKeys = {
  all: ["admin"] as const,
  users: () => [...adminKeys.all, "users"] as const,
  usersList: (params: Omit<GetAdminUsersParams, "cursor">) =>
    [...adminKeys.users(), "list", params] as const,
} as const;

function retryUnless401(failureCount: number, error: unknown): boolean {
  const err = error as ApiError | undefined;
  if (err?.status === 401) return false;
  return failureCount < 2;
}

/**
 * 관리자 유저 목록 (cursor 페이지네이션 + 검색)
 */
export function useInfiniteAdminUsers(
  params: Omit<GetAdminUsersParams, "cursor"> = {}
) {
  return useInfiniteQuery({
    queryKey: adminKeys.usersList(params),
    queryFn: ({ pageParam }) =>
      getAdminUsers({
        ...params,
        cursor: pageParam as string | undefined,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: lastPage =>
      lastPage.hasNext ? lastPage.nextCursor : undefined,
    staleTime: 60 * 1000,
    retry: retryUnless401,
  });
}
