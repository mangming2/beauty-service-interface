import { supabase } from "./supabase";

// 타입 정의
export interface PackageComponent {
  id: string;
  title: string;
  location: string;
  description: string;
  image_src: string;
}

export interface PackageInclusion {
  id: number;
  type: "included" | "not_included";
  item: string;
}

export interface PackageChecklist {
  id: number;
  item: string;
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
    const { data, error } = await supabase
      .from("packages")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

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
    // 패키지 기본 정보
    const { data: packageData, error: packageError } = await supabase
      .from("packages")
      .select("*")
      .eq("id", packageId)
      .eq("is_active", true)
      .single();

    if (packageError) {
      if (packageError.code === "PGRST116") {
        return null; // 패키지를 찾을 수 없음
      }
      throw packageError;
    }

    if (!packageData) {
      return null;
    }

    // 관련 데이터들을 병렬로 가져오기 (에러 처리 개선)
    const [
      { data: components },
      { data: inclusions },
      { data: checklist },
      { data: reviews },
    ] = await Promise.all([
      supabase
        .from("package_components")
        .select("*")
        .eq("package_id", packageId),
      supabase
        .from("package_inclusions")
        .select("*")
        .eq("package_id", packageId),
      supabase
        .from("package_checklists")
        .select("*")
        .eq("package_id", packageId),
      supabase.from("package_reviews").select("*").eq("package_id", packageId),
    ]);

    // 포함/불포함 사항 분리
    const included =
      inclusions
        ?.filter(item => item.type === "included")
        .map(item => item.item) || [];
    const not_included =
      inclusions
        ?.filter(item => item.type === "not_included")
        .map(item => item.item) || [];

    const result = {
      ...packageData,
      components: components || [],
      included,
      not_included,
      checklist: checklist?.map(item => item.item) || [],
      reviews: reviews || [],
    };

    return result;
  } catch (error) {
    throw error;
  }
}

/**
 * 아티스트별 패키지 목록을 가져오는 함수
 */
export async function getPackagesByArtist(artist: string): Promise<Package[]> {
  try {
    const { data, error } = await supabase
      .from("packages")
      .select("*")
      .eq("artist", artist)
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

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
    const { data, error } = await supabase
      .from("packages")
      .select("*")
      .contains("tags", [tag])
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

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
    const { data, error } = await supabase
      .from("packages")
      .select("*")
      .or(
        `title.ilike.%${query}%,description.ilike.%${query}%,artist.ilike.%${query}%,concept.ilike.%${query}%`
      )
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    throw error;
  }
}
