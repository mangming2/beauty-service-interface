"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import MainLogo from "../../../public/main-logo.png";
import { GoogleIcon } from "@/components/common/Icons";
import { AuthLoading } from "@/components/common";
import Image from "next/image";
import { GapY } from "../../components/ui/gap";
import { useLogin } from "@/queries/useAuth";

export default function LoginPage() {
  const [message, setMessage] = useState("");
  const router = useRouter();
  const loginMutation = useLogin();

  const handleGoogleLogin = async () => {
    try {
      setMessage("");
      // /auth/login 호출 시 refreshToken 발급 + /auth/callback으로 콜백
      await loginMutation.mutateAsync();
      // 서버에서 /auth/callback으로 리다이렉트 처리됨
    } catch (error: unknown) {
      // AxiosError의 userMessage가 있으면 사용, 없으면 기본 메시지
      const axiosError = error as Error & { userMessage?: string };
      setMessage(
        axiosError.userMessage ||
          axiosError.message ||
          "로그인 중 오류가 발생했습니다."
      );
    }
  };

  // const handleXLogin = async () => {
  //   alert("준비중입니다.");
  // };

  // const handleAppleLogin = async () => {
  //   alert("준비중입니다.");
  // };

  const handleGuestAccess = () => {
    router.push("/");
  };

  // 로그인 처리 중일 때 로딩 표시
  if (loginMutation.isPending) {
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
          {/* <button
            onClick={handleXLogin}
            disabled={googleLoginMutation.isPending || userLoading}
            className="w-[40px] h-[40px] bg-gray-container rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <XIcon width={25} height={23} />
          </button>
          <button
            onClick={handleAppleLogin}
            disabled={googleLoginMutation.isPending || userLoading}
            className="w-[40px] h-[40px] bg-gray-container rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <AppleIcon width={23} height={28} />
          </button> */}
          <button
            onClick={handleGoogleLogin}
            disabled={loginMutation.isPending}
            className="w-[40px] h-[40px] bg-white rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loginMutation.isPending ? (
              <div className="w-[24px] h-[24px] border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <GoogleIcon width={24} height={24} />
            )}
          </button>
        </div>
      </div>
      <GapY size={17} />
      <div className="text-center p-[12px]">
        <button
          onClick={handleGuestAccess}
          className="text-white text-md underline hover:text-gray-300 transition-colors duration-200"
        >
          비회원으로 이용
        </button>
      </div>

      {/* Error Message */}
      {message && (
        <div className="mt-4 text-red-400 text-sm text-center">{message}</div>
      )}
    </div>
  );
}
