import { useQuery } from "@tanstack/react-query";
import {
  getMyPageUser,
  getMyReviews,
  getMyBookings,
  getBookingDetail,
  getUpcomingBookings,
  getMyBookmarkedCommunityPosts,
  type MyPageUser,
  type Booking,
  type BookingDetail,
} from "@/api/my-page";
import type { ReviewDetail } from "@/types/api";
import type { CommunityPostListItem } from "@/api/community";
import { useAuthStore } from "@/store/useAuthStore";
import type { ApiError } from "@/lib/apiClient";

// ========== Query Keys ==========

export const myPageKeys = {
  all: ["myPage"] as const,
  user: () => [...myPageKeys.all, "user"] as const,
  reviews: () => [...myPageKeys.all, "reviews"] as const,
  bookings: () => [...myPageKeys.all, "bookings"] as const,
  bookingDetail: (id: number) => [...myPageKeys.all, "bookings", id] as const,
  upcomingBookings: () => [...myPageKeys.all, "bookings", "upcoming"] as const,
  communityBookmarks: () =>
    [...myPageKeys.all, "community", "bookmarks"] as const,
} as const;

/** 401(세션 만료) 시 재시도하지 않음 — apiClient에서 이미 reissue 시도함 */
function retryUnless401(failureCount: number, error: unknown): boolean {
  const err = error as ApiError | undefined;
  if (err?.status === 401) return false;
  return failureCount < 2;
}

// ========== Queries ==========

/**
 * 내 정보 조회
 * 비로그인 시 API 호출 안 함 (CORS/리다이렉트 에러 방지)
 * @param enabled - false면 추가로 API 호출 안 함
 */
export function useMyPageUser(enabled = true) {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  return useQuery<MyPageUser>({
    queryKey: myPageKeys.user(),
    queryFn: getMyPageUser,
    enabled: enabled && isAuthenticated,
    staleTime: 5 * 60 * 1000,
    retry: retryUnless401,
  });
}

/**
 * 내 리뷰 목록 조회
 * 비로그인 시 API 호출 안 함
 */
export function useMyReviews() {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  return useQuery<ReviewDetail[]>({
    queryKey: myPageKeys.reviews(),
    queryFn: getMyReviews,
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
    retry: retryUnless401,
  });
}

/**
 * 전체 예약 내역 조회
 * 비로그인 시 API 호출 안 함
 */
export function useMyBookings() {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  return useQuery<Booking[]>({
    queryKey: myPageKeys.bookings(),
    queryFn: getMyBookings,
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
    retry: retryUnless401,
  });
}

/**
 * 예약 상세 조회
 * 비로그인 시 API 호출 안 함
 */
export function useBookingDetail(reservationId: number | undefined) {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  return useQuery<BookingDetail | null>({
    queryKey: myPageKeys.bookingDetail(reservationId!),
    queryFn: () => getBookingDetail(reservationId!),
    enabled: isAuthenticated && reservationId !== undefined,
    staleTime: 5 * 60 * 1000,
    retry: retryUnless401,
  });
}

/**
 * 다가오는 예약 조회
 * 비로그인 시 API 호출 안 함
 */
export function useUpcomingBookings() {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  return useQuery<Booking[]>({
    queryKey: myPageKeys.upcomingBookings(),
    queryFn: getUpcomingBookings,
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
    retry: retryUnless401,
  });
}

/**
 * 내가 북마크한 커뮤니티 게시글 목록 조회
 * 비로그인 시 API 호출 안 함
 */
export function useMyBookmarkedCommunityPosts() {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  return useQuery<CommunityPostListItem[]>({
    queryKey: myPageKeys.communityBookmarks(),
    queryFn: getMyBookmarkedCommunityPosts,
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
    retry: retryUnless401,
  });
}
