"use client";
import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { GapY } from "@/components/ui/gap";
import { Badge } from "@/components/ui/badge";
import RecommendationGallery from "@/components/main/RecommendationGallery";
import PackageSection from "@/components/main/PackageSection";
import { useProducts } from "@/queries/useProductQueries";
import type { Product, ProductSortType } from "@/api/product";
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
  last: { titleKey: "wish.lookingForAnotherDate", indices: [3, 6] },
};

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

  const serverSort: ProductSortType | undefined = selectedTags.includes(
    "Most Booked"
  )
    ? "MOST_BOOKED"
    : undefined;

  const { data: products, isLoading } = useProducts({
    ...(listTag !== undefined ? { tag: listTag } : {}),
    ...(serverSort ? { sort: serverSort } : {}),
  });

  const productTags = (pkg: Product) =>
    pkg.representOption?.tags ?? pkg.tagNames ?? [];
  const productPrice = (pkg: Product) =>
    pkg.representOption?.finalPrice ?? pkg.totalPrice ?? pkg.minPrice ?? 0;

  const isForYouSelected = selectedTags.includes("For You");

  // Most Booked: 서버에서 sort=MOST_BOOKED로 이미 정렬됨
  // 그 외: 필터 후 클라이언트 정렬
  let filteredPackages: Product[] | undefined = products;
  if (products && !serverSort) {
    // For You: 이미 listTag 로 서버 필터된 단일 태그면 클라이언트 재필터 생략
    const skipForYouClientFilter =
      listTag !== undefined && conceptTags.length === 1;
    if (isForYouSelected && conceptTags.length > 0 && !skipForYouClientFilter) {
      filteredPackages = products.filter(pkg =>
        productTags(pkg).some(pt =>
          conceptTags.some(
            ft =>
              pt.toLowerCase().includes(ft.toLowerCase()) ||
              ft.toLowerCase().includes(pt.toLowerCase())
          )
        )
      );
    }
    // 클라이언트 정렬 (Most Reviewed / Low Price / High Price / Best Deal)
    const clientSortTag = selectedTags.find(t =>
      ["Most Reviewed", "Low Price", "High Price", "Best Deal"].includes(t)
    );
    filteredPackages = [...(filteredPackages ?? [])];
    if (clientSortTag === "Most Reviewed") {
      filteredPackages.sort(
        (a, b) =>
          (b.reviewCount ?? b.representOption?.reviewCount ?? 0) -
          (a.reviewCount ?? a.representOption?.reviewCount ?? 0)
      );
    } else if (clientSortTag === "Low Price") {
      filteredPackages.sort((a, b) => productPrice(a) - productPrice(b));
    } else if (clientSortTag === "High Price") {
      filteredPackages.sort((a, b) => productPrice(b) - productPrice(a));
    } else if (clientSortTag === "Best Deal") {
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
  const lastPackages = products?.slice(...PACKAGE_SECTIONS_CONFIG.last.indices);

  const PRICE_TAGS = ["Low Price", "High Price"] as const;
  const handleTagClick = (tag: string) => {
    setSelectedTags(prev => {
      if (prev.includes(tag)) return prev.filter(t => t !== tag);
      // Low Price / High Price는 상호 배타적
      if ((PRICE_TAGS as readonly string[]).includes(tag)) {
        return [
          ...prev.filter(t => !(PRICE_TAGS as readonly string[]).includes(t)),
          tag,
        ];
      }
      return [...prev, tag];
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

            {/* 2번째 갤러리 후 */}
            {index % 2 === 1 && !!middlePackages?.length && (
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

            {/* 마지막이 홀수번째일 때 */}
            {index === filteredPackages.length - 1 &&
              index % 2 === 0 &&
              !!lastPackages?.length && (
                <>
                  <GapY size={20} />
                  <PackageSection
                    title={t(PACKAGE_SECTIONS_CONFIG.last.titleKey)}
                    packages={lastPackages}
                    onPackageClick={handlePackageClick}
                  />
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
