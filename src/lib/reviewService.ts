import { supabase } from "./supabase";

export interface PackageReview {
  id: string;
  package_id: string;
  username: string;
  rating: number;
  comment: string;
  avatar_src?: string;
  created_at?: string;
}

export interface ReviewSummary {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    [key: number]: number;
  };
}

export interface CreateReviewData {
  package_id: string;
  user_id: string;
  username: string;
  rating: number;
  comment: string;
}

// 특정 패키지의 리뷰 목록 조회 (사용자 프로필 정보 포함)
export async function getPackageReviews(
  packageId: string
): Promise<PackageReview[]> {
  // 먼저 리뷰 데이터를 가져옴
  const { data: reviews, error: reviewsError } = await supabase
    .from("package_reviews")
    .select("*")
    .eq("package_id", packageId);

  if (reviewsError) {
    throw new Error("Failed to fetch package reviews");
  }

  if (!reviews || reviews.length === 0) {
    return [];
  }

  // 각 리뷰의 사용자 프로필 정보를 가져옴
  const userIds = [...new Set(reviews.map(review => review.user_id))];

  const { data: profiles, error: profilesError } = await supabase
    .from("profiles")
    .select("id, full_name, avatar_src")
    .in("id", userIds);

  if (profilesError) {
    console.warn("Failed to fetch user profiles:", profilesError);
  }

  // 리뷰와 프로필 정보를 결합
  const reviewsWithProfile = reviews.map(review => {
    const profile = profiles?.find(p => p.id === review.user_id);
    return {
      ...review,
      username: profile?.full_name || review.username,
      avatar_src: profile?.avatar_src || null, // 프로필의 avatar_src 사용
    };
  });

  return reviewsWithProfile;
}

// 특정 패키지의 리뷰 요약 정보 조회
export async function getPackageReviewSummary(
  packageId: string
): Promise<ReviewSummary> {
  const reviews = await getPackageReviews(packageId);

  if (reviews.length === 0) {
    return {
      averageRating: 0,
      totalReviews: 0,
      ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    };
  }

  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = Math.round((totalRating / reviews.length) * 10) / 10;

  const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  reviews.forEach(review => {
    ratingDistribution[review.rating as keyof typeof ratingDistribution]++;
  });

  return {
    averageRating,
    totalReviews: reviews.length,
    ratingDistribution,
  };
}

// 리뷰 생성
export async function createReview(
  reviewData: CreateReviewData
): Promise<PackageReview> {
  const { data, error } = await supabase
    .from("package_reviews")
    .insert([reviewData])
    .select()
    .single();

  if (error) {
    throw new Error("Failed to create review");
  }

  return data;
}
