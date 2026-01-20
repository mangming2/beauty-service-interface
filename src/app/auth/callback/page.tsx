// app/auth/callback/page.tsx

"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import LottieAnimation from "@/components/common/LottieAnimation";
import {
  useAuthCallback,
  useAuthStateListener,
} from "@/queries/useAuthQueries";
import { Button } from "@/components/ui/button";

// 로딩 컴포넌트
function LoadingUI() {
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

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: callbackResult, isLoading, error } = useAuthCallback();

  // 실시간 인증 상태 감지 (프로필 생성용)
  useAuthStateListener();

  // 에러 파라미터 확인
  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam) {
      console.error("OAuth error:", errorParam);
    }
  }, [searchParams]);

  if (isLoading || callbackResult?.success) {
    return <LoadingUI />;
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

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<LoadingUI />}>
      <CallbackContent />
    </Suspense>
  );
}
