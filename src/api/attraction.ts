import { apiGet } from "@/lib/apiClient";

export interface ProductTourAttractionItem {
  attractionCode: string;
  name: string;
  areaName: string | null;
  signguName: string | null;
  categoryLarge: string | null;
  categoryMiddle: string | null;
  rank: number;
  mapX: number | null;
  mapY: number | null;
  score: number;
  reason: string;
}

export interface ProductTourAttractionResponse {
  productId: number;
  productName: string;
  district: string;
  areaCode: number;
  signguCode: number;
  baseYm: string;
  llmEnhanced: boolean;
  attractions: ProductTourAttractionItem[];
}

export interface GetProductTourAttractionsParams {
  size?: number;
  baseYm?: string;
  category?: string;
  llm?: boolean;
}

export async function getProductTourAttractions(
  productId: number,
  params: GetProductTourAttractionsParams = {}
): Promise<ProductTourAttractionResponse> {
  const queryParams = new URLSearchParams();

  if (params.size !== undefined) {
    queryParams.append("size", String(params.size));
  }
  if (params.baseYm) {
    queryParams.append("base_ym", params.baseYm);
  }
  if (params.category) {
    queryParams.append("category", params.category);
  }
  if (params.llm !== undefined) {
    queryParams.append("llm", String(params.llm));
  }

  const qs = queryParams.toString();
  const url = `/products/${productId}/tourist-attractions${qs ? `?${qs}` : ""}`;

  return apiGet<ProductTourAttractionResponse>(url, { requireAuth: false });
}
