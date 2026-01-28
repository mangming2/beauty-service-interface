import { useMutation } from "@tanstack/react-query";
import {
  updateNickname,
  type UpdateNicknameRequest,
  type UserResponse,
} from "@/api/user";
import { useAuthStore } from "@/store/useAuthStore";

// ========== Query Keys ==========

export const userKeys = {
  all: ["user"] as const,
  detail: () => [...userKeys.all, "detail"] as const,
} as const;

// ========== Mutations ==========

/**
 * 닉네임 수정
 */
export function useUpdateNickname() {
  const { setUser, user } = useAuthStore();

  return useMutation<UserResponse, Error, UpdateNicknameRequest>({
    mutationFn: updateNickname,
    onSuccess: data => {
      // store 업데이트
      if (user) {
        setUser({
          ...user,
          name: data.nickname,
        });
      }
    },
  });
}
