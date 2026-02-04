import { create } from "zustand";
import { persist } from "zustand/middleware";
import { FormData } from "@/types/form";

export type Language = "Ko" | "En" | "Jp";

interface LanguageState {
  currentLanguage: Language;
  setLanguage: (language: Language) => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    set => ({
      currentLanguage: "Ko",
      setLanguage: language => set({ currentLanguage: language }),
    }),
    {
      name: "language-storage",
    }
  )
);

// 언어별 표시 텍스트
export const languageLabels: Record<Language, string> = {
  Ko: "한국어",
  En: "English",
  Jp: "日本語",
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

// 폼 데이터는 메모리에서만 관리, 제출 시 백엔드로 전송 (localStorage 사용 안 함)
export const useFormStore = create<FormState>()(set => ({
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
}));
