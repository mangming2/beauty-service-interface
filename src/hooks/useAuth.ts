import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSession, signOut, updateProfile } from "@/api/auth";
import type { User, Session, UpdateProfileRequest } from "@/types/api";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // 현재 세션 가져오기
    const loadSession = async () => {
      try {
        const sessionData = await getSession();
        setSession(sessionData);
        setUser(sessionData?.user ?? null);
      } catch (error) {
        console.error("Failed to load session:", error);
        setSession(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadSession();

    // 주기적으로 세션 확인 (간단한 구현)
    const checkInterval = setInterval(async () => {
      try {
        const sessionData = await getSession();
        if (sessionData) {
          setSession(sessionData);
          setUser(sessionData.user);
        } else {
          setSession(null);
          setUser(null);
          router.push("/login");
        }
      } catch {
        setSession(null);
        setUser(null);
      }
    }, 60000); // 1분마다 확인

    return () => clearInterval(checkInterval);
  }, [router]);

  const handleSignOut = async () => {
    try {
      await signOut();
      setSession(null);
      setUser(null);
      router.push("/login");
    } catch (error) {
      console.error("Sign out error:", error);
      // 에러가 발생해도 로컬 상태는 초기화
      setSession(null);
      setUser(null);
      router.push("/login");
    }
  };

  const handleUpdateProfile = async (updates: UpdateProfileRequest) => {
    try {
      if (!user) throw new Error("No user logged in");

      const updatedProfile = await updateProfile(user.id, updates);

      // 사용자 정보 업데이트
      setUser({
        ...user,
        user_metadata: {
          ...user.user_metadata,
          ...updates,
        },
      });

      return { data: updatedProfile, error: null };
    } catch (error) {
      console.error("Update profile error:", error);
      return { data: null, error };
    }
  };

  return {
    user,
    session,
    loading,
    signOut: handleSignOut,
    updateProfile: handleUpdateProfile,
    isAuthenticated: !!user,
  };
}
