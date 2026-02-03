"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { RestartIcon } from "@/components/common/Icons";
import { PageLoading } from "@/components/common";
import { GapY } from "@/components/ui/gap";
import RecommendationGallery from "@/components/main/RecommendationGallery";
import PackageSection from "@/components/main/PackageSection";
import { useMyPageUser } from "@/queries/useMyPageQueries";
import { useSurveyForCurrentUser } from "@/queries/useSurveyQueries";
import { useProducts } from "@/queries/useProductQueries";
import { surveyToDisplayData } from "@/lib/surveyUtils";

/** 백엔드 추천 API 없을 때 사용하는 플레이스홀더 */
const PLACEHOLDER_RECOMMENDATION = {
  images: ["/dummy-profile.png", "/dummy-profile.png", "/dummy-profile.png"],
  salonInfo: {
    tags: ["추천"],
    name: "추천 샐런 (준비 중)",
    minPrice: 0,
    totalPrice: 0,
    rating: 0,
    reviewCount: 0,
    distance: "-",
    location: "-",
    languages: "-",
  },
  packagePath: "#",
};

const PACKAGE_SECTION_TITLES = [
  "How about this package?",
  "Looking for another Date?",
] as const;

export default function FormComplete() {
  const router = useRouter();
  const { data: myPageUser, isLoading: userLoading } = useMyPageUser();
  const {
    data: survey,
    isLoading: surveyLoading,
    error: surveyError,
  } = useSurveyForCurrentUser();

  const { data: products = [] } = useProducts();

  useEffect(() => {
    if (!userLoading && !myPageUser) {
      router.push("/login");
    }
  }, [myPageUser, userLoading, router]);

  if (userLoading || surveyLoading) {
    return <PageLoading />;
  }

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

  const display = surveyToDisplayData(survey);
  const packageChunks = [products.slice(0, 2), products.slice(2, 4)] as const;

  return (
    <div className="min-h-screen text-white">
      <GapY size={8} />

      <div>
        {/* Tags Section */}
        <div className="flex flex-col pl-5 py-1 gap-2">
          <div className="flex items-center title-md h-11">
            All summed up in tags
          </div>
          <div className="flex gap-1 flex-nowrap overflow-x-auto scrollbar-hide">
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
          </div>
        </div>

        <GapY size={20} />

        {/* Recommendation Gallery - 백엔드 연동 전 플레이스홀더 */}
        <div className="pl-5">
          <RecommendationGallery
            images={PLACEHOLDER_RECOMMENDATION.images}
            salonInfo={PLACEHOLDER_RECOMMENDATION.salonInfo}
            onClick={() => router.push(PLACEHOLDER_RECOMMENDATION.packagePath)}
          />
        </div>

        <GapY size={20} />

        {/* Package Sections - products API 데이터 사용 */}
        {PACKAGE_SECTION_TITLES.map((title, index) => (
          <div key={index}>
            <PackageSection
              title={title}
              packages={packageChunks[index]}
              onPackageClick={handlePackageClick}
            />
            <GapY size={20} />
          </div>
        ))}

        <GapY size={24} />
      </div>

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
