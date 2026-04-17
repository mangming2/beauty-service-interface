import { useQuery } from "@tanstack/react-query";
import {
  getProductTourAttractions,
  type GetProductTourAttractionsParams,
  type ProductTourAttractionResponse,
} from "@/api/attraction";
import type { ApiError } from "@/lib/apiClient";

export const attractionKeys = {
  all: ["attractions"] as const,
  product: (productId: number, params: GetProductTourAttractionsParams = {}) =>
    [...attractionKeys.all, "product", productId, params] as const,
} as const;

function retryUnless401(failureCount: number, error: unknown): boolean {
  const err = error as ApiError | undefined;
  if (err?.status === 401) return false;
  return failureCount < 2;
}

export function useProductTourAttractions(
  productId: number | undefined,
  params: GetProductTourAttractionsParams = {}
) {
  const enabled =
    typeof productId === "number" &&
    Number.isFinite(productId) &&
    productId > 0;

  return useQuery<ProductTourAttractionResponse>({
    queryKey: attractionKeys.product(productId ?? -1, params),
    queryFn: () => getProductTourAttractions(productId!, params),
    enabled,
    staleTime: 5 * 60 * 1000,
    retry: retryUnless401,
  });
}
