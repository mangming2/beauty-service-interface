import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProductReviews,
  createReview,
  updateReview,
  deleteReview,
} from "@/api/review";
import type { ReviewDetail, ReviewFormData } from "@/types/api";

// ========== Query Keys ==========

export const reviewKeys = {
  all: ["reviews"] as const,
  lists: () => [...reviewKeys.all, "list"] as const,
  list: (productId: number) => [...reviewKeys.lists(), productId] as const,
} as const;

// ========== Queries ==========

/**
 * 특정 상품의 리뷰 목록 조회
 */
export function useProductReviews(productId: number | undefined) {
  const isValidProductId =
    typeof productId === "number" && Number.isFinite(productId);

  return useQuery<ReviewDetail[]>({
    queryKey: reviewKeys.list(productId!),
    queryFn: () => getProductReviews(productId!),
    enabled: isValidProductId,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
}

// ========== Mutations ==========

interface CreateReviewParams {
  productId: number;
  data: ReviewFormData;
  accessToken: string;
}

/**
 * 리뷰 생성
 */
export function useCreateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, data, accessToken }: CreateReviewParams) =>
      createReview(productId, data, accessToken),
    onSuccess: newReview => {
      queryClient.invalidateQueries({
        queryKey: reviewKeys.list(newReview.productId),
      });
    },
  });
}

interface UpdateReviewParams {
  productId: number;
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
      productId,
      reviewId,
      data,
      accessToken,
    }: UpdateReviewParams) =>
      updateReview(productId, reviewId, data, accessToken),
    onSuccess: updatedReview => {
      queryClient.invalidateQueries({
        queryKey: reviewKeys.list(updatedReview.productId),
      });
    },
  });
}

interface DeleteReviewParams {
  productId: number;
  reviewId: number;
  userId: number;
}

/**
 * 리뷰 삭제
 */
export function useDeleteReview() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, DeleteReviewParams>({
    mutationFn: ({ productId, reviewId, userId }) =>
      deleteReview(productId, reviewId, userId),
    onSuccess: (_, { productId }) => {
      queryClient.invalidateQueries({
        queryKey: reviewKeys.list(productId),
      });
    },
  });
}
