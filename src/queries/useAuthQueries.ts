import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  loginWithProvider,
  reissueToken,
  logout,
  type OAuthProvider,
} from "@/api/auth";
import { useAuthStore } from "@/store/useAuthStore";

// ========== Query Keys ==========

export const authKeys = {
  all: ["auth"] as const,
} as const;

// ========== 사용자 정보 ==========

/**
 * 현재 사용자 정보 (store에서)
 */
export function useUser() {
  const { user, isAuthenticated, accessToken } = useAuthStore();
  return {
    user,
    isAuthenticated,
    isLoggedIn: !!accessToken,
  };
}

// ========== 로그인 ==========

/**
 * 소셜 로그인
 */
export function useSocialLogin() {
  return useMutation({
    mutationFn: (provider: OAuthProvider) => {
      loginWithProvider(provider);
      return Promise.resolve();
    },
  });
}

/**
 * Google 로그인 (편의 함수)
 */
export function useGoogleLogin() {
  return useMutation({
    mutationFn: () => {
      loginWithProvider("google");
      return Promise.resolve();
    },
    onSuccess: () => {
      console.log("[Google 로그인] 리다이렉트 진행됨 (OAuth 페이지로 이동)");
    },
    onError: error => {
      console.error("[Google 로그인] 에러:", error);
    },
  });
}

// ========== 토큰 재발급 ==========

/**
 * AccessToken 재발급
 */
export function useReissueToken() {
  const { setAccessToken } = useAuthStore();

  return useMutation({
    mutationFn: reissueToken,
    onSuccess: data => {
      setAccessToken(data.accessToken);
    },
  });
}

// ========== 로그아웃 ==========

/**
 * 로그아웃
 */
export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { logout: clearAuthStore } = useAuthStore();

  return useMutation({
    mutationFn: logout,
    onSettled: () => {
      clearAuthStore();
      queryClient.clear();
      router.push("/login");
    },
  });
}

// 별칭 (하위 호환)
export const useSignOut = useLogout;
