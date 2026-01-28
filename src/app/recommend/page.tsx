"use client";
import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { GapY } from "@/components/ui/gap";
import { Badge } from "@/components/ui/badge";
import RecommendationGallery from "@/components/main/RecommendationGallery";
import PackageSection from "@/components/main/PackageSection";
import { usePackages } from "@/queries/usePackageQueries";
import { PageLoading } from "@/components/common";

const BASE_TAGS = [
  "SMent",
  "Aespa",
  "Girl crush",
  "Metallic",
  "example1",
  "example2",
];

const PACKAGE_SECTIONS_CONFIG = {
  middle: { title: "How about this package?", indices: [0, 3] },
  last: { title: "Looking for another Date?", indices: [3, 6] },
};

function Content() {
  const searchParams = useSearchParams();
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
  const { data: packages, isLoading } = usePackages();

  // 패키지 섹션 데이터
  const middlePackages = packages?.slice(
    ...PACKAGE_SECTIONS_CONFIG.middle.indices
  );
  const lastPackages = packages?.slice(...PACKAGE_SECTIONS_CONFIG.last.indices);

  // 필터링된 패키지
  const filteredPackages =
    selectedTags.length > 0
      ? packages?.filter(pkg =>
          selectedTags.some(tag =>
            pkg.tagNames.some(
              t =>
                t.toLowerCase().includes(tag.toLowerCase()) ||
                tag.toLowerCase().includes(t.toLowerCase())
            )
          )
        )
      : packages;

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
      {filteredPackages?.map((pkg, index) => (
        <div key={pkg.id}>
          <div className="pl-5">
            <RecommendationGallery
              images={[
                "/dummy-package.png",
                "/dummy-package.png",
                "/dummy-package.png",
              ]}
              salonInfo={{
                tags: pkg.tagNames,
                name: pkg.name,
                minPrice: pkg.minPrice,
                totalPrice: pkg.totalPrice,
                rating: 0,
                reviewCount: 0,
                distance: "0km",
                location: "location",
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
                title={PACKAGE_SECTIONS_CONFIG.middle.title}
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
                  title={PACKAGE_SECTIONS_CONFIG.last.title}
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
