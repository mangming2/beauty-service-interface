import { apiGet, apiPost } from "@/lib/apiClient";

// ========== 타입 정의 ==========

/** 설문 */
export interface Survey {
  id: number;
  concept: string;
  idolName: string;
  visitStartDate: string;
  visitEndDate: string;
  places: string;
}

/** 설문 저장 요청 */
export interface CreateSurveyRequest {
  concept: string;
  idolName: string;
  visitStartDate: string;
  visitEndDate: string;
  places: string[]; // 백엔드가 배열로 역직렬화 (문자열 JSON 아님)
}

/** 설문 저장 응답 */
export interface CreateSurveyResponse {
  id: number;
}

// ========== 설문 API ==========

/**
 * 설문 조회 (현재 로그인 사용자)
 * GET /surveys — No parameters
 */
export async function getSurvey(): Promise<Survey | null> {
  try {
    const data = await apiGet<Survey>("/surveys");
    return data;
  } catch (error: unknown) {
    const err = error as { status?: number; message?: string };
    // 404 → 설문 없음 (폼 미작성 사용자)
    if (err?.status === 404) return null;
    if (
      err?.status === 500 &&
      err?.message?.includes("UserSurvey does not exist")
    ) {
      return null;
    }
    console.error("Get survey error:", error);
    throw error;
  }
}

/**
 * 설문 저장 (현재 로그인 사용자)
 * POST /surveys — No parameters, request body only. 201 생성 성공.
 */
export async function createSurvey(
  request: CreateSurveyRequest
): Promise<CreateSurveyResponse> {
  try {
    const data = await apiPost<CreateSurveyResponse>("/surveys", request);
    return data;
  } catch (error) {
    console.error("Create survey error:", error);
    throw error;
  }
}
