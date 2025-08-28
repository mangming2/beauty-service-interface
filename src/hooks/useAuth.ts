import { useState, useEffect } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // 현재 세션 가져오기
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getSession();

    // 인증 상태 변경 감지
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      if (event === "SIGNED_IN") {
        // 로그인 성공 시 처리
        console.log("User signed in:", session?.user);
      } else if (event === "SIGNED_OUT") {
        // 로그아웃 시 처리
        console.log("User signed out");
        router.push("/login");
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Sign out error:", error);
        throw error;
      }
      router.push("/login");
    } catch (error) {
      console.error("Sign out error:", error);
      throw error;
    }
  };

  const updateProfile = async (updates: any) => {
    try {
      if (!user) throw new Error("No user logged in");

      const { error } = await supabase.from("profiles").upsert({
        id: user.id,
        ...updates,
        updated_at: new Date().toISOString(),
      });

      if (error) throw error;
      return { data: null, error: null };
    } catch (error) {
      console.error("Update profile error:", error);
      return { data: null, error };
    }
  };

  return {
    user,
    session,
    loading,
    signOut,
    updateProfile,
    isAuthenticated: !!user,
  };
}
