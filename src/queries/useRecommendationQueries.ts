import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getLatestInKoreaRecommendations,
  upsertLatestKoreaRecommendation,
  type GetLatestInKoreaParams,
  type UpsertLatestKoreaRecommendationRequest,
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

/**
 * Latest in Korea 추천 상품 등록/수정 (어드민 전용)
 */
export function useUpsertLatestKoreaRecommendation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: UpsertLatestKoreaRecommendationRequest) =>
      upsertLatestKoreaRecommendation(request),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: recommendationKeys.all,
      });
    },
  });
}
