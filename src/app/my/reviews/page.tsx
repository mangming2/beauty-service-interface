"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useUser } from "@/queries/useAuthQueries";
import { useMyReviews, myPageKeys } from "@/queries/useMyPageQueries";
import { useDeleteReview } from "@/queries/useReviewQueries";
import { StarRating } from "@/components/ui/star-rating";
import { Button } from "@/components/ui/button";
import { PageLoading } from "@/components/common";
import { format } from "date-fns";
import { Icons } from "@/components/common";
import { useTranslation } from "@/hooks/useTranslation";

export default function MyReviewsPage() {
  const queryClient = useQueryClient();
  const { user } = useUser();
  const { t } = useTranslation();
  const { data: reviews, isLoading: reviewsLoading } = useMyReviews();
  const deleteReviewMutation = useDeleteReview();

  const [isEditMode, setIsEditMode] = useState(false);
  const [deletedReviewIds, setDeletedReviewIds] = useState<Set<number>>(
    new Set()
  );

  if (!user) {
    return <PageLoading message={t("edit.loadingUser")} />;
  }

  if (reviewsLoading) {
    return <PageLoading message={t("package.loadingReviews")} />;
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

      if (diffInDays === 0) return t("reviews.today");
      if (diffInDays === 1) return t("reviews.daysAgoOne");
      return `${diffInDays}${t("reviews.daysAgo")}`;
    } catch {
      return "";
    }
  };

  const handleDeleteReview = (reviewId: number) => {
    setDeletedReviewIds(prev => new Set(prev).add(reviewId));
  };

  const handleSave = async () => {
    if (deletedReviewIds.size === 0 || !reviews) {
      setIsEditMode(false);
      return;
    }
    const userId = Number(user.id);
    if (Number.isNaN(userId)) {
      setIsEditMode(false);
      return;
    }
    try {
      for (const reviewId of deletedReviewIds) {
        const review = reviews.find(r => r.reviewId === reviewId);
        if (review) {
          await deleteReviewMutation.mutateAsync({
            productId: review.productId,
            reviewId: review.reviewId,
            userId,
          });
        }
      }
      setDeletedReviewIds(new Set());
      setIsEditMode(false);
      await queryClient.invalidateQueries({ queryKey: myPageKeys.reviews() });
    } catch (error) {
      console.error("Delete reviews error:", error);
    }
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
            {t("reviews.edit")}
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
            {t("reviews.cancel")}
          </Button>
        )}
      </div>

      {/* Reviews List */}
      <div className="px-4">
        {reviews && reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews
              .filter(review => !deletedReviewIds.has(review.reviewId))
              .map((review, index, filteredReviews) => (
                <div key={review.reviewId}>
                  <div className="flex pb-[14px] gap-3">
                    {/* Review Content */}
                    <div className="flex-1">
                      {/* Title */}
                      <div className="font-bold text-white mb-2">
                        Package #{review.productId}
                      </div>

                      {/* Rating and Date */}
                      <div className="flex items-center gap-2 mb-2">
                        <StarRating rating={review.rating} readonly size="sm" />
                        <div className="w-px h-4 bg-gray-600" />
                        <span className="text-gray-400 text-sm">
                          {isEditMode
                            ? formatTimeAgo(review.createdAt)
                            : formatDate(review.createdAt)}
                        </span>
                      </div>

                      {/* Comment */}
                      <div className="text-white text-md">{review.content}</div>
                    </div>

                    {/* Delete Button (Edit Mode) */}
                    {isEditMode && (
                      <div className="flex self-center">
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            handleDeleteReview(review.reviewId);
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
            <div className="text-gray-400">{t("reviews.noReviewsWritten")}</div>
          </div>
        )}
      </div>

      {/* Navigation */}
      {isEditMode && (
        <div
          className="sticky bottom-0 py-4 px-5 bg-background"
          style={{
            boxShadow: "inset 0 6px 6px -6px rgba(255, 255, 255, 0.12)",
          }}
        >
          <Button
            className="w-full h-[52px] text-lg"
            onClick={handleSave}
            disabled={
              deletedReviewIds.size === 0 || deleteReviewMutation.isPending
            }
          >
            {deleteReviewMutation.isPending
              ? t("reviews.saving")
              : t("reviews.save")}
          </Button>
        </div>
      )}
    </div>
  );
}
