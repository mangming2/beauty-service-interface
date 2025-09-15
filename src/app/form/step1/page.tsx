"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { GapY } from "@/components/ui/gap";
import GirlCrush from "@/assets/3d-images/girl-crush.png";
import LovelyFresh from "@/assets/3d-images/lovely-fresh.png";
import ElegantGlam from "@/assets/3d-images/elegant-glam.png";
import Dreamy from "@/assets/3d-images/dreamy.png";
import Highteen from "@/assets/3d-images/highteen.png";
import Etc from "@/assets/3d-images/etc.png";
import { ProgressBar } from "@/components/form/ProgressBar";
import { Step1Schema, Step1Data, concepts } from "@/types/form";
import { useFormStore } from "@/lib/store";

const conceptImages = {
  girlcrush: GirlCrush,
  lovely: LovelyFresh,
  elegant: ElegantGlam,
  dreamy: Dreamy,
  highteen: Highteen,
  etc: Etc,
} as const;

export default function FormPage1() {
  const router = useRouter();
  const { formData, updateStep1, setCurrentStep } = useFormStore();

  const form = useForm<Step1Data>({
    resolver: zodResolver(Step1Schema),
    defaultValues: {
      selectedConcepts: formData.selectedConcepts || [],
    },
  });

  const {
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = form;
  const selectedConcepts = watch("selectedConcepts");

  // 컴포넌트 마운트 시 현재 스텝 설정
  useEffect(() => {
    setCurrentStep(1);
  }, [setCurrentStep]);

  const handleConceptClick = (conceptId: string) => {
    const currentSelected = selectedConcepts || [];

    if (currentSelected.includes(conceptId)) {
      // 이미 선택된 컨셉이면 제거
      setValue(
        "selectedConcepts",
        currentSelected.filter(id => id !== conceptId)
      );
    } else if (currentSelected.length < 3) {
      // 새로운 컨셉 추가 (최대 3개)
      setValue("selectedConcepts", [...currentSelected, conceptId]);
    }
  };

  const onSubmit = (data: Step1Data) => {
    // Zustand store에 데이터 저장
    updateStep1(data);
    // 다음 스텝으로 이동
    router.push("/form/step2");
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
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex w-[372px] items-center justify-center flex-wrap gap-x-[12px] gap-y-[36px]">
            {concepts.map(concept => (
              <Card
                key={concept.id}
                className="w-[116px] py-0 px-0 border-none cursor-pointer transition-all duration-200 bg-transparent"
                onClick={() => handleConceptClick(concept.id)}
              >
                <CardContent className="flex p-0 flex-col gap-[8px] items-center">
                  <div
                    className={`flex items-center justify-center w-[112px] h-[118px] rounded-[6px] ${
                      selectedConcepts?.includes(concept.id)
                        ? "bg-secondary"
                        : "bg-gray"
                    }`}
                  >
                    <Image
                      src={
                        conceptImages[concept.id as keyof typeof conceptImages]
                      }
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

          {/* Error Display */}
          {errors.selectedConcepts && (
            <div className="mt-4 text-red-400 text-sm text-center">
              {errors.selectedConcepts.message}
            </div>
          )}
        </form>
      </div>

      {/* Navigation */}
      <div className="mt-auto py-4 bg-transparent border-t border-gray-800">
        <Button
          className={`w-full h-[52px] flex justify-center items-center ${
            selectedConcepts && selectedConcepts.length > 0
              ? "bg-primary hover:bg-primary"
              : "bg-disabled cursor-not-allowed"
          }`}
          onClick={handleSubmit(onSubmit)}
          disabled={!selectedConcepts || selectedConcepts.length === 0}
        >
          <span className="text-white font-medium">Next</span>
        </Button>
      </div>
    </div>
  );
}
