import { useQuery } from "@tanstack/react-query";
import {
  getMyPageUser,
  getMyReviews,
  getMyBookings,
  getBookingDetail,
  getUpcomingBookings,
  type MyPageUser,
  type Booking,
} from "@/api/my-page";
import type { ReviewDetail } from "@/types/api";

// ========== Query Keys ==========

export const myPageKeys = {
  all: ["myPage"] as const,
  user: () => [...myPageKeys.all, "user"] as const,
  reviews: () => [...myPageKeys.all, "reviews"] as const,
  bookings: () => [...myPageKeys.all, "bookings"] as const,
  bookingDetail: (id: number) => [...myPageKeys.all, "bookings", id] as const,
  upcomingBookings: () => [...myPageKeys.all, "bookings", "upcoming"] as const,
} as const;

// ========== Queries ==========

/**
 * 내 정보 조회
 */
export function useMyPageUser() {
  return useQuery<MyPageUser>({
    queryKey: myPageKeys.user(),
    queryFn: getMyPageUser,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
}

/**
 * 내 리뷰 목록 조회
 */
export function useMyReviews() {
  return useQuery<ReviewDetail[]>({
    queryKey: myPageKeys.reviews(),
    queryFn: getMyReviews,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
}

/**
 * 전체 예약 내역 조회
 */
export function useMyBookings() {
  return useQuery<Booking[]>({
    queryKey: myPageKeys.bookings(),
    queryFn: getMyBookings,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
}

/**
 * 예약 상세 조회
 */
export function useBookingDetail(reservationId: number | undefined) {
  return useQuery<Booking | null>({
    queryKey: myPageKeys.bookingDetail(reservationId!),
    queryFn: () => getBookingDetail(reservationId!),
    enabled: reservationId !== undefined,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
}

/**
 * 다가오는 예약 조회
 */
export function useUpcomingBookings() {
  return useQuery<Booking[]>({
    queryKey: myPageKeys.upcomingBookings(),
    queryFn: getUpcomingBookings,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
}
