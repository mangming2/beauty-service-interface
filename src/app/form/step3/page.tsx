"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "@/components/common/Icons";
import { GapY } from "@/components/ui/gap";
import { ProgressBar } from "@/components/form/ProgressBar";

export default function FormPage3() {
  const [selectedOption, setSelectedOption] = useState("");
  const router = useRouter();

  const idolOptions = [
    "K-pop stage outfit & concept shoot",
    "Casual daily look snapshot",
    "Hair & makeup only",
    "Themed shoot with friends or family",
    "Profile portrait shoot",
  ];

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
  };

  const handleNext = () => {
    if (selectedOption) {
      // 선택된 옵션을 localStorage에 저장
      localStorage.setItem("idolOption", selectedOption);
      router.push("/form/step4");
    }
  };

  return (
    <div className="text-white bg-transparent flex flex-col flex-1">
      <div className="flex-1 flex flex-col">
        <GapY size={12} />
        <ProgressBar />
        <GapY size={20} />

        <div className="flex-1 flex flex-col gap-y-[40px]">
          {/* Header */}
          <div>
            <h1 className="h-[68px] text-xl font-semibold">
              Which idol do you want to be?
            </h1>
          </div>

          {/* Option Buttons */}
          <div className="flex flex-col gap-y-[16px]">
            {idolOptions.map((option, index) => (
              <Button
                key={index}
                variant="outline"
                onClick={() => handleOptionSelect(option)}
                className={`w-full h-[56px] justify-start text-lg px-[16px] py-[10px] border-2 transition-all duration-200 ${
                  selectedOption === option
                    ? "border-primary bg-primary text-white"
                    : "border-gray-outline bg-gray-outline text-white hover:border-gray-outline hover:bg-gray-outline"
                }`}
              >
                {option}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="mt-auto py-4 bg-transparent border-t border-gray-800">
        <Button
          className={`w-full h-[52px] flex justify-between items-center ${
            selectedOption
              ? "bg-pink-500 hover:bg-pink-600"
              : "bg-gray-600 cursor-not-allowed"
          }`}
          onClick={handleNext}
          disabled={!selectedOption}
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
