import { useQuery } from "@tanstack/react-query";
import {
  getLatestInKoreaRecommendations,
  type GetLatestInKoreaParams,
} from "@/api/recommendation";
import type { Product } from "@/api/product";
import type { ApiError } from "@/lib/apiClient";

// ========== Query Keys ==========

export const recommendationKeys = {
  all: ["recommendations"] as const,
  latestInKorea: (params: GetLatestInKoreaParams) =>
    [...recommendationKeys.all, "latest-in-korea", params] as const,
} as const;

/** 401 시 재시도하지 않음 */
function retryUnless401(failureCount: number, error: unknown): boolean {
  const err = error as ApiError | undefined;
  if (err?.status === 401) return false;
  return failureCount < 2;
}

// ========== Latest in Korea ==========

/**
 * Latest in Korea 추천 리스트 조회 (관리자 우선 노출 상품)
 */
export function useLatestInKoreaRecommendations(
  params: GetLatestInKoreaParams = {}
) {
  return useQuery<Product[]>({
    queryKey: recommendationKeys.latestInKorea(params),
    queryFn: () => getLatestInKoreaRecommendations(params),
    staleTime: 5 * 60 * 1000,
    retry: retryUnless401,
  });
}
