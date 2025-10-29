"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { GapY } from "@/components/ui/gap";
import { Badge } from "@/components/ui/badge";
import RecommendationGallery from "@/components/main/RecommendationGallery";
import PackageSection from "@/components/main/PackageSection";

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

// 패키지 섹션 데이터
const PACKAGE_SECTIONS_DATA = {
  middle: {
    title: "How about this package?",
    packages: [
      {
        id: "triples-dreamy",
        title: "Dreamy & Mystic Idol...",
        artist: "tripleS",
        location: "Gapyeong",
        imageSrc: "/dummy-profile.png",
      },
      {
        id: "blackpink-romantic-1",
        title: "Romantic & Elegant i...",
        artist: "Blackpink",
        location: "Yongin",
        imageSrc: "/dummy-profile.png",
      },
      {
        id: "blackpink-romantic-2",
        title: "Romantic & Elegant i...",
        artist: "Blackpink",
        location: "Yongin",
        imageSrc: "/dummy-profile.png",
      },
    ],
  },
  last: {
    title: "Looking for another Date?",
    packages: [
      {
        id: "hitst-special-1",
        title: "HITST Special Package",
        artist: "HITST",
        location: "Seoul",
        imageSrc: "/dummy-profile.png",
      },
      {
        id: "summer-vibes",
        title: "Summer Vibes Package",
        artist: "Various",
        location: "Busan",
        imageSrc: "/dummy-profile.png",
      },
      {
        id: "hitst-special-2",
        title: "HITST Special Package",
        artist: "HITST",
        location: "Seoul",
        imageSrc: "/dummy-profile.png",
      },
    ],
  },
};

function RecommendContent() {
  const searchParams = useSearchParams();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

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
    setSelectedTags(
      prev =>
        prev.includes(tag)
          ? prev.filter(t => t !== tag) // 이미 선택된 태그면 제거
          : [...prev, tag] // 선택되지 않은 태그면 추가
    );
  };

  return (
    <div className="min-h-screen text-white">
      <GapY size={8} />

      {/* Main Content */}
      <div>
        {/* Tags Section */}
        <div className="px-5">
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
              <div className="px-5">
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
                  <PackageSection
                    title={PACKAGE_SECTIONS_DATA.middle.title}
                    packages={PACKAGE_SECTIONS_DATA.middle.packages}
                    onPackageClick={() => {}}
                  />
                  <GapY size={20} />
                </>
              )}

              {/* 마지막 갤러리가 홀수 번째일 때 추가 패키지 섹션 */}
              {isLastGallery && isEvenIndex && (
                <>
                  <GapY size={20} />
                  <PackageSection
                    title={PACKAGE_SECTIONS_DATA.last.title}
                    packages={PACKAGE_SECTIONS_DATA.last.packages}
                    onPackageClick={() => {}}
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
