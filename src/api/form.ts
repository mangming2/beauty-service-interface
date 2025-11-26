import { apiGet, apiPost } from "@/lib/apiClient";
import { FormData } from "@/types/form";
import { getUser } from "./auth";

// 뷰티 폼 데이터를 백엔드 API에 제출
export const submitBeautyForm = async (formData: Partial<FormData>) => {
  // 현재 로그인된 사용자 정보 가져오기
  const user = await getUser();

  if (!user) {
    throw new Error("사용자가 로그인되지 않았습니다.");
  }

  // 백엔드 API에 제출
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
};

// 사용자의 가장 최근 폼 제출 데이터를 가져오기
export const getUserFormSubmission = async () => {
  const user = await getUser();

  if (!user) {
    throw new Error("사용자가 로그인되지 않았습니다.");
  }

  try {
    const data = await apiGet(`/beauty-form/user/${user.id}/latest`);
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
};
