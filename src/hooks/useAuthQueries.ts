import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  apiGet,
  apiPost,
  apiPut,
  getSession as getSessionFromClient,
} from "@/lib/apiClient";
import type { User, Session, Profile } from "@/api/auth";
import type { LogoutResponse, UpdateProfileRequest } from "@/types/api";

// Query Keys
export const authKeys = {
  all: ["auth"] as const,
  user: () => [...authKeys.all, "user"] as const,
  session: () => [...authKeys.all, "session"] as const,
  profile: (userId: string) => [...authKeys.all, "profile", userId] as const,
} as const;

// 현재 사용자 정보 조회
export function useUser() {
  return useQuery<User | null>({
    queryKey: authKeys.user(),
    queryFn: async () => {
      try {
        const session = await getSessionFromClient();
        return session?.user || null;
      } catch (error) {
        console.error("Get user error:", error);
        return null;
      }
    },
    staleTime: 5 * 60 * 1000, // 5분
    retry: (failureCount, error: unknown) => {
      // 401 등 인증 에러는 재시도하지 않음
      if (
        error &&
        typeof error === "object" &&
        "status" in error &&
        (error as { status: number }).status === 401
      ) {
        return false;
      }
      return failureCount < 2;
    },
  });
}

// 현재 세션 정보 조회
export function useSession() {
  return useQuery<Session | null>({
    queryKey: authKeys.session(),
    queryFn: getSessionFromClient,
    staleTime: 5 * 60 * 1000, // 5분
  });
}

// 사용자 프로필 조회
export function useUserProfile(userId?: string) {
  return useQuery<Profile | null>({
    queryKey: authKeys.profile(userId || ""),
    queryFn: async () => {
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
    },
    enabled: !!userId, // userId가 있을 때만 실행
    staleTime: 10 * 60 * 1000, // 10분
  });
}

// Google 로그인 Mutation
export function useGoogleLogin() {
  return useMutation({
    mutationFn: async () => {
      // Google OAuth 로그인은 백엔드에서 처리하도록 리다이렉트
      const redirectUrl = `${window.location.origin}/auth/callback`;
      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

      window.location.href = `${apiUrl}/auth/google?redirect_uri=${encodeURIComponent(redirectUrl)}`;
    },
    onError: (error: unknown) => {
      console.error("Google login error:", error);
    },
  });
}

// 로그아웃 Mutation
export function useSignOut() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation<LogoutResponse, Error, void>({
    mutationFn: async () => {
      try {
        const response = await apiPost<LogoutResponse>("/auth/logout");
        return response;

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
    },
    onSuccess: () => {
      // 모든 auth 관련 캐시 제거
      queryClient.invalidateQueries({ queryKey: authKeys.all });
      // 또는 캐시 완전 제거
      queryClient.removeQueries({ queryKey: authKeys.all });

      router.push("/login");
    },
    onError: (error: unknown) => {
      console.error("Sign out error:", error);
    },
  });
}

// 프로필 업데이트 Mutation
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation<
    Profile,
    Error,
    { userId: string; profileData: UpdateProfileRequest }
  >({
    mutationFn: async (updates: {
      userId: string;
      profileData: UpdateProfileRequest;
    }) => {
      const { userId, profileData } = updates;

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
    },
    onSuccess: (data, variables) => {
      // 1. profiles 테이블 캐시 업데이트
      queryClient.setQueryData(authKeys.profile(variables.userId), data);

      // 2. auth.users 캐시 업데이트 (user_metadata 동기화)
      queryClient.setQueryData(authKeys.user(), (oldUser: User | null) => {
        if (!oldUser) return oldUser;
        return {
          ...oldUser,
          user_metadata: {
            ...oldUser.user_metadata,
            full_name: variables.profileData.full_name,
          },
        };
      });

      // 3. 세션 캐시도 업데이트 (세션에 user 정보가 포함되어 있음)
      queryClient.setQueryData(
        authKeys.session(),
        (oldSession: Session | null) => {
          if (!oldSession?.user) return oldSession;
          return {
            ...oldSession,
            user: {
              ...oldSession.user,
              user_metadata: {
                ...oldSession.user.user_metadata,
                full_name: variables.profileData.full_name,
              },
            },
          };
        }
      );

      // 4. 관련 쿼리들 무효화하여 최신 데이터 보장
      queryClient.invalidateQueries({
        queryKey: authKeys.profile(variables.userId),
      });
    },
    onError: (error: unknown) => {
      console.error("Profile update error:", error);
    },
  });
}

