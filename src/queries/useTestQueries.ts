import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { healthCheck, testSignup, testLogin } from "@/api/test";

// ========== Query Keys ==========

export const testKeys = {
  all: ["test"] as const,
  health: () => [...testKeys.all, "health"] as const,
} as const;

// ========== Types ==========

interface TestSignupResponse {
  userId: number;
  email: string;
}

interface TestLoginResponse {
  accessToken: string;
  refreshToken: string;
}

// ========== 헬스 체크 ==========

/**
 * 서버 상태 확인 Query
 * - 자동으로 30초마다 refetch
 * - 수동 refetch도 가능
 */
export function useHealthCheck(enabled: boolean = false) {
  return useQuery<string>({
    queryKey: testKeys.health(),
    queryFn: healthCheck,
    enabled, // 기본적으로 비활성화, 버튼 클릭 시 refetch
    staleTime: 30 * 1000, // 30초
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

// ========== 테스트 회원가입 ==========

/**
 * 테스트 회원가입 Mutation
 * - test-{seed}@google.com 규칙으로 생성
 * - 동일 email 존재 시 기존 사용자 반환
 */
export function useTestSignup() {
  return useMutation<TestSignupResponse, Error, string>({
    mutationFn: async (seed: string) => {
      return await testSignup(seed);
    },
    onSuccess: data => {
      console.log("✅ 테스트 회원가입 성공:", data);
    },
    onError: error => {
      console.error("❌ 테스트 회원가입 실패:", error);
    },
  });
}

// ========== 테스트 로그인 ==========

/**
 * 테스트 로그인 Mutation수사
 * - 성공 시 localStorage에 토큰 저장
 * - auth 관련 캐시 무효화
 */
export function useTestLogin() {
  const queryClient = useQueryClient();

  return useMutation<TestLoginResponse, Error, string>({
    mutationFn: async (email: string) => {
      return await testLogin(email);
    },
    onSuccess: data => {
      console.log("✅ 테스트 로그인 성공");

      // 토큰 저장
      if (data.accessToken) {
        localStorage.setItem("auth_token", data.accessToken);
      }

      // auth 관련 캐시 무효화 (기존 useQueries와 연동)
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
    onError: error => {
      console.error("❌ 테스트 로그인 실패:", error);
    },
  });
}

// ========== 토큰 관리 유틸 ==========

/**
 * 저장된 토큰 확인
 */
export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("auth_token");
}

/**
 * 토큰 삭제
 */
export function clearStoredToken(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem("auth_token");
}
