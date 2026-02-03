import { apiPost } from "@/lib/apiClient";

// ========== 타입 정의 ==========

/** 상품 예약 신청 요청 */
export interface CreateReservationRequest {
  reservationSlotId: number;
  totalPrice: number;
}

/** 상품 예약 신청 응답 */
export interface CreateReservationResponse {
  id: number;
}

// ========== 예약 API ==========

/**
 * 상품 예약 신청
 * POST /products/:productId/reservations
 */
export async function createReservation(
  productId: number,
  request: CreateReservationRequest
): Promise<CreateReservationResponse> {
  try {
    const data = await apiPost<CreateReservationResponse>(
      `/products/${productId}/reservations`,
      request
    );
    return data;
  } catch (error) {
    console.error("Create reservation error:", error);
    throw error;
  }
}
