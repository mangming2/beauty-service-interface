"use client";

import { useRouter } from "next/navigation";
import LottieAnimation from "@/components/common/LottieAnimation";
import { useAuthCallback, useAuthStateListener } from "@/hooks/useAuthQueries";
import { Button } from "@/components/ui/button";

export default function AuthCallbackPage() {
  const router = useRouter();
  const { data: callbackResult, isLoading, error } = useAuthCallback();

  // 실시간 인증 상태 감지 (프로필 생성용)
  useAuthStateListener();

  if (isLoading || callbackResult?.success) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LottieAnimation
            src="/dummy-loading.lottie"
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
