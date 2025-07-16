"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRightIcon } from "@/components/common/Icons";
import { GapY } from "@/components/ui/gap";

const concepts = [
  { id: "girlcrush", name: "Girl Crush", icon: "👊", color: "bg-pink-500" },
  { id: "lovely", name: "Lovely & Fresh", icon: "💖", color: "bg-pink-300" },
  { id: "elegant", name: "Elegant & Glam", icon: "👠", color: "bg-purple-500" },
  { id: "dreamy", name: "Dreamy", icon: "🌙", color: "bg-blue-400" },
  { id: "highteen", name: "Highteen", icon: "🎒", color: "bg-green-400" },
  { id: "etc", name: "Etc", icon: "⋯", color: "bg-gray-500" },
];

export default function FormPage1() {
  const [selectedConcepts, setSelectedConcepts] = useState<string[]>([]);
  const router = useRouter();

  const handleConceptClick = (conceptId: string) => {
    setSelectedConcepts(prev => {
      if (prev.includes(conceptId)) {
        return prev.filter(id => id !== conceptId);
      } else if (prev.length < 3) {
        return [...prev, conceptId];
      }
      return prev;
    });
  };

  const handleNext = () => {
    if (selectedConcepts.length > 0) {
      // 선택된 컨셉을 localStorage에 저장
      localStorage.setItem(
        "selectedConcepts",
        JSON.stringify(selectedConcepts)
      );
      router.push("/form/step2");
    }
  };

  return (
    <div className="min-h-screen text-white bg-black flex flex-col">
      <div className="flex-1">
        <GapY size={8} />

        {/* Header */}
        <div className="px-[16px]">
          <h1 className="text-xl font-semibold mb-2">
            어떤 바이브나 컨셉을 가장 좋아하시나요?
          </h1>
          <p className="text-sm text-gray-400 mb-6">(최대 3개)</p>
        </div>

        {/* Concept Selection */}
        <div className="px-[16px]">
          <div className="grid grid-cols-2 gap-3">
            {concepts.map(concept => (
              <Card
                key={concept.id}
                className={`cursor-pointer transition-all duration-200 ${
                  selectedConcepts.includes(concept.id)
                    ? "border-pink-500 bg-pink-500/10"
                    : "border-gray-600 bg-transparent"
                }`}
                onClick={() => handleConceptClick(concept.id)}
              >
                <CardContent className="p-4 text-center">
                  <div className="text-2xl mb-2">{concept.icon}</div>
                  <div className="text-sm font-medium">{concept.name}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="p-4 bg-black border-t border-gray-800">
        <Button
          className={`w-full h-[52px] flex justify-between items-center ${
            selectedConcepts.length > 0
              ? "bg-pink-500 hover:bg-pink-600"
              : "bg-gray-600 cursor-not-allowed"
          }`}
          onClick={handleNext}
          disabled={selectedConcepts.length === 0}
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
