"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import MainLogo from "../../../public/main-logo.png";
import { XIcon, AppleIcon, GoogleIcon } from "@/components/common/Icons";
import Image from "next/image";
import { GapY } from "../../components/ui/gap";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    // 이미 로그인된 사용자인지 확인
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        router.push("/my");
      }
    };
    checkUser();
  }, [router]);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setMessage("");

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        setMessage(error.message);
      }
    } catch (error) {
      setMessage("로그인 중 오류가 발생했습니다.");
      console.error("Google login error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleXLogin = async () => {
    alert("준비중입니다.");
  };

  const handleAppleLogin = async () => {
    alert("준비중입니다.");
  };

  const handleGuestAccess = () => {
    router.push("/");
  };

  return (
    <div className="flex flex-col flex-1 items-center justify-center">
      {/* DOKI Logo */}
      <div className="mb-16 text-center">
        <Image src={MainLogo} alt="Main Logo" width={196} height={54} />
      </div>

      {/* Social Login Section */}
      <div className="text-center p-[12px]">
        <p className="h-[24px] text-disabled text-md">소셜 로그인</p>
        <GapY size={8} />
        <div className="flex justify-center gap-x-[14px]">
          <button
            onClick={handleXLogin}
            disabled={loading}
            className="w-[40px] h-[40px] bg-gray-container rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors duration-200"
          >
            <XIcon width={25} height={23} />
          </button>
          <button
            onClick={handleAppleLogin}
            disabled={loading}
            className="w-[40px] h-[40px] bg-gray-container rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors duration-200"
          >
            <AppleIcon width={23} height={28} />
          </button>
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-[40px] h-[40px] bg-gray-container rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors duration-200"
          >
            <GoogleIcon width={24} height={24} />
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
