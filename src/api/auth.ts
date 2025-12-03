import {
  apiGet,
  apiPost,
  apiPut,
  getSession as getSessionFromClient,
} from "@/lib/apiClient";
import type {
  LoginResponse,
  LogoutResponse,
  UpdateProfileRequest,
  User,
  Session,
  Profile,
  AuthChangeEvent,
} from "@/types/api";

// ========== 인증 API ==========

/**
 * Google 로그인 시작
 * POST /auth/login 호출하여 accessToken 받기
 */
export async function login(): Promise<LoginResponse> {
  try {
    const response = await apiPost<LoginResponse>("/auth/login", undefined, {
      requireAuth: false,
    });
    return response;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
}

/**
 * 토큰 검증 및 최종 토큰 발급
 * POST /auth/verify 호출하여 최종 accessToken 받기
 */
export async function verifyToken(accessToken: string): Promise<{
  accessToken: string;
  [key: string]: unknown;
}> {
  try {
    const response = await apiPost<{
      accessToken: string;
      [key: string]: unknown;
    }>("/auth/verify", undefined, {
      requireAuth: false,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response;
  } catch (error) {
    console.error("Token verification error:", error);
    throw error;
  }
}

/**
 * 로그아웃
 * POST /auth/logout 호출
 */
export async function logout(): Promise<LogoutResponse> {
  try {
    const response = await apiPost<LogoutResponse>("/auth/logout");

    // 로컬 스토리지에서 토큰 제거
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
    }

    return response;
  } catch (error) {
    console.error("Sign out error:", error);
    // 에러가 발생해도 토큰은 제거
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
    }
    throw error;
  }
}

/**
 * 세션 정보 조회
 * GET /auth/session 호출
 */
export async function getSession(): Promise<Session | null> {
  return await getSessionFromClient();
}

/**
 * 사용자 정보 조회
 */
export async function getUser(): Promise<User | null> {
  try {
    const session = await getSession();
    return session?.user || null;
  } catch (error) {
    console.error("Get user error:", error);
    return null;
  }
}

// ========== 프로필 API ==========

/**
 * 사용자 프로필 조회
 * GET /profiles/:userId 호출
 */
export async function getUserProfile(userId: string): Promise<Profile | null> {
  if (!userId) {
    throw new Error("User ID is required");
  }

  try {
    const data = await apiGet<Profile>(`/profiles/${userId}`);
    return data;
  } catch (error: unknown) {
    if (
      error &&
      typeof error === "object" &&
      "status" in error &&
      (error as { status: number }).status === 404
    ) {
      return null;
    }
    throw error;
  }
}

/**
 * 프로필 생성
 * POST /profiles 호출
 */
export async function createProfile(profileData: {
  id: string;
  full_name?: string;
  avatar_src?: string | null;
  created_at: string;
  updated_at: string;
}): Promise<Profile> {
  try {
    const data = await apiPost<Profile>("/profiles", profileData);
    console.log("Profile created successfully:", data);
    return data;
  } catch (error) {
    console.error("Error creating profile:", error);
    throw error;
  }
}

/**
 * 프로필 업데이트
 * PUT /profiles/:userId 호출
 */
export async function updateProfile(
  userId: string,
  profileData: UpdateProfileRequest
): Promise<Profile> {
  try {
    const requestData: UpdateProfileRequest = {
      ...profileData,
      updated_at: new Date().toISOString(),
    };
    const data = await apiPut<Profile>(`/profiles/${userId}`, requestData);
    return data;
  } catch (error) {
    throw error;
  }
}

/**
 * Google 로그인 후 프로필 자동 생성/업데이트
 * 기존 프로필이 있으면 업데이트, 없으면 생성
 */
export async function createUserProfile(user: {
  id: string;
  user_metadata?: Record<string, unknown>;
  email?: string;
}): Promise<Profile> {
  if (!user) {
    throw new Error("User is required");
  }

  // 디버깅: Google에서 받아온 데이터 확인
  console.log("User metadata during profile creation:", user.user_metadata);
  console.log("User object:", user);

  // 기존 프로필이 있는지 확인
  try {
    const existingProfile = await getUserProfile(user.id);

    if (existingProfile) {
      // avatar_src가 없거나 null인 경우 업데이트
      if (
        !existingProfile.avatar_src &&
        (user.user_metadata?.avatar_url ||
          user.user_metadata?.picture ||
          user.user_metadata?.picture_url)
      ) {
        const updatedProfileData: UpdateProfileRequest = {
          avatar_src: (user.user_metadata?.avatar_url ||
            user.user_metadata?.picture ||
            user.user_metadata?.picture_url) as string | undefined,
          updated_at: new Date().toISOString(),
        };

        try {
          const data = await updateProfile(user.id, updatedProfileData);
          return data;
        } catch (error) {
          console.error("Error updating profile avatar:", error);
          return existingProfile;
        }
      }

      return existingProfile;
    }
  } catch (error: unknown) {
    // 프로필이 없는 경우 (404 에러)
    if (
      error &&
      typeof error === "object" &&
      "status" in error &&
      (error as { status: number }).status !== 404
    ) {
      throw error;
    }
  }

  // 프로필이 없는 경우 생성
  const profileData = {
    id: user.id,
    full_name: (user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      user.email?.split("@")[0] ||
      "User") as string,
    avatar_src: (user.user_metadata?.avatar_url ||
      user.user_metadata?.picture ||
      user.user_metadata?.picture_url ||
      (user.email
        ? `https://www.gravatar.com/avatar/${user.email}?d=identicon`
        : null)) as string | null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  return await createProfile(profileData);
}

// ========== 기타 유틸리티 ==========

/**
 * 기존 사용자들의 avatar_src 업데이트 (관리자용)
 */
export async function updateExistingUserAvatars() {
  try {
    // 백엔드 API로 대체 필요 (현재는 클라이언트에서 직접 처리 불가)
    console.log(
      "updateExistingUserAvatars: This function needs backend implementation"
    );
    return {
      updated: 0,
      message: "This function needs backend implementation",
    };
  } catch (error) {
    console.error("Error updating existing user avatars:", error);
    throw error;
  }
}

/**
 * 인증 상태 변경 리스너 설정 (일반 백엔드에서는 폴링 또는 WebSocket 사용)
 */
let authStateListeners: Array<
  (event: AuthChangeEvent, session: Session | null) => void
> = [];

export function onAuthStateChange(
  callback: (event: AuthChangeEvent, session: Session | null) => void
) {
  authStateListeners.push(callback);

  // 주기적으로 세션 확인 (간단한 구현)
  const checkInterval = setInterval(async () => {
    try {
      const session = await getSessionFromClient();
      if (session) {
        callback("TOKEN_REFRESHED", session);
      } else {
        callback("SIGNED_OUT", null);
      }
    } catch {
      callback("SIGNED_OUT", null);
    }
  }, 30000); // 30초마다 확인

  return {
    unsubscribe: () => {
      authStateListeners = authStateListeners.filter(
        listener => listener !== callback
      );
      clearInterval(checkInterval);
    },
  };
}

// ========== 하위 호환성을 위한 별칭 ==========
// 기존 코드와의 호환성을 위해 유지
export const signOut = logout;
export const getSessionInfo = getSession;
