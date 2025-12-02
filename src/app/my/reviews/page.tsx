"use client";

import { useState } from "react";
import { useUser } from "@/hooks/useAuthQueries";
import { useUserReviews, useDeleteReviews } from "@/hooks/useReviewQueries";
import { StarRating } from "@/components/ui/star-rating";
import { Button } from "@/components/ui/button";
import { PageLoading } from "@/components/common";
import { format } from "date-fns";
import { Check } from "lucide-react";

export default function MyReviewsPage() {
  const { data: user, isLoading: userLoading } = useUser();
  const { data: reviews, isLoading: reviewsLoading } = useUserReviews(
    user?.id || ""
  );
  const deleteReviewsMutation = useDeleteReviews();

  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedReviews, setSelectedReviews] = useState<Set<string>>(
    new Set()
  );

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

  const handleToggleSelect = (reviewId: string) => {
    const newSelected = new Set(selectedReviews);
    if (newSelected.has(reviewId)) {
      newSelected.delete(reviewId);
    } else {
      newSelected.add(reviewId);
    }
    setSelectedReviews(newSelected);
  };

  const handleDeleteSelected = async () => {
    if (selectedReviews.size === 0) return;

    if (
      !confirm(`선택한 ${selectedReviews.size}개의 리뷰를 삭제하시겠습니까?`)
    ) {
      return;
    }

    try {
      await deleteReviewsMutation.mutateAsync(Array.from(selectedReviews));
      setSelectedReviews(new Set());
      setIsEditMode(false);
    } catch (error) {
      console.error("리뷰 삭제 실패:", error);
      alert("리뷰 삭제에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className="min-h-screen text-white bg-background">
      {/* Header */}
      <div className="flex justify-end px-4 py-3">
        {!isEditMode ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditMode(true)}
            className="text-disabled"
          >
            Edit
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setIsEditMode(false);
              setSelectedReviews(new Set());
            }}
            className="text-disabled"
          >
            Cancel
          </Button>
        )}
      </div>

      {/* Edit Mode Actions */}
      {isEditMode && (
        <div className="flex justify-end px-5">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDeleteSelected}
            disabled={
              selectedReviews.size === 0 || deleteReviewsMutation.isPending
            }
            className="text-white disabled:text-gray-500"
          >
            {`Delete Selected${selectedReviews.size > 0 ? ` · ${selectedReviews.size}` : ""}`}
          </Button>
        </div>
      )}

      {/* Reviews List */}
      <div className="px-4 py-4">
        {reviews && reviews.length > 0 ? (
          <div className="space-y-0">
            {reviews.map((review, index) => (
              <div key={review.id}>
                <div
                  className={`py-4 flex gap-3 ${
                    isEditMode ? "cursor-pointer" : ""
                  }`}
                  onClick={() => {
                    if (isEditMode) {
                      handleToggleSelect(review.id);
                    }
                  }}
                >
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

                  {/* Selection Checkbox (Edit Mode) */}
                  {isEditMode && (
                    <div className="flex self-center">
                      <div
                        className={`w-5 h-5 rounded-full border-2 border-white flex items-center justify-center ${
                          selectedReviews.has(review.id)
                            ? "bg-white"
                            : "bg-transparent"
                        }`}
                        onClick={e => {
                          e.stopPropagation();
                          handleToggleSelect(review.id);
                        }}
                      >
                        {selectedReviews.has(review.id) && (
                          <Check className="w-3 h-3 text-black" />
                        )}
                      </div>
                    </div>
                  )}
                </div>
                {index < reviews.length - 1 && (
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
    </div>
  );
}
