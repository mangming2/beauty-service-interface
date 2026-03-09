import { apiGet } from "@/lib/apiClient";
import type { Product } from "@/api/product";

const BASE = "/products/recommendations";

/** Latest in Korea 추천 목록 조회 파라미터 */
export interface GetLatestInKoreaParams {
  /** 조회 개수 (1~50, 기본 20) */
  size?: number;
}

/**
 * Latest in Korea 추천 리스트 조회
 * 관리자가 저장한 우선 노출 상품 목록을 조회합니다.
 *
 * GET /products/recommendations/latest-in-korea
 */
export async function getLatestInKoreaRecommendations(
  params: GetLatestInKoreaParams = {}
): Promise<Product[]> {
  try {
    const queryParams = new URLSearchParams();
    if (params.size !== undefined) {
      queryParams.append("size", String(params.size));
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
