/**
 * 일반 백엔드 API 클라이언트
 * 인증 토큰을 자동으로 포함하여 API 요청을 처리합니다.
 */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

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
 * 인증 토큰 가져오기 (쿠키 또는 로컬 스토리지에서)
 */
function getAuthToken(): string | null {
  if (typeof window === "undefined") {
    // 서버 사이드에서는 쿠키에서 가져오기 (middleware에서 사용)
    return null;
  }

  // 먼저 로컬 스토리지에서 토큰 가져오기
  const token = localStorage.getItem("auth_token");
  if (token) {
    return token;
  }

  // 로컬 스토리지에 없으면 쿠키에서 가져오기
  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split("=");
    if (name === "auth_token" && value) {
      // 쿠키에서 찾은 토큰을 로컬 스토리지에도 저장
      localStorage.setItem("auth_token", value);
      return value;
    }
  }

  return null;
}

/**
 * 세션 정보 가져오기
 */
export async function getSession(): Promise<{
  user: { id: string; email?: string; user_metadata?: Record<string, unknown> };
  access_token?: string;
  expires_at?: number;
} | null> {
  const token = getAuthToken();
  if (!token) {
    return null;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/auth/session`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    });

    if (!response.ok) {
      if (response.status === 401) {
        // 토큰이 유효하지 않으면 제거
        localStorage.removeItem("auth_token");
        return null;
      }
      throw new Error("Failed to get session");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Get session error:", error);
    return null;
  }
}

/**
 * API 요청 함수
 */
export async function apiRequest<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { requireAuth = true, headers = {}, ...fetchOptions } = options;

  const requestHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...(headers as Record<string, string>),
  };

  // 인증이 필요한 경우 토큰 추가
  if (requireAuth) {
    const token = getAuthToken();
    if (token) {
      requestHeaders.Authorization = `Bearer ${token}`;
    }
  }

  const url = endpoint.startsWith("http")
    ? endpoint
    : `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers: requestHeaders,
      credentials: "include",
    });

    // 응답이 JSON이 아닌 경우 처리
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

      const error: ApiError = {
        message: errorMessage,
        status: response.status,
        code: errorCode,
      };

      // 401 에러인 경우 토큰 제거
      if (response.status === 401) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("auth_token");
        }
      }

      throw error;
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
