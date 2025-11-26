import { apiGet, apiPost, apiDelete } from "./apiClient";

export interface PackageReview {
  id: string;
  package_id: string;
  user_id: string;
  username: string;
  rating: number;
  comment: string;
  avatar_src?: string;
  created_at?: string;
  package_title?: string; // 패키지 제목 (사용자 리뷰 목록용)
}

export interface ReviewSummary {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    [key: number]: number;
  };
}

export interface CreateReviewData {
  package_id: string;
  user_id: string;
  username: string;
  rating: number;
  comment: string;
}

// 특정 패키지의 리뷰 목록 조회 (사용자 프로필 정보 포함)
export async function getPackageReviews(
  packageId: string
): Promise<PackageReview[]> {
  try {
    console.log("Fetching reviews for package ID:", packageId);

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
  } catch (error: any) {
    console.error("Get package reviews error:", error);
    if (error?.status === 404) {
      return [];
    }
    throw error;
  }
}

// 특정 패키지의 리뷰 요약 정보 조회
export async function getPackageReviewSummary(
  packageId: string
): Promise<ReviewSummary> {
  try {
    const summary = await apiGet<ReviewSummary>(
      `/packages/${packageId}/reviews/summary`
    );
    return summary;
  } catch (error: any) {
    // 요약 정보가 없으면 빈 요약 반환
    if (error?.status === 404) {
      return {
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      };
    }
    throw error;
  }
}

// 리뷰 생성
export async function createReview(
  reviewData: CreateReviewData
): Promise<PackageReview> {
  try {
    const data = await apiPost<PackageReview>("/reviews", reviewData);
    return data;
  } catch {
    throw new Error("Failed to create review");
  }
}

// 특정 사용자의 리뷰 목록 조회 (패키지 정보 포함)
export async function getUserReviews(userId: string): Promise<PackageReview[]> {
  try {
    const reviews = await apiGet<PackageReview[]>(`/users/${userId}/reviews`);

    if (!reviews || reviews.length === 0) {
      return [];
    }

    return reviews;
  } catch (error: any) {
    console.error("Get user reviews error:", error);
    if (error?.status === 404) {
      return [];
    }
    throw error;
  }
}

// 리뷰 삭제
export async function deleteReview(reviewId: string): Promise<void> {
  try {
    await apiDelete(`/reviews/${reviewId}`);
  } catch (error: any) {
    throw new Error(
      `Failed to delete review: ${error?.message || "Unknown error"}`
    );
  }
}

// 여러 리뷰 삭제
export async function deleteReviews(reviewIds: string[]): Promise<void> {
  if (reviewIds.length === 0) {
    return;
  }

  try {
    await apiPost("/reviews/batch-delete", { review_ids: reviewIds });
  } catch (error: any) {
    throw new Error(
      `Failed to delete reviews: ${error?.message || "Unknown error"}`
    );
  }
}
