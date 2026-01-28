import { apiGet, apiPost } from "@/lib/apiClient";

// ========== 타입 정의 ==========

/** 상품 */
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  location: string;
}

/** 상품 생성 요청 */
export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  location: string;
}

// ========== 상품 API ==========

/**
 * 상품 목록 조회
 * GET /products
 */
export async function getProducts(): Promise<Product[]> {
  try {
    const data = await apiGet<Product[]>("/products");
    return data ?? [];
  } catch (error) {
    console.error("Get products error:", error);
    throw error;
  }
}

/**
 * 상품 상세 조회
 * GET /products/:productId
 */
export async function getProductDetail(
  productId: number
): Promise<Product | null> {
  try {
    const data = await apiGet<Product>(`/products/${productId}`);
    return data;
  } catch (error: unknown) {
    if (
      error &&
      typeof error === "object" &&
      "status" in error &&
      (error as { status: number }).status === 404
    ) {
      return null;
    }
    console.error("Get product detail error:", error);
    throw error;
  }
}

/**
 * 상품 생성 (multipart/form-data)
 * POST /products
 */
export async function createProduct(
  request: CreateProductRequest,
  images?: File[]
): Promise<Product> {
  try {
    const formData = new FormData();

    // request 객체를 JSON Blob으로 추가
    formData.append(
      "request",
      new Blob([JSON.stringify(request)], { type: "application/json" })
    );

    // 이미지 파일들 추가
    if (images && images.length > 0) {
      images.forEach(image => {
        formData.append("images", image);
      });
    }

    const data = await apiPost<Product>("/products", formData, {
      headers: {
        // Content-Type은 브라우저가 자동으로 설정 (boundary 포함)
      },
    });

    return data;
  } catch (error) {
    console.error("Create product error:", error);
    throw error;
  }
}
