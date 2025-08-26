"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "@/components/common/Icons";
import { GapY } from "@/components/ui/gap";
import { ProgressBar } from "@/components/form/ProgressBar";
import { SeoulMap } from "@/components/common/SeoulMap";

export default function FormPage5() {
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const router = useRouter();

  const handleRegionClick = (regionId: string) => {
    setSelectedRegions(prev => {
      if (prev.includes(regionId)) {
        // 이미 선택된 지역이면 제거
        return prev.filter(id => id !== regionId);
      } else {
        // 새로운 지역이면 추가
        return [...prev, regionId];
      }
    });
  };

  const handleSubmit = () => {
    if (selectedRegions.length > 0) {
      // 선택된 지역들을 localStorage에 저장
      localStorage.setItem("selectedRegions", JSON.stringify(selectedRegions));

      // 모든 폼 데이터를 수집
      const formData = {
        concepts: JSON.parse(localStorage.getItem("selectedConcepts") || "[]"),
        favoriteIdol: localStorage.getItem("favoriteIdol") || "",
        dates: JSON.parse(localStorage.getItem("selectedDates") || "[]"),
        regions: selectedRegions,
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
          <h1 className="h-[68px] text-xl font-semibold mb-6">
            Where would you like to visit?
          </h1>
        </div>
        <div className="px-[16px]">
          <SeoulMap
            selectedIds={selectedRegions}
            onSelect={handleRegionClick}
            className="w-full max-w-[480px]"
          />
        </div>

        <GapY size={12} />

        <div className="px-[16px] flex justify-center">
          {selectedRegions.length > 0 && (
            <div className="p-[12px] bg-gray rounded-[32px] text-lg text-center w-fit">
              {selectedRegions.join(", ")}
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="mt-auto p-4 bg-transparent">
        <Button
          className={`w-full h-[52px] flex justify-between items-center ${
            selectedRegions.length > 0
              ? "bg-pink-500 hover:bg-pink-600"
              : "bg-gray-600 cursor-not-allowed"
          }`}
          onClick={handleSubmit}
          disabled={selectedRegions.length === 0}
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
