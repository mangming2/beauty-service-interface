"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import MainLogo from "../../../public/main-logo.png";
import { GoogleIcon } from "@/components/common/Icons";
import { AuthLoading } from "@/components/common";
import Image from "next/image";
import { GapY } from "../../components/ui/gap";
import { useGoogleLogin, useUser } from "@/queries/useAuthQueries";

export default function LoginPage() {
  const [message, setMessage] = useState("");
  const [isHydrated, setIsHydrated] = useState(false);
  const router = useRouter();
  const { user, isAuthenticated } = useUser();
  const googleLoginMutation = useGoogleLogin();

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated && isAuthenticated && user) {
      router.push("/my");
    }
  }, [isHydrated, isAuthenticated, user, router]);

  if (!isHydrated) {
    return <AuthLoading />;
  }

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

  return (
    <div className="flex flex-col flex-1 items-center pt-[360px]">
      <div className="text-center">
        <Image src={MainLogo} alt="Main Logo" width={196} height={54} />
      </div>

      <div className="mt-[200px] text-center p-[12px]">
        <div className="text-center">
          <p className="h-[24px] text-disabled text-md">소셜 로그인</p>
          <GapY size={8} />
          <div className="flex justify-center gap-x-[14px]">
            <button
              onClick={handleGoogleLogin}
              disabled={googleLoginMutation.isPending}
              className="w-[40px] h-[40px] bg-white rounded-full flex items-center justify-center cursor-pointer transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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

        <div className="text-center p-[12px] flex gap-4">
          <button
            onClick={handleGuestAccess}
            className="text-white text-md underline hover:text-gray-300 transition-colors duration-200 cursor-pointer"
          >
            비회원으로 이용
          </button>
        </div>
      </div>

      {message && (
        <div className="mt-4 text-red-400 text-sm text-center">{message}</div>
      )}
    </div>
  );
}
