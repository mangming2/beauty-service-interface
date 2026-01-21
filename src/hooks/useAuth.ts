import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  logout as logoutApi,
  getSession,
  getUserProfile,
  updateProfile,
  createUserProfile,
  loginWithProvider,
} from "@/api/auth";
import { useAuthStore } from "@/store/useAuthStore";
import type { Profile } from "@/types/api";
import type { LogoutResponse, UpdateProfileRequest } from "@/types/api";

// Query Keys
export const authKeys = {
  all: ["auth"] as const,
  user: () => [...authKeys.all, "user"] as const,
  session: () => [...authKeys.all, "session"] as const,
  profile: (userId: string) => [...authKeys.all, "profile", userId] as const,
} as const;

// ========== 사용자 & 세션 조회 ==========

/**
 * 현재 사용자 정보 조회 (store에서)
 */
export function useUser() {
  const { user, isAuthenticated } = useAuthStore();

  return {
    data: user,
    isLoading: false,
    isAuthenticated,
    error: null,
  };
}

/**
 * 현재 세션 정보 조회 (store에서)
 */
export function useSession() {
  const session = getSession();

  return {
    data: session,
    isLoading: false,
    error: null,
  };
}

// ========== 프로필 조회 ==========

/**
 * 사용자 프로필 조회
 */
export function useUserProfile(userId?: string) {
  return useQuery<Profile | null>({
    queryKey: authKeys.profile(userId || ""),
    queryFn: async () => {
      if (!userId) {
        throw new Error("User ID is required");
      }
      return await getUserProfile(userId);
    },
    enabled: !!userId,
    staleTime: 10 * 60 * 1000,
  });
}

// ========== 로그인 ==========

/**
 * Google 로그인 시작
 */
export function useGoogleLogin() {
  return useMutation({
    mutationFn: async () => {
      loginWithProvider("google");
    },
    onError: (error: unknown) => {
      console.error("Google login error:", error);
    },
  });
}

/**
 * 소셜 로그인 (provider 선택 가능)
 */
export function useSocialLogin() {
  return useMutation({
    mutationFn: async (provider: "google" | "kakao" | "naver") => {
      loginWithProvider(provider);
    },
    onError: (error: unknown) => {
      console.error("Social login error:", error);
    },
  });
}

// ========== 로그아웃 ==========

/**
 * 로그아웃 Mutation
 */
export function useSignOut() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { logout: clearAuthStore } = useAuthStore();

  return useMutation<LogoutResponse, Error, void>({
    mutationFn: async () => {
      return await logoutApi();
    },
    onSuccess: () => {
      clearAuthStore();
      queryClient.removeQueries({ queryKey: authKeys.all });
      router.push("/login");
    },
    onError: (error: unknown) => {
      console.error("Sign out error:", error);
      // 에러가 발생해도 로컬 상태는 초기화
      clearAuthStore();
      queryClient.removeQueries({ queryKey: authKeys.all });
      router.push("/login");
    },
  });
}

// ========== 프로필 업데이트 ==========

/**
 * 프로필 업데이트 Mutation
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const { setUser } = useAuthStore();

  return useMutation<
    Profile,
    Error,
    { userId: string; profileData: UpdateProfileRequest }
  >({
    mutationFn: async ({ userId, profileData }) => {
      return await updateProfile(userId, profileData);
    },
    onSuccess: (data, variables) => {
      // 캐시 업데이트
      queryClient.setQueryData(authKeys.profile(variables.userId), data);

      // Zustand user 업데이트
      const currentUser = useAuthStore.getState().user;
      if (currentUser) {
        setUser({
          ...currentUser,
          name: variables.profileData.full_name,
        });
      }

      queryClient.invalidateQueries({
        queryKey: authKeys.profile(variables.userId),
      });
    },
    onError: (error: unknown) => {
      console.error("Profile update error:", error);
    },
  });
}

/**
 * 프로필 생성 Mutation
 */
export function useCreateProfile() {
  const queryClient = useQueryClient();

  return useMutation<
    Profile,
    Error,
    { id: string; user_metadata?: Record<string, unknown>; email?: string }
  >({
    mutationFn: async user => {
      return await createUserProfile(user);
    },
    onSuccess: (data, variables) => {
      queryClient.setQueryData(authKeys.profile(variables.id), data);
    },
    onError: (error: unknown) => {
      console.error("Profile creation error:", error);
    },
  });
}
