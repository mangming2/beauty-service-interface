import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProducts,
  getProductDetail,
  createProduct,
  type Product,
  type CreateProductRequest,
} from "@/api/product";

// ========== Query Keys ==========

export const productKeys = {
  all: ["products"] as const,
  list: () => [...productKeys.all, "list"] as const,
  detail: (id: number) => [...productKeys.all, "detail", id] as const,
} as const;

// ========== Queries ==========

/**
 * 상품 목록 조회
 */
export function useProducts() {
  return useQuery<Product[]>({
    queryKey: productKeys.list(),
    queryFn: getProducts,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
}

/**
 * 상품 상세 조회
 */
export function useProductDetail(productId: number | undefined) {
  return useQuery<Product | null>({
    queryKey: productKeys.detail(productId!),
    queryFn: () => getProductDetail(productId!),
    enabled: productId !== undefined,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
}

// ========== Mutations ==========

/**
 * 상품 생성
 */
export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      request,
      images,
    }: {
      request: CreateProductRequest;
      images?: File[];
    }) => createProduct(request, images),
    onSuccess: () => {
      // 상품 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: productKeys.list() });
    },
  });
}
