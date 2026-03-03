import { apiGet, apiPost, apiDelete, apiRequest } from "@/lib/apiClient";

// ========== 타입 정의 ==========

/** 커뮤니티 게시글 목록 아이템 */
export interface CommunityPostListItem {
  postId: number;
  authorDisplayName: string;
  title: string;
  previewContent: string;
  createdAt: string;
  likeCount: number;
  commentCount: number;
  bookmarkCount: number;
  isFeatured: boolean;
  tags: string[];
  imageUrls: string[];
}

/** 커뮤니티 게시글 상세 */
export interface CommunityPostDetail {
  postId: number;
  authorId: number;
  authorDisplayName: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  likeCount: number;
  commentCount: number;
  bookmarkCount: number;
  isFeatured: boolean;
  featuredAt: string | null;
  tags: string[];
  imageUrls: string[];
}

/** 커뮤니티 목록 조회 응답 (cursor) */
export interface CommunityListResponse {
  posts: CommunityPostListItem[];
  hasNext: boolean;
  nextCursor: string;
}

/** 커뮤니티 목록 조회 파라미터 */
export interface GetCommunityPostsParams {
  cursor?: string;
  size?: number;
  tag?: string;
}

/** 게시글 생성/수정 요청 본문 (multipart의 request 필드) */
export interface CommunityPostRequestDto {
  title: string;
  content: string;
  tags?: string[];
}

/** 게시글 생성/수정 응답 */
export interface CreateOrUpdatePostResponse {
  id: number;
}

/** 댓글 */
export interface CommunityComment {
  commentId: number;
  postId: number;
  authorId: number;
  authorDisplayName: string;
  content: string;
  createdAt: string;
}

/** 댓글 생성 요청 */
export interface CreateCommentRequest {
  content: string;
}

/** 댓글 생성 응답 */
export interface CreateCommentResponse {
  id: number;
}

/** 좋아요 토글 응답 */
export interface LikeToggleResponse {
  postId: number;
  isLiked: boolean;
}

/** 즐겨찾기 토글 응답 */
export interface BookmarkToggleResponse {
  postId: number;
  isBookmarked: boolean;
}

/** 태그 아이템 */
export interface CommunityTag {
  name: string;
}

// ========== 경로 상수 ==========

const BASE = "/boards/community";
const POSTS = `${BASE}/posts`;

// ========== 게시글 API ==========

/**
 * 커뮤니티 게시글 목록 조회 (cursor)
 * GET /boards/community/posts
 */
export async function getCommunityPosts(
  params: GetCommunityPostsParams = {}
): Promise<CommunityListResponse> {
  try {
    const queryParams = new URLSearchParams();
    if (params.cursor !== undefined) {
      queryParams.append("cursor", params.cursor);
    }
    if (params.size !== undefined) {
      queryParams.append("size", String(params.size));
    }
    if (params.tag !== undefined) {
      queryParams.append("tag", params.tag);
    }
    const queryString = queryParams.toString();
    const url = `${POSTS}${queryString ? `?${queryString}` : ""}`;
    const data = await apiGet<CommunityListResponse>(url, {
      requireAuth: false,
    });
    return data;
  } catch (error) {
    console.error("Get community posts error:", error);
    throw error;
  }
}

/**
 * 커뮤니티 인기 게시글 조회 (최근 7일)
 * GET /boards/community/posts/popular
 */
export async function getPopularPosts(
  size: number = 20
): Promise<CommunityPostListItem[]> {
  try {
    const url = `${POSTS}/popular?size=${size}`;
    const data = await apiGet<CommunityPostListItem[]>(url, {
      requireAuth: false,
    });
    return data ?? [];
  } catch (error) {
    console.error("Get popular posts error:", error);
    throw error;
  }
}

/**
 * 커뮤니티 게시글 상세 조회
 * GET /boards/community/posts/:postId
 */
export async function getCommunityPostDetail(
  postId: number
): Promise<CommunityPostDetail | null> {
  try {
    const data = await apiGet<CommunityPostDetail>(`${POSTS}/${postId}`, {
      requireAuth: false,
    });
    return data ?? null;
  } catch (error: unknown) {
    const err = error as { status?: number } | null;
    if (err?.status === 404) return null;
    console.error("Get community post detail error:", error);
    throw error;
  }
}

/**
 * 커뮤니티 게시글 생성
 * POST /boards/community/posts (multipart/form-data)
 */
