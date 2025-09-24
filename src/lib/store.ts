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
      storage: {
        getItem: (name: string) => {
          const item = localStorage.getItem(name);
          if (!item) return null;
          return JSON.parse(item, (key, value) => {
            if (value && typeof value === "object" && value.__type === "Date") {
              return new Date(value.value);
            }
            return value;
          });
        },
        setItem: (name: string, value: unknown) => {
          const serialized = JSON.stringify(value, (key, val) => {
            if (val instanceof Date) {
              return { __type: "Date", value: val.toISOString() };
            }
            return val;
          });
          localStorage.setItem(name, serialized);
        },
        removeItem: (name: string) => localStorage.removeItem(name),
      },
    }
  )
);
