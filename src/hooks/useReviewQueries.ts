import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiGet, apiPost, apiDelete } from "@/lib/apiClient";
import type {
  PackageReview,
  ReviewSummary,
  CreateReviewData,
} from "@/lib/reviewService";
import type {
  BatchDeleteReviewsRequest,
  BatchDeleteReviewsResponse,
} from "@/types/api";

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
  return useQuery<PackageReview[]>({
    queryKey: reviewKeys.list(packageId),
    queryFn: async () => {
      console.log("Fetching reviews for package ID:", packageId);

      try {
        const reviews = await apiGet<PackageReview[]>(
          `/packages/${packageId}/reviews`
        );

        if (!reviews || reviews.length === 0) {
          console.log("No reviews found for package");
          return [];
        }

        console.log(`Found ${reviews.length} reviews for package`);
        console.log("Reviews with profiles processed successfully");
        return reviews;
      } catch (error: unknown) {
        console.error("Get package reviews error:", error);
        if (
          error &&
          typeof error === "object" &&
          "status" in error &&
          (error as { status: number }).status === 404
        ) {
          return [];
        }
        throw error;
      }
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
      try {
        const summary = await apiGet<ReviewSummary>(
          `/packages/${packageId}/reviews/summary`
        );
        return summary;
      } catch (error: unknown) {
        // 요약 정보가 없으면 빈 요약 반환
        if (
          error &&
          typeof error === "object" &&
          "status" in error &&
          (error as { status: number }).status === 404
        ) {
          return {
            averageRating: 0,
            totalReviews: 0,
            ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
          };
        }
        throw error;
      }
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
      try {
        const data = await apiPost<PackageReview>("/reviews", reviewData);
        return data;
      } catch {
        throw new Error("Failed to create review");
      }
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
  return useQuery<PackageReview[]>({
    queryKey: reviewKeys.userReviewList(userId),
    queryFn: async () => {
      try {
        const reviews = await apiGet<PackageReview[]>(
          `/users/${userId}/reviews`
        );

        if (!reviews || reviews.length === 0) {
          return [];
        }

        return reviews;
      } catch (error: unknown) {
        console.error("Get user reviews error:", error);
        if (
          error &&
          typeof error === "object" &&
          "status" in error &&
          (error as { status: number }).status === 404
        ) {
          return [];
        }
        throw error;
      }
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
      try {
        await apiDelete<void>(`/reviews/${reviewId}`);
      } catch (error: unknown) {
        const message =
          error && typeof error === "object" && "message" in error
            ? (error as { message: string }).message
            : "Unknown error";
        throw new Error(`Failed to delete review: ${message}`);
      }
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

      try {
        const requestData: BatchDeleteReviewsRequest = {
          review_ids: reviewIds,
        };
        const response = await apiPost<BatchDeleteReviewsResponse>(
          "/reviews/batch-delete",
          requestData
        );
        return response;
      } catch (error: unknown) {
        const message =
          error && typeof error === "object" && "message" in error
            ? (error as { message: string }).message
            : "Unknown error";
        throw new Error(`Failed to delete reviews: ${message}`);
      }
    },
    onSuccess: () => {
      // 모든 리뷰 관련 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: reviewKeys.all,
      });
    },
  });
}
