import {
  useQuery,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  getProducts,
  getProductDetail,
  getProductOptions,
  getProductsByTag,
  createProduct,
  updateProduct,
  deleteProduct,
  type Product,
  type ProductDetail,
  type ProductOptionListItem,
  type GetProductsParams,
  type CreateProductRequest,
  type CreateProductResponse,
} from "@/api/product";
import type { ApiError } from "@/lib/apiClient";

// ========== Query Keys ==========

export const productKeys = {
  all: ["products"] as const,
  lists: () => [...productKeys.all, "list"] as const,
  list: (filters: GetProductsParams) =>
    [...productKeys.lists(), filters] as const,
  details: () => [...productKeys.all, "detail"] as const,
  detail: (id: number) => [...productKeys.details(), id] as const,
  options: (productId: number) =>
    [...productKeys.detail(productId), "options"] as const,
  byTag: (tag: string) => [...productKeys.all, "tag", tag] as const,
} as const;

/** 401(세션 만료) 시 재시도하지 않음 — apiClient에서 이미 reissue 시도함 */
function retryUnless401(failureCount: number, error: unknown): boolean {
  const err = error as ApiError | undefined;
  if (err?.status === 401) return false;
  return failureCount < 2;
}

// ========== 상품 목록 조회 ==========

/**
 * 상품 목록 조회 (단일 페이지)
 */
export function useProducts(params: GetProductsParams = {}) {
  return useQuery<Product[]>({
    queryKey: productKeys.list(params),
    queryFn: () => getProducts(params),
    staleTime: 5 * 60 * 1000,
    retry: retryUnless401,
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
    retry: retryUnless401,
  });
}

// ========== 상품 상세 조회 ==========

/**
 * 특정 상품 상세 정보 조회
 */
export function useProductDetail(productId: number | undefined) {
  const isValidProductId =
    typeof productId === "number" && Number.isFinite(productId) && productId > 0;

  return useQuery<ProductDetail | null>({
    queryKey: productKeys.detail(productId!),
    queryFn: () => getProductDetail(productId!),
    enabled: isValidProductId,
    staleTime: 5 * 60 * 1000,
    retry: retryUnless401,
  });
}

// ========== 상품별 옵션 목록 조회 ==========

/**
 * 특정 상품의 옵션 목록 조회 (GET /products/:productId/options)
 */
export function useProductOptions(productId: number | undefined) {
  const isValidId = typeof productId === "number" && Number.isFinite(productId) && productId > 0;

  return useQuery<ProductOptionListItem[]>({
    queryKey: productKeys.options(productId!),
    queryFn: () => getProductOptions(productId!),
    enabled: isValidId,
    staleTime: 5 * 60 * 1000,
    retry: retryUnless401,
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
    retry: retryUnless401,
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
    retry: retryUnless401,
  });
}

// ========== 상품 생성 (관리자) ==========

interface CreateProductParams {
  request: CreateProductRequest;
  images?: File[];
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation<CreateProductResponse, Error, CreateProductParams>({
    mutationFn: ({ request, images }) => createProduct(request, images),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
  });
}

interface UpdateProductParams {
  productId: number;
  request: CreateProductRequest;
  images?: File[];
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation<CreateProductResponse, Error, UpdateProductParams>({
    mutationFn: ({ productId, request, images }) =>
      updateProduct(productId, request, images),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
      queryClient.invalidateQueries({
        queryKey: productKeys.detail(variables.productId),
      });
      queryClient.invalidateQueries({
        queryKey: productKeys.options(variables.productId),
      });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: (productId: number) => deleteProduct(productId),
    onSuccess: (_, productId) => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
      queryClient.removeQueries({ queryKey: productKeys.detail(productId) });
      queryClient.removeQueries({ queryKey: productKeys.options(productId) });
    },
  });
}
