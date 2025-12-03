import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import {
  login,
  verifyToken,
  logout,
  getSessionInfo,
  getUserProfile,
  updateProfile,
  createUserProfile,
} from "@/api/auth";
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
        const session = await getSessionInfo();
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
    queryFn: getSessionInfo,
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
      return await getUserProfile(userId);
    },
    enabled: !!userId, // userId가 있을 때만 실행
    staleTime: 10 * 60 * 1000, // 10분
  });
}

// Google 로그인 Mutation
export function useGoogleLogin() {
  return useMutation({
    mutationFn: async () => {
      // POST /auth/login API 호출
      const redirectUrl = `${window.location.origin}/auth/callback`;
      const data = await login();

      // accessToken을 쿼리 파라미터로 콜백 URL에 전달
      const callbackUrl = `${redirectUrl}?accessToken=${encodeURIComponent(data.accessToken)}`;
      window.location.href = callbackUrl;
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
      return await logout();
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
      return await updateProfile(userId, profileData);
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

// Auth Callback 처리를 위한 Hook
export function useAuthCallback() {
  const router = useRouter();

  return useQuery({
    queryKey: [...authKeys.all, "callback"],
    queryFn: async () => {
      // URL에서 accessToken 가져오기
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
        // 검증 API 호출 (Refresh Token은 쿠키로 자동 설정됨)
        const data = await verifyToken(accessToken);

        // 최종 accessToken 저장
        if (data.accessToken && typeof window !== "undefined") {
          localStorage.setItem("auth_token", data.accessToken);
          document.cookie = `auth_token=${data.accessToken}; path=/; max-age=86400; SameSite=Lax`;
        }

        // 세션 확인
        const session = await getSessionInfo();

        if (!session) {
          setTimeout(() => router.push("/login"), 0);
          return { success: false, redirectTo: "/login" };
        }

        // 사용자 정보 가져오기
        const user = session.user;

        if (!user) {
          setTimeout(() => router.push("/login"), 0);
          return { success: false, redirectTo: "/login" };
        }

        // 프로필 자동 생성 (Google 로그인 시)
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
      } catch (error) {
        console.error("Auth callback error:", error);
        setTimeout(() => router.push("/login"), 0);
        return { success: false, redirectTo: "/login" };
      }
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
  const pathname = usePathname();

  useEffect(() => {
    // 공개 페이지 목록 (리다이렉트하지 않음)
    const publicPages = ["/", "/login", "/auth/callback"];
    const isPublicPage = publicPages.includes(pathname);

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

        // 공개 페이지가 아닐 때만 리다이렉트
        if (!isPublicPage) {
          // setTimeout을 사용하여 렌더링 사이클 밖에서 라우팅 실행
          setTimeout(() => {
            router.push("/login");
          }, 0);
        }
      }
    };

    // 주기적으로 세션 확인
    const checkInterval = setInterval(async () => {
      try {
        const session = await getSessionInfo();
        if (session) {
          callback("TOKEN_REFRESHED", session);
        } else {
          // 공개 페이지가 아닐 때만 SIGNED_OUT 이벤트 발생 (리다이렉트 포함)
          if (!isPublicPage) {
            callback("SIGNED_OUT", null);
          } else {
            // 공개 페이지에서는 캐시만 업데이트 (리다이렉트 없음)
            queryClient.setQueryData(authKeys.session(), null);
            queryClient.setQueryData(authKeys.user(), null);
          }
        }
      } catch {
        // 에러 발생 시에도 공개 페이지가 아닐 때만 SIGNED_OUT 처리
        if (!isPublicPage) {
          callback("SIGNED_OUT", null);
        } else {
          // 공개 페이지에서는 캐시만 업데이트
          queryClient.setQueryData(authKeys.session(), null);
          queryClient.setQueryData(authKeys.user(), null);
        }
      }
    }, 30000); // 30초마다 확인

    // cleanup function
    return () => {
      clearInterval(checkInterval);
    };
  }, [queryClient, router, pathname]);
}
