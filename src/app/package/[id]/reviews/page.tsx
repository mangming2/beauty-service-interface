"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import {
  usePackageReviews,
  usePackageReviewSummary,
} from "@/hooks/useReviewQueries";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { StarRating } from "@/components/ui/star-rating";
import { GapY } from "../../../../components/ui/gap";

export default function ReviewsPage() {
  const params = useParams();
  const packageId = params.id as string;

  const {
    data: reviews,
    isLoading: reviewsLoading,
    error: reviewsError,
  } = usePackageReviews(packageId);
  const { data: summary, isLoading: summaryLoading } =
    usePackageReviewSummary(packageId);
  console.log(reviews);

  if (reviewsLoading || summaryLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Spinner className="w-8 h-8 text-white" />
      </div>
    );
  }

  if (reviewsError) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-center">
          <p className="text-lg">리뷰를 불러오는 중 오류가 발생했습니다.</p>
        </div>
      </div>
    );
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return "오늘";
    if (diffInDays === 1) return "1일 전";
    return `${diffInDays}일 전`;
  };

  return (
    <div className="min-h-screen text-white">
      <div className="container mx-auto px-5">
        <GapY size={20} />
        {/* Review Summary Section */}
        {summary && (
          <Card className="bg-gray-outline border-none rounded-[4px]">
            <CardContent className="py-5 px-3">
              <div className="flex items-center justify-center gap-7">
                {/* Overall Rating */}
                <div className="text-center">
                  <div className="title-lg text-white">
                    {summary.averageRating.toFixed(1)}{" "}
                    <span className="text-gray-2">/ 5</span>
                  </div>
                  <GapY size={4} />
                  <div className="flex justify-center">
                    <StarRating
                      rating={Math.round(summary.averageRating)}
                      readonly
                      size="sm"
                    />
                  </div>
                  <GapY size={2} />
                  <div className="text-gray-2 caption-sm">
                    {summary.totalReviews} reviews
                  </div>
                </div>

                {/* Rating Distribution */}
                <div className="flex flex-col">
                  {[5, 4, 3, 2, 1].map(star => {
                    const count = summary.ratingDistribution[star] || 0;
                    const percentage =
                      summary.totalReviews > 0
                        ? (count / summary.totalReviews) * 100
                        : 0;

                    return (
                      <div key={star} className="flex items-center gap-1">
                        <span className="caption-sm w-3 text-white">
                          {star}
                        </span>
                        <div className="flex w-30">
                          <div className="w-full bg-[#D9D9D9] rounded-full h-0.5">
                            <div
                              className="bg-pink-font h-0.5 rounded-full transition-all duration-300"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                        <span className="caption-sm text-gray-2 w-7 text-center">
                          {percentage.toFixed(0)}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        <GapY size={20} />

        {/* Individual Reviews */}
        <div className="space-y-4">
          {reviews && reviews.length > 0 ? (
            reviews.map(review => (
              <Card
                key={review.id}
                className="p-0 bg-transparent border-0 border-b-[1px] rounded-none border-gray"
              >
                <CardContent className="p-0 pb-3">
                  <div className="flex flex-col  items-start space-x-4">
                    <div className="flex items-start gap-2">
                      {/* Avatar */}
                      <div className="w-7 h-7 rounded-full flex-shrink-0 overflow-hidden">
                        {review.avatar_src ? (
                          <Image
                            src={review.avatar_src}
                            alt={review.username}
                            width={28}
                            height={28}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-600 flex items-center justify-center">
                            <span className="text-white text-sm font-medium">
                              {review.username.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>
                      {/* Username */}
                      <div className="text-white font-medium mb-1">
                        {review.username}
                      </div>
                    </div>
                    <GapY size={8} />
                    {/* Review Content */}
                    <div className="flex flex-col gap-3">
                      {/* Rating and Time */}
                      <div className="flex items-center space-x-2">
                        <StarRating rating={review.rating} readonly size="sm" />
                        <div className="w-px h-4 bg-gray-600" />
                        <span className="text-gray-400 text-sm">
                          {formatTimeAgo(review.created_at || "")}
                        </span>
                      </div>

                      {/* Comment */}
                      <div className="text-white text-md">{review.comment}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6 text-center">
                <div className="text-gray-400">아직 리뷰가 없습니다.</div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
