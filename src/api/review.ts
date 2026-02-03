import { apiGet, apiDelete } from "@/lib/apiClient";
import type { ReviewDetail, ReviewFormData } from "@/types/api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

/**
 * 상품 리뷰 목록 조회
 * GET /products/:productId/reviews
 */
export async function getProductReviews(
  productId: number
): Promise<ReviewDetail[]> {
  try {
    const reviews = await apiGet<ReviewDetail[]>(
      `/products/${productId}/reviews`
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
    `${API_BASE_URL}/products/${productId}/reviews`,
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
 * PUT /products/:productId/reviews/:reviewId (multipart/form-data)
 */
export async function updateReview(
  productId: number,
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
    `${API_BASE_URL}/products/${productId}/reviews/${reviewId}`,
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
