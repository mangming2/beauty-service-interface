import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import {
  verifyToken,
  logout as logoutApi,
  getSessionInfo,
  getUserProfile,
  updateProfile,
  createUserProfile,
} from "@/api/auth";
import { useAuthStore } from "@/store/useAuthStore";
import type { User, Session, Profile } from "@/types/api";
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

// 현재 세션 정보 조회
export function useSession() {
  return useQuery<Session | null>({
    queryKey: authKeys.session(),
    queryFn: getSessionInfo,
    staleTime: 5 * 60 * 1000,
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

// ⭐ Auth Callback 처리 (수정됨)
export function useAuthCallback() {
  const router = useRouter();
  const { login } = useAuthStore();

  return useQuery({
    queryKey: [...authKeys.all, "callback"],
    queryFn: async () => {
      if (typeof window === "undefined") {
        return { success: false, redirectTo: "/login" };
      }

      const urlParams = new URLSearchParams(window.location.search);
      const accessToken = urlParams.get("accessToken");

      if (!accessToken) {
        setTimeout(() => router.push("/login"), 0);
        return { success: false, redirectTo: "/login" };
      }

      try {
        // 검증 API 호출
        const data = await verifyToken(accessToken);

        if (!data.accessToken) {
          setTimeout(() => router.push("/login"), 0);
          return { success: false, redirectTo: "/login" };
        }

        // 세션 확인
        const session = await getSessionInfo();

        if (!session?.user) {
          setTimeout(() => router.push("/login"), 0);
          return { success: false, redirectTo: "/login" };
        }

        // ⭐ Zustand에 토큰 + user 한 번에 저장
        login(data.accessToken, {
          id: session.user.id,
          email: session.user.email || "",
          // name: session.user.user_metadata?.full_name,
          // profileImage: session.user.user_metadata?.avatar_url,
        });

        // 프로필 자동 생성
        try {
          await createUserProfile(session.user);
        } catch (error) {
          console.error("Failed to create profile:", error);
        }

        setTimeout(() => router.push("/"), 0);
        return { success: true, redirectTo: "/" };
      } catch (error) {
        console.error("Auth callback error:", error);
        setTimeout(() => router.push("/login"), 0);
        return { success: false, redirectTo: "/login" };
      }
    },
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: false,
  });
}
// ⭐ 실시간 인증 상태 변경 감지 (수정됨)
export function useAuthStateListener() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const pathname = usePathname();
  const { logout: clearAuthStore, setUser } = useAuthStore(); // ⭐ setAccessToken 제거

  useEffect(() => {
    const publicPages = ["/", "/login", "/auth/callback"];
    const isPublicPage = publicPages.includes(pathname);

    const syncAuthState = (session: Session | null) => {
      queryClient.setQueryData(authKeys.session(), session);
      queryClient.setQueryData(authKeys.user(), session?.user || null);

      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || "",
          // name: session.user.user_metadata?.full_name,
          // profileImage: session.user.user_metadata?.avatar_url,
        });
      }
    };

    const handleSignedOut = () => {
      clearAuthStore();
      queryClient.removeQueries({ queryKey: authKeys.all });

      if (!isPublicPage) {
        setTimeout(() => router.push("/login"), 0);
      }
    };

    // 주기적으로 세션 확인
    const checkInterval = setInterval(async () => {
      try {
        const session = await getSessionInfo();
        if (session) {
          syncAuthState(session);
        } else if (!isPublicPage) {
          handleSignedOut();
        }
      } catch {
        if (!isPublicPage) {
          handleSignedOut();
        }
      }
    }, 30000);

    return () => clearInterval(checkInterval);
  }, [queryClient, router, pathname, clearAuthStore, setUser]); // ⭐ setAccessToken 제거
}
