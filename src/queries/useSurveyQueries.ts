import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getSurvey,
  createSurvey,
  type Survey,
  type CreateSurveyRequest,
} from "@/api/survey";
import { getMyPageUser } from "@/api/my-page";
import { useMyPageUser } from "./useMyPageQueries";
import { formDataToSurveyRequest } from "@/lib/surveyUtils";
import type { FormData } from "@/types/form";

// ========== Query Keys ==========

export const surveyKeys = {
  all: ["surveys"] as const,
  detail: (userId: number) => [...surveyKeys.all, userId] as const,
} as const;

// ========== Queries ==========

/**
 * 설문 조회
 */
export function useSurvey(userId: number | undefined) {
  return useQuery<Survey | null>({
    queryKey: surveyKeys.detail(userId!),
    queryFn: () => getSurvey(userId!),
    enabled: userId !== undefined,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
}

/**
 * 현재 로그인 사용자의 설문 조회
 * - useMyPageUser로 userId 획득
 * @param enabled - false면 API 호출 안 함 (비로그인 시 getMyPageUser 401 방지)
 */
export function useSurveyForCurrentUser(enabled = true) {
  const { data: myPageUser, isLoading: isMyPageUserLoading } =
    useMyPageUser(enabled);
  const surveyQuery = useSurvey(enabled ? myPageUser?.id : undefined);

  return {
    ...surveyQuery,
    isLoading: enabled && (isMyPageUserLoading || surveyQuery.isLoading),
  };
}

// ========== Mutations ==========

interface CreateSurveyParams {
  userId: number;
  request: CreateSurveyRequest;
}

/**
 * 설문 저장
 */
export function useCreateSurvey() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, request }: CreateSurveyParams) =>
      createSurvey(userId, request),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: surveyKeys.detail(userId) });
      queryClient.invalidateQueries({ queryKey: surveyKeys.all });
    },
  });
}

/**
 * 폼 데이터로 설문 저장 (폼 제출용)
 * - getMyPageUser로 userId 획득 후 createSurvey 호출
 */
export function useSubmitSurveyForm() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: Partial<FormData>) => {
      const user = await getMyPageUser();
      if (!user) throw new Error("사용자가 로그인되지 않았습니다.");

      const request = formDataToSurveyRequest(formData);
      return createSurvey(user.id, request);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: surveyKeys.all });
    },
    onError: (error: unknown) => {
      console.error("Survey form submission error:", error);
    },
  });
}
