"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { ArrowRightIcon } from "@/components/common/Icons";
import { GapY } from "@/components/ui/gap";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { format } from "date-fns";

export default function FormPage3() {
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });
  console.log(dateRange);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const router = useRouter();

  const handleNext = () => {
    if (dateRange.from && dateRange.to) {
      // 선택된 날짜 범위를 localStorage에 저장
      localStorage.setItem(
        "selectedDateRange",
        JSON.stringify({
          from: dateRange.from.toISOString(),
          to: dateRange.to.toISOString(),
        })
      );
      router.push("/form/step4");
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
    <div className="text-white flex flex-col min-h-screen">
      <div className="flex flex-col flex-1">
        <GapY size={8} />

        {/* Header */}
        <div className="px-[16px]">
          <h1 className="text-xl font-semibold mb-6">
            언제 투어에 참여하고 싶으신가요?
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

            <div className="w-full h-full flex flex-col">
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={range =>
                  setDateRange({
                    from: range?.from,
                    to: range?.to,
                  })
                }
                month={currentMonth}
                onMonthChange={setCurrentMonth}
                todayClassName="bg-pink-500 text-white rounded-md"
                className={`rounded-md bg-transparent w-full h-full flex flex-col ${dateRange.from ? "date-selected" : ""}`}
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
                  today: dateRange
                    ? "bg-transparent text-white"
                    : "bg-pink-500 text-white rounded-md",
                  day_outside: "text-gray-500 opacity-50",
                  day_disabled: "text-gray-500 opacity-50 line-through",
                  day_range_middle: "bg-secondary text-white",
                  day_hidden: "invisible",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="p-4 border-t border-gray-800">
        <Button
          className={`w-full h-[52px] flex justify-between items-center ${
            dateRange.from && dateRange.to
              ? "bg-pink-500 hover:bg-pink-600"
              : "bg-gray-600 cursor-not-allowed"
          }`}
          onClick={handleNext}
          disabled={!dateRange.from || !dateRange.to}
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
