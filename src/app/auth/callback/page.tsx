"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import LottieAnimation from "@/components/common/LottieAnimation";
import { useReissue } from "@/queries/useAuth";
import { Button } from "@/components/ui/button";

export default function AuthCallbackPage() {
  const router = useRouter();
  const reissueMutation = useReissue();

  // 콜백 이후 /auth/reissue 호출 시 refreshToken cookie 검증 후 accessToken을 body로 전달
  useEffect(() => {
    const handleReissue = async () => {
      try {
        // refreshToken은 cookie로 전달됨
        await reissueMutation.mutateAsync(undefined);
        // 토큰 재발급 성공 시 메인 페이지로 리다이렉트
        router.push("/");
      } catch (error) {
        console.error("Token reissue error:", error);
        // 에러 발생 시 로그인 페이지로 리다이렉트
        router.push("/login");
      }
    };

    handleReissue();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (reissueMutation.isPending) {
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

  if (reissueMutation.isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="mt-4 text-lg font-medium text-gray-900">인증 오류</h2>
          <p className="mt-2 text-sm text-gray-600">
            {(reissueMutation.error as Error)?.message ||
              "인증 처리 중 오류가 발생했습니다."}
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
