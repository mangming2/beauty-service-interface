"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { ArrowRightIcon } from "@/components/common/Icons";
import Image from "next/image";
import { GapY } from "../../../components/ui/gap";
import PackageCard from "@/components/main/PackageCard";
import { useUser } from "@/hooks/useAuthQueries";
import { useUserFormSubmission } from "@/hooks/useFormQueries";

export default function FormComplete() {
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
    <div className="min-h-screen text-white">
      <GapY size={12} />
      {/* Tags Section */}
      <div>
        <div className="h-[44px] flex items-center">
          <h2 className="h-[28px] title-md font-medium">
            All summed up in tags
          </h2>
        </div>
        <div className="flex gap-1 flex-wrap">
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

      <div className="flex justify-between h-[44px]">
        <h3 className="flex items-center title-md font-medium">
          Based on your answers
        </h3>
        <div className="flex flex-col h-full gap-[5px] justify-end">
          <div className="flex items-center gap-[5px]">
            <span className="text-gray_1 text-sm">more</span>
            <ArrowRightIcon width={3} height={7} color="var(--color-gray_1)" />
          </div>
        </div>
      </div>

      <GapY size={12} />

      <div className="w-[364px] h-[448px] relative">
        <Image
          src="/dummy-profile.png"
          alt="dummy profile"
          fill
          className="object-cover"
        />
      </div>

      <GapY size={12} />

      {/* Distance Info */}
      <div className="flex items-center justify-center w-full h-[28px] bg-white/10 rounded-[32px]">
        <span className="text-gray-300 text-sm">
          About 1.5 km from the{" "}
          <span className="text-pink-400 font-medium">
            {formSubmission.selected_regions?.[0] || "Seoul"}
          </span>{" "}
        </span>
      </div>

      <GapY size={12} />

      <div className="flex justify-between h-[44px]">
        <h3 className="flex items-center title-md font-medium">
          How about this package?
        </h3>
        <div className="flex flex-col h-full gap-[5px] justify-end">
          <div className="flex items-center gap-[5px]">
            <span className="text-gray_1 text-sm">more</span>
            <ArrowRightIcon width={3} height={7} color="var(--color-gray_1)" />
          </div>
        </div>
      </div>

      <GapY size={8} />

      {/* Package Cards */}
      <div className="flex gap-2">
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
  );
}
