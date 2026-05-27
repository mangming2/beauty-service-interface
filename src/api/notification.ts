import { apiGet, apiPatch, apiDelete } from "@/lib/apiClient";

// ========== 타입 정의 ==========

export type NotificationType = "POST_COMMENT" | "POST_LIKE" | "COMMENT_REPLY";
export type NotificationTargetType = "COMMUNITY_POST" | "COMMUNITY_COMMENT";

export interface NotificationResponse {
  id: number;
  type: NotificationType;
  targetType: NotificationTargetType;
  targetId: number;
  actorId: number;
  actorDisplayName: string;
  message: string;
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
}

export interface NotificationSliceResponse {
  notifications: NotificationResponse[];
  hasNext: boolean;
  nextCursor: number | null;
}

export interface NotificationUnreadCountResponse {
  unreadCount: number;
}

export interface GetNotificationsParams {
  cursor?: number;
  size?: number;
}

// ========== API 함수 ==========

/**
 * 알림 목록 조회 (cursor 기반)
 * GET /notifications?cursor={id?}&size={1..50}
 */
export async function getNotifications(
  params: GetNotificationsParams = {}
): Promise<NotificationSliceResponse> {
  const queryParams = new URLSearchParams();
  if (params.cursor !== undefined) {
    queryParams.append("cursor", String(params.cursor));
  }
  if (params.size !== undefined) {
    queryParams.append("size", String(params.size));
  }
  const queryString = queryParams.toString();
  const url = `/notifications${queryString ? `?${queryString}` : ""}`;
  return apiGet<NotificationSliceResponse>(url, { requireAuth: true });
}

/**
 * 읽지 않은 알림 수 조회
 * GET /notifications/unread-count
 */
export async function getUnreadNotificationCount(): Promise<NotificationUnreadCountResponse> {
  return apiGet<NotificationUnreadCountResponse>(
    "/notifications/unread-count",
    {
      requireAuth: true,
    }
  );
}

/**
 * 개별 알림 읽음 처리
 * PATCH /notifications/:notificationId/read
 */
export async function markNotificationRead(
  notificationId: number
): Promise<NotificationResponse> {
  return apiPatch<NotificationResponse>(
    `/notifications/${notificationId}/read`,
    undefined,
    { requireAuth: true }
  );
}

/**
 * 전체 알림 읽음 처리
 * PATCH /notifications/read-all
 */
export async function markAllNotificationsRead(): Promise<void> {
  await apiPatch<void>("/notifications/read-all", undefined, {
    requireAuth: true,
  });
}

/**
 * 개별 알림 삭제
 * DELETE /notifications/:notificationId
 */
export async function deleteNotification(
  notificationId: number
): Promise<void> {
  await apiDelete<void>(`/notifications/${notificationId}`, {
    requireAuth: true,
  });
}

/**
 * 전체 알림 삭제
 * DELETE /notifications
 */
export async function deleteAllNotifications(): Promise<void> {
  await apiDelete<void>("/notifications", { requireAuth: true });
}
