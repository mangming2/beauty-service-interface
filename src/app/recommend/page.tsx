"use client";
import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { GapY } from "@/components/ui/gap";
import { Badge } from "@/components/ui/badge";
import RecommendationGallery from "@/components/main/RecommendationGallery";
import PackageSection from "@/components/main/PackageSection";
import { useProducts } from "@/queries/useProductQueries";
import { useSurveyForCurrentUser } from "@/queries/useSurveyQueries";
import { surveyToDisplayData } from "@/lib/surveyUtils";
import type { Product } from "@/api/product";
import { PageLoading } from "@/components/common";
import { useTranslation } from "@/hooks/useTranslation";

const BASE_TAGS = [
  "Recommended",
  "For You",
  "Most Booked",
  "Most Reviewed",
  "Low Price",
  "High Price",
  "Best Deal",
] as const;

const PACKAGE_SECTIONS_CONFIG = {
  middle: { titleKey: "wish.howAboutThisPackage", indices: [0, 3] },
};

// 이 태그들은 서버 정렬을 그대로 사용한다.
// Recommended -> recommendationScore, Most Booked -> bookingCount 기준 정렬.
function getServerSort(tags: string[]) {
  if (tags.includes("Recommended")) return "RECOMMENDED" as const;
  if (tags.includes("Most Booked")) return "MOST_BOOKED" as const;
  if (tags.includes("Most Reviewed")) return "MOST_REVIEWED" as const;
  if (tags.includes("Low Price")) return "PRICE_LOW" as const;
  if (tags.includes("High Price")) return "PRICE_HIGH" as const;
  return undefined;
}

function Content() {
  const searchParams = useSearchParams();
  const { t } = useTranslation();
  // URL ?tags=… (홈 컨셉 등). "All"은 전체 보기이므로 GET /products 의 tag 에 넣지 않음
  const formTags =
    searchParams
      .get("tags")
      ?.split(",")
      .map(t => t.trim())
      .filter(Boolean) || [];
  const conceptTags = formTags.filter(t => t.toLowerCase() !== "all");
  /** 백엔드는 tag 단일 문자열 — 첫 컨셉 태그로 목록 조회 */
  const listTag = conceptTags.length > 0 ? conceptTags[0] : undefined;

  const availableTags = [...BASE_TAGS];
  const router = useRouter();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const serverSort = getServerSort(selectedTags);

  const { data: products, isLoading } = useProducts({
    ...(listTag !== undefined ? { tag: listTag } : {}),
    ...(serverSort !== undefined ? { sort: serverSort } : {}),
  });

  const productTags = (pkg: Product) =>
    pkg.representOption?.tags ?? pkg.tagNames ?? [];

  const isForYouSelected = selectedTags.includes("For You");

  // survey 태그: 로그인 유저의 survey 데이터 우선, 없으면 URL conceptTags 폴백
  const { data: survey } = useSurveyForCurrentUser();
  const surveyTags = (() => {
    if (survey) {
      const display = surveyToDisplayData(survey);
      return [
        ...display.concepts,
        ...(display.idolName ? [display.idolName] : []),
        ...display.regions,
      ].filter(Boolean);
    }
    return conceptTags;
  })();

  /** 상품의 태그 중 survey 태그와 매칭되는 수 */
  const countSurveyTagMatches = (pkg: Product): number =>
    surveyTags.reduce((count, st) => {
      const matched = productTags(pkg).some(
        pt =>
          pt.toLowerCase().includes(st.toLowerCase()) ||
          st.toLowerCase().includes(pt.toLowerCase())
      );
      return matched ? count + 1 : count;
    }, 0);

  // 클라이언트 정렬
  let filteredPackages: Product[] | undefined = products;
  if (products) {
    filteredPackages = [...products];
    // For You: survey 태그 매칭 수 내림차순, 동률이면 가나다 순
    if (isForYouSelected && surveyTags.length > 0) {
      filteredPackages.sort((a, b) => {
        const diff = countSurveyTagMatches(b) - countSurveyTagMatches(a);
        if (diff !== 0) return diff;
        return (a.name ?? "").localeCompare(b.name ?? "", "ko");
      });
    }
    if (selectedTags.includes("Best Deal")) {
      filteredPackages.sort(
        (a, b) =>
          (b.representOption?.discountRate ?? 0) -
          (a.representOption?.discountRate ?? 0)
      );
    }
  }

  // 상품 섹션 데이터 (정렬/필터된 목록이 아닌 원본 기준)
  const middlePackages = products?.slice(
    ...PACKAGE_SECTIONS_CONFIG.middle.indices
  );

  const handleTagClick = (tag: string) => {
    setSelectedTags(prev => {
      if (prev.includes(tag)) return [];
      return [tag];
    });
  };

  const handlePackageClick = (id: number) => router.push(`/package/${id}`);

  if (isLoading) return <PageLoading />;

  return (
    <div className="min-h-screen text-white">
      <GapY size={8} />

      {/* Tags */}
      <div className="pl-5">
        <div className="flex gap-1 flex-nowrap overflow-x-auto scrollbar-hide">
          {availableTags.map((tag, i) => (
            <Badge
              key={i}
              variant="secondary"
              className={`text-lg h-[40px] p-[12px] rounded-[32px] cursor-pointer transition-colors ${
                selectedTags.includes(tag)
                  ? "bg-primary text-white"
                  : "bg-gray text-gray-300"
              }`}
              onClick={() => handleTagClick(tag)}
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      <GapY size={20} />

      {/* Galleries */}
      {filteredPackages?.map((pkg: Product, index: number) => (
        <div key={pkg.id}>
          <div className="pl-5">
            <RecommendationGallery
              images={
                pkg.imageUrls?.length
                  ? pkg.imageUrls
                  : ["/dummy-logo.png", "/dummy-logo.png", "/dummy-logo.png"]
              }
              salonInfo={{
                tags: pkg.representOption?.tags ?? pkg.tagNames ?? [],
                name: pkg.name,
                originalPrice:
                  pkg.representOption?.originalPrice ?? pkg.minPrice ?? 0,
                finalPrice:
                  pkg.representOption?.finalPrice ?? pkg.totalPrice ?? 0,
                discountRate: pkg.representOption?.discountRate ?? 0,
                rating: pkg.rating ?? pkg.representOption?.rating ?? 0,
                reviewCount:
                  pkg.reviewCount ?? pkg.representOption?.reviewCount ?? 0,
                location: pkg.representOption?.location ?? "location",
              }}
              onClick={() => handlePackageClick(pkg.id)}
            />
          </div>

          {/* 3개마다 또는 총 1~2개일 때 마지막 후 배너 */}
          {!!middlePackages?.length &&
            ((index + 1) % 3 === 0 ||
              (index === filteredPackages.length - 1 &&
                filteredPackages.length < 3)) && (
              <>
                <GapY size={20} />
                <PackageSection
                  title={t(PACKAGE_SECTIONS_CONFIG.middle.titleKey)}
                  packages={middlePackages}
                  onPackageClick={handlePackageClick}
                />
                <GapY size={20} />
              </>
            )}
        </div>
      ))}
      <GapY size={24} />
    </div>
  );
}

export default function RecommendPage() {
  return (
    <Suspense fallback={<PageLoading />}>
      <Content />
    </Suspense>
  );
}
