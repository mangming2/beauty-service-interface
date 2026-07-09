import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getWishes,
  toggleWish,
  type WishItem,
  type GetWishesParams,
} from "@/api/wish";
import type { ApiError } from "@/lib/apiClient";
import { productKeys } from "./useProductQueries";

// ========== Query Keys ==========

export const wishKeys = {
  all: ["wishes"] as const,
  lists: () => [...wishKeys.all, "list"] as const,
  list: (params: GetWishesParams) => [...wishKeys.lists(), params] as const,
} as const;

function retryUnless401(failureCount: number, error: unknown): boolean {
  const err = error as ApiError | undefined;
  if (err?.status === 401) return false;
  return failureCount < 2;
}

// ========== Queries ==========

/**
 * 위시 상품 목록 조회 (단일 페이지)
 */
export function useWishes(params: GetWishesParams = {}) {
  return useQuery<WishItem[]>({
    queryKey: wishKeys.list(params),
    queryFn: () => getWishes(params),
    staleTime: 5 * 60 * 1000,
    retry: retryUnless401,
  });
}

// ========== Mutations ==========

/**
 * 위시 토글 (등록/해제)
 */
export function useToggleWish() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: number) => toggleWish(productId),
    onSuccess: (_, productId) => {
      queryClient.invalidateQueries({ queryKey: wishKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: productKeys.detail(productId),
      });
    },
  });
}
