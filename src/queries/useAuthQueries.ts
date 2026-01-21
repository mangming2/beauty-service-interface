import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  logout as logoutApi,
  getSessionInfo,
  getUserProfile,
  updateProfile,
} from "@/api/auth";
import { useAuthStore } from "@/store/useAuthStore";
import type { User, Profile } from "@/types/api";
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
        const session = await getSessionInfo();
        return session?.user || null;
      } catch (error) {
        console.error("Get user error:", error);
        return null;
      }
    },
    staleTime: 5 * 60 * 1000,
    retry: (failureCount, error: unknown) => {
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

// 사용자 프로필 조회
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

// Google 로그인 시작
export function useGoogleLogin() {
  return useMutation({
    mutationFn: async () => {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
      window.location.href = `${API_BASE_URL}/auth/login/google`;
    },
    onError: (error: unknown) => {
      console.error("Google login error:", error);
    },
  });
}

// ⭐ 로그아웃 Mutation
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
      clearAuthStore();
    },
  });
}

// 프로필 업데이트 Mutation
export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const { setUser } = useAuthStore();

  return useMutation<
    Profile,
    Error,
    { userId: string; profileData: UpdateProfileRequest }
  >({
    mutationFn: async updates => {
      const { userId, profileData } = updates;
      return await updateProfile(userId, profileData);
    },
    onSuccess: (data, variables) => {
      queryClient.setQueryData(authKeys.profile(variables.userId), data);

      // ⭐ Zustand user 업데이트
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
