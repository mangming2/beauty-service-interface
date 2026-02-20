import { apiGet, apiPost } from "@/lib/apiClient";

// ========== 타입 정의 ==========

/** 상품 목록 아이템 */
export interface Product {
  id: number;
  name: string;
  description: string;
  minPrice: number;
  totalPrice: number;
  tagNames: string[];
}

/** 상품 상세 - 옵션 정보 */
export interface ProductOption {
  id: number;
  name: string;
  description: string;
  price: number;
  location: string;
}

/** 상품 상세 */
export interface ProductDetail {
  id: number;
  name: string;
  description: string;
  options: ProductOption[];
  tagNames: string[];
  slotStartDate: string;
  slotEndDate: string;
  slotStartTime: string;
  slotEndTime: string;
  reservationSlotCount: number;
  minPrice: number;
  totalPrice: number;
}

/** 상품 생성 요청 */
export interface CreateProductRequest {
  name: string;
  description: string;
  slotStartDate: string;
  slotEndDate: string;
  slotStartHour: number;
  slotEndHour: number;
  optionIds: number[];
  tagNames: string[];
}

/** 상품 목록 조회 파라미터 */
export interface GetProductsParams {
  lastId?: number;
  size?: number;
  tag?: string;
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
    const data = await apiGet<ProductDetail>(`/products/${productId}`);

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
 * 상품 생성 (application/json)
 * POST /products
 */
export async function createProduct(
  request: CreateProductRequest
): Promise<CreateProductResponse> {
  try {
    const data = await apiPost<CreateProductResponse>("/products", request);
    return data;
  } catch (error) {
    console.error("Create product error:", error);
    throw error;
  }
}
