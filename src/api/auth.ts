import { supabase } from "@/lib/supabase";
import type { AuthChangeEvent, Session } from "@supabase/supabase-js";

// 사용자 정보 조회
export const getUser = async () => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw error;
  }

  return user;
};

// 세션 정보 조회
export const getSession = async () => {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) {
    throw error;
  }

  return session;
};

// 사용자 프로필 조회
export const getUserProfile = async (userId: string) => {
  if (!userId) {
    throw new Error("User ID is required");
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error && error.code !== "PGRST116") {
    // PGRST116은 "no rows returned" 에러
    throw error;
  }

  return data;
};

// Google OAuth 로그인
export const signInWithGoogle = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  if (error) {
    throw error;
  }
};

// 로그아웃
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw error;
  }
};

// 프로필 업데이트
export const updateProfile = async (
  userId: string,
  profileData: Record<string, unknown>
) => {
  const { data, error } = await supabase
    .from("profiles")
    .upsert(
      {
        id: userId,
        ...profileData,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "id",
      }
    )
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
};

// 인증 상태 변경 리스너 설정
export const onAuthStateChange = (
  callback: (event: AuthChangeEvent, session: Session | null) => void
) => {
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange(callback);

  return subscription;
};
