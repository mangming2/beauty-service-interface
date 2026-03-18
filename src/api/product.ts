import { apiGet, apiRequest } from "@/lib/apiClient";

// ========== 타입 정의 ==========

/** 대표 옵션 요약 (목록/상세 공통) */
export interface RepresentOption {
  rating?: number;
  reviewCount?: number;
  tags: string[];
  location: string;
  /** 정규화 주소 (상세 조회 시) */
  address?: string;
  discountRate: number;
  originalPrice: number;
  finalPrice: number;
  imageUrls?: string[];
}

/** 상품 목록 아이템 (목록 API 응답) */
export interface Product {
  id: number;
  name: string;
  description?: string;
  minPrice?: number;
  totalPrice?: number;
  /** @deprecated 목록은 representOption.tags 사용 */
  tagNames?: string[];
  /** 대표 옵션 (태그, 주소, 할인율, 원가/할인가, 이미지) */
  representOption?: RepresentOption;
  /** 상품 대표 이미지 */
  imageUrls?: string[];
  /** 옵션들 평균 별점 */
  rating?: number;
  /** 누적 리뷰 수 */
  reviewCount?: number;
}

/** 상품 상세 - 옵션 정보 (목록/요약; 상세는 Option 타입 참고) */
export interface ProductOption {
  id: number;
  name: string;
  description: string;
  price: number;
  /** 할인 적용가 (할인 시) */
  finalPrice?: number;
  location: string;
  address?: string;
  discountRate?: number;
  bookingGuide?: string;
  regularClosingDay?: string | null;
  imageUrls?: string[];
  representOption?: boolean;
}

/** 상품별 옵션 목록 조회 API 응답 (GET /products/:productId/options) */
export interface ProductOptionListItem {
  id: number;
  name: string;
  description: string;
  discountRate: number;
  price: number;
  address: string;
  optionTags: string[];
  imageUrl: string | null;
  isRepresent: boolean;
}

/** 상품 상세 */
export interface ProductDetail {
  id: number;
  name: string;
  description?: string;
  address: string;
  /** 상품 대표 이미지 (대표옵션 이미지) */
  imageUrls?: string[];
}

/** 상품 생성 요청 (POST /products multipart request body) */
export interface CreateProductRequest {
  name: string;
  description: string;
  optionIds: number[];
  representOptionId: number;
}

/** 상품 목록 조회 파라미터 */
export interface GetProductsParams {
  lastId?: number;
  size?: number;
  tag?: string;
  is_random?: boolean;
}

/** 상품 생성 응답 */
export interface CreateProductResponse {
  id: number;
}

// ========== 상품 API ==========

/**
 * 상품 목록 조회
 * - no-offset 기반 커서 페이지네이션
 * - tag 미지정 시 태그 없는 상품만 조회
 *
 * GET /products
 */
export async function getProducts(
  params: GetProductsParams = {}
): Promise<Product[]> {
  try {
    const queryParams = new URLSearchParams();

    if (params.lastId !== undefined) {
      queryParams.append("lastId", String(params.lastId));
    }
    if (params.size !== undefined) {
      queryParams.append("size", String(params.size));
    }
    if (params.tag !== undefined) {
      queryParams.append("tag", params.tag);
    }
    if (params.is_random === true) {
      queryParams.append("is_random", "true");
    }

    const queryString = queryParams.toString();
    const url = `/products${queryString ? `?${queryString}` : ""}`;

    const data = await apiGet<Product[]>(url, { requireAuth: false });
    return data || [];
  } catch (error) {
    console.error("Get products error:", error);
    throw error;
  }
}

/**
 * 태그별 상품 목록 조회 (편의 함수)
 */
export async function getProductsByTag(
  tag: string,
  params: Omit<GetProductsParams, "tag"> = {}
): Promise<Product[]> {
  return getProducts({ ...params, tag });
}

/**
 * 상품 상세 조회
 *
 * GET /products/:productId
 */
export async function getProductDetail(
  productId: number
): Promise<ProductDetail | null> {
  try {
    const data = await apiGet<ProductDetail>(`/products/${productId}`, {
      requireAuth: false,
    });

    if (!data) {
      return null;
    }

    return data;
  } catch (error: unknown) {
    const err = error as { status?: number; message?: string } | null;
    const status = err?.status;
    const message = typeof err?.message === "string" ? err.message : "";

    // 404 또는 백엔드가 500으로 보내는 "상품 없음" 응답 → null 처리
    const isNotFound =
      status === 404 ||
      (status === 500 &&
        (message.includes("does not exist") || message.includes("찾을 수 없")));

    if (isNotFound) {
      return null;
    }
    console.error("Get product detail error:", error);
    throw error;
  }
}

/**
 * 특정 상품의 옵션 목록 조회
 * GET /products/:productId/options
 */
export async function getProductOptions(
  productId: number
): Promise<ProductOptionListItem[]> {
  try {
    const data = await apiGet<ProductOptionListItem[]>(
      `/products/${productId}/options`,
      { requireAuth: true }
    );
    return data ?? [];
  } catch (error) {
    console.error("Get product options error:", error);
    throw error;
  }
}

/**
 * 상품 생성 (multipart/form-data)
 * POST /products
 * - request: JSON { name, description, optionIds, representOptionId }
 * - images: 파일 목록 (선택)
 * apiRequest 사용 → 401 시 토큰 재발급·리다이렉트 동일 적용
 */
export async function createProduct(
  request: CreateProductRequest,
  images?: File[]
): Promise<CreateProductResponse> {
  const formData = new FormData();
  formData.append(
    "request",
    new Blob([JSON.stringify(request)], { type: "application/json" })
  );
  if (images?.length) {
    images.forEach(file => formData.append("images", file));
  }

  return apiRequest<CreateProductResponse>("/products", {
    method: "POST",
    body: formData,
    requireAuth: true,
  });
}
