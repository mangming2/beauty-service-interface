import { apiGet } from "./apiClient";

// 타입 정의
export interface PackageComponent {
  id: string;
  title: string;
  location: string;
  description: string;
  image_src: string;
}

export interface PackageReview {
  id: string;
  username: string;
  rating: number;
  comment: string;
  avatar_src: string;
}

export interface Package {
  id: string;
  title: string;
  description: string;
  location: string;
  image_src: string[];
  price: number;
  currency: string;
  valid_period_start: string;
  valid_period_end: string;
  travel_time: string;
  map_location: string;
  map_address: string;
  tags: string[];
  artist: string;
  concept: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  // 관련 데이터들
  components?: PackageComponent[];
  included?: string[];
  not_included?: string[];
  checklist?: string[];
  reviews?: PackageReview[];
}

export interface PackageDetail extends Package {
  components: PackageComponent[];
  included: string[];
  not_included: string[];
  checklist: string[];
  reviews: PackageReview[];
}

/**
 * 모든 활성 패키지 목록을 가져오는 함수
 */
export async function getAllPackages(): Promise<Package[]> {
  try {
    const data = await apiGet<Package[]>("/packages?is_active=true");
    return data || [];
  } catch (error) {
    throw error;
  }
}

/**
 * 특정 패키지의 상세 정보를 가져오는 함수
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
  } catch (error: any) {
    if (error?.status === 404) {
      return null; // 패키지를 찾을 수 없음
    }
    throw error;
  }
}

/**
 * 아티스트별 패키지 목록을 가져오는 함수
 */
export async function getPackagesByArtist(artist: string): Promise<Package[]> {
  try {
    const data = await apiGet<Package[]>(
      `/packages?artist=${encodeURIComponent(artist)}&is_active=true`
    );
    return data || [];
  } catch (error) {
    throw error;
  }
}

/**
 * 태그별 패키지 목록을 가져오는 함수
 */
export async function getPackagesByTag(tag: string): Promise<Package[]> {
  try {
    const data = await apiGet<Package[]>(
      `/packages?tag=${encodeURIComponent(tag)}&is_active=true`
    );
    return data || [];
  } catch (error) {
    throw error;
  }
}

/**
 * 패키지 검색 함수
 */
export async function searchPackages(query: string): Promise<Package[]> {
  try {
    const data = await apiGet<Package[]>(
      `/packages/search?q=${encodeURIComponent(query)}&is_active=true`
    );
    return data || [];
  } catch (error) {
    throw error;
  }
}
