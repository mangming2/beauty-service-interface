import { supabase } from "./supabase";

export interface PackageReview {
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
  try {
    console.log("Fetching reviews for package ID:", packageId);

    // 먼저 리뷰 데이터를 가져옴
    const { data: reviews, error: reviewsError } = await supabase
      .from("package_reviews")
      .select("*")
      .eq("package_id", packageId);

    if (reviewsError) {
      console.error("Reviews fetch error:", reviewsError);
      if (reviewsError.code === "PGRST116") {
        console.log(
          "No reviews found for package or RLS policy blocking access"
        );
        return [];
      }
      throw new Error(
        `Failed to fetch package reviews: ${reviewsError.message}`
      );
    }

    if (!reviews || reviews.length === 0) {
      console.log("No reviews found for package");
      return [];
    }

    console.log(`Found ${reviews.length} reviews for package`);

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
        avatar_src: profile?.avatar_src || null,
      };
    });

    console.log("Reviews with profiles processed successfully");
    return reviewsWithProfile;
  } catch (error) {
    console.error("Get package reviews error:", error);
    throw error;
  }
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

// 특정 사용자의 리뷰 목록 조회 (패키지 정보 포함)
export async function getUserReviews(userId: string): Promise<PackageReview[]> {
  try {
    // 먼저 리뷰 데이터를 가져옴
    const { data: reviews, error: reviewsError } = await supabase
      .from("package_reviews")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (reviewsError) {
      console.error("User reviews fetch error:", reviewsError);
      if (reviewsError.code === "PGRST116") {
        return [];
      }
      throw new Error(`Failed to fetch user reviews: ${reviewsError.message}`);
    }

    if (!reviews || reviews.length === 0) {
      return [];
    }

    // 각 리뷰의 패키지 정보를 가져옴
    const packageIds = [...new Set(reviews.map(review => review.package_id))];

    const { data: packages, error: packagesError } = await supabase
      .from("packages")
      .select("id, title")
      .in("id", packageIds);

    if (packagesError) {
      console.warn("Failed to fetch package titles:", packagesError);
    }

    // 리뷰와 패키지 정보를 결합
    const reviewsWithPackage = reviews.map(review => {
      const packageData = packages?.find(p => p.id === review.package_id);
      return {
        ...review,
        package_title: packageData?.title || "Unknown Package",
      };
    });

    return reviewsWithPackage;
  } catch (error) {
    console.error("Get user reviews error:", error);
    throw error;
  }
}

// 리뷰 삭제
export async function deleteReview(reviewId: string): Promise<void> {
  const { error } = await supabase
    .from("package_reviews")
    .delete()
    .eq("id", reviewId);

  if (error) {
    throw new Error(`Failed to delete review: ${error.message}`);
  }
}

// 여러 리뷰 삭제
export async function deleteReviews(reviewIds: string[]): Promise<void> {
  if (reviewIds.length === 0) {
    return;
  }

  const { error } = await supabase
    .from("package_reviews")
    .delete()
    .in("id", reviewIds);

  if (error) {
    throw new Error(`Failed to delete reviews: ${error.message}`);
  }
}
