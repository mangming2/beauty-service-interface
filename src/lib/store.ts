import { create } from "zustand";
import { persist } from "zustand/middleware";

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
  ja: "日本語",
  zh: "中文",
};
