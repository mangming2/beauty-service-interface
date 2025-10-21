"use client";
import { useState } from "react";
import { GapY } from "@/components/ui/gap";
import { Badge } from "@/components/ui/badge";
import RecommendationGallery from "@/components/main/RecommendationGallery";
import PackageSection from "@/components/main/PackageSection";

export default function RecommendPage() {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const availableTags = ["SMent", "Aespa", "Girl crush", "Metallic"];

  // 각 갤러리의 태그 정보
  const galleries = [
    {
      id: 1,
      images: [
        "/dummy-profile.png",
        "/dummy-profile.png",
        "/dummy-profile.png",
      ],
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
      images: [
        "/dummy-profile.png",
        "/dummy-profile.png",
        "/dummy-profile.png",
      ],
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
      images: [
        "/dummy-profile.png",
        "/dummy-profile.png",
        "/dummy-profile.png",
      ],
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

  // 태그 필터링 함수
  const filteredGalleries =
    selectedTags.length > 0
      ? galleries.filter(gallery =>
          selectedTags.some(selectedTag =>
            gallery.salonInfo.tags.some(
              tag =>
                tag.toLowerCase().includes(selectedTag.toLowerCase()) ||
                selectedTag.toLowerCase().includes(tag.toLowerCase())
            )
          )
        )
      : galleries;

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
        <div>
          <div className="flex gap-1 flex-nowrap overflow-x-auto pb-2 scrollbar-hide">
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

        <GapY size={16} />

        <GapY size={12} />

        {/* 필터링된 갤러리들과 패키지 섹션을 교대로 렌더링 */}
        {filteredGalleries.map((gallery, index) => {
          const isEvenIndex = index % 2 === 0;
          const isLastInPair = index % 2 === 1;
          const isLastGallery = index === filteredGalleries.length - 1;

          return (
            <div key={gallery.id}>
              <RecommendationGallery
                images={gallery.images}
                salonInfo={gallery.salonInfo}
                onClick={gallery.onClick}
              />

              {/* 두 번째 갤러리 다음에 패키지 섹션 추가 */}
              {isLastInPair && (
                <>
                  <GapY size={12} />
                  <PackageSection
                    title="How about this package?"
                    packages={[
                      {
                        id: "triples-dreamy",
                        title: "Dreamy & Mystic Idol...",
                        artist: "tripleS",
                        location: "Gapyeong",
                        imageSrc: "/dummy-profile.png",
                      },
                      {
                        id: "blackpink-romantic",
                        title: "Romantic & Elegant i...",
                        artist: "Blackpink",
                        location: "Yongin",
                        imageSrc: "/dummy-profile.png",
                      },
                    ]}
                    onPackageClick={() => {}}
                  />
                </>
              )}

              {/* 마지막 갤러리가 홀수 번째일 때 추가 패키지 섹션 */}
              {isLastGallery && isEvenIndex && (
                <>
                  <GapY size={12} />
                  <PackageSection
                    title="Looking for another Date?"
                    packages={[
                      {
                        id: "hitst-special",
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
                    ]}
                    onPackageClick={() => {}}
                  />
                </>
              )}

              {/* 갤러리 사이 간격 */}
              {!isLastGallery && <GapY size={12} />}
            </div>
          );
        })}

        <GapY size={24} />
      </div>
    </div>
  );
}
