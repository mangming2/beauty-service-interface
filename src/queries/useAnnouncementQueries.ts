import {
  useQuery,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  getAnnouncements,
  getAnnouncementDetail,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  type AnnouncementPostDetail,
  type AnnouncementListResponse,
  type GetAnnouncementsParams,
  type AnnouncementRequestDto,
} from "@/api/announcement";
import type { ApiError } from "@/lib/apiClient";

// ========== Query Keys ==========

export const announcementKeys = {
  all: ["announcements"] as const,
  lists: () => [...announcementKeys.all, "list"] as const,
  list: (params: GetAnnouncementsParams) =>
    [...announcementKeys.lists(), params] as const,
  details: () => [...announcementKeys.all, "detail"] as const,
  detail: (postId: number) => [...announcementKeys.details(), postId] as const,
} as const;

function retryUnless401(failureCount: number, error: unknown): boolean {
  const err = error as ApiError | undefined;
  if (err?.status === 401) return false;
  return failureCount < 2;
}

// ========== Queries ==========

/**
 * 공지 게시글 목록 조회 (단일 페이지)
 */
export function useAnnouncements(params: GetAnnouncementsParams = {}) {
  return useQuery<AnnouncementListResponse>({
    queryKey: announcementKeys.list(params),
    queryFn: () => getAnnouncements(params),
    staleTime: 5 * 60 * 1000,
    retry: retryUnless401,
  });
}

/**
 * 공지 게시글 목록 무한 스크롤 (cursor)
 */
export function useInfiniteAnnouncements(
  params: Omit<GetAnnouncementsParams, "cursor"> = {}
) {
  return useInfiniteQuery<AnnouncementListResponse>({
    queryKey: [...announcementKeys.lists(), "infinite", params],
    queryFn: ({ pageParam }) =>
      getAnnouncements({
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
 * 공지 게시글 상세 조회 (조회수 증가)
 */
export function useAnnouncementDetail(postId: number | undefined) {
  const isValid = typeof postId === "number" && Number.isFinite(postId);

  return useQuery<AnnouncementPostDetail | null>({
    queryKey: announcementKeys.detail(postId!),
    queryFn: () => getAnnouncementDetail(postId!),
    enabled: isValid,
    staleTime: 2 * 60 * 1000,
    retry: retryUnless401,
  });
}

// ========== Mutations ==========

/**
 * 공지 게시글 생성 (관리자)
 */
export function useCreateAnnouncement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      request,
      images,
    }: {
      request: AnnouncementRequestDto;
      images?: File[];
    }) => createAnnouncement(request, images),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: announcementKeys.lists() });
    },
  });
}

/**
 * 공지 게시글 수정 (관리자)
 */
export function useUpdateAnnouncement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      postId,
      request,
      images,
    }: {
      postId: number;
      request: AnnouncementRequestDto;
      images?: File[];
    }) => updateAnnouncement(postId, request, images),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: announcementKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: announcementKeys.detail(variables.postId),
      });
    },
  });
}

/**
 * 공지 게시글 삭제 (관리자)
 */
export function useDeleteAnnouncement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: number) => deleteAnnouncement(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: announcementKeys.lists() });
    },
  });
}
