"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { getMyPageUser } from "@/api/my-page";
import type { ApiError } from "@/lib/apiClient";

/**
 * 앱 로드 시:
 * - persist된 토큰 검증 (만료 시 store 초기화)
 * - 구 beauty-form-storage localStorage 정리 (백엔드 관리로 전환됨)
 */
export function AuthValidator({ children }: { children: React.ReactNode }) {
  const accessToken = useAuthStore(state => state.accessToken);
  const logout = useAuthStore(state => state.logout);

  // 구 beauty-form-storage 제거 (폼 데이터는 이제 백엔드에서 관리)
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("beauty-form-storage");
    }
  }, []);

  useEffect(() => {
    if (!accessToken || typeof window === "undefined") return;

    let cancelled = false;

    const validate = async () => {
      try {
        await getMyPageUser();
      } catch (error) {
        const err = error as ApiError | undefined;
        const status = err?.status;
        const code = err?.code;
        // 401(세션만료) 또는 404(USER_NOT_FOUND) 시 로그아웃만 수행, 콘솔 스팸 방지
        if (!cancelled && (status === 401 || (status === 404 && code === "USER_NOT_FOUND"))) {
          logout();
        }
      }
    };

    validate();
    return () => {
      cancelled = true;
    };
  }, [accessToken, logout]);

  return <>{children}</>;
}
