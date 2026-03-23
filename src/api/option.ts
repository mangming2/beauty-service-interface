import { apiGet, apiRequest, apiDelete } from "@/lib/apiClient";

// ========== 타입 정의 ==========

/** 옵션 (상세/생성 응답, 목록 조회) */
export interface Option {
  id: number;
  name: string;
  description: string;
  discountRate: number;
  price: number;
  address: string;
  bookingGuide: string;
  regularClosingDay: string | null;
  imageUrls: string[];
  /** 예약 슬롯 (옵션 단위) */
  slotStartDate?: string;
  slotEndDate?: string;
  slotStartTime?: string;
  slotEndTime?: string;
  reservationSlotCount?: number;
  /** 목록 조회 시 대표 옵션 여부 */
  representOption?: boolean;
}

/** 옵션 생성 요청 (POST /options multipart request body) */
export interface CreateOptionRequest {
  name: string;
  description: string;
  price: number;
  address: string;
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
}

// ========== 옵션 API ==========

/**
 * 옵션 목록 조회
 * GET /options
 */
export async function getOptions(): Promise<Option[]> {
  try {
    const data = await apiGet<Option[]>("/options");
    return data ?? [];
  } catch (error) {
    console.error("Get options error:", error);
    throw error;
  }
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
 * 옵션 삭제
 * DELETE /options/:optionId
 */
export async function deleteOption(optionId: number): Promise<void> {
  await apiDelete<void>(`/options/${optionId}`, { requireAuth: true });
}
