"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { GapY } from "../../../components/ui/gap";
import { Divider } from "../../../components/ui/divider";
import KakaoMap from "@/components/common/KakaoMap";
import { usePackageDetail } from "@/hooks/usePackageQueries";
import { usePackageReviews } from "@/hooks/useReviewQueries";
import Link from "next/link";

export default function PackageDetail() {
  const params = useParams();
  const router = useRouter();
  const packageId = params.id as string;

  // 슈퍼베이스에서 패키지 데이터 가져오기
  const { data: packageDetail, isLoading, error } = usePackageDetail(packageId);

  // 리뷰 데이터 별도로 가져오기
  const {
    data: reviews,
    isLoading: reviewsLoading,
    error: reviewsError,
  } = usePackageReviews(packageId);

  console.log(reviews);

  // State for collapsible sections
  const [isIncludedExpanded, setIsIncludedExpanded] = useState(false);
  const [isChecklistExpanded, setIsChecklistExpanded] = useState(false);

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="min-h-screen text-white bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg">패키지 정보를 불러오는 중...</div>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className="min-h-screen text-white bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-semibold mb-4">
            패키지를 불러오는 중 오류가 발생했습니다
          </h1>
          <Button onClick={() => router.push("/form/complete")}>
            Go back to packages
          </Button>
        </div>
      </div>
    );
  }

  // 패키지를 찾을 수 없는 경우
  if (!packageDetail) {
    return (
      <div className="min-h-screen text-white bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-semibold mb-4">Package not found</h1>
          <Button onClick={() => router.push("/form/complete")}>
            Go back to packages
          </Button>
        </div>
      </div>
    );
  }

  const handleBook = () => {
    router.push(`/booking/${packageDetail.id}/check`);
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
    <div className="min-h-screen text-white">
      {/* Main Package Image */}
      <div className="relative w-full h-[412px]">
        <Image
          src={packageDetail.image_src}
          alt={packageDetail.title}
          fill
          className="object-cover"
        />
      </div>

      <GapY size={8} />

      {/* Contents : 제목 ~ 지도까지지 */}
      <div className="flex flex-col px-5 py-4">
        {/* Package Title and Location */}
        <div>
          <h1 className="title-md">{packageDetail.title}</h1>
          <p className="text-gray_1 text-md">{packageDetail.location}</p>
        </div>

        <GapY size={12} />

        {/* Package Details Section */}
        <div>
          <h2 className="text-lg ">Package Details</h2>
          {/* Package Components */}
          <div className="flex flex-col w-full">
            {packageDetail.components.map(component => (
              <div key={component.id}>
                <Card className="bg-transparent border-none py-1">
                  <CardContent className="px-0 py-2">
                    <div className="flex gap-1 items-center">
                      <div className="relative w-[80px] h-[80px] overflow-hidden flex-shrink-0">
                        <Image
                          src={component.image_src}
                          alt={component.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-white mb-1">
                          {component.title}
                        </h3>
                        <p className="text-gray-400 text-sm mb-1">
                          {component.location}
                        </p>
                        <p className="text-gray-300 text-sm line-clamp-2">
                          {component.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Divider />
              </div>
            ))}
          </div>

          {/* Collapsible Sections */}
          <div className="flex flex-col gap-2">
            {/* Included & Not Included Section */}
            <div className="bg-gray-container rounded-lg overflow-hidden">
              <button
                className="flex items-center justify-between w-full p-4 h-[44px] hover:bg-gray-700 transition-colors"
                onClick={() => setIsIncludedExpanded(!isIncludedExpanded)}
              >
                <span className="font-semibold">Included & Not Included</span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className={`transform transition-transform ${isIncludedExpanded ? "rotate-180" : ""}`}
                >
                  <path
                    d="M4 6L8 10L12 6"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              {isIncludedExpanded && (
                <div className="px-4 pb-4">
                  {/* Included Section */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="font-semibold text-white">
                        ✅ Included
                      </span>
                    </div>
                    <div className="space-y-2 ml-6">
                      {packageDetail.included.map((item, index) => (
                        <div key={index} className="text-sm text-gray-300">
                          - {item}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Not Included Section */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="font-semibold text-white">
                        ❌ Not Included (Please prepare separately)
                      </span>
                    </div>
                    <div className="space-y-1 ml-6 text-sm text-gray-300">
                      {packageDetail.not_included.map((item, index) => (
                        <div key={index}>{item}</div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Booking Checklist Section */}
            <div className="bg-gray-container rounded-lg overflow-hidden">
              <button
                className="flex items-center justify-between w-full p-4 h-[44px] hover:bg-gray-700 transition-colors"
                onClick={() => setIsChecklistExpanded(!isChecklistExpanded)}
              >
                <span className="font-semibold">Booking Checklist</span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className={`transform transition-transform ${isChecklistExpanded ? "rotate-180" : ""}`}
                >
                  <path
                    d="M4 6L8 10L12 6"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              {isChecklistExpanded && (
                <div className="px-4 pb-4 space-y-2">
                  {packageDetail.checklist.map((item, index) => (
                    <div key={index} className="text-sm text-gray-300">
                      • {item}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <GapY size={20} />

          {/* Customer Reviews */}
          <div>
            <span className="flex items-center h-11 title-md font-bold mb-4">
              Customers review
            </span>
            <Link href={`/package/${packageDetail.id}/reviews`}>
              <div className="flex flex-nowrap gap-3 overflow-x-auto scrollbar-hide">
                {reviewsLoading ? (
                  <div className="flex items-center justify-center w-[250px] h-[132px]">
                    <div className="text-gray-400">리뷰를 불러오는 중...</div>
                  </div>
                ) : reviewsError ? (
                  <div className="flex items-center justify-center w-[250px] h-[132px]">
                    <div className="text-gray-400">
                      리뷰를 불러올 수 없습니다.
                    </div>
                  </div>
                ) : reviews && reviews.length > 0 ? (
                  reviews.slice(0, 5).map(review => (
                    <Card
                      key={review.id}
                      className="w-[250px] h-[132px] flex-shrink-0 p-[14px] bg-gray-container border-none text-white"
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 rounded-full bg-gray-container overflow-hidden">
                            {review.avatar_src ? (
                              <Image
                                src={review.avatar_src}
                                alt={review.username}
                                width={32}
                                height={32}
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-600 flex items-center justify-center">
                                <span className="text-white text-xs font-medium">
                                  {review.username.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium">
                              {review.username}
                            </p>
                            <div className="flex text-xs">
                              {renderStars(review.rating)}
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-gray-300">
                          {review.comment}
                        </p>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="flex items-center justify-center w-[250px] h-[132px]">
                    <div className="text-gray-400">아직 리뷰가 없습니다.</div>
                  </div>
                )}
              </div>
            </Link>
          </div>

          <GapY size={20} />

          {/* Map Section */}
          <div>
            <KakaoMap
              address={packageDetail.map_address || "사당동 142-38"}
              height="192px"
              className="mb-3"
            />

            {/* Distance Info */}
            <div className="flex items-center justify-center w-full h-[28px] bg-white/10 rounded-[32px]">
              <span className="text-gray-300 text-sm">
                {packageDetail.travel_time} from the{" "}
                <span className="text-pink-400 font-medium">
                  {packageDetail.map_location}
                </span>{" "}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Footer */}
      <div className="bg-transparent px-4 py-4 border-t border-gray-container">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-white font-semibold">
              ₩ {packageDetail.price.toLocaleString()} / person
            </p>
            <p className="text-gray-400 text-sm">
              {packageDetail.valid_period_start} -{" "}
              {packageDetail.valid_period_end}
            </p>
          </div>
          <Button
            className="w-[164px] x-6 py-3 rounded-lg"
            onClick={handleBook}
          >
            Book Now
          </Button>
        </div>
      </div>
    </div>
  );
}
