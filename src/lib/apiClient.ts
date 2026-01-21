import { useAuthStore } from "@/store/useAuthStore";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"; // ✏️ 마지막 슬래시 제거

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

/**
 * API 요청 옵션
 */
interface RequestOptions extends RequestInit {
  requireAuth?: boolean;
}

/**
 * 토큰 재발급
 */
export async function reissueToken(): Promise<string | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/reissue`, {
      method: "POST",
      credentials: "include",
    });

    if (!response.ok) return null;

    const data = await response.json();
    return data.accessToken;
  } catch {
    return null;
  }
}

/**
 * 인증 토큰 가져오기
 */
export function getAuthToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }
  return useAuthStore.getState().accessToken;
}

/**
 * 세션 정보 가져오기 - store에서 직접 가져옴 (API 호출 X)
 */
export function getSession() {
  if (typeof window === "undefined") {
    return null;
  }

  const { accessToken, user, isAuthenticated } = useAuthStore.getState();

  if (!accessToken || !isAuthenticated) {
    return null;
  }

  return {
    user: user
      ? {
          id: user.id,
          email: user.email,
          name: user.name,
          user_metadata: { profileImage: user.profileImage },
        }
      : null,
    access_token: accessToken,
  };
}

/**
 * API 요청 함수
 */
export async function apiRequest<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { requireAuth = true, headers = {}, ...fetchOptions } = options;

  const { accessToken, setAccessToken, logout } = useAuthStore.getState();

  const requestHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...(headers as Record<string, string>),
  };

  // 인증이 필요한 경우 토큰 추가
  if (requireAuth && accessToken) {
    requestHeaders.Authorization = `Bearer ${accessToken}`;
  }

  const url = endpoint.startsWith("http")
    ? endpoint
    : `${API_BASE_URL}${endpoint}`;

  const fetchWithToken = async (token?: string): Promise<Response> => {
    if (token) {
      requestHeaders.Authorization = `Bearer ${token}`;
    }

    return fetch(url, {
      ...fetchOptions,
      headers: requestHeaders,
      credentials: "include",
    });
  };

  try {
    let response = await fetchWithToken();

    // ⭐ 401 에러 → 토큰 재발급 시도
    if (response.status === 401 && requireAuth) {
      const newToken = await reissueToken();

      if (newToken) {
        // 새 토큰 저장 & 재요청
        setAccessToken(newToken);
        response = await fetchWithToken(newToken);
      } else {
        // 재발급 실패 → 로그아웃
        logout();

        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }

        throw {
          message: "세션이 만료되었습니다.",
          status: 401,
        } as ApiError;
      }
    }

    // 응답 처리
    const contentType = response.headers.get("content-type");
    const isJson = contentType?.includes("application/json");

    if (!response.ok) {
      let errorMessage = "Request failed";
      let errorCode: string | undefined;

      if (isJson) {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
        errorCode = errorData.code;
      } else {
        errorMessage = (await response.text()) || errorMessage;
      }

      throw {
        message: errorMessage,
        status: response.status,
        code: errorCode,
      } as ApiError;
    }

    if (isJson) {
      return await response.json();
    }

    return (await response.text()) as T;
  } catch (error) {
    if (error && typeof error === "object" && "status" in error) {
      throw error;
    }
    throw {
      message: error instanceof Error ? error.message : "Network error",
      status: 0,
    } as ApiError;
  }
}

/**
 * GET 요청
 */
export async function apiGet<T>(
  endpoint: string,
  options?: RequestOptions
): Promise<T> {
  return apiRequest<T>(endpoint, {
    ...options,
    method: "GET",
  });
}

/**
 * POST 요청
 */
export async function apiPost<T>(
  endpoint: string,
  data?: unknown,
  options?: RequestOptions
): Promise<T> {
  return apiRequest<T>(endpoint, {
    ...options,
    method: "POST",
    body: data ? JSON.stringify(data) : undefined,
  });
}

/**
 * PUT 요청
 */
export async function apiPut<T>(
  endpoint: string,
  data?: unknown,
  options?: RequestOptions
): Promise<T> {
  return apiRequest<T>(endpoint, {
    ...options,
    method: "PUT",
    body: data ? JSON.stringify(data) : undefined,
  });
}

/**
 * PATCH 요청
 */
export async function apiPatch<T>(
  endpoint: string,
  data?: unknown,
  options?: RequestOptions
): Promise<T> {
  return apiRequest<T>(endpoint, {
    ...options,
    method: "PATCH",
    body: data ? JSON.stringify(data) : undefined,
  });
}

/**
 * DELETE 요청
 */
export async function apiDelete<T>(
  endpoint: string,
  options?: RequestOptions
): Promise<T> {
  return apiRequest<T>(endpoint, {
    ...options,
    method: "DELETE",
  });
}
