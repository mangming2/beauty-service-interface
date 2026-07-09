"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import LottieAnimation from "@/components/common/LottieAnimation";
import { useAuthStore } from "@/store/useAuthStore";
import { reissueToken } from "@/lib/apiClient";
import { getMyPageUser } from "@/api/my-page";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/useTranslation";
import { gtag } from "@/lib/gtag";

// 로딩 컴포넌트
function LoadingUI() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <LottieAnimation
          src="/logo-loading.lottie"
          width={120}
          height={120}
          className="mx-auto"
        />
        <p className="mt-4 text-lg text-gray-600">
          {t("auth.processingLogin")}
        </p>
      </div>
    </div>
  );
}

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setAccessToken, setUser } = useAuthStore();
  const { t } = useTranslation();
  const [error, setError] = useState<string | null>(null);
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const handleCallback = async () => {
      try {
        // 1. 에러 파라미터 확인
        const errorParam = searchParams.get("error");
        if (errorParam) {
          setError(errorParam);
          return;
        }

        // 2. 토큰 재발급
        // refreshToken은 백엔드가 이 콜백 URL에 rt 쿼리파라미터로 넘겨준다
        // (OAuth 리다이렉트 중 크로스사이트 쿠키 세팅이 Safari ITP에 막히는 문제 회피).
        const rt = searchParams.get("rt") ?? undefined;
        const accessToken = await reissueToken(rt);

        if (!accessToken) {
          setError(t("auth.sessionNotPersisted"));
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

        gtag.loginSuccess("google");

        // 5. 마이페이지로 이동
        router.replace("/my");
      } catch (err) {
        console.error("Auth callback error:", err);
        setError(t("auth.authError"));
      }
    };

    handleCallback();
  }, [searchParams, setAccessToken, setUser, router, t]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <h2 className="mt-4 text-lg font-medium text-white">
            {t("auth.authErrorTitle")}
          </h2>
          <p className="mt-2 text-sm text-gray-300 leading-relaxed">{error}</p>
          <Button className="mt-4" onClick={() => router.push("/login")}>
            {t("auth.backToLogin")}
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
