"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowRightIcon } from "@/components/common/Icons";
import Image from "next/image";
import { GapY } from "../../components/ui/gap";
import PackageCard from "@/components/main/PackageCard";
import { useUser } from "@/hooks/useAuthQueries";
import { useUserFormSubmission } from "@/hooks/useFormQueries";

export default function Wish() {
  const router = useRouter();
  const { data: user, isLoading: userLoading } = useUser();
  const {
    data: formSubmission,
    isLoading: formLoading,
    error: formError,
  } = useUserFormSubmission(user?.id);

  useEffect(() => {
    if (!userLoading && !user) {
      router.push("/login");
    }
  }, [user, userLoading, router]);

  // 로딩 상태
  if (userLoading || formLoading) {
    return (
      <div className="min-h-screen text-white flex items-center justify-center">
        <div className="text-lg">데이터를 불러오는 중...</div>
      </div>
    );
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
          <PackageCard
            packageId="triples-dreamy"
            imageSrc="/dummy-profile.png"
            imageAlt="tripleS - Dreamy & Mystic Idol"
            artist="tripleS"
            location="Gapyeong"
            title="Dreamy & Mystic Idol..."
            onClick={handlePackageClick}
          />

          <PackageCard
            packageId="triples-dreamy-2"
            imageSrc="/dummy-profile.png"
            imageAlt="tripleS - Dreamy & Mystic Idol"
            artist="tripleS"
            location="Gapyeong"
            title="Dreamy & Mystic Idol..."
            onClick={handlePackageClick}
          />
        </div>
      </div>

      <GapY size={24} />
    </div>
  );
}
