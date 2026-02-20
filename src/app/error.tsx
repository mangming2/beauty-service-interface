"use client";

import { useEffect } from "react";
import { PageError } from "@/components/common";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error }: ErrorProps) {
  useEffect(() => {
    // 에러를 로깅 서비스에 전송할 수 있습니다
    console.error("Application error:", error);
  }, [error]);

  return (
    <PageError
      title="Oops!"
      description={"An unexpected error occurred.\nPlease try again later."}
      buttonText="Back to main page"
      buttonHref="/login"
      errorDigest={error.digest}
    />
  );
}
