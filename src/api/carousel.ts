import { apiGet, apiPost, apiPut, apiDelete, apiRequest } from "@/lib/apiClient";

// ========== 타입 정의 ==========

export type CarouselLinkType = "PRODUCT" | "ANNOUNCEMENT";
export type CarouselType = "LANDING" | "COMMUNITY";

/** 랜딩 캐러셀 아이템 (public) */
export interface LandingCarouselItem {
  id: number;
  linkType: CarouselLinkType;
  linkId: number;
  imageUrl: string;
  hashtag: string;
}

/** 커뮤니티 캐러셀 아이템 (public) */
export interface CommunityCarouselItem {
  id: number;
  imageUrl: string;
}

/** 어드민 캐러셀 아이템 (공통) */
export interface AdminCarouselItem {
  id: number;
  type: CarouselType;
  title?: string;
  imageUrl: string;
  hashtag?: string;
  linkType?: CarouselLinkType;
  linkId?: number;
  sortOrder: number;
  isActive: boolean;
}

/** 랜딩 캐러셀 생성/수정 요청 */
export interface LandingCarouselRequest {
  linkType: CarouselLinkType;
  linkId: number;
  imageUrl: string;
  hashtag: string;
  sortOrder: number;
  isActive: boolean;
}

/** 커뮤니티 캐러셀 생성/수정 request 파트 */
export interface CommunityCarouselRequestDto {
  sortOrder: number;
  isActive: boolean;
  hashtag?: string;
}

/** 해시태그 빠른 수정 요청 */
export interface UpdateHashtagRequest {
  hashtag: string;
}

// ========== Public API ==========

/**
 * 랜딩 페이지 활성 캐러셀 목록
 * GET /carousels/landing
 */
export async function getLandingCarousels(): Promise<LandingCarouselItem[]> {
  return apiGet<LandingCarouselItem[]>("/carousels/landing", {
    optionalAuth: true,
  });
}

/**
 * 커뮤니티 페이지 활성 캐러셀 목록
 * GET /carousels/community
 */
export async function getCommunityCarousels(): Promise<CommunityCarouselItem[]> {
  return apiGet<CommunityCarouselItem[]>("/carousels/community", {
    optionalAuth: true,
  });
}

// ========== Admin API ==========

/**
 * 어드민 캐러셀 목록 조회 (type 필터)
 * GET /admin/carousels?type=LANDING
 */
export async function getAdminCarousels(
  type?: CarouselType
): Promise<AdminCarouselItem[]> {
  const params = type ? `?type=${type}` : "";
  return apiGet<AdminCarouselItem[]>(`/admin/carousels${params}`, {
    requireAuth: true,
  });
}

/**
 * 어드민 캐러셀 단건 조회
 * GET /admin/carousels/:id
 */
export async function getAdminCarouselDetail(
  id: number
): Promise<AdminCarouselItem> {
  return apiGet<AdminCarouselItem>(`/admin/carousels/${id}`, {
    requireAuth: true,
  });
}

/**
 * 랜딩 캐러셀 생성
 * POST /admin/carousels/landing
 */
export async function createLandingCarousel(
  request: LandingCarouselRequest
): Promise<AdminCarouselItem> {
  return apiPost<AdminCarouselItem>("/admin/carousels/landing", request, {
    requireAuth: true,
  });
}

/**
 * 랜딩 캐러셀 전체 수정
 * PUT /admin/carousels/landing/:id
 */
export async function updateLandingCarousel(
  id: number,
  request: LandingCarouselRequest
): Promise<AdminCarouselItem> {
  return apiPut<AdminCarouselItem>(
    `/admin/carousels/landing/${id}`,
    request,
    { requireAuth: true }
  );
}

/**
 * 해시태그 빠른 수정
 * PUT /admin/carousels/:id/hashtag
 */
export async function updateCarouselHashtag(
  id: number,
  hashtag: string
): Promise<void> {
  return apiPut<void>(
    `/admin/carousels/${id}/hashtag`,
    { hashtag } satisfies UpdateHashtagRequest,
    { requireAuth: true }
  );
}

/**
 * 커뮤니티 캐러셀 생성 (multipart)
 * POST /admin/carousels/community
 */
export async function createCommunityCarousel(
  image: File,
  dto: CommunityCarouselRequestDto
): Promise<AdminCarouselItem> {
  const formData = new FormData();
  formData.append("image", image);
  formData.append(
    "request",
    new Blob([JSON.stringify(dto)], { type: "application/json" })
  );
  return apiRequest<AdminCarouselItem>("/admin/carousels/community", {
    method: "POST",
    body: formData,
    requireAuth: true,
  });
}

/**
 * 커뮤니티 캐러셀 수정 (multipart, 이미지 교체 옵션)
 * PUT /admin/carousels/community/:id
 */
export async function updateCommunityCarousel(
  id: number,
  dto: CommunityCarouselRequestDto,
  image?: File
): Promise<AdminCarouselItem> {
  const formData = new FormData();
  if (image) {
    formData.append("image", image);
  }
  formData.append(
    "request",
    new Blob([JSON.stringify(dto)], { type: "application/json" })
  );
  return apiRequest<AdminCarouselItem>(`/admin/carousels/community/${id}`, {
    method: "PUT",
    body: formData,
    requireAuth: true,
  });
}

/**
 * 캐러셀 삭제
 * DELETE /admin/carousels/:id
 */
export async function deleteCarousel(id: number): Promise<void> {
  return apiDelete<void>(`/admin/carousels/${id}`, { requireAuth: true });
}
