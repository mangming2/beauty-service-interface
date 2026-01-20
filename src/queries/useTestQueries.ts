import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { healthCheck, testSignup, testLogin } from "@/api/test";
import { useAuthStore } from "@/store/useAuthStore";
import { authKeys } from "@/queries/useAuthQueries";

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
  refreshToken: string; // 백엔드가 쿠키로 관리하므로 사용 안 함
  user?: {
    id: string;
    email: string;
    name?: string;
  };
}

// ========== 헬스 체크 ==========

export function useHealthCheck(enabled: boolean = false) {
  return useQuery<string>({
    queryKey: testKeys.health(),
    queryFn: healthCheck,
    enabled,
    staleTime: 30 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

// ========== 테스트 회원가입 ==========

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

export function useTestLogin() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { login } = useAuthStore(); // ⭐ Zustand

  return useMutation<TestLoginResponse, Error, string>({
    mutationFn: async (email: string) => {
      return await testLogin(email);
    },
    onSuccess: data => {
      console.log("✅ 테스트 로그인 성공");

      // ⭐ Zustand에 토큰 저장 (일반 로그인과 동일!)
      login(data.accessToken, data.user);

      // auth 관련 캐시 무효화
      queryClient.invalidateQueries({ queryKey: authKeys.all });

      // 홈으로 이동
      router.push("/");
    },
    onError: error => {
      console.error("❌ 테스트 로그인 실패:", error);
    },
  });
}
