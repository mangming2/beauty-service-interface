"use client";

import { useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import ErrorLogo from "../../public/error-logo.png";
import { GapY } from "../components/ui/gap";
import Link from "next/link";

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
    <div
      className="text-white bg-transparent flex flex-col flex-1 items-center"
      data-page="error"
    >
      {/* 중앙 콘텐츠 영역 */}
      <div className="flex-1 flex flex-col items-center justify-center">
        {/* Error Logo */}
        <div className="mb-8">
          <Image
            src={ErrorLogo}
            alt="Error"
            width={172}
            height={172}
            className="object-contain"
            priority
          />
        </div>

        {/* Error Messages */}
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-2">Oops!</h1>
          <GapY size={24} />
          <p className="text-lg text-white">
            An unexpected error occurred.
            <br />
            Please try again later.
          </p>
          {process.env.NODE_ENV === "development" && error.digest && (
            <p className="text-sm text-gray-400 mt-2">
              Error ID: {error.digest}
            </p>
          )}
        </div>
      </div>

      {/* Back to Login Button */}
      <div
        className="w-full py-4 px-5"
        style={{
          boxShadow: "inset 0 6px 6px -6px rgba(255, 255, 255, 0.12)",
        }}
      >
        <Link href="/login">
          <Button
            variant="default"
            className="w-full h-12 text-lg font-semibold"
          >
            Back to main page
          </Button>
        </Link>
      </div>
    </div>
  );
}
