"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { ArrowRightIcon, RestartIcon } from "@/components/common/Icons";
import { PageLoading } from "@/components/common";
import Image from "next/image";
import { GapY } from "../../../components/ui/gap";
import PackageCard from "@/components/main/PackageCard";
import { useUser } from "@/hooks/useAuthQueries";
import { useUserFormSubmission } from "@/hooks/useFormQueries";
import { useAllPackages } from "@/hooks/usePackageQueries";

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
      <GapY size={12} />
      {/* Tags Section */}
      <div>
        <div className="h-[44px] flex items-center">
          <h2 className="h-[28px] title-md font-medium">
            All summed up in tags
          </h2>
        </div>
        <div className="flex gap-1 flex-nowrap overflow-x-auto pb-2 scrollbar-hide">
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
      <GapY size={16} />

      <GapY size={12} />

      <div
        className="flex flex-col cursor-pointer"
        onClick={() => router.push("/package/aespa-futuristic")}
      >
        <div className="flex gap-3 flex-nowrap overflow-x-auto pb-2 scrollbar-hide">
          <div className="w-[348px] h-[196px] relative flex-shrink-0">
            <Image
              src="/dummy-profile.png"
              alt="dummy profile"
              fill
              className="object-cover"
            />
          </div>
          <div className="w-[348px] h-[196px] relative flex-shrink-0">
            <Image
              src="/dummy-profile.png"
              alt="dummy profile"
              fill
              className="object-cover"
            />
          </div>
          <div className="w-[348px] h-[196px] relative flex-shrink-0">
            <Image
              src="/dummy-profile.png"
              alt="dummy profile"
              fill
              className="object-cover"
            />
          </div>
        </div>

        <GapY size={12} />

        {/* Salon Recommendation Cards */}
        <div className="flex gap-3 flex-nowrap overflow-x-auto pb-2">
          <div className="w-[372px]">
            <div>
              <div className="flex gap-2 mb-2">
                <span className="text-pink-400 text-sm">#aespa</span>
                <span className="text-pink-400 text-sm">#metallic</span>
                <span className="text-pink-400 text-sm">#sm</span>
              </div>

              <div className="flex justify-between items-center">
                <h3 className="text-white title-sm font-semibold mb-2">
                  DOKI MAKE SALON
                </h3>
                <span className="text-pink-400 title-sm font-semibold">
                  ₩ 50,000 ~
                </span>
              </div>

              <div className="flex items-center gap-2 mb-2">
                <span className="text-pink-400">★</span>
                <span className="text-white text-sm">4.8</span>
                <span className="text-gray-400 text-sm">review 15</span>
                <span className="text-gray-300 text-sm">2.3km (Yongsan)</span>
              </div>
              <div className="text-gray-400 text-xs mb-2">
                Korean / English / Japanese
              </div>
            </div>
          </div>
        </div>
      </div>

      <GapY size={12} />

      <div className="flex flex-col gap-2 pl-5 bg-gray-container">
        <div className="flex justify-between h-[44px]">
          <h3 className="flex items-center title-md font-medium">
            How about this package?
          </h3>
          <div className="flex flex-col h-full gap-[5px] justify-end pr-5">
            <div className="flex items-center gap-[5px]">
              <span className="text-gray_1 text-sm">more</span>
              <ArrowRightIcon
                width={3}
                height={7}
                color="var(--color-gray_1)"
              />
            </div>
          </div>
        </div>
        {/* Package Cards */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {packages?.slice(0, 2).map(pkg => (
            <PackageCard
              key={pkg.id}
              packageId={pkg.id}
              imageSrc={pkg.image_src[0] || "/dummy-profile.png"}
              imageAlt={`${pkg.artist} - ${pkg.title}`}
              artist={pkg.artist}
              location={pkg.location}
              title={pkg.title}
              onClick={handlePackageClick}
            />
          ))}
        </div>
      </div>

      <GapY size={12} />

      <div className="flex flex-col gap-2 pl-5 bg-gray-container">
        <div className="flex justify-between h-[44px]">
          <h3 className="flex items-center title-md font-medium">
            Looking for another Date?
          </h3>
          <div className="flex flex-col h-full gap-[5px] justify-end pr-5">
            <div className="flex items-center gap-[5px]">
              <span className="text-gray_1 text-sm">more</span>
              <ArrowRightIcon
                width={3}
                height={7}
                color="var(--color-gray_1)"
              />
            </div>
          </div>
        </div>
        {/* Package Cards */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {packages?.slice(2, 4).map(pkg => (
            <PackageCard
              key={pkg.id}
              packageId={pkg.id}
              imageSrc={pkg.image_src[0] || "/dummy-profile.png"}
              imageAlt={`${pkg.artist} - ${pkg.title}`}
              artist={pkg.artist}
              location={pkg.location}
              title={pkg.title}
              onClick={handlePackageClick}
            />
          ))}
        </div>
      </div>

      <GapY size={24} />

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
