import {
  useQuery,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  getCommunityPosts,
  getPopularPosts,
  getCommunityPostDetail,
  createCommunityPost,
  updateCommunityPost,
  deleteCommunityPost,
  togglePostLike,
  togglePostBookmark,
  getPostComments,
  createPostComment,
  deletePostComment,
  getCommunityTags,
  type CommunityPostDetail,
  type CommunityPostListItem,
  type CommunityListResponse,
  type GetCommunityPostsParams,
  type CommunityPostRequestDto,
  type CreateCommentRequest,
  type CommunityComment,
  type CommunityTag,
} from "@/api/community";
import type { ApiError } from "@/lib/apiClient";

// ========== Query Keys ==========

export const communityKeys = {
  all: ["community"] as const,
  lists: () => [...communityKeys.all, "list"] as const,
  list: (params: GetCommunityPostsParams) =>
    [...communityKeys.lists(), params] as const,
  details: () => [...communityKeys.all, "detail"] as const,
  detail: (postId: number) => [...communityKeys.details(), postId] as const,
  comments: (postId: number) =>
    [...communityKeys.detail(postId), "comments"] as const,
  tags: () => [...communityKeys.all, "tags"] as const,
  popular: (size?: number) => [...communityKeys.all, "popular", size] as const,
} as const;

function retryUnless401(failureCount: number, error: unknown): boolean {
  const err = error as ApiError | undefined;
  if (err?.status === 401) return false;
  return failureCount < 2;
}

// ========== 게시글 Queries ==========

/**
 * 커뮤니티 게시글 목록 조회 (단일 페이지)
 */
export function useCommunityPosts(params: GetCommunityPostsParams = {}) {
  return useQuery<CommunityListResponse>({
    queryKey: communityKeys.list(params),
    queryFn: () => getCommunityPosts(params),
    staleTime: 5 * 60 * 1000,
    retry: retryUnless401,
  });
}

/**
 * 커뮤니티 게시글 목록 무한 스크롤 (cursor)
 */
export function useInfiniteCommunityPosts(
  params: Omit<GetCommunityPostsParams, "cursor"> = {}
) {
  return useInfiniteQuery<CommunityListResponse>({
    queryKey: [...communityKeys.lists(), "infinite", params],
    queryFn: ({ pageParam }) =>
      getCommunityPosts({
        ...params,
        cursor: pageParam as string | undefined,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: lastPage =>
      lastPage.hasNext ? lastPage.nextCursor : undefined,
    staleTime: 5 * 60 * 1000,
    retry: retryUnless401,
  });
}

/**
 * 커뮤니티 인기 게시글 조회 (최근 7일)
 */
export function usePopularPosts(size: number = 20) {
  return useQuery<CommunityPostListItem[]>({
    queryKey: communityKeys.popular(size),
    queryFn: () => getPopularPosts(size),
    staleTime: 5 * 60 * 1000,
    retry: retryUnless401,
  });
}

/**
 * 커뮤니티 게시글 상세 조회
 */
export function useCommunityPostDetail(postId: number | undefined) {
  const isValid = typeof postId === "number" && Number.isFinite(postId);

  return useQuery<CommunityPostDetail | null>({
    queryKey: communityKeys.detail(postId!),
    queryFn: () => getCommunityPostDetail(postId!),
    enabled: isValid,
    staleTime: 2 * 60 * 1000,
    retry: retryUnless401,
  });
}

/**
 * 사용 가능한 태그 목록 조회
 */
export function useCommunityTags() {
  return useQuery<CommunityTag[]>({
    queryKey: communityKeys.tags(),
    queryFn: getCommunityTags,
    staleTime: 10 * 60 * 1000,
    retry: retryUnless401,
  });
}

// ========== 댓글 Queries ==========

/**
 * 댓글 목록 조회
 */
export function usePostComments(postId: number | undefined) {
  const isValid = typeof postId === "number" && Number.isFinite(postId);

  return useQuery<CommunityComment[]>({
    queryKey: communityKeys.comments(postId!),
    queryFn: () => getPostComments(postId!),
    enabled: isValid,
    staleTime: 2 * 60 * 1000,
    retry: retryUnless401,
  });
}

// ========== 게시글 Mutations ==========

/**
 * 커뮤니티 게시글 생성
 */
export function useCreateCommunityPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      request,
      images,
    }: {
      request: CommunityPostRequestDto;
      images?: File[];
    }) => createCommunityPost(request, images),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: communityKeys.lists() });
      queryClient.invalidateQueries({ queryKey: communityKeys.popular() });
    },
  });
}

/**
 * 커뮤니티 게시글 수정
 */
export function useUpdateCommunityPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      postId,
      request,
      images,
    }: {
      postId: number;
      request: CommunityPostRequestDto;
      images?: File[];
    }) => updateCommunityPost(postId, request, images),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: communityKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: communityKeys.detail(variables.postId),
      });
      queryClient.invalidateQueries({ queryKey: communityKeys.popular() });
    },
  });
}

/**
 * 커뮤니티 게시글 삭제
 */
export function useDeleteCommunityPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: number) => deleteCommunityPost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: communityKeys.lists() });
      queryClient.invalidateQueries({ queryKey: communityKeys.popular() });
    },
  });
}

/**
 * 좋아요 토글
 */
export function useTogglePostLike() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: number) => togglePostLike(postId),
    onSuccess: (_, postId) => {
      queryClient.invalidateQueries({ queryKey: communityKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: communityKeys.detail(postId),
      });
      queryClient.invalidateQueries({ queryKey: communityKeys.popular() });
    },
  });
}

/**
 * 즐겨찾기 토글
 */
export function useTogglePostBookmark() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: number) => togglePostBookmark(postId),
    onSuccess: (_, postId) => {
      queryClient.invalidateQueries({ queryKey: communityKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: communityKeys.detail(postId),
      });
      queryClient.invalidateQueries({ queryKey: communityKeys.popular() });
    },
  });
}

// ========== 댓글 Mutations ==========

/**
 * 댓글 생성
 */
export function useCreatePostComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      postId,
      body,
    }: {
      postId: number;
      body: CreateCommentRequest;
    }) => createPostComment(postId, body),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: communityKeys.comments(variables.postId),
      });
      queryClient.invalidateQueries({
        queryKey: communityKeys.detail(variables.postId),
      });
      queryClient.invalidateQueries({ queryKey: communityKeys.lists() });
      queryClient.invalidateQueries({ queryKey: communityKeys.popular() });
    },
  });
}

/**
 * 댓글 삭제
 */
export function useDeletePostComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      postId,
      commentId,
    }: {
      postId: number;
      commentId: number;
    }) => deletePostComment(postId, commentId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: communityKeys.comments(variables.postId),
      });
      queryClient.invalidateQueries({
        queryKey: communityKeys.detail(variables.postId),
      });
      queryClient.invalidateQueries({ queryKey: communityKeys.lists() });
      queryClient.invalidateQueries({ queryKey: communityKeys.popular() });
    },
  });
}
