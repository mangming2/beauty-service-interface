/**
 * API 요청/응답 타입 정의
 */

// ========== Auth API Types ==========
export interface User {
  id: string;
  email?: string;
  user_metadata?: Record<string, unknown>;
}

export interface Session {
  user: User;
  access_token?: string;
  expires_at?: number;
}

export interface Profile {
  id: string;
  full_name?: string;
  phone?: string;
  birth_date?: string;
  avatar_src?: string;
  created_at?: string;
  updated_at?: string;
}

export type AuthChangeEvent =
  | "SIGNED_IN"
  | "SIGNED_OUT"
  | "TOKEN_REFRESHED"
  | "USER_UPDATED";

export interface LoginResponse {
  grantType: string;
  accessToken: string;
  accessTokenExpireIn: number;
}

export interface LogoutResponse {
  success: boolean;
  message?: string;
}

export interface UpdateProfileRequest {
  full_name?: string;
  phone?: string;
  birth_date?: string;
  avatar_src?: string;
  updated_at: string;
  [key: string]: unknown; // 추가 필드 허용
}

// ========== Form API Types ==========
export interface FormSubmissionResult {
  success: boolean;
  error?: string;
}

export interface FormSubmissionRequest {
  user_id: string;
  selected_concepts: string[];
  favorite_idol: string;
  idol_option: string;
  date_range: {
    from: string;
    to: string;
  } | null;
  selected_regions: string[];
  created_at: string;
}

export interface FormSubmissionResponse {
  id: string;
  user_id: string;
  selected_concepts: string[];
  favorite_idol: string;
  idol_option: string;
  date_range: {
    from: string;
    to: string;
  } | null;
  selected_regions: string[];
  created_at: string;
  updated_at?: string;
}

export interface FormSubmissionSuccessResponse {
  success: boolean;
  message?: string;
}

// ========== Package API Types ==========
// Package 타입은 api/package.ts에 정의되어 있음
export interface PackageComponent {
  id: string;
  title: string;
  location: string;
  description: string;
  image_src: string;
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

// ========== Review API Types ==========
export interface CreateReviewRequest {
  package_id: string;
  user_id: string;
  username: string;
  rating: number;
  comment: string;
}

export interface CreateReviewData {
  package_id: string;
  user_id: string;
  username: string;
  rating: number;
  comment: string;
}

export interface BatchDeleteReviewsRequest {
  review_ids: string[];
}

export interface BatchDeleteReviewsResponse {
  success: boolean;
  deleted_count: number;
}

export interface ReviewSummary {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    [key: number]: number;
  };
}

// Review API에서 사용하는 상세 리뷰 타입 (Package의 reviews와는 다름)
export interface ReviewDetail {
  id: string;
  package_id: string;
  user_id: string;
  username: string;
  rating: number;
  comment: string;
  avatar_src?: string;
  created_at?: string;
  package_title?: string; // 패키지 제목 (사용자 리뷰 목록용)
}
