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

// Google 로그인 후 프로필 자동 생성
export const createUserProfile = async (user: {
  id: string;
  user_metadata?: Record<string, unknown>;
  email?: string;
}) => {
  if (!user) {
    throw new Error("User is required");
  }

  // 디버깅: Google에서 받아온 데이터 확인
  console.log("User metadata during profile creation:", user.user_metadata);
  console.log("User object:", user);

  // 기존 프로필이 있는지 확인
  const existingProfile = await getUserProfile(user.id);
  if (existingProfile) {
    console.log("Profile already exists, skipping creation:", existingProfile);
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

  console.log("Profile data to be saved:", profileData);

  console.log("Attempting to upsert profile data to Supabase...");

  const { data, error } = await supabase
    .from("profiles")
    .upsert(profileData, {
      onConflict: "id",
    })
    .select()
    .single();

  if (error) {
    console.error("Error upserting profile:", error);
    throw error;
  }

  console.log("Profile upserted successfully:", data);
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
  // 1. profiles 테이블 업데이트
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

  // 2. auth.users.user_metadata도 함께 업데이트 (동기화)
  if (profileData.full_name) {
    const { error: authError } = await supabase.auth.updateUser({
      data: {
        full_name: profileData.full_name,
      },
    });

    if (authError) {
      console.warn("Failed to update auth user metadata:", authError);
      // auth 업데이트 실패해도 profiles 업데이트는 성공했으므로 계속 진행
    }
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
