import { apiGet, apiPost } from "@/lib/apiClient";
import { API_BASE_URL } from "@/constants";

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
  const res = await fetch("/api/auth/reissue", { method: "POST" });
  if (!res.ok) throw new Error("reissue failed");
  return res.json();
}

/** 로그아웃 (API 호출만) */
export async function logout(): Promise<void> {
  // Next.js API route 경유: 프론트 도메인 쿠키 읽기 + 백엔드 로그아웃 + 쿠키 삭제
  await fetch("/api/auth/logout", { method: "POST" });
}

/**
 * 현재 인증·권한 조회
 * GET /auth/status
 */
export async function getAuthStatus(): Promise<AuthStatusResponse> {
  return apiGet<AuthStatusResponse>("/auth/status", { requireAuth: true });
}
