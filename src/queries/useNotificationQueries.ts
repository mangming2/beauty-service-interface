import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getNotifications,
  getUnreadNotificationCount,
  markNotificationRead,
  markAllNotificationsRead,
  deleteAllNotifications,
  type NotificationSliceResponse,
  type NotificationUnreadCountResponse,
  type GetNotificationsParams,
} from "@/api/notification";
import type { ApiError } from "@/lib/apiClient";

// ========== Query Keys ==========

export const notificationKeys = {
  all: ["notifications"] as const,
  lists: () => [...notificationKeys.all, "list"] as const,
  list: (params: GetNotificationsParams) =>
    [...notificationKeys.lists(), params] as const,
  unreadCount: () => [...notificationKeys.all, "unreadCount"] as const,
} as const;

function retryUnless401(failureCount: number, error: unknown): boolean {
  const err = error as ApiError | undefined;
  if (err?.status === 401) return false;
  return failureCount < 2;
}

// ========== Queries ==========

/**
 * 알림 목록 조회
 */
export function useNotifications(params: GetNotificationsParams = {}) {
  return useQuery<NotificationSliceResponse>({
    queryKey: notificationKeys.list(params),
    queryFn: () => getNotifications(params),
    staleTime: 30 * 1000,
    retry: retryUnless401,
  });
}

/**
 * 읽지 않은 알림 수 조회
 */
export function useUnreadNotificationCount() {
  return useQuery<NotificationUnreadCountResponse>({
    queryKey: notificationKeys.unreadCount(),
    queryFn: getUnreadNotificationCount,
    staleTime: 30 * 1000,
    retry: retryUnless401,
    refetchOnWindowFocus: true,
  });
}

// ========== Mutations ==========

/**
 * 개별 알림 읽음 처리
 */
export function useMarkNotificationRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: number) =>
      markNotificationRead(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: notificationKeys.unreadCount(),
      });
    },
  });
}

/**
 * 전체 알림 읽음 처리
 */
export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAllNotificationsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
}

/**
 * 전체 알림 삭제
 */
export function useDeleteAllNotifications() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAllNotifications,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
}
