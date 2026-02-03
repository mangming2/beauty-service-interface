import { apiGet, getAuthToken } from "@/lib/apiClient";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

// ========== 타입 정의 ==========

/** 옵션 */
export interface Option {
  id: number;
  name: string;
  description: string;
  price: number;
  location: string;
}

/** 옵션 생성 요청 */
export interface CreateOptionRequest {
  name: string;
  description: string;
  price: number;
  location: string;
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
    images.forEach(file => {
      formData.append("images", file);
    });
  }

  const accessToken = getAuthToken();
  const headers: Record<string, string> = {};
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  const response = await fetch(`${API_BASE_URL}/options`, {
    method: "POST",
    headers,
    body: formData,
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to create option");
  }

  return response.json();
}
