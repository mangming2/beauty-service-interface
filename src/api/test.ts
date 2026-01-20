import { apiGet, apiPost } from "@/lib/apiClient";

// ========== 타입 정의 ==========

interface TestLoginResponse {
  accessToken: string;
  refreshToken: string;
}
interface TestSignupResponse {
  userId: number;
  email: string;
}

// ========== 테스트 회원가입 ==========

/**
 * 테스트 회원가입
 * - test-{seed}@google.com 규칙으로 생성
 * - 동일 email 존재 시 기존 사용자 반환
 */
export async function testSignup(
  seed: string = "qa01"
): Promise<TestSignupResponse> {
  try {
    return await apiPost<TestSignupResponse>(
      "/auth/test/signup",
      { seed },
      { requireAuth: false }
    );
  } catch (error) {
    console.error("Test signup error:", error);
    throw error;
  }
}

// ========== 테스트 로그인 ==========

/**
 * 테스트 로그인
 */
export async function testLogin(
  email: string = "test@test.com"
): Promise<TestLoginResponse> {
  try {
    const response = await apiPost<TestLoginResponse>(
      "/auth/test/login",
      { email },
      {
        requireAuth: false,
        headers: {
          "X-Test-Auth-Key": "doki-test-login",
        },
      }
    );

    // 토큰 저장
    if (response.accessToken) {
      localStorage.setItem("auth_token", response.accessToken);
    }

    return response;
  } catch (error) {
    console.error("Test login error:", error);
    throw error;
  }
}

// ========== 헬스 체크 ==========

/**
 * 서버 상태 확인
 * GET /health/check
 * @returns "up" (서버 정상 작동 시)
 */
export async function healthCheck(): Promise<string> {
  try {
    return await apiGet<string>("/health/check", {
      requireAuth: false,
    });
  } catch (error) {
    console.error("Health check error:", error);
    throw error;
  }
}
