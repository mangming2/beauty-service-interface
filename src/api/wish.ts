import { apiGet, apiPost } from "@/lib/apiClient";

// ========== 타입 정의 ==========

/** 위시 상품 목록 아이템 */
export interface WishItem {
  id: number;
  name: string;
  minPrice: number;
}

/** 위시 토글 응답 */
export interface ToggleWishResponse {
  id: number;
  wished: boolean;
}

/** 위시 목록 조회 파라미터 (no-offset) */
export interface GetWishesParams {
  lastWishId?: number;
  size?: number;
}

// ========== 위시 API ==========

const BASE = "/wishes";

/**
 * 위시 상품 목록 조회 (no-offset)
 * GET /wishes
 */
export async function getWishes(
  params: GetWishesParams = {}
): Promise<WishItem[]> {
  try {
    const queryParams = new URLSearchParams();
    if (params.lastWishId !== undefined) {
      queryParams.append("lastWishId", String(params.lastWishId));
    }
    if (params.size !== undefined) {
      queryParams.append("size", String(params.size));
    }
    const queryString = queryParams.toString();
    const url = `${BASE}${queryString ? `?${queryString}` : ""}`;
    const data = await apiGet<WishItem[]>(url, { requireAuth: true });
    return data ?? [];
  } catch (error) {
    console.error("Get wishes error:", error);
    throw error;
  }
}

/**
 * 위시 상태 토글 (있으면 해제, 없으면 등록)
 * POST /wishes/:productId
 */
export async function toggleWish(
  productId: number
): Promise<ToggleWishResponse> {
  try {
    const data = await apiPost<ToggleWishResponse>(
      `${BASE}/${productId}`,
      undefined,
      { requireAuth: true }
    );
    return data;
  } catch (error) {
    console.error("Toggle wish error:", error);
    throw error;
  }
}
