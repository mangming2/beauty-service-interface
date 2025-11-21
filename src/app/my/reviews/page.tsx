"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/useAuthQueries";
import { useUserReviews, useDeleteReviews } from "@/hooks/useReviewQueries";
import { StarRating } from "@/components/ui/star-rating";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { PageLoading } from "@/components/common";
import { format } from "date-fns";
import { Check } from "lucide-react";

export default function MyReviewsPage() {
  const router = useRouter();
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

  const handleSelectAll = () => {
    if (selectedReviews.size === reviews?.length) {
      setSelectedReviews(new Set());
    } else {
      setSelectedReviews(new Set(reviews?.map(r => r.id) || []));
    }
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

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen text-white bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBack}
          className="p-0 h-auto"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10.5 12.5L5.5 8L10.5 3.5"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Button>
        <h1 className="text-lg font-semibold">My Reviews</h1>
        {!isEditMode ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditMode(true)}
            className="text-white"
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
            className="text-white"
          >
            Cancel
          </Button>
        )}
      </div>

      {/* Edit Mode Actions */}
      {isEditMode && (
        <div className="px-4 py-3 border-b border-gray-700 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSelectAll}
            className="text-white"
          >
            {selectedReviews.size === reviews?.length
              ? "Deselect All"
              : "Select All"}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDeleteSelected}
            disabled={
              selectedReviews.size === 0 || deleteReviewsMutation.isPending
            }
            className="text-white disabled:text-gray-500"
          >
            {deleteReviewsMutation.isPending ? (
              <div className="flex items-center gap-2">
                <Spinner className="w-4 h-4" />
                삭제 중...
              </div>
            ) : (
              `Delete Selected${selectedReviews.size > 0 ? ` · ${selectedReviews.size}` : ""}`
            )}
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
                  className={`py-4 flex items-start gap-3 ${
                    isEditMode ? "cursor-pointer" : ""
                  }`}
                  onClick={() => {
                    if (isEditMode) {
                      handleToggleSelect(review.id);
                    }
                  }}
                >
                  {/* Selection Checkbox (Edit Mode) */}
                  {isEditMode && (
                    <div className="pt-1">
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
                    <div className="text-white text-sm">{review.comment}</div>
                  </div>
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
