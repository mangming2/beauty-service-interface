import { apiGet, apiPost, apiPut } from "@/lib/apiClient";
import type { Product } from "@/api/product";

const BASE = "/products/recommendations";

/** 어드민 Latest in Korea 추천 상품 등록 요청 */
export interface UpsertLatestKoreaRecommendationRequest {
  /** 우선 노출할 추천 상품 ID 목록 (정렬 순서대로, 최대 50개) */
  productIds: number[];
}

/** 어드민 Latest in Korea 추천 상품 등록 응답 */
export interface UpsertLatestKoreaRecommendationResponse {
  productCount: number;
}

/** Latest in Korea 추천 목록 조회 파라미터 */
export interface GetLatestInKoreaParams {
  /** 조회 개수 (1~50, 기본 20) */
  size?: number;
  /** 태그 필터 (카테고리 태그 또는 옵션 태그) */
  tag?: string;
}

/**
 * Latest in Korea 추천 리스트 조회
 * 관리자가 저장한 우선 노출 상품 목록을 조회합니다.
 *
 * GET /products/recommendations/latest-in-korea
 */
/**
 * Latest in Korea 추천 상품 등록/수정 (어드민 전용)
 * POST /admin/products/recommendations/latest-in-korea
 */
export async function upsertLatestKoreaRecommendation(
  request: UpsertLatestKoreaRecommendationRequest
): Promise<UpsertLatestKoreaRecommendationResponse> {
  try {
    const data = await apiPost<UpsertLatestKoreaRecommendationResponse>(
      "/admin/products/recommendations/latest-in-korea",
      request,
      { requireAuth: true }
    );
    return data;
  } catch (error) {
    console.error("Upsert latest-in-korea recommendation error:", error);
    throw error;
  }
}

/** 추천 패키지 여부 설정 응답 */
export interface SetRecommendationResponse {
  productId: number;
  recommended: boolean;
}

/**
 * 특정 상품 추천 여부 설정 (관리자 전용)
 * PUT /admin/products/{productId}/recommendation
 */
export async function setProductRecommendation(
  productId: number,
  recommended: boolean
): Promise<SetRecommendationResponse> {
  return apiPut<SetRecommendationResponse>(
    `/admin/products/${productId}/recommendation`,
    { recommended },
    { requireAuth: true }
  );
}

/** 추천 패키지 목록 아이템 (GET /products/recommendations/admin-picked) */
export interface AdminPickedProduct {
  id: number;
  name: string;
  averageRating: number;
  totalReviewCount: number;
  representOption: {
    rating: number;
    reviewCount: number;
    tags: string[];
    location: string;
    discountRate: number;
    originalPrice: number;
    finalPrice: number;
  };
  imageUrls: string[];
}

/** 추천 패키지 목록 조회 파라미터 */
export interface GetAdminPickedParams {
  size?: number;
  tag?: string;
  query?: string;
}

/**
 * 관리자 추천 패키지 목록 조회
 * GET /products/recommendations/admin-picked
 */
export async function getAdminPickedRecommendations(
  params: GetAdminPickedParams = {}
): Promise<AdminPickedProduct[]> {
  const queryParams = new URLSearchParams();
  if (params.size !== undefined) queryParams.append("size", String(params.size));
  if (params.tag) queryParams.append("tag", params.tag);
  if (params.query) queryParams.append("query", params.query);
  const qs = queryParams.toString();
  const url = `${BASE}/admin-picked${qs ? `?${qs}` : ""}`;
  const data = await apiGet<AdminPickedProduct[]>(url, { requireAuth: false });
  return data ?? [];
}

export async function getLatestInKoreaRecommendations(
  params: GetLatestInKoreaParams = {}
): Promise<Product[]> {
  try {
    const queryParams = new URLSearchParams();
    if (params.size !== undefined) {
      queryParams.append("size", String(params.size));
    }
    if (params.tag !== undefined) {
      queryParams.append("tag", params.tag);
    }
    const queryString = queryParams.toString();
    const url = `${BASE}/latest-in-korea${queryString ? `?${queryString}` : ""}`;
    const data = await apiGet<Product[]>(url, { requireAuth: false });
    return data ?? [];
  } catch (error) {
    console.error("Get latest-in-korea recommendations error:", error);
    throw error;
  }
}
