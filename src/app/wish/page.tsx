"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { PageLoading } from "@/components/common";
import { GapY } from "../../components/ui/gap";
import RecommendationGallery from "@/components/main/RecommendationGallery";
import PackageSection from "@/components/main/PackageSection";
import { useMyPageUser } from "@/queries/useMyPageQueries";
import { useSurveyForCurrentUser } from "@/queries/useSurveyQueries";
import { useProducts } from "@/queries/useProductQueries";
import { useTranslation } from "@/hooks/useTranslation";

// TODO: 백엔드 연동 시 더미 데이터를 실제 API 응답으로 교체
const DUMMY_RECOMMENDATION_GALLERIES = [
  {
    images: ["/dummy-profile.png", "/dummy-profile.png", "/dummy-profile.png"],
    salonInfo: {
      tags: ["aespa", "metallic", "sm"],
      name: "DOKI MAKE SALON",
      originalPrice: 60000,
      finalPrice: 50000,
      discountRate: 17,
      rating: 4.8,
      reviewCount: 15,
      location: "Yongsan",
    },
    packagePath: "/package/aespa-futuristic",
  },
  {
    images: ["/dummy-profile.png", "/dummy-profile.png", "/dummy-profile.png"],
    salonInfo: {
      tags: ["girl crush", "metallic", "sm"],
      name: "STYLE STUDIO",
      originalPrice: 50000,
      finalPrice: 45000,
      discountRate: 10,
      rating: 4.6,
      reviewCount: 23,
      location: "Gangnam",
    },
    packagePath: "/package/girl-crush",
  },
  {
    images: ["/dummy-profile.png", "/dummy-profile.png", "/dummy-profile.png"],
    salonInfo: {
      tags: ["metallic", "girl crush"],
      name: "GLAM BEAUTY",
      originalPrice: 70000,
      finalPrice: 60000,
      discountRate: 14,
      rating: 4.9,
      reviewCount: 8,
      location: "Hongdae",
    },
    packagePath: "/package/glam-beauty",
  },
];

const DUMMY_PACKAGE_SECTION = {
  titleKey: "wish.howAboutThisPackage",
  packageIndices: [0, 2],
};

export default function Wish() {
  const router = useRouter();
  const { t } = useTranslation();
  const { data: myPageUser, isLoading: userLoading } = useMyPageUser();
  const {
    data: survey,
    isLoading: surveyLoading,
    error: surveyError,
  } = useSurveyForCurrentUser();

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
            {(surveyError as Error)?.message || t("wish.errorLoadingData")}
          </div>
          <button
            onClick={() => router.push("/form/step1")}
            className="px-4 py-2 bg-pink-500 rounded text-white"
          >
            {t("wish.tryAgain")}
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
          <div className="text-lg mb-4">{t("wish.noSubmittedData")}</div>
          <button
            onClick={() => router.push("/form/step1")}
            className="px-4 py-2 bg-pink-500 rounded text-white"
          >
            {t("wish.fillForm")}
          </button>
        </div>
      </div>
    );
  }

  // ✏️ packageId 타입: string → number
  const handlePackageClick = (packageId: number) => {
    router.push(`/package/${packageId}`);
  };

  return (
    <div className="min-h-screen text-white relative">
      <GapY size={8} />

      {/* Main Content */}
      <div>
        {/* RecommendationGalleries */}
        {DUMMY_RECOMMENDATION_GALLERIES.map((gallery, index) => (
          <div key={index}>
            <div className="pl-5">
              <RecommendationGallery
                images={gallery.images}
                salonInfo={gallery.salonInfo}
                onClick={() => router.push(gallery.packagePath)}
              />
            </div>
            {index < DUMMY_RECOMMENDATION_GALLERIES.length - 1 && (
              <GapY size={4} />
            )}
          </div>
        ))}

        <GapY size={20} />

        {/* ✏️ PackageSection - 매핑 제거 */}
        <PackageSection
          title={t(DUMMY_PACKAGE_SECTION.titleKey)}
          packages={
            products?.slice(
              DUMMY_PACKAGE_SECTION.packageIndices[0],
              DUMMY_PACKAGE_SECTION.packageIndices[1] + 1
            ) || []
          }
          onPackageClick={handlePackageClick}
        />
      </div>

      <GapY size={24} />
    </div>
  );
}