export async function createCommunityPost(
  request: CommunityPostRequestDto,
  images?: File[]
): Promise<CreateOrUpdatePostResponse> {
  const formData = new FormData();
  const requestBlob = new Blob([JSON.stringify(request)], {
    type: "application/json",
  });
  formData.append("request", requestBlob);
  if (images?.length) {
    images.forEach(file => formData.append("images", file));
  }
  const data = await apiRequest<CreateOrUpdatePostResponse>(POSTS, {
    method: "POST",
    body: formData,
    requireAuth: true,
  });
  return data;
}

/**
 * 커뮤니티 게시글 수정
 * PUT /boards/community/posts/:postId (multipart/form-data)
 */
export async function updateCommunityPost(
  postId: number,
  request: CommunityPostRequestDto,
  images?: File[]
): Promise<CreateOrUpdatePostResponse> {
  const formData = new FormData();
  const requestBlob = new Blob([JSON.stringify(request)], {
    type: "application/json",
  });
  formData.append("request", requestBlob);
  if (images?.length) {
    images.forEach(file => formData.append("images", file));
  }
  const data = await apiRequest<CreateOrUpdatePostResponse>(
    `${POSTS}/${postId}`,
    {
      method: "PUT",
      body: formData,
      requireAuth: true,
    }
  );
  return data;
}

/**
 * 커뮤니티 게시글 삭제
 * DELETE /boards/community/posts/:postId
 */
export async function deleteCommunityPost(postId: number): Promise<void> {
  try {
    await apiDelete<void>(`${POSTS}/${postId}`, { requireAuth: true });
  } catch (error) {
    console.error("Delete community post error:", error);
    throw error;
  }
}

/**
 * 좋아요 토글
 * POST /boards/community/posts/:postId/likes
 */
export async function togglePostLike(
  postId: number
): Promise<LikeToggleResponse> {
  try {
    const data = await apiPost<LikeToggleResponse>(
      `${POSTS}/${postId}/likes`,
      undefined,
      { requireAuth: true }
    );
    return data;
  } catch (error) {
    console.error("Toggle post like error:", error);
    throw error;
  }
}

/**
 * 즐겨찾기 토글
 * POST /boards/community/posts/:postId/bookmarks
 */
export async function togglePostBookmark(
  postId: number
): Promise<BookmarkToggleResponse> {
  try {
    const data = await apiPost<BookmarkToggleResponse>(
      `${POSTS}/${postId}/bookmarks`,
      undefined,
      { requireAuth: true }
    );
    return data;
  } catch (error) {
    console.error("Toggle post bookmark error:", error);
    throw error;
  }
}

// ========== 댓글 API ==========

/**
 * 댓글 목록 조회
 * GET /boards/community/posts/:postId/comments
 */
export async function getPostComments(
  postId: number
): Promise<CommunityComment[]> {
  try {
    const data = await apiGet<CommunityComment[]>(
      `${POSTS}/${postId}/comments`,
      { requireAuth: false }
    );
    return data ?? [];
  } catch (error) {
    console.error("Get post comments error:", error);
    throw error;
  }
}

/**
 * 댓글 생성
 * POST /boards/community/posts/:postId/comments
 */
export async function createPostComment(
  postId: number,
  body: CreateCommentRequest
): Promise<CreateCommentResponse> {
  try {
    const data = await apiPost<CreateCommentResponse>(
      `${POSTS}/${postId}/comments`,
      body,
      { requireAuth: true }
    );
    return data;
  } catch (error) {
    console.error("Create post comment error:", error);
    throw error;
  }
}

/**
 * 댓글 삭제
 * DELETE /boards/community/posts/:postId/comments/:commentId
 */
export async function deletePostComment(
  postId: number,
  commentId: number
): Promise<void> {
  try {
    await apiDelete<void>(`${POSTS}/${postId}/comments/${commentId}`, {
      requireAuth: true,
    });
  } catch (error) {
    console.error("Delete post comment error:", error);
    throw error;
  }
}

// ========== 태그 API ==========

/**
 * 사용 가능한 태그 목록 조회
 * GET /boards/community/tags
 */
export async function getCommunityTags(): Promise<CommunityTag[]> {
  try {
    const data = await apiGet<CommunityTag[]>(`${BASE}/tags`, {
      requireAuth: false,
    });
    return data ?? [];
  } catch (error) {
    console.error("Get community tags error:", error);
    throw error;
  }
}
