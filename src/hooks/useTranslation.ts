import { useLanguageStore } from "@/lib/store";
import { translations } from "@/locales/translations";

export const useTranslation = () => {
  const { currentLanguage } = useLanguageStore();

  const t = (key: string) => {
    const keys = key.split(".");
    let value: string | Record<string, unknown> = translations[currentLanguage];

    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = value[k] as string | Record<string, unknown>;
      } else {
        // Fallback to Korean if translation not found
        value = translations.Ko;
        for (const fallbackKey of keys) {
          if (value && typeof value === "object" && fallbackKey in value) {
            value = value[fallbackKey] as string | Record<string, unknown>;
          } else {
            return key; // Return key if translation still not found
          }
        }
        break;
      }
    }

    return typeof value === "string" ? value : key;
  };

  return { t, currentLanguage };
};
