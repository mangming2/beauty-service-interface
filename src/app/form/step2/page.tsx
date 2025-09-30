"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GapY } from "@/components/ui/gap";
import { ProgressBar } from "@/components/form/ProgressBar";
import { Step2Schema, Step2Data } from "@/types/form";
import { useFormStore } from "@/lib/store";

export default function FormPage2() {
  const router = useRouter();
  const { formData, updateStep2, setCurrentStep } = useFormStore();

  const form = useForm<Step2Data>({
    resolver: zodResolver(Step2Schema),
    defaultValues: {
      favoriteIdol: formData.favoriteIdol || "",
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = form;

  // 컴포넌트 마운트 시 현재 스텝 설정
  useEffect(() => {
    setCurrentStep(2);
  }, [setCurrentStep]);

  const onSubmit = (data: Step2Data) => {
    // Zustand store에 데이터 저장
    updateStep2(data);
    // 다음 스텝으로 이동
    router.push("/form/step3");
  };

  return (
    <div className="text-white bg-transparent flex flex-col flex-1">
      <div className="flex-1 flex flex-col">
        <GapY size={12} />
        <ProgressBar />
        <GapY size={20} />

        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div>
            <h1 className="h-[68px] text-xl font-semibold">
              Which idol do you want to be?
            </h1>
          </div>

          <GapY size={146} />

          {/* Input Field */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div>
              <Input
                type="text"
                placeholder="Enter the name of the group or idol"
                {...register("favoriteIdol")}
                className="w-full h-[52px] py-[8px] px-[12px] text-white border-none placeholder:text-gray-400 focus:border-pink-500 focus:ring-pink-500"
              />
              {/* Error Display */}
              {errors.favoriteIdol && (
                <div className="mt-2 text-red-400 text-sm">
                  {errors.favoriteIdol.message}
                </div>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Navigation */}
      <div className="mt-auto py-4">
        <Button
          className="w-full h-[52px]"
          onClick={handleSubmit(onSubmit)}
          disabled={!isValid}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
