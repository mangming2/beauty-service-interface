import { apiGet, apiPost } from "@/lib/apiClient";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

// ========== 타입 정의 ==========

export type OAuthProvider = "google" | "kakao" | "naver";

/** GET /auth/status 응답 */
export interface AuthStatusResponse {
  authenticated: boolean;
  admin: boolean;
  role: "ADMIN" | "USER" | null;
  userId: number | null;
}

export interface ReissueTokenResponse {
  grantType: string;
  accessToken: string;
  accessTokenExpiresIn: number;
}

// ========== 인증 API ==========

/** 소셜 로그인 (리다이렉트) */
export function loginWithProvider(provider: OAuthProvider): void {
  if (typeof window !== "undefined") {
    window.location.href = `${API_BASE_URL}/auth/login/${provider}`;
  }
}

/** AccessToken 재발급 */
export async function reissueToken(): Promise<ReissueTokenResponse> {
  return apiPost<ReissueTokenResponse>("/auth/reissue", undefined, {
    credentials: "include",
  });
}

/** 로그아웃 (API 호출만) */
export async function logout(): Promise<void> {
  await apiPost("/auth/logout", undefined, { credentials: "include" });
}

/**
 * 현재 인증·권한 조회
 * GET /auth/status
 */
export async function getAuthStatus(): Promise<AuthStatusResponse> {
  return apiGet<AuthStatusResponse>("/auth/status", { requireAuth: true });
}
