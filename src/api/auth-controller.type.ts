// 토큰 재발급 요청 타입 (refreshToken은 cookie로 전달)
export interface ReissueRequest {
  refreshToken?: string; // cookie로 전달되므로 선택적
}

// 토큰 재발급 응답 타입
export interface ReissueResponse {
  grantType: string;
  accessToken: string;
  accessTokenExpiresIn: number;
}
