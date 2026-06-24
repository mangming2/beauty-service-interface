import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getLandingCarousels,
  getCommunityCarousels,
  getAdminCarousels,
  getAdminCarouselDetail,
  createLandingCarousel,
  updateLandingCarousel,
  updateCarouselHashtag,
  createCommunityCarousel,
  updateCommunityCarousel,
  deleteCarousel,
  type LandingCarouselItem,
  type CommunityCarouselItem,
  type AdminCarouselItem,
  type LandingCarouselRequest,
  type CommunityCarouselRequestDto,
  type CarouselType,
} from "@/api/carousel";
import type { ApiError } from "@/lib/apiClient";

// ========== Query Keys ==========

export const carouselKeys = {
  all: ["carousels"] as const,
  landing: () => [...carouselKeys.all, "landing"] as const,
  community: () => [...carouselKeys.all, "community"] as const,
  admin: () => [...carouselKeys.all, "admin"] as const,
  adminList: (type?: CarouselType) =>
    [...carouselKeys.admin(), "list", type] as const,
  adminDetail: (id: number) => [...carouselKeys.admin(), "detail", id] as const,
} as const;

function retryUnless401(failureCount: number, error: unknown): boolean {
  const err = error as ApiError | undefined;
  if (err?.status === 401) return false;
  return failureCount < 2;
}

// ========== Public Queries ==========

/** 랜딩 페이지 활성 캐러셀 목록 */
export function useLandingCarousels() {
  return useQuery<LandingCarouselItem[]>({
    queryKey: carouselKeys.landing(),
    queryFn: getLandingCarousels,
    staleTime: 5 * 60 * 1000,
    retry: retryUnless401,
  });
}

/** 커뮤니티 페이지 활성 캐러셀 목록 */
export function useCommunityCarousels() {
  return useQuery<CommunityCarouselItem[]>({
    queryKey: carouselKeys.community(),
    queryFn: getCommunityCarousels,
    staleTime: 5 * 60 * 1000,
    retry: retryUnless401,
  });
}

// ========== Admin Queries ==========

/** 어드민 캐러셀 목록 (type 필터) */
export function useAdminCarousels(type?: CarouselType) {
  return useQuery<AdminCarouselItem[]>({
    queryKey: carouselKeys.adminList(type),
    queryFn: () => getAdminCarousels(type),
    staleTime: 2 * 60 * 1000,
    retry: retryUnless401,
  });
}

/** 어드민 캐러셀 단건 */
export function useAdminCarouselDetail(id: number | null) {
  return useQuery<AdminCarouselItem>({
    queryKey: carouselKeys.adminDetail(id!),
    queryFn: () => getAdminCarouselDetail(id!),
    enabled: id !== null,
    staleTime: 2 * 60 * 1000,
    retry: retryUnless401,
  });
}

// ========== Admin Mutations ==========

/** 랜딩 캐러셀 생성 */
export function useCreateLandingCarousel() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: LandingCarouselRequest) =>
      createLandingCarousel(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: carouselKeys.landing() });
      queryClient.invalidateQueries({ queryKey: carouselKeys.adminList("LANDING") });
    },
  });
}

/** 랜딩 캐러셀 수정 */
export function useUpdateLandingCarousel() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, request }: { id: number; request: LandingCarouselRequest }) =>
      updateLandingCarousel(id, request),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: carouselKeys.landing() });
      queryClient.invalidateQueries({ queryKey: carouselKeys.adminList("LANDING") });
      queryClient.invalidateQueries({ queryKey: carouselKeys.adminDetail(id) });
    },
  });
}

/** 해시태그 빠른 수정 */
export function useUpdateCarouselHashtag() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, hashtag }: { id: number; hashtag: string }) =>
      updateCarouselHashtag(id, hashtag),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: carouselKeys.landing() });
      queryClient.invalidateQueries({ queryKey: carouselKeys.admin() });
    },
  });
}

/** 커뮤니티 캐러셀 생성 */
export function useCreateCommunityCarousel() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ image, dto }: { image: File; dto: CommunityCarouselRequestDto }) =>
      createCommunityCarousel(image, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: carouselKeys.community() });
      queryClient.invalidateQueries({ queryKey: carouselKeys.adminList("COMMUNITY") });
    },
  });
}

/** 커뮤니티 캐러셀 수정 */
export function useUpdateCommunityCarousel() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto, image }: { id: number; dto: CommunityCarouselRequestDto; image?: File }) =>
      updateCommunityCarousel(id, dto, image),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: carouselKeys.community() });
      queryClient.invalidateQueries({ queryKey: carouselKeys.adminList("COMMUNITY") });
      queryClient.invalidateQueries({ queryKey: carouselKeys.adminDetail(id) });
    },
  });
}

/** 캐러셀 삭제 */
export function useDeleteCarousel() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteCarousel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: carouselKeys.all });
    },
  });
}
