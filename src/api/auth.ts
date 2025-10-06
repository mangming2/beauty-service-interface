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
    // avatar_src가 없거나 null인 경우 업데이트
    if (
      !existingProfile.avatar_src &&
      (user.user_metadata?.avatar_url ||
        user.user_metadata?.picture ||
        user.user_metadata?.picture_url)
    ) {
      const updatedProfileData = {
        id: user.id,
        avatar_src:
          user.user_metadata?.avatar_url ||
          user.user_metadata?.picture ||
          user.user_metadata?.picture_url,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("profiles")
        .update(updatedProfileData)
        .eq("id", user.id)
        .select()
        .single();

      if (error) {
        console.error("Error updating profile avatar:", error);
        return existingProfile;
      }

      return data;
    }

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

// 기존 사용자들의 avatar_src 업데이트 (관리자용)
export const updateExistingUserAvatars = async () => {
  try {
    // avatar_src가 null인 모든 프로필 조회
    const { data: profilesWithoutAvatar, error: fetchError } = await supabase
      .from("profiles")
      .select("id")
      .is("avatar_src", null);

    if (fetchError) {
      throw fetchError;
    }

    if (!profilesWithoutAvatar || profilesWithoutAvatar.length === 0) {
      console.log("No profiles found without avatar_src");
      return { updated: 0, message: "No profiles need updating" };
    }

    console.log(
      `Found ${profilesWithoutAvatar.length} profiles without avatar_src`
    );

    // 각 사용자의 auth 정보에서 avatar URL 가져와서 업데이트
    const updatedCount = 0;
    for (const profile of profilesWithoutAvatar) {
      try {
        // auth.users 테이블에서 user_metadata 조회 (이건 직접 접근이 어려우므로)
        // 대신 사용자가 다시 로그인할 때 자동으로 업데이트되도록 함
        console.log(
          `Profile ${profile.id} needs avatar update - will be updated on next login`
        );
      } catch (error) {
        console.error(`Error processing profile ${profile.id}:`, error);
      }
    }

    return {
      updated: updatedCount,
      message: `${profilesWithoutAvatar.length} profiles will be updated on next login`,
    };
  } catch (error) {
    console.error("Error updating existing user avatars:", error);
    throw error;
  }
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
