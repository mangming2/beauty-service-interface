import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login, reissue, logout } from "@/api/auth-controller";
import type {
  ReissueRequest,
  ReissueResponse,
} from "@/api/auth-controller.type";
import { authControllerKeys } from "./queryKeys";

/**
 * 로그인 Mutation
 * GET /auth/login
 */
export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: login,
    onSuccess: () => {
      // 로그인 성공 시 인증 관련 캐시 무효화
      queryClient.invalidateQueries({
        queryKey: authControllerKeys.all,
      });
    },
    onError: (error: unknown) => {
      console.error("Login error:", error);
    },
  });
}

/**
 * 토큰 재발급 Mutation
 * POST /auth/reissue
 * refreshToken은 cookie로 전달됨
 */
export function useReissue() {
  const queryClient = useQueryClient();

  return useMutation<ReissueResponse, Error, ReissueRequest | undefined>({
    mutationFn: (data?: ReissueRequest) => reissue(data),
    onSuccess: () => {
      // 토큰 재발급 성공 시 인증 관련 캐시 무효화
      queryClient.invalidateQueries({
        queryKey: authControllerKeys.all,
      });
    },
    onError: (error: unknown) => {
      console.error("Token reissue error:", error);
    },
  });
}

/**
 * 로그아웃 Mutation
 * POST /auth/logout
 */
export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      // 로그아웃 성공 시 모든 인증 관련 캐시 제거
      queryClient.removeQueries({
        queryKey: authControllerKeys.all,
      });
    },
    onError: (error: unknown) => {
      console.error("Logout error:", error);
    },
  });
}
