"use client";

import { useTranslation } from "@/hooks/useTranslation";

interface TranslatedTextProps {
  translationKey: string;
  className?: string;
}

export const TranslatedText = ({
  translationKey,
  className,
}: TranslatedTextProps) => {
  const { t } = useTranslation();

  return <span className={className}>{t(translationKey)}</span>;
};
