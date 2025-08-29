import { create } from "zustand";
import { persist } from "zustand/middleware";
import { FormData } from "@/types/form";

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

  // Actions
  updateFormData: (data: Partial<FormData>) => void;
  setCurrentStep: (step: number) => void;
  resetForm: () => void;

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
    set => ({
      formData: initialFormData,
      currentStep: 1,

      updateFormData: data =>
        set(state => ({
          formData: { ...state.formData, ...data },
        })),

      setCurrentStep: step => set({ currentStep: step }),

      resetForm: () =>
        set({
          formData: initialFormData,
          currentStep: 1,
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
    }),
    {
      name: "beauty-form-storage",
    }
  )
);
