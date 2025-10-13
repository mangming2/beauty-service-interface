import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { submitBeautyForm, getUserFormSubmission } from "@/api/form";
import { FormData } from "@/types/form";

// Query Keys
export const formKeys = {
  all: ["form"] as const,
  submissions: () => [...formKeys.all, "submissions"] as const,
  userSubmission: (userId: string) =>
    [...formKeys.submissions(), userId] as const,
} as const;

// 사용자의 폼 제출 데이터 조회
export function useUserFormSubmission(userId?: string) {
  return useQuery({
    queryKey: formKeys.userSubmission(userId || ""),
    queryFn: getUserFormSubmission,
    enabled: !!userId, // userId가 있을 때만 실행
    staleTime: 10 * 60 * 1000, // 10분
    retry: (failureCount, error: unknown) => {
      // 인증 에러는 재시도하지 않음
      if (
        (error as { message?: string })?.message?.includes(
          "로그인되지 않았습니다"
        )
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

  return useMutation({
    mutationFn: (formData: Partial<FormData>) => submitBeautyForm(formData),
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
