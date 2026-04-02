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
import { useTranslation } from "@/hooks/useTranslation";
import type { Product } from "@/api/product";

/** 백엔드 추천 API 없을 때 사용하는 플레이스홀더 */
const PLACEHOLDER_RECOMMENDATION = {
  images: ["/dummy-logo.png", "/dummy-logo.png", "/dummy-logo.png"],
  salonInfo: {
    tags: ["추천"],
    name: "추천 샐런 (준비 중)",
    originalPrice: 0,
    finalPrice: 0,
    discountRate: 0,
    rating: 0,
    reviewCount: 0,
    location: "-",
  },
  packagePath: "#",
};

const PACKAGE_SECTION_TITLES = [
  "wish.howAboutThisPackage",
  "wish.lookingForAnotherDate",
] as const;

export default function FormComplete() {
  const router = useRouter();
  const { t } = useTranslation();
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

  const handlePackageClick = (packageId: number) => {
    router.push(`/package/${packageId}`);
  };

  const display = surveyToDisplayData(survey);
  const packageChunks = [products.slice(0, 2), products.slice(2, 4)] as const;

  // 폼 태그 (For You 추천 링크 + 매칭 상품용)
  const formTags = [
    ...display.concepts,
    ...(display.idolName ? [display.idolName] : []),
    ...display.regions,
  ].filter(Boolean);
  const recommendUrl =
    formTags.length > 0
      ? `/recommend?tags=${encodeURIComponent(formTags.join(","))}`
      : "/recommend";

  const productTags = (pkg: Product) =>
    pkg.representOption?.tags ?? pkg.tagNames ?? [];
  const firstMatchingProduct = products.find(pkg =>
    formTags.length === 0
      ? true
      : productTags(pkg).some(pt =>
          formTags.some(
            ft =>
              pt.toLowerCase().includes(ft.toLowerCase()) ||
              ft.toLowerCase().includes(pt.toLowerCase())
          )
        )
  );

  const galleryProduct: Product | null =
    firstMatchingProduct ?? products[0] ?? null;
  const galleryData = galleryProduct
    ? {
        images: galleryProduct.imageUrls?.length
          ? galleryProduct.imageUrls
          : ["/dummy-logo.png", "/dummy-logo.png", "/dummy-logo.png"],
        salonInfo: {
          tags:
            galleryProduct.representOption?.tags ??
            galleryProduct.tagNames ??
            [],
          name: galleryProduct.name,
          originalPrice:
            galleryProduct.representOption?.originalPrice ??
            galleryProduct.minPrice ??
            0,
          finalPrice:
            galleryProduct.representOption?.finalPrice ??
            galleryProduct.totalPrice ??
            0,
          discountRate: galleryProduct.representOption?.discountRate ?? 0,
          rating:
            galleryProduct.rating ??
            galleryProduct.representOption?.rating ??
            0,
          reviewCount:
            galleryProduct.reviewCount ??
            galleryProduct.representOption?.reviewCount ??
            0,
          location: galleryProduct.representOption?.location ?? "location",
        },
        onClick: () => handlePackageClick(galleryProduct.id),
      }
    : {
        images: PLACEHOLDER_RECOMMENDATION.images,
        salonInfo: PLACEHOLDER_RECOMMENDATION.salonInfo,
        onClick: () => router.push(recommendUrl),
      };

  return (
    <div className="min-h-screen text-white">
      <GapY size={8} />

      <div>
        {/* Tags Section */}
        <div className="flex flex-col pl-5 py-1 gap-2">
          <div className="flex items-center title-md h-11">
            {t("form.allSummedUpInTags")}
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

        {/* Recommendation Gallery - recommend 페이지와 동일한 디자인/구조 */}
        <div>
          <div className="pl-5">
            <RecommendationGallery
              images={galleryData.images}
              priority
              salonInfo={galleryData.salonInfo}
              onClick={galleryData.onClick}
            />
          </div>
        </div>

        <GapY size={20} />

        {PACKAGE_SECTION_TITLES.map((titleKey, index) => (
          <div key={index}>
            <PackageSection
              title={t(titleKey)}
              packages={packageChunks[index]}
              onPackageClick={handlePackageClick}
              firstCardPriority={index === 0}
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
