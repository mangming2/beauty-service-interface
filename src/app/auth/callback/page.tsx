"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import LottieAnimation from "@/components/common/LottieAnimation";
import { useAuthStore } from "@/store/useAuthStore";
import { reissueToken } from "@/lib/apiClient";
import { getMyPageUser } from "@/api/my-page";
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
  const { setAccessToken, setUser } = useAuthStore();
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
          setError(
            "로그인 세션이 유지되지 않았습니다. 시크릿/프라이빗 모드에서는 쿠키가 저장되지 않아 로그인이 실패할 수 있습니다. 일반 창에서 다시 시도해 주세요."
          );
          return;
        }

        // 3. store에 토큰 저장
        setAccessToken(accessToken);

        // 4. 사용자 정보 조회 후 store에 저장 (my 이동 전 pause)
        const me = await getMyPageUser();
        setUser({
          id: String(me.id),
          email: me.email,
          name: me.nickname,
        });

        // 5. 마이페이지로 이동
        router.replace("/my");
      } catch (err) {
        console.error("Auth callback error:", err);
        setError("인증 처리 중 오류가 발생했습니다.");
      }
    };

    handleCallback();
  }, [searchParams, setAccessToken, setUser, router]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <h2 className="mt-4 text-lg font-medium text-white">인증 오류</h2>
          <p className="mt-2 text-sm text-gray-300 leading-relaxed">{error}</p>
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
