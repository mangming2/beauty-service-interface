"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import {
  usePackageReviews,
  usePackageReviewSummary,
} from "@/hooks/useReviewQueries";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { Star } from "lucide-react";

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

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-600"
        }`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Review Summary Section */}
        {summary && (
          <Card className="bg-gray-800 border-gray-700 mb-8">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                {/* Overall Rating */}
                <div className="text-center">
                  <div className="text-4xl font-bold text-white mb-2">
                    {summary.averageRating.toFixed(1)} / 5
                  </div>
                  <div className="flex justify-center mb-2">
                    {renderStars(Math.round(summary.averageRating))}
                  </div>
                  <div className="text-gray-400 text-sm">
                    {summary.totalReviews} reviews
                  </div>
                </div>

                {/* Rating Distribution */}
                <div className="flex-1 max-w-xs ml-8">
                  {[5, 4, 3, 2, 1].map(star => {
                    const count = summary.ratingDistribution[star] || 0;
                    const percentage =
                      summary.totalReviews > 0
                        ? (count / summary.totalReviews) * 100
                        : 0;

                    return (
                      <div key={star} className="flex items-center mb-2">
                        <span className="text-sm text-gray-400 w-4">
                          {star}
                        </span>
                        <div className="flex-1 mx-2">
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-pink-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                        <span className="text-sm text-gray-400 w-8 text-right">
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

        {/* Individual Reviews */}
        <div className="space-y-6">
          {reviews && reviews.length > 0 ? (
            reviews.map(review => (
              <Card key={review.id} className="bg-gray-800 border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full flex-shrink-0 overflow-hidden">
                      {review.avatar_src ? (
                        <Image
                          src={review.avatar_src}
                          alt={review.username}
                          width={40}
                          height={40}
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

                    {/* Review Content */}
                    <div className="flex-1">
                      {/* Username */}
                      <div className="text-white font-medium mb-1">
                        {review.username}
                      </div>

                      {/* Rating and Time */}
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="flex items-center">
                          {renderStars(review.rating)}
                        </div>
                        <div className="w-px h-4 bg-gray-600" />
                        <span className="text-gray-400 text-sm">
                          {formatTimeAgo(review.created_at || "")}
                        </span>
                      </div>

                      {/* Comment */}
                      <div className="text-white">{review.comment}</div>
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
