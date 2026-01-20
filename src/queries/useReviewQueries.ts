import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getPackageReviews,
  getPackageReviewSummary,
  createReview,
  getUserReviews,
  deleteReview,
  deleteReviews,
} from "@/api/review";
import type {
  ReviewDetail,
  ReviewSummary,
  CreateReviewData,
} from "@/types/api";
import type { BatchDeleteReviewsResponse } from "@/types/api";

// Query Keys
export const reviewKeys = {
  all: ["reviews"] as const,
  lists: () => [...reviewKeys.all, "list"] as const,
  list: (packageId: string) => [...reviewKeys.lists(), packageId] as const,
  summaries: () => [...reviewKeys.all, "summary"] as const,
  summary: (packageId: string) =>
    [...reviewKeys.summaries(), packageId] as const,
  userReviews: () => [...reviewKeys.all, "user"] as const,
  userReviewList: (userId: string) =>
    [...reviewKeys.userReviews(), userId] as const,
} as const;

// 특정 패키지의 리뷰 목록 조회
export function usePackageReviews(packageId: string) {
  return useQuery<ReviewDetail[]>({
    queryKey: reviewKeys.list(packageId),
    queryFn: async () => {
      return await getPackageReviews(packageId);
    },
    enabled: !!packageId,
    staleTime: 5 * 60 * 1000, // 5분
    retry: 2,
  });
}

// 특정 패키지의 리뷰 요약 정보 조회
export function usePackageReviewSummary(packageId: string) {
  return useQuery<ReviewSummary>({
    queryKey: reviewKeys.summary(packageId),
    queryFn: async () => {
      return await getPackageReviewSummary(packageId);
    },
    enabled: !!packageId,
    staleTime: 5 * 60 * 1000, // 5분
    retry: 2,
  });
}

// 리뷰 생성 mutation
export function useCreateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reviewData: CreateReviewData) => {
      return await createReview(reviewData);
    },
    onSuccess: newReview => {
      // 해당 패키지의 리뷰 목록과 요약 정보를 무효화하여 다시 가져오도록 함
      queryClient.invalidateQueries({
        queryKey: reviewKeys.list(newReview.package_id),
      });
      queryClient.invalidateQueries({
        queryKey: reviewKeys.summary(newReview.package_id),
      });
      // 사용자 리뷰 목록도 무효화
      queryClient.invalidateQueries({
        queryKey: reviewKeys.userReviews(),
      });
    },
  });
}

// 사용자의 리뷰 목록 조회
export function useUserReviews(userId: string) {
  return useQuery<ReviewDetail[]>({
    queryKey: reviewKeys.userReviewList(userId),
    queryFn: async () => {
      return await getUserReviews(userId);
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5분
    retry: 2,
  });
}

// 리뷰 삭제 mutation
export function useDeleteReview() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: async (reviewId: string) => {
      return await deleteReview(reviewId);
    },
    onSuccess: () => {
      // 모든 리뷰 관련 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: reviewKeys.all,
      });
    },
  });
}

// 여러 리뷰 삭제 mutation
export function useDeleteReviews() {
  const queryClient = useQueryClient();

  return useMutation<BatchDeleteReviewsResponse, Error, string[]>({
    mutationFn: async (reviewIds: string[]) => {
      if (reviewIds.length === 0) {
        return { success: true, deleted_count: 0 };
      }

      await deleteReviews(reviewIds);
      return { success: true, deleted_count: reviewIds.length };
    },
    onSuccess: () => {
      // 모든 리뷰 관련 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: reviewKeys.all,
      });
    },
  });
}
