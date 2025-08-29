"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { ArrowRightIcon } from "@/components/common/Icons";
import { GapY } from "@/components/ui/gap";
import { ProgressBar } from "@/components/form/ProgressBar";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { format } from "date-fns";
import { Step4Schema, Step4Data } from "@/types/form";
import { useFormStore } from "@/lib/store";

export default function FormPage4() {
  const router = useRouter();
  const { formData, updateStep4, setCurrentStep } = useFormStore();
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const form = useForm<Step4Data>({
    resolver: zodResolver(Step4Schema),
    defaultValues: {
      dateRange: formData.dateRange || { from: undefined, to: undefined },
    },
  });

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = form;
  const dateRange = watch("dateRange");

  // 컴포넌트 마운트 시 현재 스텝 설정
  useEffect(() => {
    setCurrentStep(4);
  }, [setCurrentStep]);

  const onSubmit = (data: Step4Data) => {
    // 데이터 검증 후 저장 (from과 to가 모두 존재하는 경우만)
    if (data.dateRange.from && data.dateRange.to) {
      updateStep4({
        dateRange: {
          from: data.dateRange.from,
          to: data.dateRange.to,
        },
      });
      // 다음 스텝으로 이동
      router.push("/form/step5");
    }
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() - 1);
      return newDate;
    });
  };

  const goToNextMonth = () => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + 1);
      return newDate;
    });
  };

  return (
    <div className="text-white bg-transparent flex flex-col flex-1">
      <div className="flex-1 flex flex-col">
        <GapY size={12} />
        <ProgressBar />
        <GapY size={12} />

        {/* Header */}
        <div className="px-[16px]">
          <h1 className="text-xl font-semibold mb-6">
            When would you like to join the tour?
          </h1>
        </div>

        {/* Calendar - Centered */}
        <div className="flex-1 flex px-[16px]">
          <div className="w-full max-w-xs mx-auto">
            {/* Custom Calendar Header */}
            <div className="flex items-center justify-between mb-4 px-2">
              <button
                onClick={goToPreviousMonth}
                className="text-gray-300 hover:text-white transition-colors"
              >
                <ChevronLeftIcon className="h-5 w-5" />
              </button>
              <span className="text-gray-300 font-medium">
                {format(currentMonth, "yyyy.MM")}
              </span>
              <button
                onClick={goToNextMonth}
                className="text-gray-300 hover:text-white transition-colors"
              >
                <ChevronRightIcon className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="w-full h-full flex flex-col">
                <Controller
                  name="dateRange"
                  control={control}
                  render={({ field }) => (
                    <Calendar
                      mode="range"
                      selected={
                        field.value?.from && field.value?.to
                          ? { from: field.value.from, to: field.value.to }
                          : undefined
                      }
                      onSelect={range => {
                        field.onChange({
                          from: range?.from,
                          to: range?.to,
                        });
                      }}
                      month={currentMonth}
                      onMonthChange={setCurrentMonth}
                      todayClassName="text-pink-font"
                      className={`rounded-md bg-transparent w-full h-full flex flex-col ${field.value?.from ? "date-selected" : ""}`}
                      classNames={{
                        months: "flex flex-col w-full h-full flex-1",
                        month: "space-y-4 w-full h-full flex flex-col flex-1",
                        caption: "hidden !hidden", // Completely hide default caption
                        caption_label: "hidden !hidden", // Hide caption label
                        month_caption: "hidden !hidden", // Hide month caption completely
                        nav: "hidden !hidden", // Completely hide default navigation
                        nav_button: "hidden !hidden", // Hide nav buttons
                        nav_button_previous: "hidden !hidden",
                        nav_button_next: "hidden !hidden",
                        table: "w-full border-collapse space-y-1 flex-1",
                        head_row: "flex w-full",
                        head_cell:
                          "text-gray-400 rounded-md w-8 font-normal text-[0.8rem] text-white flex-1",
                        row: "flex w-full mt-2 flex-1",
                        cell: "text-center text-sm p-0 relative first:[&:has([aria-selected])]:rounded-l-[999px] last:[&:has([aria-selected])]:rounded-r-[999px] focus-within:relative focus-within:z-20 flex-1 bg-transparent",
                        day: "h-full w-full p-0 font-normal aria-selected:opacity-100 hover:bg-secondary/20 text-white flex items-center justify-center bg-transparent",
                        day_selected:
                          "bg-secondary text-white hover:bg-secondary/80 hover:text-white focus:bg-secondary focus:text-white",
                        today: field.value?.from
                          ? "bg-transparent text-white"
                          : "bg-secondary text-pink-font rounded-md",
                        day_outside: "text-gray-500 opacity-50",
                        day_disabled: "text-gray-500 opacity-50 line-through",
                        day_range_middle: "bg-secondary text-white",
                        day_hidden: "invisible",
                      }}
                    />
                  )}
                />

                {/* Error Display */}
                {errors.dateRange && (
                  <div className="mt-4 text-red-400 text-sm text-center">
                    {errors.dateRange.message || "날짜 범위를 선택해주세요"}
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="mt-auto p-4 bg-transparent">
        <Button
          className={`w-full h-[52px] flex justify-between items-center ${
            dateRange?.from && dateRange?.to
              ? "bg-pink-500 hover:bg-pink-600"
              : "bg-gray-600 cursor-not-allowed"
          }`}
          onClick={handleSubmit(onSubmit)}
          disabled={!dateRange?.from || !dateRange?.to}
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
