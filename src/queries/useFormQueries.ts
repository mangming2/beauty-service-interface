import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FormData } from "@/types/form";
import { submitBeautyForm, getUserFormSubmission } from "@/api/beauty-form";
import type {
  FormSubmissionResponse,
  FormSubmissionSuccessResponse,
} from "@/types/api";

// Query Keys
export const formKeys = {
  all: ["form"] as const,
  submissions: () => [...formKeys.all, "submissions"] as const,
  userSubmission: (userId: string) =>
    [...formKeys.submissions(), userId] as const,
} as const;

// 사용자의 폼 제출 데이터 조회
export function useUserFormSubmission(userId?: string) {
  return useQuery<FormSubmissionResponse | null>({
    queryKey: formKeys.userSubmission(userId || ""),
    queryFn: async () => {
      if (!userId) {
        throw new Error("User ID is required");
      }

      return await getUserFormSubmission(userId);
    },
    enabled: !!userId, // userId가 있을 때만 실행
    staleTime: 10 * 60 * 1000, // 10분
    retry: (failureCount, error: unknown) => {
      // 인증 에러는 재시도하지 않음
      if (
        (error as { message?: string })?.message?.includes(
          "로그인되지 않았습니다"
        ) ||
        (error &&
          typeof error === "object" &&
          "status" in error &&
          (error as { status: number }).status === 401)
      ) {
        return false;
      }
      return failureCount < 2;
    },
  });
}

// 뷰티 폼 제출 Mutation
export function useSubmitBeautyForm() {
  const queryClient = useQueryClient();

  return useMutation<FormSubmissionSuccessResponse, Error, Partial<FormData>>({
    mutationFn: async (formData: Partial<FormData>) => {
      return await submitBeautyForm(formData);
    },
    onSuccess: data => {
      console.log("Form submitted successfully:", data);

      // 사용자의 폼 제출 데이터 캐시 무효화
      queryClient.invalidateQueries({
        queryKey: formKeys.submissions(),
      });

      // 리다이렉트는 호출하는 컴포넌트에서 처리
    },
    onError: (error: unknown) => {
      console.error("Form submission error:", error);
    },
  });
}

// 폼 제출 상태를 확인하는 편의 hook
export function useFormSubmissionStatus() {
  const queryClient = useQueryClient();

  const invalidateFormSubmissions = () => {
    queryClient.invalidateQueries({
      queryKey: formKeys.submissions(),
    });
  };

  const clearFormSubmissions = () => {
    queryClient.removeQueries({
      queryKey: formKeys.submissions(),
    });
  };

  return {
    invalidateFormSubmissions,
    clearFormSubmissions,
  };
}
