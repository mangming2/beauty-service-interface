"use client";

import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/useAuthStore";
import { reissueToken } from "@/lib/apiClient";
import { notificationKeys } from "@/queries/useNotificationQueries";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

export function useNotificationStream() {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  const accessToken = useAuthStore(s => s.accessToken);
  const queryClient = useQueryClient();
  const abortRef = useRef<AbortController | null>(null);
  const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !accessToken) {
      cleanup();
      return;
    }

    let cancelled = false;

    async function connect(token: string) {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const response = await fetch(
          `${API_BASE_URL}/notifications/stream?token=${encodeURIComponent(token)}`,
          { signal: controller.signal }
        );

        if (cancelled) return;

        if (response.status === 401) {
          const newToken = await reissueToken();
          if (cancelled) return;
          if (newToken) {
            useAuthStore.getState().setAccessToken(newToken);
            // accessToken 변경으로 useEffect 재실행 → 새 토큰으로 자동 재연결
          }
          // reissueToken 실패 시 내부에서 logout() 호출
          return;
        }

        if (!response.ok || !response.body) {
          scheduleRetry(token);
          return;
        }

        // SSE 스트림 읽기
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let currentEvent = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done || cancelled) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            if (line === "") {
              if (currentEvent === "notification") {
                queryClient.invalidateQueries({
                  queryKey: notificationKeys.lists(),
                });
                queryClient.invalidateQueries({
                  queryKey: notificationKeys.unreadCount(),
                });
              }
              currentEvent = "";
            } else if (line.startsWith("event:")) {
              currentEvent = line.slice(6).trim();
            }
          }
        }

        if (!cancelled) scheduleRetry(token);
      } catch {
        if (!cancelled) scheduleRetry(token);
      }
    }

    function scheduleRetry(token: string) {
      retryTimerRef.current = setTimeout(() => connect(token), 5000);
    }

    function cleanup() {
      cancelled = true;
      abortRef.current?.abort();
      abortRef.current = null;
      if (retryTimerRef.current) {
        clearTimeout(retryTimerRef.current);
        retryTimerRef.current = null;
      }
    }

    connect(accessToken!);

    function handleVisibilityChange() {
      if (document.visibilityState === "visible") {
        if (retryTimerRef.current) clearTimeout(retryTimerRef.current);
        connect(accessToken!);
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      cleanup();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isAuthenticated, accessToken, queryClient]);
}
