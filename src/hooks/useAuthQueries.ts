import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  getUser,
  getSession,
  getUserProfile,
  signInWithGoogle,
  signOut,
  updateProfile,
  onAuthStateChange,
} from "@/api/auth";

// Query Keys
export const authKeys = {
  all: ["auth"] as const,
  user: () => [...authKeys.all, "user"] as const,
  session: () => [...authKeys.all, "session"] as const,
  profile: (userId: string) => [...authKeys.all, "profile", userId] as const,
} as const;

// 현재 사용자 정보 조회
export function useUser() {
  return useQuery({
    queryKey: authKeys.user(),
    queryFn: getUser,
    staleTime: 5 * 60 * 1000, // 5분
    retry: (failureCount, error: unknown) => {
      // 401 등 인증 에러는 재시도하지 않음
      if ((error as { status?: number })?.status === 401) {
        return false;
      }
      return failureCount < 2;
    },
  });
}

// 현재 세션 정보 조회
export function useSession() {
  return useQuery({
    queryKey: authKeys.session(),
    queryFn: getSession,
    staleTime: 5 * 60 * 1000, // 5분
  });
}

// 사용자 프로필 조회
export function useUserProfile(userId?: string) {
  return useQuery({
    queryKey: authKeys.profile(userId || ""),
    queryFn: () => getUserProfile(userId!),
    enabled: !!userId, // userId가 있을 때만 실행
    staleTime: 10 * 60 * 1000, // 10분
  });
}

// Google 로그인 Mutation
export function useGoogleLogin() {
  return useMutation({
    mutationFn: signInWithGoogle,
    onError: (error: unknown) => {
      console.error("Google login error:", error);
    },
  });
}

// 로그아웃 Mutation
export function useSignOut() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: signOut,
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

  return useMutation({
    mutationFn: async (updates: {
      userId: string;
      profileData: Record<string, unknown>;
    }) => {
      const { userId, profileData } = updates;
      return await updateProfile(userId, profileData);
    },
    onSuccess: (data, variables) => {
      // 해당 사용자의 프로필 캐시 업데이트
      queryClient.setQueryData(authKeys.profile(variables.userId), data);

      // 또는 프로필 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: authKeys.profile(variables.userId),
      });
    },
    onError: (error: unknown) => {
      console.error("Profile update error:", error);
    },
  });
}

// 실시간 인증 상태 변경 감지를 위한 Hook
export function useAuthStateListener() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useQuery({
    queryKey: [...authKeys.all, "listener"],
    queryFn: () => {
      // 실시간 리스너 설정
      const subscription = onAuthStateChange(async (event, session) => {
        console.log("Auth state changed:", event, session);

        // 캐시 업데이트
        queryClient.setQueryData(authKeys.session(), session);
        queryClient.setQueryData(authKeys.user(), session?.user || null);

        if (event === "SIGNED_IN") {
          console.log("User signed in:", session?.user);
          // 사용자 관련 데이터 refetch
          queryClient.invalidateQueries({ queryKey: authKeys.all });
        } else if (event === "SIGNED_OUT") {
          console.log("User signed out");
          // 모든 auth 캐시 제거
          queryClient.removeQueries({ queryKey: authKeys.all });
          router.push("/login");
        }
      });

      // cleanup function 반환
      return () => subscription.unsubscribe();
    },
    staleTime: Infinity, // 한 번만 설정
    gcTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}
