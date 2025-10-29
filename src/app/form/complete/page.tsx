"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { RestartIcon } from "@/components/common/Icons";
import { PageLoading } from "@/components/common";
import { GapY } from "../../../components/ui/gap";
import RecommendationGallery from "@/components/main/RecommendationGallery";
import PackageSection from "@/components/main/PackageSection";
import { useUser } from "@/hooks/useAuthQueries";
import { useUserFormSubmission } from "@/hooks/useFormQueries";
import { useAllPackages } from "@/hooks/usePackageQueries";

// TODO: 백엔드 연동 시 더미 데이터를 실제 API 응답으로 교체
const DUMMY_RECOMMENDATION_GALLERIES = [
  {
    images: ["/dummy-profile.png", "/dummy-profile.png", "/dummy-profile.png"],
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
    packagePath: "/package/aespa-futuristic",
  },
  {
    images: ["/dummy-profile.png", "/dummy-profile.png", "/dummy-profile.png"],
    salonInfo: {
      tags: ["girl crush", "metallic", "sm"],
      name: "STYLE STUDIO",
      price: "₩ 45,000 ~",
      rating: 4.6,
      reviewCount: 23,
      distance: "1.8km (Gangnam)",
      location: "Gangnam",
      languages: "Korean / English",
    },
    packagePath: "/package/girl-crush",
  },
  {
    images: ["/dummy-profile.png", "/dummy-profile.png", "/dummy-profile.png"],
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
    packagePath: "/package/glam-beauty",
  },
  {
    images: ["/dummy-profile.png", "/dummy-profile.png", "/dummy-profile.png"],
    salonInfo: {
      tags: ["elegant", "glam"],
      name: "ELEGANT STUDIO",
      price: "₩ 55,000 ~",
      rating: 4.7,
      reviewCount: 12,
      distance: "2.1km (Myeongdong)",
      location: "Myeongdong",
      languages: "Korean / English / Japanese",
    },
    packagePath: "/package/elegant-studio",
  },
];

const DUMMY_PACKAGE_SECTIONS = [
  {
    title: "How about this package?",
    packageIndices: [0, 1], // packages 배열에서 가져올 인덱스
  },
  {
    title: "Looking for another Date?",
    packageIndices: [2, 3], // packages 배열에서 가져올 인덱스
  },
];

export default function FormComplete() {
  const router = useRouter();
  const { data: user, isLoading: userLoading } = useUser();
  const {
    data: formSubmission,
    isLoading: formLoading,
    error: formError,
  } = useUserFormSubmission(user?.id);

  // 패키지 데이터 가져오기
  const { data: packages, isLoading: packagesLoading } = useAllPackages();

  useEffect(() => {
    if (!userLoading && !user) {
      router.push("/login");
    }
  }, [user, userLoading, router]);

  // 로딩 상태
  if (userLoading || formLoading || packagesLoading) {
    return <PageLoading />;
  }

  // 에러 상태
  if (formError) {
    return (
      <div className="min-h-screen text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg text-red-400 mb-4">
            {(formError as Error)?.message ||
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

  // 데이터가 없는 경우
  if (!formSubmission) {
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

  const handlePackageClick = (packageId: string) => {
    // 패키지 상세 페이지로 이동
    router.push(`/package/${packageId}`);
  };

  return (
    <div className="min-h-screen text-white relative">
      <GapY size={8} />

      {/* Main Content */}
      <div>
        {/* Tags Section */}
        <div className="px-5">
          <div className="flex gap-1 flex-nowrap overflow-x-auto scrollbar-hide">
            {formSubmission.selected_concepts?.map(
              (concept: string, index: number) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="text-lg h-[40px] p-[12px] rounded-[32px] bg-gray text-gray-300 hover:bg-gray-600"
                >
                  {concept}
                </Badge>
              )
            )}
            {formSubmission.favorite_idol && (
              <Badge
                variant="secondary"
                className="text-lg h-[40px] p-[12px] rounded-[32px] bg-gray text-gray-300 hover:bg-gray-600"
              >
                {formSubmission.favorite_idol}
              </Badge>
            )}
            {formSubmission.idol_option && (
              <Badge
                variant="secondary"
                className="text-lg h-[40px] p-[12px] rounded-[32px] bg-gray text-gray-300 hover:bg-gray-600"
              >
                {formSubmission.idol_option}
              </Badge>
            )}
            {formSubmission.selected_regions?.map(
              (region: string, index: number) => (
                <Badge
                  key={`region-${index}`}
                  variant="secondary"
                  className="text-lg h-[40px] p-[12px] rounded-[32px] bg-gray text-gray-300 hover:bg-gray-600"
                >
                  {region}
                </Badge>
              )
            )}
          </div>
        </div>

        <GapY size={20} />

        {/* RecommendationGalleries */}
        {DUMMY_RECOMMENDATION_GALLERIES.map((gallery, index) => {
          const isSecondGallery = index === 1;
          const isFourthGallery = index === 3;

          return (
            <div key={index}>
              <div className="px-5">
                <RecommendationGallery
                  images={gallery.images}
                  salonInfo={gallery.salonInfo}
                  onClick={() => router.push(gallery.packagePath)}
                />
              </div>

              {/* 두 번째 갤러리 다음에 패키지 섹션 추가 */}
              {isSecondGallery && (
                <>
                  <GapY size={20} />
                  <PackageSection
                    title={DUMMY_PACKAGE_SECTIONS[0].title}
                    packages={
                      packages
                        ?.slice(
                          DUMMY_PACKAGE_SECTIONS[0].packageIndices[0],
                          DUMMY_PACKAGE_SECTIONS[0].packageIndices[1] + 1
                        )
                        .map(pkg => ({
                          id: pkg.id,
                          title: pkg.title,
                          artist: pkg.artist,
                          location: pkg.location,
                          imageSrc: pkg.image_src[0] || "/dummy-profile.png",
                        })) || []
                    }
                    onPackageClick={handlePackageClick}
                  />
                  <GapY size={20} />
                </>
              )}

              {/* 네 번째 갤러리 다음에 패키지 섹션 추가 */}
              {isFourthGallery && (
                <>
                  <GapY size={20} />
                  <PackageSection
                    title={DUMMY_PACKAGE_SECTIONS[1].title}
                    packages={
                      packages
                        ?.slice(
                          DUMMY_PACKAGE_SECTIONS[1].packageIndices[0],
                          DUMMY_PACKAGE_SECTIONS[1].packageIndices[1] + 1
                        )
                        .map(pkg => ({
                          id: pkg.id,
                          title: pkg.title,
                          artist: pkg.artist,
                          location: pkg.location,
                          imageSrc: pkg.image_src[0] || "/dummy-profile.png",
                        })) || []
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

      {/* Fixed Floating Restart Form Button */}
      <button
        onClick={() => router.push("/form/step1")}
        className="sticky bottom-20 right-6 flex justify-center items-center cursor-pointer p-3 rounded-full z-50 ml-auto"
        style={{ backgroundColor: "var(--pink-font)" }}
      >
        <RestartIcon width={35} height={35} color="white" />
      </button>
    </div>
  );
}
