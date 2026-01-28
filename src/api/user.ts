import { apiPatch } from "@/lib/apiClient";

// ========== 타입 정의 ==========

/** 닉네임 수정 요청 */
export interface UpdateNicknameRequest {
  nickname: string;
}

/** 사용자 정보 응답 */
export interface UserResponse {
  id: number;
  email: string;
  nickname: string;
  lastLoginAt: string;
}

// ========== User API ==========

/**
 * 닉네임 수정
 * PATCH /users
 */
export async function updateNickname(
  data: UpdateNicknameRequest
): Promise<UserResponse> {
  return apiPatch<UserResponse>("/users", data);
}
