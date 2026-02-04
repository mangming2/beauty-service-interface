// stores/useAuthStore.ts

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  email: string;
  name?: string;
  profileImage?: string;
}

interface AuthState {
  accessToken: string | null;
  user: User | null;
  isAuthenticated: boolean;

  // Actions
  setAccessToken: (token: string) => void;
  setUser: (user: User) => void;
  login: (token: string, user?: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    set => ({
      accessToken: null,
      user: null,
      isAuthenticated: false,

      setAccessToken: token =>
        set({
          accessToken: token,
          isAuthenticated: true,
        }),

      setUser: user => set({ user }),

      login: (token, user) =>
        set({
          accessToken: token,
          user: user ?? null,
          isAuthenticated: true,
        }),

      logout: () => {
        if (typeof window !== "undefined") {
          localStorage.removeItem("auth_token"); // 테스트 로그인용 키 정리
        }
        set({
          accessToken: null,
          user: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: "auth-storage", // localStorage 키
      partialize: state => ({
        accessToken: state.accessToken,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
