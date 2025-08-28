"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Icons } from "@/components/common/Icons";

export default function AuthCallbackPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          setError(error.message);
          setLoading(false);
          return;
        }

        if (data.session) {
          // 로그인 성공, 사용자 정보 가져오기
          const {
            data: { user },
          } = await supabase.auth.getUser();

          if (user) {
            // 사용자 프로필 정보가 있는지 확인
            const { data: profile } = await supabase
              .from("profiles")
              .select("*")
              .eq("id", user.id)
              .single();

            if (!profile) {
              // 프로필이 없으면 프로필 생성 페이지로 이동
              router.push("/profile/setup");
            } else {
              // 프로필이 있으면 메인 페이지로 이동
              router.push("/my");
            }
          }
        } else {
          // 세션이 없으면 로그인 페이지로 이동
          router.push("/login");
        }
      } catch (error) {
        console.error("Auth callback error:", error);
        setError("인증 처리 중 오류가 발생했습니다.");
        setLoading(false);
      }
    };

    handleAuthCallback();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Icons.spinner className="mx-auto h-12 w-12 animate-spin text-indigo-600" />
          <p className="mt-4 text-lg text-gray-600">
            인증을 처리하고 있습니다...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 text-red-600">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h2 className="mt-4 text-lg font-medium text-gray-900">인증 오류</h2>
          <p className="mt-2 text-sm text-gray-600">{error}</p>
          <button
            onClick={() => router.push("/login")}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            로그인 페이지로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return null;
}
