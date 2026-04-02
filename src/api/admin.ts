import { apiGet, apiPost } from "@/lib/apiClient";

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

// ========== Dev Tools ==========

export interface DbResetAndSeedResult {
  truncatedTableCount: number;
  seededProductId: number;
  seededOptionId: number;
  seededReservationId: number;
  seededReviewId: number;
  seededUserId: number;
  seededMainBannerId: number;
  seededImageIds: number[];
}

/**
 * DB 전체 truncate 후 더미 데이터 생성 (local/dev 전용)
 * POST /dev/tools/db/reset-and-seed
 */
export async function resetAndSeedDb(): Promise<DbResetAndSeedResult> {
  return apiPost<DbResetAndSeedResult>(
    "/dev/tools/db/reset-and-seed",
    undefined,
    {
      requireAuth: true,
    }
  );
}
