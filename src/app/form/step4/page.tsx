"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRightIcon } from "@/components/common/Icons";
import { GapY } from "@/components/ui/gap";

const regions = [
  { id: "seoul", name: "서울-경기-인천", color: "bg-pink-500" },
  { id: "busan", name: "부산-울산-경남", color: "bg-blue-500" },
  { id: "daegu", name: "대구-경북", color: "bg-green-500" },
  { id: "gwangju", name: "광주-전남", color: "bg-yellow-500" },
  { id: "daejeon", name: "대전-충남", color: "bg-purple-500" },
  { id: "jeju", name: "제주도", color: "bg-orange-500" },
];

export default function FormPage4() {
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
    <div className="text-white bg-transparent flex flex-col">
      <div className="flex flex-col">
        <GapY size={8} />

        {/* Header */}
        <div className="px-[16px]">
          <h1 className="text-xl font-semibold mb-6">
            어디를 방문하고 싶으신가요?
          </h1>
        </div>

        {/* Region Selection */}
        <div className="px-[16px]">
          <div className="grid grid-cols-2 gap-3">
            {regions.map(region => (
              <Card
                key={region.id}
                className={`cursor-pointer transition-all duration-200 ${
                  selectedRegion === region.id
                    ? "border-pink-500 bg-pink-500/10"
                    : "border-gray-600 bg-transparent"
                }`}
                onClick={() => handleRegionClick(region.id)}
              >
                <CardContent className="p-4 text-center">
                  <div
                    className={`w-8 h-8 rounded-full ${region.color} mx-auto mb-2`}
                  ></div>
                  <div className="text-sm text-white font-medium">
                    {region.name}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Selected Region Display */}
        {selectedRegion && (
          <div className="px-[16px] mt-4">
            <p className="text-sm text-gray-400 mb-2">선택된 지역:</p>
            <div className="px-3 py-2 bg-gray-800 rounded-md">
              <span className="text-white">
                {regions.find(r => r.id === selectedRegion)?.name}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="p-4 bg-transparent border-t border-gray-800">
        <Button
          className={`w-full h-[52px] flex justify-between items-center ${
            selectedRegion
              ? "bg-pink-500 hover:bg-pink-600"
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
