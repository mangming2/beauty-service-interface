import { useQuery } from "@tanstack/react-query";
import { getUser } from "@/api/user";
import type { User } from "@/api/user-controller.type";
import { userKeys } from "./queryKeys";

/**
 * 사용자 조회 Query
 * GET /users
 */
export function useUser(userId: number) {
  return useQuery<User, Error>({
    queryKey: userKeys.detail(userId),
    queryFn: () => getUser({ userId }),
    enabled: !!userId && userId > 0,
    staleTime: 5 * 60 * 1000, // 5분
    retry: 2,
  });
}
