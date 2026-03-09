"use client";
import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { GapY } from "@/components/ui/gap";
import { Badge } from "@/components/ui/badge";
import RecommendationGallery from "@/components/main/RecommendationGallery";
import PackageSection from "@/components/main/PackageSection";
import { useProducts } from "@/queries/useProductQueries";
import type { Product } from "@/api/product";
import { PageLoading } from "@/components/common";
import { useTranslation } from "@/hooks/useTranslation";

const BASE_TAGS = [
  "SMent",
  "Aespa",
  "Girl crush",
  "Metallic",
  "example1",
  "example2",
];

const PACKAGE_SECTIONS_CONFIG = {
  middle: { titleKey: "wish.howAboutThisPackage", indices: [0, 3] },
  last: { titleKey: "wish.lookingForAnotherDate", indices: [3, 6] },
};

function Content() {
  const searchParams = useSearchParams();
  const { t } = useTranslation();
  // URL 태그 파싱
  const urlTags =
    searchParams
      .get("tags")
      ?.split(",")
      .map(t => t.trim())
      .filter(Boolean) || [];
  const availableTags = Array.from(new Set([...BASE_TAGS, ...urlTags]));
  const router = useRouter();
  const [selectedTags, setSelectedTags] = useState<string[]>(urlTags);
  const { data: products, isLoading } = useProducts();

  // 상품 섹션 데이터
  const middlePackages = products?.slice(
    ...PACKAGE_SECTIONS_CONFIG.middle.indices
  );
  const lastPackages = products?.slice(...PACKAGE_SECTIONS_CONFIG.last.indices);

  // 필터링된 상품
  const filteredPackages =
    selectedTags.length > 0
      ? products?.filter(pkg =>
          selectedTags.some(tag =>
            (pkg.representOption?.tags ?? pkg.tagNames ?? []).some(
              t =>
                t.toLowerCase().includes(tag.toLowerCase()) ||
                tag.toLowerCase().includes(t.toLowerCase())
            )
          )
        )
      : products;

  const handleTagClick = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
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
                  : [
                      "/dummy-package.png",
                      "/dummy-package.png",
                      "/dummy-package.png",
                    ]
              }
              salonInfo={{
                tags: pkg.representOption?.tags ?? pkg.tagNames ?? [],
                name: pkg.name,
                minPrice:
                  pkg.representOption?.originalPrice ?? pkg.minPrice ?? 0,
                totalPrice:
                  pkg.representOption?.finalPrice ?? pkg.totalPrice ?? 0,
                rating: pkg.rating ?? pkg.representOption?.rating ?? 0,
                reviewCount:
                  pkg.reviewCount ?? pkg.representOption?.reviewCount ?? 0,
                distance: "0km",
                location: pkg.representOption?.location ?? "location",
                languages: "languages",
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
