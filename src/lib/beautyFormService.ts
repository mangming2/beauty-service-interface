import { FormData } from "@/types/form";
import { apiGet, apiPost, apiDelete } from "./apiClient";
import { getUser } from "@/api/auth";

export interface FormSubmissionResult {
  success: boolean;
  error?: string;
}

/**
 * 뷰티 폼 데이터를 백엔드 API에 제출하는 서비스 함수
 */
export async function submitBeautyForm(
  formData: Partial<FormData>
): Promise<FormSubmissionResult> {
  try {
    // 현재 로그인된 사용자 정보 가져오기
    const user = await getUser();

    if (!user) {
      throw new Error("사용자가 로그인되지 않았습니다.");
    }

    // 기존 데이터 삭제 후 새 데이터 삽입
    // 1. 기존 사용자 데이터 삭제
    try {
      await apiDelete(`/beauty-form/user/${user.id}`);
    } catch (error) {
      // 삭제 실패는 무시 (데이터가 없을 수 있음)
      console.warn("Failed to delete existing form data:", error);
    }

    // 2. 새 데이터 삽입
    await apiPost("/beauty-form/submit", {
      user_id: user.id,
      selected_concepts: formData.selectedConcepts,
      favorite_idol: formData.favoriteIdol,
      idol_option: formData.idolOption,
      date_range: formData.dateRange
        ? {
            from: formData.dateRange.from.toISOString(),
            to: formData.dateRange.to.toISOString(),
          }
        : null,
      selected_regions: formData.selectedRegions,
      created_at: new Date().toISOString(),
    });

    return { success: true };
  } catch (error) {
    console.error("Form submission error:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "폼 제출 중 오류가 발생했습니다.",
    };
  }
}

/**
 * 사용자의 가장 최근 폼 제출 데이터를 가져오는 함수
 */
export async function getUserFormSubmission() {
  try {
    const user = await getUser();

    if (!user) {
      throw new Error("사용자가 로그인되지 않았습니다.");
    }

    try {
      const data = await apiGet(`/beauty-form/user/${user.id}/latest`);
      return { data, error: null };
    } catch (error: any) {
      if (error?.status === 404) {
        // 데이터가 없는 경우
        return { data: null, error: null };
      }
      throw error;
    }
  } catch (error) {
    console.error("Get user form submission error:", error);
    return {
      data: null,
      error:
        error instanceof Error
          ? error.message
          : "데이터를 가져오는 중 오류가 발생했습니다.",
    };
  }
}
