"use client";

import { useParams, useRouter } from "next/navigation";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { GapY } from "../../../components/ui/gap";
import KakaoMap from "@/components/common/KakaoMap";
import { usePackageDetail } from "@/hooks/usePackageQueries";
import Link from "next/link";
import { LocationIcon } from "../../../components/common/Icons";

export default function PackageDetail() {
  const params = useParams();
  const router = useRouter();
  const packageId = params.id as string;

  // 슈퍼베이스에서 패키지 데이터 가져오기 (리뷰 데이터 포함)
  const { data: packageDetail, isLoading, error } = usePackageDetail(packageId);

  // packageDetail에서 리뷰 데이터 추출
  const reviews = packageDetail?.reviews || [];

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
    notFound();
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
          src={packageDetail.image_src[0] || "/dummy-profile.png"}
          alt={packageDetail.title}
          fill
          className="object-cover"
        />
      </div>

      {/* Contents : 제목 ~ 지도까지지 */}
      <div className="flex flex-col py-4">
        {/* Package Title and Location */}
        <div className="px-5">
          <h1 className="title-md">{packageDetail.title}</h1>
          <p className="text-gray_1 text-md">{packageDetail.location}</p>
        </div>

        <GapY size={20} />

        {/* Package Details Section */}
        <div>
          <h2 className="title-md px-5">Package Details</h2>
          <GapY size={12} />
          {/* Package Components */}
          <div className="flex flex-col w-full gap-3 px-5">
            {packageDetail.components.map(component => (
              <div key={component.id}>
                <Card className="bg-gray-container border-solid border-[1px] border-[#2E3033] rounded-[4px] p-3">
                  <CardContent className="p-0">
                    <div className="flex gap-1 items-center">
                      <div className="relative w-[96px] h-[96px] overflow-hidden flex-shrink-0">
                        <Image
                          src={component.image_src || "/dummy-profile.png"}
                          alt={component.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-lg text-white mb-1">
                          {component.title}
                        </p>
                        <div className="flex items-center gap-1">
                          <LocationIcon
                            width={11}
                            height={13}
                            color="#ABA9A9"
                          />
                          <p className="text-gray-400 text-sm">
                            {component.location}
                          </p>
                        </div>
                        <GapY size={12} />
                        <p className="text-gray-300 text-sm line-clamp-2">
                          {component.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>

          <GapY size={20} />
          {/* Customer Reviews */}
          <div className="pl-5">
            <span className="flex items-center h-8 title-md font-bold">
              Customers review
            </span>
            <GapY size={8} />
            <Link href={`/package/${packageDetail.id}/reviews`}>
              <div className="flex flex-nowrap gap-3 overflow-x-auto scrollbar-hide">
                {isLoading ? (
                  <div className="flex items-center justify-center w-[250px] h-[132px]">
                    <div className="text-gray-400">리뷰를 불러오는 중...</div>
                  </div>
                ) : error ? (
                  <div className="flex items-center justify-center w-[250px] h-[132px]">
                    <div className="text-gray-400">
                      리뷰를 불러올 수 없습니다.
                    </div>
                  </div>
                ) : reviews && reviews.length > 0 ? (
                  reviews.slice(0, 5).map(review => (
                    <Card
                      key={review.id}
                      className="w-[250px] h-[132px] flex-shrink-0 p-[13px] bg-gray-container border-none text-white"
                    >
                      <CardContent className="p-0">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="rounded-full bg-gray-container overflow-hidden w-7 h-7 flex-shrink-0">
                            {review.avatar_src ? (
                              <Image
                                src={review.avatar_src}
                                alt={review.username}
                                width={28}
                                height={28}
                                className="object-cover w-7 h-7"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-600 flex items-center justify-center">
                                <span className="text-white text-xs font-medium">
                                  {review.username.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="flex flex-1 justify-between items-center min-w-0">
                            <p className="text-sm font-medium truncate">
                              {review.username}
                            </p>
                            <div className="flex text-xs flex-shrink-0">
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
          <div className="px-5">
            <KakaoMap
              address={packageDetail.map_address || "사당동 142-38"}
              height="372px"
              className="mb-3"
            />

            {/* Distance Info */}
            <div className="flex items-center justify-center w-full h-[28px] bg-white/10 rounded-[32px]">
              <span className="text-gray-300 text-sm">
                {packageDetail.travel_time}{" "}
                <span className="text-primary font-medium">
                  {packageDetail.map_location}
                </span>{" "}
              </span>
            </div>
          </div>
        </div>
      </div>

      <GapY size={61} />

      {/* Booking Footer */}
      <div className="bg-transparent px-5 pt-2 pb-3 border-t border-gray-container">
        <div className="flex justify-between items-center">
          <div className="flex flex-col gap-1">
            <p className="title-md text-white font-semibold">
              ₩ {packageDetail.price.toLocaleString()}{" "}
              <span className="text-lg">/person</span>
            </p>
            <div
              className="flex items-center justify-center rounded-[32px] py-1 px-4 text-white caption-sm"
              style={{ background: "rgba(255, 255, 255, 0.16)" }}
            >
              {packageDetail.valid_period_start} -{" "}
              {packageDetail.valid_period_end}
            </div>
          </div>
          <Button
            className="text-lg w-[188px] h-[52px] rounded-lg"
            onClick={handleBook}
          >
            Book Now
          </Button>
        </div>
      </div>
    </div>
  );
}
