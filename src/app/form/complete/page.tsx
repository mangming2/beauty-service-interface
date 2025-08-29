"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { ArrowRightIcon } from "@/components/common/Icons";
import Image from "next/image";
import { GapY } from "../../../components/ui/gap";
import PackageCard from "@/components/main/PackageCard";

export default function FormComplete() {
  const [formData, setFormData] = useState<{
    concepts: string[];
    favoriteIdol: string;
    dateRange: { start?: Date; end?: Date };
    region: string;
  } | null>(null);
  const router = useRouter();

  useEffect(() => {
    // localStorage에서 폼 데이터 가져오기
    const concepts = JSON.parse(
      localStorage.getItem("selectedConcepts") || "[]"
    );
    const favoriteIdol = localStorage.getItem("favoriteIdol") || "";
    const dateRange = JSON.parse(
      localStorage.getItem("selectedDateRange") || "{}"
    );
    const region = localStorage.getItem("selectedRegion") || "";

    setFormData({
      concepts,
      favoriteIdol,
      dateRange,
      region,
    });
  }, []);

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
          {formData?.concepts.map((concept: string, index: number) => (
            <Badge
              key={index}
              variant="secondary"
              className="text-lg h-[40px] p-[12px] rounded-[32px] bg-gray text-gray-300 hover:bg-gray-600"
            >
              {concept}
            </Badge>
          ))}
          {formData?.favoriteIdol && (
            <Badge
              variant="secondary"
              className="text-lg h-[40px] p-[12px] rounded-[32px] bg-gray text-gray-300 hover:bg-gray-600"
            >
              {formData.favoriteIdol}
            </Badge>
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
          <span className="text-pink-400 font-medium">Jongno-gu</span>{" "}
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
