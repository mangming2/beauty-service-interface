import { create } from "zustand";
import { persist } from "zustand/middleware";
import { FormData } from "@/types/form";
import { supabase } from "./supabase";

export type Language = "ko" | "en" | "ja" | "zh";

interface LanguageState {
  currentLanguage: Language;
  setLanguage: (language: Language) => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    set => ({
      currentLanguage: "ko",
      setLanguage: language => set({ currentLanguage: language }),
    }),
    {
      name: "language-storage",
    }
  )
);

// 언어별 표시 텍스트
export const languageLabels: Record<Language, string> = {
  ko: "한국어",
  en: "English",
  ja: "日본語",
  zh: "中文",
};

// 폼 상태 관리
interface FormState {
  formData: Partial<FormData>;
  currentStep: number;
  isSubmitting: boolean;

  // Actions
  updateFormData: (data: Partial<FormData>) => void;
  setCurrentStep: (step: number) => void;
  resetForm: () => void;
  submitForm: () => Promise<{ success: boolean; error?: string }>;

  // Step별 데이터 업데이트
  updateStep1: (data: { selectedConcepts: string[] }) => void;
  updateStep2: (data: { favoriteIdol: string }) => void;
  updateStep3: (data: { idolOption: string }) => void;
  updateStep4: (data: { dateRange: { from: Date; to: Date } }) => void;
  updateStep5: (data: { selectedRegions: string[] }) => void;
}

const initialFormData: Partial<FormData> = {
  selectedConcepts: [],
  favoriteIdol: "",
  idolOption: "",
  dateRange: undefined,
  selectedRegions: [],
};

export const useFormStore = create<FormState>()(
  persist(
    (set, get) => ({
      formData: initialFormData,
      currentStep: 1,
      isSubmitting: false,

      updateFormData: data =>
        set(state => ({
          formData: { ...state.formData, ...data },
        })),

      setCurrentStep: step => set({ currentStep: step }),

      resetForm: () =>
        set({
          formData: initialFormData,
          currentStep: 1,
          isSubmitting: false,
        }),

      updateStep1: data =>
        set(state => ({
          formData: { ...state.formData, ...data },
        })),

      updateStep2: data =>
        set(state => ({
          formData: { ...state.formData, ...data },
        })),

      updateStep3: data =>
        set(state => ({
          formData: { ...state.formData, ...data },
        })),

      updateStep4: data =>
        set(state => ({
          formData: { ...state.formData, ...data },
        })),

      updateStep5: data =>
        set(state => ({
          formData: { ...state.formData, ...data },
        })),

      submitForm: async () => {
        const { formData } = get();
        set({ isSubmitting: true });

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
          const { error } = await supabase
            .from("beauty_form_submissions")
            .insert({
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

          set({ isSubmitting: false });
          return { success: true };
        } catch (error) {
          console.error("Form submission error:", error);
          set({ isSubmitting: false });
          return {
            success: false,
            error:
              error instanceof Error
                ? error.message
                : "폼 제출 중 오류가 발생했습니다.",
          };
        }
      },
    }),
    {
      name: "beauty-form-storage",
    }
  )
);
