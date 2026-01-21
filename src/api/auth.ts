import { apiGet, apiPost, apiPut, getSession } from "@/lib/apiClient";
import { useAuthStore } from "@/store/useAuthStore";
import type {
  LogoutResponse,
  UpdateProfileRequest,
  User,
  Profile,
} from "@/types/api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

// ========== 인증 API ==========

/**
 * 소셜 로그인 시작
 * 백엔드 GET /auth/login/{provider}로 리다이렉트
 */
export function loginWithProvider(provider: "google" | "kakao" | "naver") {
  if (typeof window !== "undefined") {
    window.location.href = `${API_BASE_URL}/auth/login/${provider}`;
  }
}

/**
 * Google 로그인 (기존 호환용)
 */
export function login() {
  loginWithProvider("google");
}

/**
 * 로그아웃
 * POST /auth/logout 호출 + store 초기화
 */
export async function logout(): Promise<LogoutResponse> {
  try {
    const response = await apiPost<LogoutResponse>("/auth/logout", undefined, {
      requireAuth: false,
    });

    // store 초기화
    useAuthStore.getState().logout();

    return response;
  } catch (error) {
    console.error("Sign out error:", error);
    // 에러가 발생해도 store는 초기화
    useAuthStore.getState().logout();
    throw error;
  }
}

/**
 * 사용자 정보 조회 (store에서 가져옴)
 */
export function getUser(): User | null {
  const session = getSession();
  return session?.user as User | null;
}

/**
 * 현재 사용자 정보 조회 (store에서)
 */
export function getCurrentUser(): User | null {
  const { user } = useAuthStore.getState();
  return user;
}

/**
 * 인증 상태 확인
 */
export function isAuthenticated(): boolean {
  const { isAuthenticated, accessToken } = useAuthStore.getState();
  return isAuthenticated && !!accessToken;
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
 * 소셜 로그인 후 프로필 자동 생성/업데이트
 */
export async function createUserProfile(user: {
  id: string;
  user_metadata?: Record<string, unknown>;
  email?: string;
}): Promise<Profile> {
  if (!user) {
    throw new Error("User is required");
  }

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

// ========== 하위 호환성을 위한 별칭 ==========
export const signOut = logout;
export const getSessionInfo = getSession;
export { getSession };
