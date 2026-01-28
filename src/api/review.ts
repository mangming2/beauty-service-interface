import { apiGet, apiDelete } from "@/lib/apiClient";
import type { ReviewDetail, ReviewFormData, ReviewSummary } from "@/types/api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

/**
 * 패키지 리뷰 목록 조회
 * GET /packages/:packageId/reviews
 */
export async function getPackageReviews(
  packageId: number
): Promise<ReviewDetail[]> {
  try {
    const reviews = await apiGet<ReviewDetail[]>(
      `/packages/${packageId}/reviews`
    );
    return reviews ?? [];
  } catch (error) {
    console.error("Get package reviews error:", error);
    if (isNotFoundError(error)) return [];
    throw error;
  }
}

/**
 * 리뷰 생성
 * POST /packages/:packageId/reviews (multipart/form-data)
 */
export async function createReview(
  packageId: number,
  data: ReviewFormData,
  accessToken: string
): Promise<ReviewDetail> {
  const formData = new FormData();

  // request 객체를 JSON Blob으로 추가
  const requestBlob = new Blob(
    [JSON.stringify({ rating: data.rating, content: data.content })],
    { type: "application/json" }
  );
  formData.append("request", requestBlob);

  // 이미지 파일 추가
  if (data.images?.length) {
    data.images.forEach(file => {
      formData.append("images", file);
    });
  }

  const response = await fetch(
    `${API_BASE_URL}/packages/${packageId}/reviews`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error("Failed to create review");
  }

  return response.json();
}

/**
 * 리뷰 수정
 * PUT /packages/:packageId/reviews/:reviewId (multipart/form-data)
 */
export async function updateReview(
  packageId: number,
  reviewId: number,
  data: ReviewFormData,
  accessToken: string
): Promise<ReviewDetail> {
  const formData = new FormData();

  const requestBlob = new Blob(
    [JSON.stringify({ rating: data.rating, content: data.content })],
    { type: "application/json" }
  );
  formData.append("request", requestBlob);

  if (data.images?.length) {
    data.images.forEach(file => {
      formData.append("images", file);
    });
  }

  const response = await fetch(
    `${API_BASE_URL}/packages/${packageId}/reviews/${reviewId}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update review");
  }

  return response.json();
}

/**
 * 리뷰 삭제
 * DELETE /packages/:packageId/reviews/:reviewId?userId=
 */
export async function deleteReview(
  packageId: number,
  reviewId: number,
  userId: number
): Promise<void> {
  try {
    await apiDelete<void>(
      `/packages/${packageId}/reviews/${reviewId}?userId=${userId}`
    );
  } catch (error) {
    console.error("Delete review error:", error);
    throw new Error("Failed to delete review");
  }
}

/**
 * 패키지 리뷰 요약 조회 (백엔드에 있는지 확인 필요!)
 * GET /packages/:packageId/reviews/summary
 */
export async function getPackageReviewSummary(
  packageId: number
): Promise<ReviewSummary> {
  try {
    return await apiGet<ReviewSummary>(
      `/packages/${packageId}/reviews/summary`
    );
  } catch (error) {
    if (isNotFoundError(error)) {
      return {
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      };
    }
    throw error;
  }
}

// 헬퍼
function isNotFoundError(error: unknown): boolean {
  return (
    error !== null &&
    typeof error === "object" &&
    "status" in error &&
    (error as { status: number }).status === 404
  );
}
