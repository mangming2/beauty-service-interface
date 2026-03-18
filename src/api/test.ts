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
 * 테스트 회원가입 (일반 USER)
 * - 생성 이메일: test+{seed}@google.com
 * - 동일 seed 재호출 시 기존 사용자 반환
 */
export async function testSignup(
  seed: string = "fe-qa-001"
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

/**
 * 테스트 관리자 회원가입 (ADMIN)
 * - 생성 이메일: test+{seed}@google.com
 * - 동일 이메일 사용자 있으면 ADMIN 권한 보정 후 반환
 */
export async function testSignupAdmin(
  seed: string = "fe-admin-001"
): Promise<TestSignupResponse> {
  try {
    return await apiPost<TestSignupResponse>(
      "/auth/test/signup/admin",
      { seed },
      { requireAuth: false }
    );
  } catch (error) {
    console.error("Test signup admin error:", error);
    throw error;
  }
}

// ========== 테스트 로그인 ==========

/** 테스트 로그인 시 서버와 동일한 시크릿 (app.auth.test-login.secret) */
const TEST_AUTH_KEY = process.env.NEXT_PUBLIC_TEST_AUTH_KEY || "doki-test-login";

/**
 * 테스트 로그인
 * - 헤더 X-Test-Auth-Key 필수 (서버 app.auth.test-login.secret과 동일)
 * - signup 응답 email로 호출 후 accessToken을 Bearer로 사용
 */
export async function testLogin(email: string): Promise<TestLoginResponse> {
  try {
    const response = await apiPost<TestLoginResponse>(
      "/auth/test/login",
      { email },
      {
        requireAuth: false,
        headers: {
          "X-Test-Auth-Key": TEST_AUTH_KEY,
        },
      }
    );

    if (response.accessToken && typeof window !== "undefined") {
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
