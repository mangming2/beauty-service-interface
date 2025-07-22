"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRightIcon } from "@/components/common/Icons";
import { GapY } from "@/components/ui/gap";
import girlCrush from "@/assets/3d-images/girlcrush.png";
import lovely from "@/assets/3d-images/lovely.png";
import glow from "@/assets/3d-images/glow.png";
import dreamy from "@/assets/3d-images/dreamy.png";
import highteen from "@/assets/3d-images/highteen.png";
import etc from "@/assets/3d-images/etc.png";

const concepts = [
  {
    id: "girlcrush",
    name: "Girl Crush",
    icon: girlCrush,
    color: "bg-pink-500",
  },
  { id: "lovely", name: "Lovely & Fresh", icon: lovely, color: "bg-pink-300" },
  {
    id: "elegant",
    name: "Elegant & Glam",
    icon: glow,
    color: "bg-purple-500",
  },
  { id: "dreamy", name: "Dreamy", icon: dreamy, color: "bg-blue-400" },
  { id: "highteen", name: "Highteen", icon: highteen, color: "bg-green-400" },
  { id: "etc", name: "Etc", icon: etc, color: "bg-gray-500" },
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
    <div className="min-h-screen text-white bg-transparent flex flex-col">
      <div className="flex-1">
        <GapY size={20} />
        {/* Header */}
        <div className="px-[16px]">
          <h1 className="text-xl font-semibold">
            What kind of Vibe or concept do you love most? (max 3)
          </h1>
        </div>

        <GapY size={32} />

        {/* Concept Selection */}
        <div className="grid grid-cols-3 gap-x-[20px] gap-y-[36px]">
          {concepts.map(concept => (
            <Card
              key={concept.id}
              className="py-0 border-none cursor-pointer transition-all duration-200 bg-transparent"
              onClick={() => handleConceptClick(concept.id)}
            >
              <CardContent className="flex flex-col gap-[8px] items-center">
                <div
                  className={`flex items-center justify-center w-[112px] h-[118px] py-[23px] px-[31px] rounded-[6px] ${
                    selectedConcepts.includes(concept.id)
                      ? "bg-secondary"
                      : "bg-gray"
                  }`}
                >
                  <Image
                    src={concept.icon}
                    alt={concept.name}
                    width={50}
                    height={50}
                    className="object-contain"
                  />
                </div>
                <div className="text-white text-xs font-medium w-full text-center">
                  {concept.name}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="p-4 bg-transparent border-t border-gray-800">
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
