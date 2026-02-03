"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { RestartIcon } from "@/components/common/Icons";
import { PageLoading } from "@/components/common";
import { GapY } from "../../../components/ui/gap";
import RecommendationGallery from "@/components/main/RecommendationGallery";
import PackageSection from "@/components/main/PackageSection";
import { useMyPageUser } from "@/queries/useMyPageQueries";
import { useSurveyForCurrentUser } from "@/queries/useSurveyQueries";
import { useProducts } from "@/queries/useProductQueries";
import { surveyToDisplayData } from "@/lib/surveyUtils";

// TODO: 백엔드 연동 시 더미 데이터를 실제 API 응답으로 교체
const DUMMY_RECOMMENDATION_GALLERIES = [
  {
    images: ["/dummy-profile.png", "/dummy-profile.png", "/dummy-profile.png"],
    salonInfo: {
      tags: ["aespa", "metallic", "sm"],
      name: "DOKI MAKE SALON",
      price: "₩ 50,000 ~",
      rating: 4.8,
      reviewCount: 15,
      distance: "2.3km (Yongsan)",
      location: "Yongsan",
      languages: "Korean / English / Japanese",
    },
    packagePath: "/package/aespa-futuristic",
  },
  {
    images: ["/dummy-profile.png", "/dummy-profile.png", "/dummy-profile.png"],
    salonInfo: {
      tags: ["girl crush", "metallic", "sm"],
      name: "STYLE STUDIO",
      price: "₩ 45,000 ~",
      rating: 4.6,
      reviewCount: 23,
      distance: "1.8km (Gangnam)",
      location: "Gangnam",
      languages: "Korean / English",
    },
    packagePath: "/package/girl-crush",
  },
  {
    images: ["/dummy-profile.png", "/dummy-profile.png", "/dummy-profile.png"],
    salonInfo: {
      tags: ["metallic", "girl crush"],
      name: "GLAM BEAUTY",
      price: "₩ 60,000 ~",
      rating: 4.9,
      reviewCount: 8,
      distance: "3.2km (Hongdae)",
      location: "Hongdae",
      languages: "Korean / English / Japanese",
    },
    packagePath: "/package/glam-beauty",
  },
  {
    images: ["/dummy-profile.png", "/dummy-profile.png", "/dummy-profile.png"],
    salonInfo: {
      tags: ["elegant", "glam"],
      name: "ELEGANT STUDIO",
      price: "₩ 55,000 ~",
      rating: 4.7,
      reviewCount: 12,
      distance: "2.1km (Myeongdong)",
      location: "Myeongdong",
      languages: "Korean / English / Japanese",
    },
    packagePath: "/package/elegant-studio",
  },
];

const DUMMY_PACKAGE_SECTIONS = [
  {
    title: "How about this package?",
    packageIndices: [0, 2],
  },
  {
    title: "Looking for another Date?",
    packageIndices: [0, 2],
  },
];

