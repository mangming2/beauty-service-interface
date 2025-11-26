import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiGet, apiPost, apiDelete } from "@/lib/apiClient";
import { FormData } from "@/types/form";
import { getUser } from "@/api/auth";
import type {
  FormSubmissionRequest,
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

      try {
        const data = await apiGet<FormSubmissionResponse>(
          `/beauty-form/user/${userId}/latest`
        );
        return data;
      } catch (error: unknown) {
        if (
          error &&
          typeof error === "object" &&
          "status" in error &&
          (error as { status: number }).status === 404
        ) {
          // 데이터가 없는 경우 null 반환
          return null;
        }
        throw error;
      }
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
      // 현재 로그인된 사용자 정보 가져오기
      const user = await getUser();

      if (!user) {
        throw new Error("사용자가 로그인되지 않았습니다.");
      }

      // 기존 데이터 삭제 후 새 데이터 삽입
      // 1. 기존 사용자 데이터 삭제
      try {
        await apiDelete<void>(`/beauty-form/user/${user.id}`);
      } catch (error) {
        // 삭제 실패는 무시 (데이터가 없을 수 있음)
        console.warn("Failed to delete existing form data:", error);
      }

      // 2. 새 데이터 삽입
      const requestData: FormSubmissionRequest = {
        user_id: user.id,
        selected_concepts: formData.selectedConcepts || [],
        favorite_idol: formData.favoriteIdol || "",
        idol_option: formData.idolOption || "",
        date_range: formData.dateRange
          ? {
              from: formData.dateRange.from.toISOString(),
              to: formData.dateRange.to.toISOString(),
            }
          : null,
        selected_regions: formData.selectedRegions || [],
        created_at: new Date().toISOString(),
      };

      const response = await apiPost<FormSubmissionSuccessResponse>(
        "/beauty-form/submit",
        requestData
      );

      return response || { success: true };
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
