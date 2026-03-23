import { apiGet } from "@/lib/apiClient";

/**
 * 관리자 유저 목록 API (백엔드 스펙)
 * GET /admin/users?cursor=&size=&query=
 * - query: 이메일/닉네임 부분 검색(백엔드 구현에 따름)
 */
export interface AdminUserListItem {
  id: number;
  email: string;
  nickname: string;
  lastLoginAt: string;
  role?: "USER" | "ADMIN";
}

export interface AdminUsersListResponse {
  users: AdminUserListItem[];
  hasNext: boolean;
  nextCursor: string;
}

export interface GetAdminUsersParams {
  cursor?: string;
  size?: number;
  query?: string;
}

export async function getAdminUsers(
  params: GetAdminUsersParams = {}
): Promise<AdminUsersListResponse> {
  const queryParams = new URLSearchParams();
  if (params.cursor !== undefined) {
    queryParams.append("cursor", params.cursor);
  }
  if (params.size !== undefined) {
    queryParams.append("size", String(params.size));
  }
  if (params.query !== undefined && params.query.trim() !== "") {
    queryParams.append("query", params.query.trim());
  }
  const qs = queryParams.toString();
  const url = `/admin/users${qs ? `?${qs}` : ""}`;
  const data = await apiGet<AdminUsersListResponse>(url, {
    requireAuth: true,
  });
  return (
    data ?? {
      users: [],
      hasNext: false,
      nextCursor: "",
    }
  );
}
