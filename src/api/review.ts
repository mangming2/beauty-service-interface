import { apiGet, apiDelete, apiRequest } from "@/lib/apiClient";
import type { ReviewDetail, ReviewFormData } from "@/types/api";

/**
 * 상품 리뷰 목록 조회
 * GET /products/:productId/reviews
 */
export async function getProductReviews(
  productId: number
): Promise<ReviewDetail[]> {
  try {
    const reviews = await apiGet<ReviewDetail[]>(
      `/products/${productId}/reviews`,
      { requireAuth: false }
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
 * POST /products/:productId/reviews (multipart/form-data)
 */
export async function createReview(
  productId: number,
  data: ReviewFormData
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

  return apiRequest<ReviewDetail>(`/products/${productId}/reviews`, {
    method: "POST",
    body: formData,
    requireAuth: true,
  });
}

/**
 * 리뷰 수정
 * PUT /products/:productId/reviews/:reviewId (multipart/form-data)
 */
export async function updateReview(
  productId: number,
  reviewId: number,
  data: ReviewFormData
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

  return apiRequest<ReviewDetail>(
    `/products/${productId}/reviews/${reviewId}`,
    {
      method: "PUT",
      body: formData,
      requireAuth: true,
    }
  );
}

/**
 * 리뷰 삭제
 * DELETE /products/:productId/reviews/:reviewId?userId=
 */
export async function deleteReview(
  productId: number,
  reviewId: number,
  userId: number
): Promise<void> {
  try {
    await apiDelete<void>(
      `/products/${productId}/reviews/${reviewId}?userId=${userId}`
    );
  } catch (error) {
    console.error("Delete review error:", error);
    throw new Error("Failed to delete review");
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
