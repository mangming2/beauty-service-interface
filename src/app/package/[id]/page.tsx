"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { GapY } from "../../../components/ui/gap";
import {
  useProductDetail,
  useProductOptions,
} from "@/queries/useProductQueries";
import { useProductReviews } from "@/queries/useReviewQueries";
import { useWishes, useToggleWish } from "@/queries/useWishQueries";
import Link from "next/link";
import { PageError, PageLoading } from "@/components/common";
import {
  HeartIcon,
  BorderHeartIcon,
  LocationIcon,
  ShareIcon,
  ArrowRightIcon,
} from "../../../components/common/Icons";
import { LanguageSelector } from "../../../components/common/LanguageSelector";
import { TranslatedText } from "../../../components/main/TranslatedText";
import { ReviewDetail } from "@/types/api";
import { useTranslation } from "@/hooks/useTranslation";
import { getSafeImageSrc } from "@/lib/utils";

export default function PackageDetail() {
  const params = useParams();
  const router = useRouter();
  const { t } = useTranslation();
  const packageId = Number(params.id);
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);

  const { data: productDetail, isLoading, error } = useProductDetail(packageId);

  const { data: options = [], isLoading: optionsLoading } =
    useProductOptions(packageId);

  const { data: wishes = [] } = useWishes();
  const toggleWishMutation = useToggleWish();
  const isWished = wishes.some(w => w.id === packageId);

  const {
    data: reviews,
    isLoading: reviewsLoading,
    error: reviewsError,
  } = useProductReviews(packageId);
  // 로딩 상태
  if (isLoading) {
    return <PageLoading message="패키지 정보를 불러오는 중..." />;
  }

  // 에러 상태
  if (error) {
    return (
      <PageError
        title="Oops!"
        description="An unexpected error occurred. Please try again later."
        buttonText="Back to main page"
        buttonHref="/"
      />
    );
  }

  // 패키지를 찾을 수 없는 경우
  if (!productDetail) {
    return (
      <div className="bg-transparent flex flex-col flex-1">
        <div className="flex-1 flex flex-col items-center justify-center gap-3">
          <Image src={"/empty.png"} alt="Empty Logo" width={372} height={200} />
          <h1 className="title-lg text-gray-2">{t("package.emptyPackage")}</h1>
          <span className="text-white text-lg text-center">
            {t("package.packageDeletedOrMoved")}
          </span>
        </div>
        <div
          className="w-full py-4 px-5"
          style={{
            boxShadow: "inset 0 6px 6px -6px rgba(255, 255, 255, 0.12)",
          }}
        >
          <Link href="/">
            <Button
              variant="default"
              className="w-full h-12 text-lg font-semibold"
            >
              {t("package.backToMain")}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleOptionBook = (optionId: number) => {
    router.push(`/package/${productDetail.id}/${optionId}`);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={i < rating ? "text-yellow-400" : "text-gray-600"}
      >
        ★
      </span>
    ));
  };

  return (
    <>
      <header>
        <div
          className="container mx-auto px-5 py-[14px] flex justify-between items-center"
          style={{
            boxShadow: "0 4px 7px -2px rgba(0,0,0,0.15)",
          }}
        >
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => toggleWishMutation.mutate(packageId)}
              disabled={toggleWishMutation.isPending}
              className="w-6 h-6 flex items-center justify-center"
            >
              {isWished ? (
                <HeartIcon color="#F92595" />
              ) : (
                <BorderHeartIcon />
              )}
            </button>
            <ShareIcon />
          </div>
          <LanguageSelector />
        </div>
      </header>
      <div className="min-h-screen text-white">
        {/* Main Package Image */}
        <div className="relative w-full h-[412px]">
          <Image
            src={getSafeImageSrc(productDetail.imageUrls?.[0])}
            alt={productDetail.name}
            fill
            className="object-cover"
          />
        </div>

        {/* Contents : 제목 ~ 지도까지지 */}
        <div className="flex flex-col py-4">
          {/* Package Title and Location */}
          <div className="px-5">
            <h1 className="title-md">{productDetail.name}</h1>
            <span className="text-gray-font text-md">
              {productDetail?.address}
            </span>
            <div className="mt-4 rounded-[12px] bg-gray-container border border-[#2E3033]">
              <button
                type="button"
                className="w-full flex items-center justify-between px-3 py-2 text-left"
                onClick={() => setIsDescriptionOpen(prev => !prev)}
                aria-expanded={isDescriptionOpen}
              >
                <span className="text-white text-lg">
                  {t("package.description")}
                </span>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className={`transition-transform ${isDescriptionOpen ? "rotate-180" : ""}`}
                >
                  <path
                    d="M6 9L12 15L18 9"
                    stroke="#E5E7EB"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              {isDescriptionOpen && (
                <p className="px-3 py-2 text-md text-white leading-relaxed">
                  {productDetail.description ?? ""}
                </p>
              )}
            </div>
          </div>

          <GapY size={20} />

          {/* Package Details Section */}
          <div>
            <h2 className="title-md px-5">{t("package.packageDetails")}</h2>
            <GapY size={12} />
            {/* Option list from GET /products/:productId/options */}
            <div className="flex flex-col w-full gap-3 px-5">
              {optionsLoading ? (
                <div className="py-6 text-center text-gray-400">
                  {t("package.loadingReviews")}
                </div>
              ) : (
                options.map(option => {
                  const finalPrice =
                    option.discountRate > 0
                      ? Math.round(
                          (option.price * (100 - option.discountRate)) / 100
                        )
                      : option.price;
                  return (
                    <div key={option.id}>
                      <Card
                        className="bg-gray-container border-solid border-[1px] border-[#2E3033] rounded-[8px] p-3 cursor-pointer"
                        onClick={() => handleOptionBook(option.id)}
                      >
                        <CardContent className="p-0">
                          <div className="flex gap-3 items-start">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                {option.isRepresent && (
                                  <div className="caption-sm bg-primary text-white px-2 py-1">
                                    Featured
                                  </div>
                                )}
                                {option.optionTags?.length ? (
                                  <p className="text-white caption-md truncate">
                                    {option.optionTags
                                      .slice(0, 2)
                                      .map(tag => `#${tag}`)
                                      .join(" ")}
                                  </p>
                                ) : null}
                              </div>

                              <p className="text-[24px] text-white mb-1 font-semibold leading-tight truncate">
                                {option.name}
                              </p>
                              <div className="flex items-center gap-1">
                                <LocationIcon
                                  width={14}
                                  height={14}
                                  color="#ABA9A9"
                                />
                                <p className="text-[#A9A9AA] text-[12px] truncate">
                                  {option.address}
                                </p>
                              </div>
                              <GapY size={8} />
                              <div className="flex items-center gap-1">
                                {option.discountRate > 0 && (
                                  <p className="text-primary text-md">
                                    {option.discountRate}%
                                  </p>
                                )}
                                <p className="text-white text-md">
                                  ₩{finalPrice.toLocaleString()}
                                </p>
                              </div>
                            </div>
                            <div className="relative w-[108px] h-[108px] overflow-hidden flex-shrink-0 rounded-[2px]">
                              <Image
                                src={getSafeImageSrc(option.imageUrl)}
                                alt={option.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  );
                })
              )}
            </div>

            <GapY size={20} />
            {/* Customer Reviews */}
            <div className="pl-5">
              <div className="flex items-center justify-between pr-5">
                <span className="flex items-center h-8 title-md font-bold">
                  {t("package.customersReview")}
                </span>
                <Link href={`/package/${productDetail.id}/reviews`}>
                  <div className="flex flex-col items-center h-7 justify-end">
                    <div className="flex items-center gap-1">
                      <span className="text-gray-font text-sm">
                        <TranslatedText translationKey="more" />
                      </span>
                      <ArrowRightIcon
                        color="#BCBCBC"
                        width={3}
                        height={7}
                        className="size-auto"
                      />
                    </div>
                  </div>
                </Link>
              </div>

              <GapY size={8} />
              <Link
                href={`/package/${productDetail.id}/reviews`}
                className="block w-full"
              >
                <div className="flex flex-nowrap gap-3 overflow-x-auto scrollbar-hide">
                  {reviewsLoading ? (
                    <div className="flex w-full min-h-[132px] shrink-0 items-center justify-center">
                      <div className="text-gray-400">
                        {t("package.loadingReviews")}
                      </div>
                    </div>
                  ) : reviewsError ? (
                    <div className="flex w-full min-h-[132px] shrink-0 items-center justify-center">
                      <div className="text-gray-400">
                        {t("package.errorLoadingReviews")}
                      </div>
                    </div>
                  ) : reviews && reviews.length > 0 ? (
                    reviews.slice(0, 5).map((review: ReviewDetail) => (
                      <Card
                        key={review.reviewId}
                        className="w-[250px] h-[132px] flex-shrink-0 p-[13px] bg-gray-container border-none text-white"
                      >
                        <CardContent className="p-0">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="rounded-full bg-gray-container overflow-hidden w-7 h-7 flex-shrink-0">
                              <Image
                                src={"/dummy-profile.png"}
                                alt={review.content}
                                width={28}
                                height={28}
                                className="object-cover w-7 h-7"
                              />
                            </div>
                            <div className="flex flex-1 justify-between items-center min-w-0">
                              <p className="text-sm font-medium truncate">
                                {review.userId}
                              </p>
                              <div className="flex text-xs flex-shrink-0">
                                {renderStars(review.rating)}
                              </div>
                            </div>
                          </div>
                          <p className="text-sm text-gray-300">
                            {review.content}
                          </p>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="flex w-full min-h-[132px] shrink-0 items-center justify-center">
                      <div className="text-gray-400">
                        {t("package.noReviewsYet")}
                      </div>
                    </div>
                  )}
                </div>
              </Link>
            </div>

            <GapY size={20} />
          </div>
        </div>
      </div>
    </>
  );
}
