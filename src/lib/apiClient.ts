import { useAuthStore } from "@/store/useAuthStore";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"; // ✏️ 마지막 슬래시 제거

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

/** 로그인 없이 접근 가능한 경로 (middleware / ProtectedLayout과 동기화) */
const PUBLIC_PATHS = ["/", "/login", "/auth/callback", "/recommend", "/board"];
const isPackageDetailPath = (path: string) => /^\/package\/[^/]+$/.test(path);
const isPackageReviewsPath = (path: string) =>
  /^\/package\/[^/]+\/reviews$/.test(path);
const isBoardNoticeDetailPath = (path: string) =>
  /^\/board\/notice\/[^/]+$/.test(path);

function isPublicPath(pathname: string): boolean {
  return (
    PUBLIC_PATHS.includes(pathname) ||
    isPackageDetailPath(pathname) ||
    isPackageReviewsPath(pathname) ||
    isBoardNoticeDetailPath(pathname)
  );
}

/** 세션 만료 시 로그인으로 보낼지 여부. 공개 페이지면 리다이렉트하지 않음 */
function shouldRedirectToLogin(): boolean {
  if (typeof window === "undefined") return false;
  return !isPublicPath(window.location.pathname);
}

/**
 * API 요청 옵션
 */
export interface RequestOptions extends RequestInit {
  requireAuth?: boolean;
  /**
   * true면 토큰이 있을 때만 Bearer를 붙이고, 없으면 익명 요청.
   * 401 시 토큰이 있었을 때만 재발급·재시도한다(비로그인 401은 그대로 에러).
   */
  optionalAuth?: boolean;
}

/**
 * 토큰 재발급
 * refreshToken 쿠키(credentials: 'include')로 POST /auth/reissue 호출 후 새 accessToken 반환
 */
export async function reissueToken(): Promise<string | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/reissue`, {
      method: "POST",
      credentials: "include", // refreshToken 쿠키 전송
    });

    if (!response.ok) {
      const text = await response.text();
      // 404 USER_NOT_FOUND: refresh 토큰에 해당하는 사용자가 없음(삭제/만료 등) → 로그아웃 처리
      if (response.status === 404) {
        try {
          const data = JSON.parse(text || "{}");
          if (data.errorCode === "USER_NOT_FOUND") {
            useAuthStore.getState().logout();
            if (process.env.NODE_ENV === "development") {
              console.info("[reissue] 사용자 없음(404), 로그아웃 처리됨");
            }
            return null;
          }
        } catch {
          useAuthStore.getState().logout();
        }
      }
      if (process.env.NODE_ENV === "development" && response.status !== 404) {
        console.warn(
          "[reissue] 재발급 실패:",
          response.status,
          text || response.statusText
        );
      }
      return null;
    }

    const data = await response.json();
    // 백엔드 스펙: accessToken 또는 access_token
    const token = data.accessToken ?? data.access_token ?? null;
    return token;
  } catch (e) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[reissue] 요청 실패:", e);
    }
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
  const {
    requireAuth: requireAuthOption,
    optionalAuth = false,
    headers = {},
    ...fetchOptions
  } = options;

  const isOptionalAuth = optionalAuth === true;
  const requireAuthStrict = !isOptionalAuth && (requireAuthOption ?? true);

  const { accessToken, setAccessToken, logout } = useAuthStore.getState();
  const hadAccessToken = !!accessToken;

  const requestHeaders: Record<string, string> = {
    ...(headers as Record<string, string>),
  };

  // body가 있을 때만 JSON Content-Type을 기본으로 설정한다.
  // GET 요청까지 Content-Type을 강제로 넣으면 preflight가 발생해 CORS 실패 가능성이 커진다.
  const hasBody = fetchOptions.body !== undefined && fetchOptions.body !== null;
  const isFormData =
    typeof FormData !== "undefined" && fetchOptions.body instanceof FormData;
  const hasContentTypeHeader = Object.keys(requestHeaders).some(
    key => key.toLowerCase() === "content-type"
  );
  if (hasBody && !isFormData && !hasContentTypeHeader) {
    requestHeaders["Content-Type"] = "application/json";
  }

  // strict: 토큰 있을 때만 Bearer / optional: 토큰 있으면 Bearer
  if ((requireAuthStrict || isOptionalAuth) && accessToken) {
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
      credentials: requireAuthStrict || isOptionalAuth ? "include" : "omit",
      redirect: "manual", // 302 OAuth 리다이렉트 시 CORS 에러 방지
    });
  };

  try {
    let response = await fetchWithToken();

    // ⭐ 리다이렉트 응답 (백엔드가 OAuth로 보냄) → 세션 만료로 간주
    const isRedirect =
      response.type === "opaqueredirect" ||
      response.status === 301 ||
      response.status === 302 ||
      response.status === 303 ||
      response.status === 307 ||
      response.status === 308;
    const treatRedirectAsSessionLoss =
      requireAuthStrict || (isOptionalAuth && hadAccessToken);
    if (isRedirect && treatRedirectAsSessionLoss) {
      logout();
      if (
        typeof window !== "undefined" &&
        (requireAuthStrict || shouldRedirectToLogin())
      ) {
        window.location.href = "/login";
      }
      throw {
        message: "세션이 만료되었습니다.",
        status: 401,
      } as ApiError;
    }

    // ⭐ 401 에러 → 토큰 재발급 시도 (엄격 인증 또는 optional이지만 토큰을 보낸 경우)
    const shouldTryReissueOn401 =
      response.status === 401 &&
      (requireAuthStrict || (isOptionalAuth && hadAccessToken));
    if (shouldTryReissueOn401) {
      const newToken = await reissueToken();

      if (newToken) {
        // 새 토큰 저장 & 재요청
        setAccessToken(newToken);
        response = await fetchWithToken(newToken);
      } else {
        // 재발급 실패 → 로그아웃
        logout();

        if (
          typeof window !== "undefined" &&
          (requireAuthStrict || shouldRedirectToLogin())
        ) {
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
