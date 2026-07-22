import { apiGet, apiRequest, apiDelete } from "@/lib/apiClient";

// ========== 타입 정의 ==========

export type SeoulDistrict =
  | "GANGNAM"
  | "GANGDONG"
  | "GANGBUK"
  | "GANGSEO"
  | "GWANAK"
  | "GWANGJIN"
  | "GURO"
  | "GEUMCHEON"
  | "NOWON"
  | "DOBONG"
  | "DONGDAEMUN"
  | "DONGJAK"
  | "MAPO"
  | "SEODAEMUN"
  | "SEOCHO"
  | "SEONGDONG"
  | "SEONGBUK"
  | "SONGPA"
  | "YANGCHEON"
  | "YEONGDEUNGPO"
  | "YONGSAN"
  | "EUNPYEONG"
  | "JONGNO"
  | "JUNG"
  | "JUNGNANG";

/** GET /options/:id/available-slots 응답 아이템 */
export interface AvailableSlotItem {
  hour: number;
  startTime: string;
  endTime: string;
  available: boolean;
}

/** 옵션 (상세/생성 응답, 목록 조회) */
export interface Option {
  id: number;
  name: string;
  description: string;
  discountRate: number;
  price: number;
  detailAddress: string;
  district: SeoulDistrict;
  bookingGuide: string;
  regularClosingDay: string | null;
  imageUrls: string[];
  /** GET /options/:id 응답 필드 */
  categoryTagName?: string;
  /** 예약 가능 날짜 범위 (null이면 제한 없음) */
  slotAvailableFrom?: string | null;
  slotAvailableUntil?: string | null;
  /** 예약 가능 시간 범위 (시 단위, slotEndHour는 exclusive) */
  slotStartHour?: number;
  slotEndHour?: number;
  /** 목록 조회 시 대표 옵션 여부 */
  representOption?: boolean;
  /** 실제 예약 URL (없으면 예약 버튼 비활성화) */
  reservationUrl?: string | null;
}

/** 옵션에 연결된 상품 요약 (GET /options 응답 중 linkedProducts) */
export interface LinkedProductSummary {
  productId: number;
  productName: string;
  isRepresent: boolean;
}

/** 옵션 카탈로그 아이템 (GET /options 응답) */
export interface OptionCatalogItem {
  id: number;
  name: string;
  description: string;
  price: number;
  district: SeoulDistrict;
  categoryTagName: string;
  optionTags: string[];
  imageUrl: string | null;
  linkedProducts: LinkedProductSummary[];
}

/** 옵션 생성 요청 (POST /options multipart request body) */
export interface CreateOptionRequest {
  name: string;
  description: string;
  /** 백엔드 필수 — 대표 카테고리 태그 한 개 (예: hair) */
  categoryTagName: string;
  price: number;
  detailAddress: string;
  district: SeoulDistrict;
  slotStartDate: string;
  slotEndDate: string;
  slotStartHour: number;
  slotEndHour: number;
  discountRate?: number;
  discountStartAt?: string;
  discountEndAt?: string;
  bookingGuide?: string;
  regularClosingDay?: string | null;
  optionTagNames?: string[];
  reservationUrl?: string | null;
}

// ========== 옵션 API ==========

/**
 * 전체 옵션 목록 조회 (태그 필터 optional)
 * GET /options?tag=...
 */
export async function getOptions(tag?: string): Promise<OptionCatalogItem[]> {
  const url = tag ? `/options?tag=${encodeURIComponent(tag)}` : "/options";
  const data = await apiGet<OptionCatalogItem[]>(url, { requireAuth: false });
  return data ?? [];
}

/**
 * 옵션 상세 조회
 * GET /options/:optionId
 */
export async function getOptionDetail(
  optionId: number
): Promise<Option | null> {
  try {
    const data = await apiGet<Option>(`/options/${optionId}`);
    return data;
  } catch (error: unknown) {
    if (
      error &&
      typeof error === "object" &&
      "status" in error &&
      (error as { status: number }).status === 404
    ) {
      return null;
    }
    console.error("Get option detail error:", error);
    throw error;
  }
}

/**
 * 옵션 생성 (multipart/form-data)
 * POST /options
 * apiRequest 사용 → 401 시 토큰 재발급·리다이렉트 동일 적용
 */
export async function createOption(
  request: CreateOptionRequest,
  images?: File[]
): Promise<Option> {
  const formData = new FormData();
  formData.append(
    "request",
    new Blob([JSON.stringify(request)], { type: "application/json" })
  );
  if (images?.length) {
    images.forEach(file => formData.append("images", file));
  }

  return apiRequest<Option>("/options", {
    method: "POST",
    body: formData,
    requireAuth: true,
  });
}

/**
 * 옵션 수정 (multipart/form-data)
 * PUT /options/:optionId
 */
export async function updateOption(
  optionId: number,
  request: CreateOptionRequest,
  images?: File[]
): Promise<Option> {
  const formData = new FormData();
  formData.append(
    "request",
    new Blob([JSON.stringify(request)], { type: "application/json" })
  );
  if (images?.length) {
    images.forEach(file => formData.append("images", file));
  }

  return apiRequest<Option>(`/options/${optionId}`, {
    method: "PUT",
    body: formData,
    requireAuth: true,
  });
}

/**
 * 날짜별 예약 가능 슬롯 조회
 * GET /options/:optionId/available-slots?date=YYYY-MM-DD
 */
export async function getAvailableSlots(
  optionId: number,
  date: string
): Promise<AvailableSlotItem[]> {
  const data = await apiGet<AvailableSlotItem[]>(
    `/options/${optionId}/available-slots?date=${encodeURIComponent(date)}`,
    { requireAuth: false }
  );
  return data ?? [];
}

/**
 * 옵션 삭제
 * DELETE /options/:optionId
 */
export async function deleteOption(optionId: number): Promise<void> {
  await apiDelete<void>(`/options/${optionId}`, { requireAuth: true });
}
