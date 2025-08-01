"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRightIcon } from "@/components/common/Icons";
import { GapY } from "@/components/ui/gap";

export default function FormPage2() {
  const [favoriteIdol, setFavoriteIdol] = useState("");
  const router = useRouter();

  const handleNext = () => {
    if (favoriteIdol.trim()) {
      // 입력된 아이돌 이름을 localStorage에 저장
      localStorage.setItem("favoriteIdol", favoriteIdol.trim());
      router.push("/form/step3");
    }
  };

  return (
    <div className="text-white bg-transparent flex flex-col">
      <div className="flex flex-col">
        <GapY size={20} />

        {/* Header */}
        <div className="px-[16px]">
          <h1 className="text-xl font-semibold">Who’s your favorite idol?</h1>
        </div>

        {/* Input Field */}
        <div className="px-[16px]">
          <Input
            type="text"
            placeholder="그룹 또는 아이돌 이름을 입력하세요"
            value={favoriteIdol}
            onChange={e => setFavoriteIdol(e.target.value)}
            className="w-full h-[52px] bg-gray-800 border-gray-600 text-white placeholder:text-gray-400 focus:border-pink-500 focus:ring-pink-500"
          />
        </div>
      </div>

      {/* Navigation */}
      <div className="p-4 bg-transparent border-t border-gray-800">
        <Button
          className={`w-full h-[52px] flex justify-between items-center ${
            favoriteIdol.trim()
              ? "bg-pink-500 hover:bg-pink-600"
              : "bg-gray-600 cursor-not-allowed"
          }`}
          onClick={handleNext}
          disabled={!favoriteIdol.trim()}
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
