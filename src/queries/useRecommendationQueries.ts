import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getLatestInKoreaRecommendations,
  upsertLatestKoreaRecommendation,
  setProductRecommendation,
  setProductRecommendationScore,
  getAdminPickedRecommendations,
  type GetLatestInKoreaParams,
  type UpsertLatestKoreaRecommendationRequest,
  type GetAdminPickedParams,
  type AdminPickedProduct,
} from "@/api/recommendation";
import type { Product } from "@/api/product";
import type { ApiError } from "@/lib/apiClient";

// ========== Query Keys ==========

export const recommendationKeys = {
  all: ["recommendations"] as const,
  latestInKorea: (params: GetLatestInKoreaParams) =>
    [...recommendationKeys.all, "latest-in-korea", params] as const,
  adminPicked: (params: GetAdminPickedParams) =>
    [...recommendationKeys.all, "admin-picked", params] as const,
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
 * 관리자 추천 패키지 목록 조회
 * GET /products/recommendations/admin-picked
 */
export function useAdminPickedRecommendations(
  params: GetAdminPickedParams = {}
) {
  return useQuery<AdminPickedProduct[]>({
    queryKey: recommendationKeys.adminPicked(params),
    queryFn: () => getAdminPickedRecommendations(params),
    staleTime: 5 * 60 * 1000,
    retry: retryUnless401,
  });
}

/**
 * 특정 상품 추천 여부 설정 (관리자 전용)
 * PUT /admin/products/{productId}/recommendation
 */
export function useSetProductRecommendation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      productId,
      recommended,
    }: {
      productId: number;
      recommended: boolean;
    }) => setProductRecommendation(productId, recommended),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: recommendationKeys.all });
    },
  });
}

/**
 * 특정 상품 추천 점수 설정 (관리자 전용)
 * PUT /admin/products/{productId}/recommendation-score
 */
export function useSetProductRecommendationScore() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, score }: { productId: number; score: number }) =>
      setProductRecommendationScore(productId, score),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: recommendationKeys.all });
    },
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