export default function FormComplete() {
  const router = useRouter();
  const { data: myPageUser, isLoading: userLoading } = useMyPageUser();
  const {
    data: survey,
    isLoading: surveyLoading,
    error: surveyError,
  } = useSurveyForCurrentUser();

  // 상품 데이터 가져오기
  const { data: products, isLoading: productsLoading } = useProducts();

  useEffect(() => {
    if (!userLoading && !myPageUser) {
      router.push("/login");
    }
  }, [myPageUser, userLoading, router]);

  // 로딩 상태
  if (userLoading || surveyLoading || productsLoading) {
    return <PageLoading />;
  }

  // 에러 상태
  if (surveyError) {
    return (
      <div className="min-h-screen text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg text-red-400 mb-4">
            {(surveyError as Error)?.message ||
              "데이터를 불러오는 중 오류가 발생했습니다."}
          </div>
          <button
            onClick={() => router.push("/form/step1")}
            className="px-4 py-2 bg-pink-500 rounded text-white"
          >
            다시 시작하기
          </button>
        </div>
      </div>
    );
  }

  // 데이터가 없는 경우
  if (!survey) {
    return (
      <div className="min-h-screen text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg mb-4">제출된 데이터가 없습니다.</div>
          <button
            onClick={() => router.push("/form/step1")}
            className="px-4 py-2 bg-pink-500 rounded text-white"
          >
            폼 작성하기
          </button>
        </div>
      </div>
    );
  }

  const handlePackageClick = (packageId: number) => {
    router.push(`/package/${packageId}`);
  };

  return (
    <div className="min-h-screen text-white">
      <GapY size={8} />

      {/* Main Content */}
      <div>
        {/* Tags Section */}
        <div className="flex flex-col pl-5 py-1 gap-2">
          <div className="flex items-center title-md h-11">
            All summed up in tags
          </div>
          <div className="flex gap-1 flex-nowrap overflow-x-auto scrollbar-hide">
            {(() => {
              const display = surveyToDisplayData(survey);
              return (
                <>
                  {display.concepts.map((concept, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="text-lg h-[40px] p-[12px] rounded-[32px] bg-gray text-gray-300 hover:bg-gray-600"
                    >
                      {concept}
                    </Badge>
                  ))}
                  {display.idolName && (
                    <Badge
                      variant="secondary"
                      className="text-lg h-[40px] p-[12px] rounded-[32px] bg-gray text-gray-300 hover:bg-gray-600"
                    >
                      {display.idolName}
                    </Badge>
                  )}
                  {display.regions.map((region, index) => (
                    <Badge
                      key={`region-${index}`}
                      variant="secondary"
                      className="text-lg h-[40px] p-[12px] rounded-[32px] bg-gray text-gray-300 hover:bg-gray-600"
                    >
                      {region}
                    </Badge>
                  ))}
                </>
              );
            })()}
          </div>
        </div>

        <GapY size={20} />

        {/* RecommendationGalleries */}
        {DUMMY_RECOMMENDATION_GALLERIES.map((gallery, index) => {
          const isSecondGallery = index === 1;
          const isFourthGallery = index === 3;

          return (
            <div key={index}>
              <div className="pl-5">
                <RecommendationGallery
                  images={gallery.images}
                  salonInfo={gallery.salonInfo}
                  onClick={() => router.push(gallery.packagePath)}
                />
              </div>

              {/* 두 번째 갤러리 다음에 패키지 섹션 추가 */}
              {isSecondGallery && (
                <>
                  <GapY size={20} />

                  <PackageSection
                    title={DUMMY_PACKAGE_SECTIONS[0].title}
                    packages={
                      products?.slice(
                        DUMMY_PACKAGE_SECTIONS[0].packageIndices[0],
                        DUMMY_PACKAGE_SECTIONS[0].packageIndices[1] + 1
                      ) || []
                    }
                    onPackageClick={handlePackageClick}
                  />

                  <GapY size={20} />
                </>
              )}

              {/* 네 번째 갤러리 다음에 패키지 섹션 추가 */}
              {isFourthGallery && (
                <>
                  <GapY size={20} />

                  <PackageSection
                    title={DUMMY_PACKAGE_SECTIONS[1].title}
                    packages={
                      products?.slice(
                        DUMMY_PACKAGE_SECTIONS[1].packageIndices[0],
                        DUMMY_PACKAGE_SECTIONS[1].packageIndices[1] + 1
                      ) || []
                    }
                    onPackageClick={handlePackageClick}
                  />
                </>
              )}
            </div>
          );
        })}

        <GapY size={24} />
      </div>

      {/* Fixed Floating Restart Form Button */}
      <button
        onClick={() => router.push("/form/step1")}
        className="w-16 h-16 sticky bottom-20 right-6 flex justify-center items-center cursor-pointer p-3 rounded-full z-50 ml-auto"
        style={{ backgroundColor: "var(--pink-font)" }}
      >
        <RestartIcon width={30} height={30} color="white" />
      </button>
    </div>
  );
}
