import { apiGet, apiPost, apiDelete } from "@/lib/apiClient";
import { FormData } from "@/types/form";
import { getMyPageUser } from "./my-page";
import type {
  FormSubmissionRequest,
  FormSubmissionResponse,
  FormSubmissionSuccessResponse,
} from "@/types/api";

// ========== 뷰티 폼 API ==========

/**
 * 뷰티 폼 데이터를 백엔드 API에 제출
 * POST /beauty-form/submit 호출
 */
export async function submitBeautyForm(
  formData: Partial<FormData>
): Promise<FormSubmissionSuccessResponse> {
  try {
    // 현재 로그인된 사용자 정보 가져오기
    const user = await getMyPageUser();

    if (!user) {
      throw new Error("사용자가 로그인되지 않았습니다.");
    }

    // 기존 데이터 삭제 후 새 데이터 삽입
    // 1. 기존 사용자 데이터 삭제
    try {
      await apiDelete<void>(`/beauty-form/user/${user.id}`);
    } catch (error) {
      // 삭제 실패는 무시 (데이터가 없을 수 있음)
      console.warn("Failed to delete existing form data:", error);
    }

    // 2. 새 데이터 삽입
    const requestData: FormSubmissionRequest = {
      user_id: user.id.toString(),
      selected_concepts: formData.selectedConcepts || [],
      favorite_idol: formData.favoriteIdol || "",
      idol_option: formData.idolOption || "",
      date_range: formData.dateRange
        ? {
            from: formData.dateRange.from.toISOString(),
            to: formData.dateRange.to.toISOString(),
          }
        : null,
      selected_regions: formData.selectedRegions || [],
      created_at: new Date().toISOString(),
    };

    const response = await apiPost<FormSubmissionSuccessResponse>(
      "/beauty-form/submit",
      requestData
    );

    return response || { success: true };
  } catch (error) {
    console.error("Form submission error:", error);
    throw error;
  }
}

/**
 * 사용자의 가장 최근 폼 제출 데이터를 가져오기
 * GET /beauty-form/user/:userId/latest 호출
 */
export async function getUserFormSubmission(
  userId?: string
): Promise<FormSubmissionResponse | null> {
  try {
    const user = userId ? { id: userId } : await getMyPageUser();

    if (!user) {
      throw new Error("사용자가 로그인되지 않았습니다.");
    }

    try {
      const data = await apiGet<FormSubmissionResponse>(
        `/beauty-form/user/${user.id}/latest`
      );
      return data;
    } catch (error: unknown) {
      if (
        error &&
        typeof error === "object" &&
        "status" in error &&
        (error as { status: number }).status === 404
      ) {
        // 데이터가 없는 경우 null 반환
        return null;
      }
      throw error;
    }
  } catch (error) {
    console.error("Get user form submission error:", error);
    throw error;
  }
}

/**
 * 사용자의 폼 제출 데이터 삭제
 * DELETE /beauty-form/user/:userId 호출
 */
export async function deleteUserFormSubmission(userId?: string): Promise<void> {
  try {
    const user = userId ? { id: userId } : await getMyPageUser();

    if (!user) {
      throw new Error("사용자가 로그인되지 않았습니다.");
    }

    await apiDelete<void>(`/beauty-form/user/${user.id}`);
  } catch (error) {
    console.error("Delete user form submission error:", error);
    throw error;
  }
}
