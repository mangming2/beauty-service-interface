"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import LottieAnimation from "@/components/common/LottieAnimation";
import { useAuthStore } from "@/store/useAuthStore";
import { reissueToken } from "@/lib/apiClient"; // ✅ import
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
        <p className="mt-4 text-lg text-gray-600">로그인 처리 중...</p>
      </div>
    </div>
  );
}

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setAccessToken } = useAuthStore();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // 1. 에러 파라미터 확인
        const errorParam = searchParams.get("error");
        if (errorParam) {
          setError(errorParam);
          return;
        }

        // 2. 토큰 재발급 (refreshToken은 쿠키에 있음)
        const accessToken = await reissueToken();

        if (!accessToken) {
          setError("토큰 발급에 실패했습니다.");
          return;
        }

        // 3. store에 저장
        setAccessToken(accessToken);

        // 4. 마이페이지로 이동
        router.replace("/my");
      } catch (err) {
        console.error("Auth callback error:", err);
        setError("인증 처리 중 오류가 발생했습니다.");
      }
    };

    handleCallback();
  }, [searchParams, setAccessToken, router]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="mt-4 text-lg font-medium text-gray-900">인증 오류</h2>
          <p className="mt-2 text-sm text-gray-600">{error}</p>
          <Button className="mt-4" onClick={() => router.push("/login")}>
            로그인 페이지로 돌아가기
          </Button>
        </div>
      </div>
    );
  }

  return <LoadingUI />;
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<LoadingUI />}>
      <CallbackContent />
    </Suspense>
  );
}
