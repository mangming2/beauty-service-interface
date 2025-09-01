"use client";

import { useRouter } from "next/navigation";
import { Icons } from "@/components/common/Icons";
import { useAuthCallback } from "@/hooks/useAuthQueries";

export default function AuthCallbackPage() {
  const router = useRouter();
  const { data: callbackResult, isLoading, error } = useAuthCallback();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
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
          <p className="mt-2 text-sm text-gray-600">
            {(error as Error)?.message || "인증 처리 중 오류가 발생했습니다."}
          </p>
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

  // 성공적으로 처리되었으면 결과 표시 (실제로는 리다이렉트되므로 보이지 않을 것임)
  if (callbackResult?.success) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Icons.spinner className="mx-auto h-12 w-12 animate-spin text-green-600" />
          <p className="mt-4 text-lg text-gray-600">
            로그인 성공! 페이지를 이동하고 있습니다...
          </p>
        </div>
      </div>
    );
  }

  return null;
}
