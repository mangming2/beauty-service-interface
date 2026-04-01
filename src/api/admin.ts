import { apiGet } from "@/lib/apiClient";

/**
 * 관리자 유저 목록 API
 * GET /admin/users
 */
export interface AdminUserListItem {
  id: number;
  email: string;
  nickname: string;
  role: "USER" | "ADMIN";
  lastLoginAt?: string;
}

export async function getAdminUsers(): Promise<AdminUserListItem[]> {
  const data = await apiGet<AdminUserListItem[]>("/admin/users", {
    requireAuth: true,
  });
  return data ?? [];
}
