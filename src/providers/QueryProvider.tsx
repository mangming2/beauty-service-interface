"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";
import { ApiError } from "@/lib/apiClient";

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // 기본 설정: 데이터가 5분간 fresh하게 유지
            staleTime: 5 * 60 * 1000, // 5분
            // 캐시된 데이터가 30분간 메모리에 유지
            gcTime: 30 * 60 * 1000, // 30분 (구 cacheTime)
            // 에러 발생 시 재시도 설정
            retry: (failureCount, error: ApiError) => {
              // 401, 403 등 인증 관련 에러는 재시도하지 않음
              if (error?.status === 401 || error?.status === 403) {
                return false;
              }
              // 최대 3번까지 재시도
              return failureCount < 3;
            },
            // 윈도우가 다시 포커스될 때 자동 refetch
            refetchOnWindowFocus: true,
            // 네트워크 재연결 시 자동 refetch
            refetchOnReconnect: true,
          },
          mutations: {
            // 뮤테이션 에러 시 재시도 설정
            retry: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* 개발 모드에서만 DevTools 표시 */}
      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}
