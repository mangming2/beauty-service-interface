import { apiGet } from "@/lib/apiClient";
import type { ApiError } from "@/lib/apiClient";
import type { ReviewDetail } from "@/types/api";
import type { CommunityPostListItem } from "@/api/community";

// ========== 타입 정의 ==========

/** 마이페이지 사용자 정보 */
export interface MyPageUser {
  id: number;
  email: string;
  nickname: string;
  lastLoginAt: string;
  /** 서버에서 반환 시 관리자 뱃지 표시 (예: USER | ADMIN) */
  role?: "USER" | "ADMIN";
}

/** 예약 내역 */
export interface Booking {
  reservationId: number;
  status: "PREBOOK" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
  packageId: number;
  packageName: string;
  packageDescription: string;
  totalPrice: number;
  visitDate: string;
  visitStartTime: string;
  visitEndTime: string;
  attractions: string[];
}

// ========== 마이페이지 API ==========

/**
 * 내 정보 조회
 * GET /mypage/user
 */
export async function getMyPageUser(): Promise<MyPageUser> {
  try {
    const data = await apiGet<MyPageUser>("/mypage/user");
    if (process.env.NODE_ENV === "development") {
      console.log("[GET /mypage/user] 응답:", JSON.stringify(data, null, 2));
    }
    return data;
  } catch (error) {
    const err = error as ApiError | undefined;
    if (
      err?.status !== 401 &&
      !(err?.status === 404 && err?.code === "USER_NOT_FOUND")
    ) {
      console.error("Get my page user error:", error);
    }
    throw error;
  }
}

/**
 * 내 리뷰 목록 조회
 * GET /mypage/reviews
 */
export async function getMyReviews(): Promise<ReviewDetail[]> {
  try {
    const data = await apiGet<ReviewDetail[]>("/mypage/reviews");
    return data ?? [];
  } catch (error) {
    console.error("Get my reviews error:", error);
    throw error;
  }
}

/**
 * 예약 내역 조회
 * GET /mypage/bookings
 */
export async function getMyBookings(): Promise<Booking[]> {
  try {
    const data = await apiGet<Booking[]>("/mypage/bookings");
    return data ?? [];
  } catch (error) {
    console.error("Get my bookings error:", error);
    throw error;
  }
}

/**
 * 예약 상세 조회
 * GET /mypage/bookings/:reservationId
 */
export async function getBookingDetail(
  reservationId: number
): Promise<Booking | null> {
  try {
    const data = await apiGet<Booking>(`/mypage/bookings/${reservationId}`);
    return data;
  } catch (error: unknown) {
    if (
      error &&
      typeof error === "object" &&
      "status" in error &&
      (error as { status: number }).status === 404
    ) {
      return null;
    }
    console.error("Get booking detail error:", error);
    throw error;
  }
}

/**
 * 다가오는 예약 조회
 * GET /mypage/bookings/upcoming
 */
export async function getUpcomingBookings(): Promise<Booking[]> {
  try {
    const data = await apiGet<Booking[]>("/mypage/bookings/upcoming");
    return data ?? [];
  } catch (error) {
    console.error("Get upcoming bookings error:", error);
    throw error;
  }
}

/**
 * 내가 북마크한 커뮤니티 게시글 목록 조회
 * GET /mypage/community/bookmarks
 */
export async function getMyBookmarkedCommunityPosts(): Promise<
  CommunityPostListItem[]
> {
  try {
    const data = await apiGet<CommunityPostListItem[]>(
      "/mypage/community/bookmarks"
    );
    return data ?? [];
  } catch (error) {
    console.error("Get my bookmarked community posts error:", error);
    throw error;
  }
}
