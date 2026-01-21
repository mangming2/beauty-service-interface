"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { GapY } from "@/components/ui/gap";
import { Badge } from "@/components/ui/badge";
import RecommendationGallery from "@/components/main/RecommendationGallery";
import PackageSection from "@/components/main/PackageSection";
import { usePackages } from "@/queries/usePackageQueries"; // ✏️ 추가
import { PageLoading } from "@/components/common"; // ✏️ 추가

// 기본 태그 목록
const BASE_TAGS = [
  "SMent",
  "Aespa",
  "Girl crush",
  "Metallic",
  "example1",
  "example2",
];

// 갤러리 데이터
const GALLERIES_DATA = [
  {
    id: 1,
    images: ["/dummy-package.png", "/dummy-package.png", "/dummy-package.png"],
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
    onClick: () => {},
  },
  {
    id: 2,
    images: ["/dummy-package.png", "/dummy-package.png", "/dummy-package.png"],
    salonInfo: {
      tags: ["aespa", "girl crush", "sm"],
      name: "STYLE STUDIO",
      price: "₩ 45,000 ~",
      rating: 4.6,
      reviewCount: 23,
      distance: "1.8km (Gangnam)",
      location: "Gangnam",
      languages: "Korean / English",
    },
    onClick: () => {},
  },
  {
    id: 3,
    images: ["/dummy-package.png", "/dummy-package.png", "/dummy-package.png"],
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
    onClick: () => {},
  },
];

// ✏️ 패키지 섹션 더미 데이터 삭제 (API 사용)
const PACKAGE_SECTIONS_CONFIG = {
  middle: {
    title: "How about this package?",
    indices: [0, 2], // 0~2번 패키지 (3개)
  },
  last: {
    title: "Looking for another Date?",
    indices: [3, 5], // 3~5번 패키지 (3개)
  },
};

function RecommendContent() {
  const searchParams = useSearchParams();
  const router = useRouter(); // ✏️ 추가
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // ✏️ 패키지 데이터 가져오기
  const { data: packages, isLoading: packagesLoading } = usePackages();
  console.log(packages);

  // URL 쿼리 파라미터에서 태그 읽기
  useEffect(() => {
    const tagsParam = searchParams.get("tags");
    if (tagsParam) {
      const tags = tagsParam
        .split(",")
        .map(tag => tag.trim())
        .filter(Boolean);
      setSelectedTags(tags);
    }
  }, [searchParams]);

  // URL에서 받은 태그 가져오기
  const tagsParam = searchParams.get("tags");
  const urlTags = tagsParam
    ? tagsParam
        .split(",")
        .map(tag => tag.trim())
        .filter(Boolean)
    : [];

  // 기본 태그와 URL에서 받은 태그를 합치고 중복 제거
  const availableTags = Array.from(new Set([...BASE_TAGS, ...urlTags]));

  // 태그 필터링 함수
  const filteredGalleries =
    selectedTags.length > 0
      ? GALLERIES_DATA.filter(gallery =>
          selectedTags.some(selectedTag =>
            gallery.salonInfo.tags.some(
              tag =>
                tag.toLowerCase().includes(selectedTag.toLowerCase()) ||
                selectedTag.toLowerCase().includes(tag.toLowerCase())
            )
          )
        )
      : GALLERIES_DATA;

  const handleTagClick = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  // ✏️ 패키지 클릭 핸들러 (number 타입)
  const handlePackageClick = (packageId: number) => {
    router.push(`/package/${packageId}`);
  };

  // ✏️ 로딩 상태
  if (packagesLoading) {
    return <PageLoading />;
  }

  return (
    <div className="min-h-screen text-white">
      <GapY size={8} />

      {/* Main Content */}
      <div>
        {/* Tags Section */}
        <div className="pl-5">
          <div className="flex gap-1 flex-nowrap overflow-x-auto scrollbar-hide">
            {availableTags.map((tag, index) => (
              <Badge
                key={index}
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

        {/* 필터링된 갤러리들과 패키지 섹션을 교대로 렌더링 */}
        {filteredGalleries.map((gallery, index) => {
          const isEvenIndex = index % 2 === 0;
          const isLastInPair = index % 2 === 1;
          const isLastGallery = index === filteredGalleries.length - 1;

          return (
            <div key={gallery.id}>
              <div className="pl-5">
                <RecommendationGallery
                  images={gallery.images}
                  salonInfo={gallery.salonInfo}
                  onClick={gallery.onClick}
                />
              </div>

              {/* 두 번째 갤러리 다음에 패키지 섹션 추가 */}
              {isLastInPair && (
                <>
                  <GapY size={20} />
                  {/* ✏️ API 데이터 사용 */}
                  <PackageSection
                    title={PACKAGE_SECTIONS_CONFIG.middle.title}
                    packages={
                      packages?.slice(
                        PACKAGE_SECTIONS_CONFIG.middle.indices[0],
                        PACKAGE_SECTIONS_CONFIG.middle.indices[1] + 1
                      ) || []
                    }
                    onPackageClick={handlePackageClick}
                  />
                  <GapY size={20} />
                </>
              )}

              {/* 마지막 갤러리가 홀수 번째일 때 추가 패키지 섹션 */}
              {isLastGallery && isEvenIndex && (
                <>
                  <GapY size={20} />
                  {/* ✏️ API 데이터 사용 */}
                  <PackageSection
                    title={PACKAGE_SECTIONS_CONFIG.last.title}
                    packages={
                      packages?.slice(
                        PACKAGE_SECTIONS_CONFIG.last.indices[0],
                        PACKAGE_SECTIONS_CONFIG.last.indices[1] + 1
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
    </div>
  );
}

export default function RecommendPage() {
  return (
    <Suspense
      fallback={<div className="min-h-screen text-white">Loading...</div>}
    >
      <RecommendContent />
    </Suspense>
  );
}
