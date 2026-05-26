"use client";

import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/useAuthStore";
import { notificationKeys } from "@/queries/useNotificationQueries";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

/**
 * SSE로 실시간 알림을 구독하는 훅.
 * 로그인 상태일 때만 연결하고, 새 알림 이벤트가 오면 React Query 캐시를 갱신한다.
 */
export function useNotificationStream() {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  const accessToken = useAuthStore(s => s.accessToken);
  const queryClient = useQueryClient();
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !accessToken) {
      eventSourceRef.current?.close();
      eventSourceRef.current = null;
      return;
    }

    function connect() {
      eventSourceRef.current?.close();

      const url = `${API_BASE_URL}/notifications/stream?token=${encodeURIComponent(accessToken!)}`;
      const es = new EventSource(url);
      eventSourceRef.current = es;

      es.addEventListener("notification", () => {
        queryClient.invalidateQueries({ queryKey: notificationKeys.lists() });
        queryClient.invalidateQueries({
          queryKey: notificationKeys.unreadCount(),
        });
      });

      es.onerror = () => {
        es.close();
        // 5초 후 재연결 시도
        setTimeout(connect, 5000);
      };
    }

    connect();

    function handleVisibilityChange() {
      if (document.visibilityState === "visible") {
        connect();
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      eventSourceRef.current?.close();
      eventSourceRef.current = null;
    };
  }, [isAuthenticated, accessToken, queryClient]);
}
