/**
 * API 요청/응답 타입 정의
 */

// ========== Form API Types ==========
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

// ========== Review API Types ==========
export interface CreateReviewRequest {
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

// ========== Auth API Types ==========
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

// ========== Package API Types ==========
// Package 타입은 packageService.ts에 정의되어 있음