// 프로필 생성 함수 (내부 사용)
async function createUserProfile(user: {
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
    const existingProfile = await apiGet<Profile>(`/profiles/${user.id}`);

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
  } catch (error: unknown) {
    // 프로필이 없는 경우 생성
    if (
      error &&
      typeof error === "object" &&
      "status" in error &&
      (error as { status: number }).status === 404
    ) {
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
    }
    throw error;
  }
}

// Auth Callback 처리를 위한 Hook
export function useAuthCallback() {
  const router = useRouter();

  return useQuery({
    queryKey: [...authKeys.all, "callback"],
    queryFn: async () => {
      // 1. 세션 확인
      const session = await getSessionFromClient();

      if (!session) {
        setTimeout(() => router.push("/login"), 0);
        return { success: false, redirectTo: "/login" };
      }

      // 2. 사용자 정보 가져오기
      const user = session.user;

      if (!user) {
        setTimeout(() => router.push("/login"), 0);
        return { success: false, redirectTo: "/login" };
      }

      // 3. 프로필 자동 생성 (Google 로그인 시)
      try {
        console.log("Creating profile for user:", user.id);
        await createUserProfile(user);
        console.log("Profile created successfully in callback");
      } catch (error) {
        console.error("Failed to create profile in callback:", error);
        // 프로필 생성 실패해도 로그인은 계속 진행
      }

      setTimeout(() => router.push("/"), 0);
      return { success: true, redirectTo: "/" };
    },
    staleTime: 0, // 항상 새로 실행
    gcTime: 0, // 캐시하지 않음
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: false, // 실패 시 재시도하지 않음
  });
}

// 실시간 인증 상태 변경 감지를 위한 Hook
export function useAuthStateListener() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useQuery({
    queryKey: [...authKeys.all, "listener"],
    queryFn: () => {
      // 주기적으로 세션 확인 (간단한 구현)
      let authStateListeners: Array<
        (
          event:
            | "SIGNED_IN"
            | "SIGNED_OUT"
            | "TOKEN_REFRESHED"
            | "USER_UPDATED",
          session: Session | null
        ) => void
      > = [];

      const callback = async (
        event: "SIGNED_IN" | "SIGNED_OUT" | "TOKEN_REFRESHED" | "USER_UPDATED",
        session: Session | null
      ) => {
        console.log("Auth state changed:", event, session);

        // 캐시 업데이트
        queryClient.setQueryData(authKeys.session(), session);
        queryClient.setQueryData(authKeys.user(), session?.user || null);

        if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
          console.log("User signed in:", session?.user);
          // 사용자 관련 데이터 refetch
          queryClient.invalidateQueries({ queryKey: authKeys.all });

          // Google 로그인 시 프로필 자동 생성
          if (session?.user) {
            console.log("Calling createUserProfile for user:", session.user.id);
            createUserProfile(session.user)
              .then(result => {
                console.log("Profile created successfully:", result);
              })
              .catch(error => {
                console.error("Failed to create profile:", error);
              });
          }
        } else if (event === "SIGNED_OUT") {
          console.log("User signed out");
          // 모든 auth 캐시 제거
          queryClient.removeQueries({ queryKey: authKeys.all });
          // setTimeout을 사용하여 렌더링 사이클 밖에서 라우팅 실행
          setTimeout(() => {
            router.push("/login");
          }, 0);
        }
      };

      authStateListeners.push(callback);

      // 주기적으로 세션 확인
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

      // cleanup function 반환
      return () => {
        authStateListeners = authStateListeners.filter(
          listener => listener !== callback
        );
        clearInterval(checkInterval);
      };
    },
    staleTime: Infinity, // 한 번만 설정
    gcTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}
