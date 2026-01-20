"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import MainLogo from "../../../public/main-logo.png";
import { GoogleIcon } from "@/components/common/Icons";
import { AuthLoading } from "@/components/common";
import Image from "next/image";
import { GapY } from "../../components/ui/gap";
import {
  useUser,
  useGoogleLogin,
  useAuthStateListener,
} from "@/queries/useAuthQueries";

// 개발 모드 체크
const isDev = process.env.NODE_ENV === "development";

export default function LoginPage() {
  const [message, setMessage] = useState("");
  const router = useRouter();
  const { data: user, isLoading: userLoading } = useUser();
  const googleLoginMutation = useGoogleLogin();

  // 실시간 인증 상태 감지
  useAuthStateListener();

  // 이미 로그인된 사용자라면 리다이렉트
  useEffect(() => {
    if (user && !userLoading) {
      router.push("/my");
    }
  }, [user, userLoading, router]);

  const handleGoogleLogin = async () => {
    try {
      setMessage("");
      await googleLoginMutation.mutateAsync();
    } catch (error: unknown) {
      setMessage((error as Error)?.message || "로그인 중 오류가 발생했습니다.");
    }
  };

  const handleGuestAccess = () => {
    router.push("/");
  };

  const handleTestLogin = () => {
    router.push("/dev/test");
  };

  if (userLoading) {
    return <AuthLoading />;
  }

  return (
    <div className="flex flex-col flex-1 items-center justify-center">
      {/* DOKI Logo */}
      <div className="text-center mt-auto">
        <Image src={MainLogo} alt="Main Logo" width={196} height={54} />
      </div>

      {/* Social Login Section */}
      <div className="text-center p-[12px] mt-auto">
        <p className="h-[24px] text-disabled text-md">소셜 로그인</p>
        <GapY size={8} />
        <div className="flex justify-center gap-x-[14px]">
          <button
            onClick={handleGoogleLogin}
            disabled={googleLoginMutation.isPending || userLoading}
            className="w-[40px] h-[40px] bg-white rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {googleLoginMutation.isPending ? (
              <div className="w-[24px] h-[24px] border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <GoogleIcon width={24} height={24} />
            )}
          </button>
        </div>
      </div>

      <GapY size={17} />

      {/* Guest & Test Login */}
      <div className="text-center p-[12px] flex gap-4">
        <button
          onClick={handleGuestAccess}
          className="text-white text-md underline hover:text-gray-300 transition-colors duration-200"
        >
          비회원으로 이용
        </button>

        {/* 🔧 개발 모드에서만 표시 */}
        {isDev && (
          <button
            onClick={handleTestLogin}
            className="text-yellow-400 text-md underline hover:text-yellow-300 transition-colors duration-200"
          >
            🧪 테스트 로그인
          </button>
        )}
      </div>

      {/* Error Message */}
      {message && (
        <div className="mt-4 text-red-400 text-sm text-center">{message}</div>
      )}
    </div>
  );
}
