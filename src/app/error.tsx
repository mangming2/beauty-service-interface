"use client";

import { useEffect } from "react";
import { PageError } from "@/components/common";
import { useTranslation } from "@/hooks/useTranslation";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error }: ErrorProps) {
  const { t } = useTranslation();
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <PageError
      title={t("common.oops")}
      description={t("common.unexpectedError")}
      buttonText={t("common.backToMain")}
      buttonHref="/login"
      errorDigest={error.digest}
    />
  );
}
