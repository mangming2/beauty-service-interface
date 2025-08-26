import { useLanguageStore } from "@/lib/store";
import { translations } from "@/locales/translations";

export const useTranslation = () => {
  const { currentLanguage } = useLanguageStore();

  const t = (key: string) => {
    const keys = key.split(".");
    let value: any = translations[currentLanguage];

    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = value[k];
      } else {
        // Fallback to Korean if translation not found
        value = translations.ko;
        for (const fallbackKey of keys) {
          if (value && typeof value === "object" && fallbackKey in value) {
            value = value[fallbackKey];
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
