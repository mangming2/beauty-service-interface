import { apiGet } from "@/lib/apiClient";
import type { Package, PackageDetail } from "@/types/api";

// ========== 패키지 API ==========

/**
 * 모든 활성 패키지 목록을 가져오기
 * GET /packages?is_active=true 호출
 */
export async function getAllPackages(): Promise<Package[]> {
  try {
    const data = await apiGet<Package[]>("/packages?is_active=true");
    return data || [];
  } catch (error) {
    console.error("Get all packages error:", error);
    throw error;
  }
}

/**
 * 특정 패키지의 상세 정보를 가져오기
 * GET /packages/:packageId 호출
 */
export async function getPackageDetail(
  packageId: string
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
      return null; // 패키지를 찾을 수 없음
    }
    console.error("Get package detail error:", error);
    throw error;
  }
}

/**
 * 아티스트별 패키지 목록을 가져오기
 * GET /packages?artist=:artist&is_active=true 호출
 */
export async function getPackagesByArtist(artist: string): Promise<Package[]> {
  try {
    const data = await apiGet<Package[]>(
      `/packages?artist=${encodeURIComponent(artist)}&is_active=true`
    );
    return data || [];
  } catch (error) {
    console.error("Get packages by artist error:", error);
    throw error;
  }
}

/**
 * 태그별 패키지 목록을 가져오기
 * GET /packages?tag=:tag&is_active=true 호출
 */
export async function getPackagesByTag(tag: string): Promise<Package[]> {
  try {
    const data = await apiGet<Package[]>(
      `/packages?tag=${encodeURIComponent(tag)}&is_active=true`
    );
    return data || [];
  } catch (error) {
    console.error("Get packages by tag error:", error);
    throw error;
  }
}

/**
 * 패키지 검색
 * GET /packages/search?q=:query&is_active=true 호출
 */
export async function searchPackages(query: string): Promise<Package[]> {
  try {
    const data = await apiGet<Package[]>(
      `/packages/search?q=${encodeURIComponent(query)}&is_active=true`
    );
    return data || [];
  } catch (error) {
    console.error("Search packages error:", error);
    throw error;
  }
}
