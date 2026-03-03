import { apiGet, apiDelete, apiRequest } from "@/lib/apiClient";

// ========== 타입 정의 ==========

/** 공지 게시글 목록 아이템 */
export interface AnnouncementPostListItem {
  postId: number;
  title: string;
  announcementDate: string;
  viewCount: number;
  createdAt: string;
}

/** 공지 게시글 상세 */
export interface AnnouncementPostDetail {
  postId: number;
  title: string;
  announcementDate: string;
  content: string;
  viewCount: number;
  imageUrls: string[];
  createdAt: string;
  updatedAt: string;
}

/** 공지 목록 조회 응답 (cursor) */
export interface AnnouncementListResponse {
  posts: AnnouncementPostListItem[];
  hasNext: boolean;
  nextCursor: string;
}

/** 공지 목록 조회 파라미터 */
export interface GetAnnouncementsParams {
  cursor?: string;
  size?: number;
}

/** 공지 생성/수정 요청 본문 (multipart의 request 필드) */
export interface AnnouncementRequestDto {
  title: string;
  announcementDate?: string;
  content: string;
}

/** 공지 생성 응답 */
export interface CreateAnnouncementResponse {
  id: number;
}

/** 공지 수정 응답 */
export interface UpdateAnnouncementResponse {
  id: number;
}

// ========== 공지 API ==========

const BASE = "/boards/announcements";

/**
 * 공지 게시글 목록 조회 (cursor)
 * GET /boards/announcements
 */
export async function getAnnouncements(
  params: GetAnnouncementsParams = {}
): Promise<AnnouncementListResponse> {
  try {
    const queryParams = new URLSearchParams();
    if (params.cursor !== undefined) {
      queryParams.append("cursor", params.cursor);
    }
    if (params.size !== undefined) {
      queryParams.append("size", String(params.size));
    }
    const queryString = queryParams.toString();
    const url = `${BASE}${queryString ? `?${queryString}` : ""}`;
    const data = await apiGet<AnnouncementListResponse>(url, {
      requireAuth: false,
    });
    return data;
  } catch (error) {
    console.error("Get announcements error:", error);
    throw error;
  }
}

/**
 * 공지 게시글 상세 조회 (조회수 증가)
 * GET /boards/announcements/:postId
 */
export async function getAnnouncementDetail(
  postId: number
): Promise<AnnouncementPostDetail | null> {
  try {
    const data = await apiGet<AnnouncementPostDetail>(`${BASE}/${postId}`, {
      requireAuth: false,
    });
    return data ?? null;
  } catch (error: unknown) {
    const err = error as { status?: number } | null;
    if (err?.status === 404) return null;
    console.error("Get announcement detail error:", error);
    throw error;
  }
}

/**
 * 공지 게시글 생성 (관리자)
 * POST /boards/announcements (multipart/form-data)
 */
export async function createAnnouncement(
  request: AnnouncementRequestDto,
  images?: File[]
): Promise<CreateAnnouncementResponse> {
  const formData = new FormData();
  const requestBlob = new Blob([JSON.stringify(request)], {
    type: "application/json",
  });
  formData.append("request", requestBlob);
  if (images?.length) {
    images.forEach(file => formData.append("images", file));
  }
  const data = await apiRequest<CreateAnnouncementResponse>(`${BASE}`, {
    method: "POST",
    body: formData,
    requireAuth: true,
  });
  return data;
}

/**
 * 공지 게시글 수정 (관리자)
 * PUT /boards/announcements/:postId (multipart/form-data)
 */
export async function updateAnnouncement(
  postId: number,
  request: AnnouncementRequestDto,
  images?: File[]
): Promise<UpdateAnnouncementResponse> {
  const formData = new FormData();
  const requestBlob = new Blob([JSON.stringify(request)], {
    type: "application/json",
  });
  formData.append("request", requestBlob);
  if (images?.length) {
    images.forEach(file => formData.append("images", file));
  }
  const data = await apiRequest<UpdateAnnouncementResponse>(
    `${BASE}/${postId}`,
    {
      method: "PUT",
      body: formData,
      requireAuth: true,
    }
  );
  return data;
}

/**
 * 공지 게시글 삭제 (관리자)
 * DELETE /boards/announcements/:postId
 */
export async function deleteAnnouncement(postId: number): Promise<void> {
  try {
    await apiDelete<void>(`${BASE}/${postId}`, { requireAuth: true });
  } catch (error) {
    console.error("Delete announcement error:", error);
    throw error;
  }
}
