"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "@/components/common/Icons";
import { GapY } from "@/components/ui/gap";
import { ProgressBar } from "@/components/form/ProgressBar";
import SeoulMap from "@/components/common/SeoulMap";

export default function FormPage5() {
  const [selectedRegion, setSelectedRegion] = useState<string>("");
  const router = useRouter();

  const handleRegionClick = (regionId: string) => {
    setSelectedRegion(regionId);
  };

  const handleSubmit = () => {
    if (selectedRegion) {
      // 선택된 지역을 localStorage에 저장
      localStorage.setItem("selectedRegion", selectedRegion);

      // 모든 폼 데이터를 수집
      const formData = {
        concepts: JSON.parse(localStorage.getItem("selectedConcepts") || "[]"),
        favoriteIdol: localStorage.getItem("favoriteIdol") || "",
        dates: JSON.parse(localStorage.getItem("selectedDates") || "[]"),
        region: selectedRegion,
      };

      // 폼 제출 완료 (여기서 API 호출 등을 할 수 있습니다)
      console.log("Form submitted:", formData);

      // 패키지 추천 페이지로 리다이렉트
      router.push("/form/complete");
    }
  };

  return (
    <div className="text-white bg-transparent flex flex-col flex-1">
      <div className="flex-1 flex flex-col">
        <GapY size={8} />
        <ProgressBar />
        <GapY size={12} />

        {/* Header */}
        <div className="px-[16px]">
          <h1 className="text-xl font-semibold mb-6">
            어디를 방문하고 싶으신가요?
          </h1>
        </div>
        <div className="px-[16px]">
          <SeoulMap
            selectedId={selectedRegion}
            onSelect={handleRegionClick}
            className="w-full max-w-[480px]"
          />
        </div>
      </div>

      {/* Navigation */}
      <div className="mt-auto p-4 bg-transparent">
        <Button
          className={`w-full h-[52px] flex justify-between items-center ${
            selectedRegion
              ? "bg-secondary text-pink-font hover:bg-secondary/80 hover:text-pink-font"
              : "bg-gray-600 cursor-not-allowed"
          }`}
          onClick={handleSubmit}
          disabled={!selectedRegion}
        >
          <span className="font-medium">Next</span>
          <ArrowRightIcon
            color="white"
            width={7}
            height={16}
            className="size-auto"
          />
        </Button>
      </div>
    </div>
  );
}
