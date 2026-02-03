import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import {
  getProducts,
  getProductDetail,
  getProductsByTag,
  type Product,
  type ProductDetail,
  type GetProductsParams,
} from "@/api/product";

// ========== Query Keys ==========

export const productKeys = {
  all: ["products"] as const,
  lists: () => [...productKeys.all, "list"] as const,
  list: (filters: GetProductsParams) =>
    [...productKeys.lists(), filters] as const,
  details: () => [...productKeys.all, "detail"] as const,
  detail: (id: number) => [...productKeys.details(), id] as const,
  byTag: (tag: string) => [...productKeys.all, "tag", tag] as const,
} as const;

// ========== 상품 목록 조회 ==========

/**
 * 상품 목록 조회 (단일 페이지)
 */
export function useProducts(params: GetProductsParams = {}) {
  return useQuery<Product[]>({
    queryKey: productKeys.list(params),
    queryFn: () => getProducts(params),
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
}

/**
 * 상품 목록 무한 스크롤 (커서 기반)
 */
export function useInfiniteProducts(
  params: Omit<GetProductsParams, "lastId"> = {}
) {
  return useInfiniteQuery<Product[]>({
    queryKey: [...productKeys.lists(), "infinite", params],
    queryFn: ({ pageParam }) =>
      getProducts({
        ...params,
        lastId: pageParam as number | undefined,
      }),
    initialPageParam: undefined as number | undefined,
    getNextPageParam: lastPage => {
      if (!lastPage || lastPage.length === 0) return undefined;
      const size = params.size ?? 20;
      if (lastPage.length < size) return undefined;
      return lastPage[lastPage.length - 1].id;
    },
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
}

// ========== 상품 상세 조회 ==========

/**
 * 특정 상품 상세 정보 조회
 */
export function useProductDetail(productId: number | undefined) {
  return useQuery<ProductDetail | null>({
    queryKey: productKeys.detail(productId!),
    queryFn: () => getProductDetail(productId!),
    enabled: productId !== undefined,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
}

// ========== 태그별 상품 조회 ==========

/**
 * 태그별 상품 목록 조회 (단일 페이지)
 */
export function useProductsByTag(
  tag: string,
  params: Omit<GetProductsParams, "tag"> = {}
) {
  return useQuery<Product[]>({
    queryKey: productKeys.byTag(tag),
    queryFn: () => getProductsByTag(tag, params),
    enabled: !!tag,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
}

/**
 * 태그별 상품 무한 스크롤
 */
export function useInfiniteProductsByTag(
  tag: string,
  params: Omit<GetProductsParams, "tag" | "lastId"> = {}
) {
  return useInfiniteQuery<Product[]>({
    queryKey: [...productKeys.byTag(tag), "infinite", params],
    queryFn: ({ pageParam }) =>
      getProductsByTag(tag, {
        ...params,
        lastId: pageParam as number | undefined,
      }),
    initialPageParam: undefined as number | undefined,
    getNextPageParam: lastPage => {
      if (!lastPage || lastPage.length === 0) return undefined;
      const size = params.size ?? 20;
      if (lastPage.length < size) return undefined;
      return lastPage[lastPage.length - 1].id;
    },
    enabled: !!tag,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
}
