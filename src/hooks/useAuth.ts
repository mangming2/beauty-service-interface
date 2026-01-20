// hooks/useAuth.ts

import { useAuthStore } from "@/store/useAuthStore";
import { useSignOut, useUpdateProfile } from "@/queries/useAuthQueries";
import type { UpdateProfileRequest } from "@/types/api";

/**
 * 인증 관련 통합 훅
 * - 내부적으로 Zustand + React Query 사용
 */
export function useAuth() {
  // ⭐ Zustand에서 상태 가져오기
  const { user, accessToken, isAuthenticated } = useAuthStore();

  // ⭐ React Query mutations
  const signOutMutation = useSignOut();
  const updateProfileMutation = useUpdateProfile();

  // 로그아웃
  const handleSignOut = () => {
    signOutMutation.mutate();
  };

  // 프로필 업데이트
  const handleUpdateProfile = async (updates: UpdateProfileRequest) => {
    if (!user) {
      return { data: null, error: new Error("No user logged in") };
    }

    try {
      const result = await updateProfileMutation.mutateAsync({
        userId: user.id,
        profileData: updates,
      });
      return { data: result, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  return {
    user,
    session: accessToken ? { user, accessToken } : null,
    loading: false, // Zustand persist로 즉시 로드됨
    signOut: handleSignOut,
    updateProfile: handleUpdateProfile,
    isAuthenticated,
  };
}
