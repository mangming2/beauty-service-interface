import { FormData } from "@/types/form";
import { supabase } from "./supabase";

export interface FormSubmissionResult {
  success: boolean;
  error?: string;
}

/**
 * 뷰티 폼 데이터를 Supabase에 제출하는 서비스 함수
 */
export async function submitBeautyForm(
  formData: Partial<FormData>
): Promise<FormSubmissionResult> {
  try {
    // 현재 로그인된 사용자 정보 가져오기
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      throw new Error("사용자가 로그인되지 않았습니다.");
    }

    // 기존 데이터 삭제 후 새 데이터 삽입
    // 1. 기존 사용자 데이터 삭제
    await supabase
      .from("beauty_form_submissions")
      .delete()
      .eq("user_id", user.id);

    // 2. 새 데이터 삽입
    const { error } = await supabase.from("beauty_form_submissions").insert({
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

    if (error) {
      throw error;
    }

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
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      throw new Error("사용자가 로그인되지 않았습니다.");
    }

    const { data, error } = await supabase
      .from("beauty_form_submissions")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== "PGRST116") {
      // PGRST116은 "no rows returned" 에러로, 정상적인 상황
      throw error;
    }

    return { data, error: null };
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
