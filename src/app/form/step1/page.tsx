"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRightIcon } from "@/components/common/Icons";
import { GapY } from "@/components/ui/gap";
import GirlCrush from "@/assets/3d-images/girl-crush.png";
import LovelyFresh from "@/assets/3d-images/lovely-fresh.png";
import ElegantGlam from "@/assets/3d-images/elegant-glam.png";
import Dreamy from "@/assets/3d-images/dreamy.png";
import Highteen from "@/assets/3d-images/highteen.png";
import Etc from "@/assets/3d-images/etc.png";
import { ProgressBar } from "@/components/form/ProgressBar";

const concepts = [
  {
    id: "girlcrush",
    name: "Girl Crush",
    icon: GirlCrush,
  },
  {
    id: "lovely",
    name: "Lovely & Fresh",
    icon: LovelyFresh,
  },
  {
    id: "elegant",
    name: "Elegant & Glam",
    icon: ElegantGlam,
  },
  {
    id: "dreamy",
    name: "Dreamy",
    icon: Dreamy,
  },
  {
    id: "highteen",
    name: "Highteen",
    icon: Highteen,
  },
  {
    id: "etc",
    name: "Etc",
    icon: Etc,
  },
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
    <div className="text-white bg-transparent flex flex-col flex-1">
      <div className="flex-1">
        <GapY size={12} />

        <ProgressBar />

        <GapY size={20} />
        {/* Header */}
        <div>
          <h1 className="text-xl font-semibold">
            What kind of Vibe or concept do you love most? (max 3)
          </h1>
        </div>

        <GapY size={32} />

        {/* Concept Selection */}
        <div className="flex items-center justify-center flex-wrap gap-x-[20px] gap-y-[36px]">
          {concepts.map(concept => (
            <Card
              key={concept.id}
              className="w-[112px] py-0 px-0 border-none cursor-pointer transition-all duration-200 bg-transparent"
              onClick={() => handleConceptClick(concept.id)}
            >
              <CardContent className="flex p-0 flex-col gap-[8px] items-center">
                <div
                  className={`flex items-center justify-center w-[112px] h-[118px] rounded-[6px] ${
                    selectedConcepts.includes(concept.id)
                      ? "bg-secondary"
                      : "bg-gray"
                  }`}
                >
                  <Image
                    src={concept.icon}
                    alt={concept.name}
                    width={60}
                    height={60}
                    className="object-contain"
                  />
                </div>
                <div className="text-white text-sm font-medium w-full text-center whitespace-nowrap">
                  {concept.name}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="mt-auto py-4 bg-transparent border-t border-gray-800">
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
