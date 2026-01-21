import { apiGet, apiPost } from "@/lib/apiClient";

// ========== 타입 정의 ==========

/** 패키지 목록 아이템 */
export interface Package {
  id: number;
  name: string;
  description: string;
  minPrice: number;
  totalPrice: number;
  tagNames: string[];
}

/** 패키지 상세 - 상품 정보 */
export interface PackageProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  location: string;
}

/** 패키지 상세 */
export interface PackageDetail {
  id: number;
  name: string;
  description: string;
  products: PackageProduct[];
  tagNames: string[];
  slotStartDate: string;
  slotEndDate: string;
  slotStartTime: string;
  slotEndTime: string;
  reservationSlotCount: number;
  minPrice: number;
  totalPrice: number;
}

/** 패키지 생성 요청 */
export interface CreatePackageRequest {
  name: string;
  description: string;
  slotStartDate: string;
  slotEndDate: string;
  slotStartHour: number;
  slotEndHour: number;
  productIds: number[];
  tagNames: string[];
}

/** 패키지 목록 조회 파라미터 */
export interface GetPackagesParams {
  lastId?: number;
  size?: number;
  tag?: string;
}

// ========== 패키지 API ==========

/**
 * 패키지 목록 조회
 * - no-offset 기반 커서 페이지네이션
 * - tag 미지정 시 태그 없는 패키지만 조회
 *
 * GET /packages
 */
export async function getPackages(
  params: GetPackagesParams = {}
): Promise<Package[]> {
  try {
    const queryParams = new URLSearchParams();

    if (params.lastId !== undefined) {
      queryParams.append("lastId", String(params.lastId));
    }
    if (params.size !== undefined) {
      queryParams.append("size", String(params.size));
    }
    if (params.tag !== undefined) {
      queryParams.append("tag", params.tag);
    }

    const queryString = queryParams.toString();
    const url = `/packages${queryString ? `?${queryString}` : ""}`;

    const data = await apiGet<Package[]>(url);
    return data || [];
  } catch (error) {
    console.error("Get packages error:", error);
    throw error;
  }
}

/**
 * 태그별 패키지 목록 조회 (편의 함수)
 */
export async function getPackagesByTag(
  tag: string,
  params: Omit<GetPackagesParams, "tag"> = {}
): Promise<Package[]> {
  return getPackages({ ...params, tag });
}

/**
 * 패키지 상세 조회
 *
 * GET /packages/:packageId
 */
export async function getPackageDetail(
  packageId: number
): Promise<PackageDetail | null> {
  try {
    const data = await apiGet<PackageDetail>(`/packages/${packageId}`);

    if (!data) {
      return null;
    }

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
    console.error("Get package detail error:", error);
    throw error;
  }
}

/**
 * 패키지 생성
 *
 * POST /packages
 */
export async function createPackage(
  data: CreatePackageRequest
): Promise<{ id: number }> {
  try {
    return await apiPost<{ id: number }>("/packages", data);
  } catch (error) {
    console.error("Create package error:", error);
    throw error;
  }
}
