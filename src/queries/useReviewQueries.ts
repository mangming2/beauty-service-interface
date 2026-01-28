import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getPackageReviews,
  getPackageReviewSummary,
  createReview,
  updateReview,
  deleteReview,
} from "@/api/review";
import type { ReviewDetail, ReviewSummary, ReviewFormData } from "@/types/api";

// ========== Query Keys ==========

export const reviewKeys = {
  all: ["reviews"] as const,
  lists: () => [...reviewKeys.all, "list"] as const,
  list: (packageId: number) => [...reviewKeys.lists(), packageId] as const,
  summaries: () => [...reviewKeys.all, "summary"] as const,
  summary: (packageId: number) =>
    [...reviewKeys.summaries(), packageId] as const,
} as const;

// ========== Queries ==========

/**
 * 특정 패키지의 리뷰 목록 조회
 */
export function usePackageReviews(packageId: number | undefined) {
  return useQuery<ReviewDetail[]>({
    queryKey: reviewKeys.list(packageId!),
    queryFn: () => getPackageReviews(packageId!),
    enabled: packageId !== undefined,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
}

/**
 * 특정 패키지의 리뷰 요약 정보 조회
 */
export function usePackageReviewSummary(packageId: number | undefined) {
  return useQuery<ReviewSummary>({
    queryKey: reviewKeys.summary(packageId!),
    queryFn: () => getPackageReviewSummary(packageId!),
    enabled: packageId !== undefined,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
}

// ========== Mutations ==========

interface CreateReviewParams {
  packageId: number;
  data: ReviewFormData;
  accessToken: string;
}

/**
 * 리뷰 생성
 */
export function useCreateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ packageId, data, accessToken }: CreateReviewParams) =>
      createReview(packageId, data, accessToken),
    onSuccess: newReview => {
      queryClient.invalidateQueries({
        queryKey: reviewKeys.list(newReview.packageId),
      });
      queryClient.invalidateQueries({
        queryKey: reviewKeys.summary(newReview.packageId),
      });
    },
  });
}

interface UpdateReviewParams {
  packageId: number;
  reviewId: number;
  data: ReviewFormData;
  accessToken: string;
}

/**
 * 리뷰 수정
 */
export function useUpdateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      packageId,
      reviewId,
      data,
      accessToken,
    }: UpdateReviewParams) =>
      updateReview(packageId, reviewId, data, accessToken),
    onSuccess: updatedReview => {
      queryClient.invalidateQueries({
        queryKey: reviewKeys.list(updatedReview.packageId),
      });
      queryClient.invalidateQueries({
        queryKey: reviewKeys.summary(updatedReview.packageId),
      });
    },
  });
}

interface DeleteReviewParams {
  packageId: number;
  reviewId: number;
  userId: number;
}

/**
 * 리뷰 삭제
 */
export function useDeleteReview() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, DeleteReviewParams>({
    mutationFn: ({ packageId, reviewId, userId }) =>
      deleteReview(packageId, reviewId, userId),
    onSuccess: (_, { packageId }) => {
      queryClient.invalidateQueries({
        queryKey: reviewKeys.list(packageId),
      });
      queryClient.invalidateQueries({
        queryKey: reviewKeys.summary(packageId),
      });
    },
  });
}
