"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useProductReviews } from "@/queries/useReviewQueries";
import {
  useProductDetail,
  useProductOptions,
} from "@/queries/useProductQueries";
import { useMyPageUser } from "@/queries/useMyPageQueries";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { StarRating } from "@/components/ui/star-rating";
import { GapY } from "../../../../components/ui/gap";
import { Divider } from "@/components/ui/divider";
import { ArrowRightIcon } from "@/components/common/Icons";
import { useTranslation } from "@/hooks/useTranslation";

export default function ReviewsPage() {
  const params = useParams();
  const packageId = Number(params.id);
  const { t } = useTranslation();

  const {
    data: reviews,
    isLoading: reviewsLoading,
    error: reviewsError,
  } = useProductReviews(packageId);

  const { data: productDetail } = useProductDetail(packageId);
  const { data: options = [] } = useProductOptions(packageId);
  const { data: myUser } = useMyPageUser();

  // optionId → option 매핑
  const optionMap = new Map(options.map(o => [o.id, o]));

  // 리뷰 요약 계산
  const summary =
    reviews && reviews.length > 0
      ? {
          averageRating:
            reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length,
          totalReviews: reviews.length,
          ratingDistribution: [1, 2, 3, 4, 5].reduce(
            (acc, star) => ({
              ...acc,
              [star]: reviews.filter(r => r.rating === star).length,
            }),
            {} as { [key: number]: number }
          ),
        }
      : null;

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (diffInDays === 0) return t("reviews.today");
    if (diffInDays === 1) return t("reviews.daysAgoOne");
    return `${diffInDays}${t("reviews.daysAgo")}`;
  };

  if (reviewsLoading) {
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
          <p className="text-lg">{t("package.errorLoadingReviews")}</p>
        </div>
      </div>
    );
  }

  // 내 리뷰 상단 정렬
  const myReviews =
    reviews?.filter(r => myUser && r.userId === myUser.id) ?? [];
  const otherReviews =
    reviews?.filter(r => !myUser || r.userId !== myUser.id) ?? [];
  const sortedReviews = [...myReviews, ...otherReviews];

  const ReviewCard = ({
    review,
    isMine,
  }: {
    review: (typeof sortedReviews)[0];
    isMine: boolean;
  }) => {
    const option = review.optionId ? optionMap.get(review.optionId) : null;

    return (
      <div className="flex flex-col gap-3">
        {/* 옵션 카드 헤더 */}
        {option ? (
          <Link href={`/package/${packageId}`}>
            <div className="bg-gray-container border border-[#2E3033] rounded-[8px] px-3 py-2 flex items-center justify-between">
              <div>
                <p className="text-gray-font caption-sm">
                  {productDetail?.name ?? ""}
                </p>
                <p className="text-white text-md font-medium">{option.name}</p>
              </div>
              <ArrowRightIcon color="#B9BBC2" width={7} height={14} />
            </div>
          </Link>
        ) : null}

        {/* 유저 + 리뷰 */}
        <Card className="p-0 bg-transparent border-0 rounded-none">
          <CardContent className="p-0 pb-3">
            <div className="flex items-start gap-2 mb-2">
              <div className="w-7 h-7 rounded-full flex-shrink-0 bg-gray-600 flex items-center justify-center overflow-hidden">
                {review.avatar_src ? (
                  <Image
                    src={review.avatar_src}
                    alt="avatar"
                    width={28}
                    height={28}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-white text-xs font-medium">
                    {isMine ? "ME" : `U`}
                  </span>
                )}
              </div>
              <div className="text-white font-medium">
                {isMine ? t("reviews.myReview") : `User #${review.userId}`}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center space-x-2">
                <StarRating rating={review.rating} readonly size="sm" />
                <div className="w-px h-4 bg-gray-600" />
                <span className="text-gray-400 text-sm">
                  {formatTimeAgo(review.createdAt ?? "")}
                </span>
              </div>
              <p className="text-white text-md">{review.content}</p>

              {/* 리뷰 이미지 */}
              {review.images && review.images.length > 0 && (
                <div className="flex gap-2 mt-1 flex-wrap">
                  {review.images.map(img => (
                    <div
                      key={img.id}
                      className="relative w-16 h-16 rounded-[4px] overflow-hidden flex-shrink-0"
                    >
                      <Image
                        src={img.url}
                        alt={img.originalFilename}
                        fill
                        className="object-cover"
                        unoptimized={img.url.startsWith("http")}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="min-h-screen text-white">
      <div className="container mx-auto px-5">
        <GapY size={20} />

        {/* 평점 요약 */}
        {summary && (
          <Card className="bg-gray-outline border-none rounded-[4px]">
            <CardContent className="py-5 px-3">
              <div className="flex items-center justify-center gap-7">
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
                    {summary.totalReviews} {t("reviews.reviewsCount")}
                  </div>
                </div>

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

        <GapY size={16} />

        {/* 리뷰 목록 */}
        {sortedReviews.length > 0 ? (
          <div className="space-y-4">
            {myReviews.length > 0 && (
              <>
                {myReviews.map(review => (
                  <ReviewCard key={review.reviewId} review={review} isMine />
                ))}
                {otherReviews.length > 0 && <Divider height={8} />}
              </>
            )}
            {otherReviews.map(review => (
              <ReviewCard
                key={review.reviewId}
                review={review}
                isMine={false}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-4 py-16">
            <Image
              src="/no-review.png"
              alt="no reviews"
              width={200}
              height={200}
            />
            <p className="title-md text-gray-2 text-center">
              {t("package.noReviewsYet")}
            </p>
            <p className="text-md text-white font-semibold text-center whitespace-pre-line">
              {t("package.noReviewsYetSub")}
            </p>
          </div>
        )}

        <GapY size={8} />
      </div>
    </div>
  );
}
