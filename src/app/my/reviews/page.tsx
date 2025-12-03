"use client";

import { useState } from "react";
import { useUser } from "@/queries/useAuthQueries";
import { useUserReviews } from "@/queries/useReviewQueries";
import { StarRating } from "@/components/ui/star-rating";
import { Button } from "@/components/ui/button";
import { PageLoading } from "@/components/common";
import { format } from "date-fns";
import { Icons } from "@/components/common";

export default function MyReviewsPage() {
  const { data: user, isLoading: userLoading } = useUser();
  const { data: reviews, isLoading: reviewsLoading } = useUserReviews(
    user?.id || ""
  );

  const [isEditMode, setIsEditMode] = useState(false);
  const [deletedReviewIds, setDeletedReviewIds] = useState<Set<string>>(
    new Set()
  );
  //const deleteReviewsMutation = useDeleteReviews();

  if (userLoading || reviewsLoading) {
    return <PageLoading message="리뷰를 불러오는 중..." />;
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    try {
      return format(new Date(dateString), "yy.MM.dd");
    } catch {
      return "";
    }
  };

  const formatTimeAgo = (dateString?: string) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInMs = now.getTime() - date.getTime();
      const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

      if (diffInDays === 0) return "오늘";
      if (diffInDays === 1) return "1일 전";
      return `${diffInDays}일 전`;
    } catch {
      return "";
    }
  };

  const handleDeleteReview = (reviewId: string) => {
    setDeletedReviewIds(prev => new Set(prev).add(reviewId));
  };

  const handleSave = () => {
    if (deletedReviewIds.size > 0) {
      console.log("Deleting reviews:", Array.from(deletedReviewIds));
      // TODO: 실제 삭제 로직 구현
      // deleteReviewsMutation.mutate(Array.from(deletedReviewIds));
    }
    setDeletedReviewIds(new Set());
    setIsEditMode(false);
  };

  return (
    <div className="text-white bg-transparent flex flex-col flex-1">
      {/* Header */}
      <div className="flex justify-end px-4 py-3">
        {!isEditMode ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditMode(true)}
            className="text-disabled text-lg p-0"
          >
            Edit
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setIsEditMode(false);
              setDeletedReviewIds(new Set());
            }}
            className="text-disabled text-lg p-0"
          >
            Cancel
          </Button>
        )}
      </div>

      {/* Reviews List */}
      <div className="px-4">
        {reviews && reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews
              .filter(review => !deletedReviewIds.has(review.id))
              .map((review, index, filteredReviews) => (
                <div key={review.id}>
                  <div className="flex pb-[14px] gap-3">
                    {/* Review Content */}
                    <div className="flex-1">
                      {/* Title */}
                      <div className="font-bold text-white mb-2">
                        {review.package_title || "Unknown Package"}
                      </div>

                      {/* Rating and Date */}
                      <div className="flex items-center gap-2 mb-2">
                        <StarRating rating={review.rating} readonly size="sm" />
                        <div className="w-px h-4 bg-gray-600" />
                        <span className="text-gray-400 text-sm">
                          {isEditMode
                            ? formatTimeAgo(review.created_at)
                            : formatDate(review.created_at)}
                        </span>
                      </div>

                      {/* Comment */}
                      <div className="text-white text-md">{review.comment}</div>
                    </div>

                    {/* Delete Button (Edit Mode) */}
                    {isEditMode && (
                      <div className="flex self-center">
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            handleDeleteReview(review.id);
                          }}
                          className="cursor-pointer"
                        >
                          <Icons.delete />
                        </button>
                      </div>
                    )}
                  </div>
                  {index < filteredReviews.length - 1 && (
                    <div className="h-px bg-gray-700" />
                  )}
                </div>
              ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400">작성한 리뷰가 없습니다.</div>
          </div>
        )}
      </div>

      {/* Navigation */}
      {isEditMode && (
        <div
          className="mt-auto py-4 px-5"
          style={{
            boxShadow: "inset 0 6px 6px -6px rgba(255, 255, 255, 0.12)",
          }}
        >
          <Button
            className="w-full h-[52px] text-lg"
            onClick={handleSave}
            disabled={deletedReviewIds.size === 0}
          >
            Save
          </Button>
        </div>
      )}
    </div>
  );
}
