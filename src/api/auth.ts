import {
  apiGet,
  apiPost,
  apiPut,
  getSession as getSessionFromClient,
} from "@/lib/apiClient";

// 타입 정의
export interface User {
  id: string;
  email?: string;
  user_metadata?: Record<string, unknown>;
}

export interface Session {
  user: User;
  access_token?: string;
  expires_at?: number;
}

export interface Profile {
  id: string;
  full_name?: string;
  phone?: string;
  birth_date?: string;
  avatar_src?: string;
  created_at?: string;
  updated_at?: string;
}

export type AuthChangeEvent =
  | "SIGNED_IN"
  | "SIGNED_OUT"
  | "TOKEN_REFRESHED"
  | "USER_UPDATED";

// 사용자 정보 조회
export const getUser = async (): Promise<User | null> => {
  try {
    const session = await getSession();
    return session?.user || null;
  } catch (error) {
    console.error("Get user error:", error);
    return null;
  }
};

// 세션 정보 조회
export const getSession = async (): Promise<Session | null> => {
  return await getSessionFromClient();
};

// 사용자 프로필 조회
export const getUserProfile = async (
  userId: string
): Promise<Profile | null> => {
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
};

// Google 로그인 후 프로필 자동 생성
export const createUserProfile = async (user: {
  id: string;
  user_metadata?: Record<string, unknown>;
  email?: string;
}): Promise<Profile> => {
  if (!user) {
    throw new Error("User is required");
  }

  // 디버깅: Google에서 받아온 데이터 확인
  console.log("User metadata during profile creation:", user.user_metadata);
  console.log("User object:", user);

  // 기존 프로필이 있는지 확인
  const existingProfile = await getUserProfile(user.id);
  if (existingProfile) {
    // avatar_src가 없거나 null인 경우 업데이트
    if (
      !existingProfile.avatar_src &&
      (user.user_metadata?.avatar_url ||
        user.user_metadata?.picture ||
        user.user_metadata?.picture_url)
    ) {
      const updatedProfileData = {
        avatar_src:
          user.user_metadata?.avatar_url ||
          user.user_metadata?.picture ||
          user.user_metadata?.picture_url,
        updated_at: new Date().toISOString(),
      };

      try {
        const data = await apiPut<Profile>(
          `/profiles/${user.id}`,
          updatedProfileData
        );
        return data;
      } catch (error) {
        console.error("Error updating profile avatar:", error);
        return existingProfile;
      }
    }

    return existingProfile;
  }

  // Google 프로필 정보 추출
  const profileData = {
    id: user.id,
    full_name:
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      user.email?.split("@")[0] ||
      "User",
    avatar_src:
      user.user_metadata?.avatar_url ||
      user.user_metadata?.picture ||
      user.user_metadata?.picture_url ||
      (user.email
        ? `https://www.gravatar.com/avatar/${user.email}?d=identicon`
        : null),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  try {
    const data = await apiPost<Profile>("/profiles", profileData);
    console.log("Profile created successfully:", data);
    return data;
  } catch (error) {
    console.error("Error creating profile:", error);
    throw error;
  }
};

// Google OAuth 로그인
export const signInWithGoogle = async (): Promise<void> => {
  // Google OAuth 로그인은 백엔드에서 처리하도록 리다이렉트
  const redirectUrl = `${window.location.origin}/auth/callback`;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

  window.location.href = `${apiUrl}/auth/google?redirect_uri=${encodeURIComponent(redirectUrl)}`;
};

// 로그아웃
export const signOut = async (): Promise<void> => {
  try {
    await apiPost("/auth/logout");

    // 로컬 스토리지에서 토큰 제거
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
    }
  } catch (error) {
    console.error("Sign out error:", error);
    // 에러가 발생해도 토큰은 제거
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
    }
    throw error;
  }
};

// 프로필 업데이트
export const updateProfile = async (
  userId: string,
  profileData: Record<string, unknown>
): Promise<Profile> => {
  try {
    const data = await apiPut<Profile>(`/profiles/${userId}`, {
      ...profileData,
      updated_at: new Date().toISOString(),
    });
    return data;
  } catch (error) {
    throw error;
  }
};

// 기존 사용자들의 avatar_src 업데이트 (관리자용)
export const updateExistingUserAvatars = async () => {
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
};

// 인증 상태 변경 리스너 설정 (일반 백엔드에서는 폴링 또는 WebSocket 사용)
let authStateListeners: Array<
  (event: AuthChangeEvent, session: Session | null) => void
> = [];

export const onAuthStateChange = (
  callback: (event: AuthChangeEvent, session: Session | null) => void
) => {
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
};
