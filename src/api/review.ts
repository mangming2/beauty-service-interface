import { apiGet, apiPost, apiDelete } from "@/lib/apiClient";
import type {
  CreateReviewRequest,
  CreateReviewData,
  ReviewDetail,
  ReviewSummary,
} from "@/types/api";

// ========== 리뷰 API ==========

/**
 * 특정 패키지의 리뷰 목록 조회 (사용자 프로필 정보 포함)
 * GET /packages/:packageId/reviews 호출
 */
export async function getPackageReviews(
  packageId: string
): Promise<ReviewDetail[]> {
  try {
    console.log("Fetching reviews for package ID:", packageId);

    const reviews = await apiGet<ReviewDetail[]>(
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
}

/**
 * 특정 패키지의 리뷰 요약 정보 조회
 * GET /packages/:packageId/reviews/summary 호출
 */
export async function getPackageReviewSummary(
  packageId: string
): Promise<ReviewSummary> {
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
    console.error("Get package review summary error:", error);
    throw error;
  }
}

/**
 * 리뷰 생성
 * POST /reviews 호출
 */
export async function createReview(
  reviewData: CreateReviewData
): Promise<ReviewDetail> {
  try {
    const requestData: CreateReviewRequest = {
      package_id: reviewData.package_id,
      user_id: reviewData.user_id,
      username: reviewData.username,
      rating: reviewData.rating,
      comment: reviewData.comment,
    };

    const data = await apiPost<ReviewDetail>("/reviews", requestData);
    return data;
  } catch (error) {
    console.error("Create review error:", error);
    throw new Error("Failed to create review");
  }
}

/**
 * 특정 사용자의 리뷰 목록 조회 (패키지 정보 포함)
 * GET /users/:userId/reviews 호출
 */
export async function getUserReviews(userId: string): Promise<ReviewDetail[]> {
  try {
    const reviews = await apiGet<ReviewDetail[]>(`/users/${userId}/reviews`);

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
}

/**
 * 리뷰 삭제
 * DELETE /reviews/:reviewId 호출
 */
export async function deleteReview(reviewId: string): Promise<void> {
  try {
    await apiDelete<void>(`/reviews/${reviewId}`);
  } catch (error: unknown) {
    const message =
      error && typeof error === "object" && "message" in error
        ? (error as { message: string }).message
        : "Unknown error";
    console.error("Delete review error:", error);
    throw new Error(`Failed to delete review: ${message}`);
  }
}

/**
 * 여러 리뷰 삭제
 * POST /reviews/batch-delete 호출
 */
export async function deleteReviews(reviewIds: string[]): Promise<void> {
  if (reviewIds.length === 0) {
    return;
  }

  try {
    await apiPost("/reviews/batch-delete", { review_ids: reviewIds });
  } catch (error: unknown) {
    const message =
      error && typeof error === "object" && "message" in error
        ? (error as { message: string }).message
        : "Unknown error";
    console.error("Delete reviews error:", error);
    throw new Error(`Failed to delete reviews: ${message}`);
  }
}
