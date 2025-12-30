// 사용자 조회 요청 타입
export interface GetUserRequest {
  userId: number; // 사용자 ID (query parameter)
}

// 사용자 응답 타입
export interface User {
  id: number;
  email: string;
  lastLoginAt: string; // ISO 8601 datetime format
}
