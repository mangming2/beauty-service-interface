import apiClient from "./index";
import type { ReissueRequest, ReissueResponse } from "./auth-controller.type";

/**
 * 로그인 API
 * GET /auth/login
 */
export const login = async (): Promise<void> => {
  await apiClient.get("/auth/login");
};

/**
 * 토큰 재발급 API
 * POST /auth/reissue
 * refreshToken은 cookie로 전달됨
 */
export const reissue = async (
  data?: ReissueRequest
): Promise<ReissueResponse> => {
  const response = await apiClient.post<ReissueResponse>("/auth/reissue", data);
  return response.data;
};

/**
 * 로그아웃 API
 * POST /auth/logout
 */
export const logout = async (): Promise<void> => {
  await apiClient.post("/auth/logout");
};

// auth-controller의 모든 API를 객체로 export
export const authController = {
  login,
  reissue,
  logout,
};
