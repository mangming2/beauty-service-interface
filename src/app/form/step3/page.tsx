"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "@/components/common/Icons";
import { GapY } from "@/components/ui/gap";
import { ProgressBar } from "@/components/form/ProgressBar";
import { Step3Schema, Step3Data, idolOptions } from "@/types/form";
import { useFormStore } from "@/lib/store";

export default function FormPage3() {
  const router = useRouter();
  const { formData, updateStep3, setCurrentStep } = useFormStore();

  const form = useForm<Step3Data>({
    resolver: zodResolver(Step3Schema),
    defaultValues: {
      idolOption: formData.idolOption || "",
    },
  });

  const {
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = form;
  const selectedOption = watch("idolOption");

  // 컴포넌트 마운트 시 현재 스텝 설정
  useEffect(() => {
    setCurrentStep(3);
  }, [setCurrentStep]);

  const handleOptionSelect = (option: string) => {
    setValue("idolOption", option);
  };

  const onSubmit = (data: Step3Data) => {
    // Zustand store에 데이터 저장
    updateStep3(data);
    // 다음 스텝으로 이동
    router.push("/form/step4");
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
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-y-[16px]">
              {idolOptions.map((option, index) => (
                <Button
                  key={index}
                  type="button"
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

            {/* Error Display */}
            {errors.idolOption && (
              <div className="mt-4 text-red-400 text-sm text-center">
                {errors.idolOption.message}
              </div>
            )}
          </form>
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
          onClick={handleSubmit(onSubmit)}
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
