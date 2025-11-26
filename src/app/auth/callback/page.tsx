"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import LottieAnimation from "@/components/common/LottieAnimation";
import { useAuthCallback, useAuthStateListener } from "@/hooks/useAuthQueries";
import { Button } from "@/components/ui/button";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: callbackResult, isLoading, error } = useAuthCallback();

  // 실시간 인증 상태 감지 (프로필 생성용)
  useAuthStateListener();

  // URL 파라미터에서 토큰 받아서 저장
  useEffect(() => {
    const token = searchParams.get("token");
    const errorParam = searchParams.get("error");

    if (errorParam) {
      console.error("OAuth error:", errorParam);
      return;
    }

    if (token && typeof window !== "undefined") {
      // 토큰을 로컬 스토리지에 저장
      localStorage.setItem("auth_token", token);

      // 쿠키에도 저장 (middleware에서 사용)
      document.cookie = `auth_token=${token}; path=/; max-age=86400; SameSite=Lax`;
    }
  }, [searchParams]);

  if (isLoading || callbackResult?.success) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LottieAnimation
            src="/logo-loading.lottie"
            width={120}
            height={120}
            className="mx-auto"
          />
          <p className="mt-4 text-lg text-gray-600">로딩중입니다.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="mt-4 text-lg font-medium text-gray-900">인증 오류</h2>
          <p className="mt-2 text-sm text-gray-600">
            {(error as Error)?.message || "인증 처리 중 오류가 발생했습니다."}
          </p>
          <Button
            onClick={() => {
              setTimeout(() => router.push("/login"), 0);
            }}
          >
            로그인 페이지로 돌아가기
          </Button>
        </div>
      </div>
    );
  }

  return null;
}
