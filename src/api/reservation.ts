import { apiPost, apiGet, apiPut } from "@/lib/apiClient";

// ========== 타입 정의 ==========

/** 상품 예약 신청 요청 */
export interface CreateReservationRequest {
  optionId: number;
  reservationDate: string; // YYYY-MM-DD
  startHour: number;
  totalPrice: number;
}

/** 상품 예약 신청 응답 */
export interface CreateReservationResponse {
  id: number;
}

/** 예약 수정 요청 */
export interface UpdateReservationRequest {
  optionId: number;
  reservationDate: string; // YYYY-MM-DD
  startHour: number;
  totalPrice: number;
}

/** 일괄 예약 생성 요청 아이템 */
export interface BulkReservationItem {
  optionId: number;
  reservationDate: string; // YYYY-MM-DD
  startHour: number;
  totalPrice: number;
}

/** 일괄 예약 생성 요청 */
export interface CreateBulkReservationRequest {
  reservations: BulkReservationItem[];
}

/** 예약 수정 응답 */
export interface UpdateReservationResponse {
  id: number;
}

/** 옵션 요약 (예약 단건 조회 응답 내부) */
export interface ReservationOptionSummary {
  id: number;
  name: string;
  description: string;
  discountRate: number;
  price: number;
  address: string;
  categoryTagName: string;
  optionTags: string[];
  imageUrl: string | null;
  isRepresent: boolean;
}

/** 예약 단건 조회 응답 */
export interface ReservationSpecificResponse {
  option: ReservationOptionSummary;
  visitDate: string;
  visitStartAt: string;
  product: {
    id: number;
    name: string;
    averageRating: number;
    totalReviewCount: number;
    imageUrls: string[];
  };
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

/**
 * 예약 수정
 * PUT /products/:productId/reservations/:reservationId
 */
export async function updateReservation(
  productId: number,
  reservationId: number,
  request: UpdateReservationRequest
): Promise<UpdateReservationResponse> {
  try {
    const data = await apiPut<UpdateReservationResponse>(
      `/products/${productId}/reservations/${reservationId}`,
      request,
      { requireAuth: true }
    );
    return data;
  } catch (error) {
    console.error("Update reservation error:", error);
    throw error;
  }
}

/**
 * 일괄 예약 생성
 * POST /products/:productId/reservations/bulk
 */
export async function createBulkReservation(
  productId: number,
  request: CreateBulkReservationRequest
): Promise<void> {
  try {
    await apiPost<void>(`/products/${productId}/reservations/bulk`, request);
  } catch (error) {
    console.error("Create bulk reservation error:", error);
    throw error;
  }
}

/**
 * 예약 단건 조회
 * GET /products/:productId/reservations/:reservationId
 */
export async function getReservationDetail(
  productId: number,
  reservationId: number
): Promise<ReservationSpecificResponse> {
  try {
    const data = await apiGet<ReservationSpecificResponse>(
      `/products/${productId}/reservations/${reservationId}`,
      { requireAuth: true }
    );
    return data;
  } catch (error) {
    console.error("Get reservation detail error:", error);
    throw error;
  }
}
