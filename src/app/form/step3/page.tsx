"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { ArrowRightIcon } from "@/components/common/Icons";
import { GapY } from "@/components/ui/gap";
import { format } from "date-fns";

export default function FormPage3() {
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });
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

  return (
    <div className="text-white bg-transparent flex flex-col">
      <div className="flex flex-col">
        <GapY size={8} />

        {/* Header */}
        <div className="px-[16px]">
          <h1 className="text-xl font-semibold mb-6">
            언제 투어에 참여하고 싶으신가요?
          </h1>
        </div>

        {/* Calendar */}
        <div className="px-[16px]">
          <Calendar
            mode="range"
            selected={dateRange}
            onSelect={range =>
              setDateRange({
                from: range?.from,
                to: range?.to,
              })
            }
            className="rounded-md bg-transparent"
            classNames={{
              months:
                "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
              month: "space-y-4",
              caption: "flex justify-center pt-1 relative items-center",
              caption_label: "text-sm font-medium text-white",
              nav: "space-x-1 flex items-center",
              nav_button:
                "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 text-white",
              nav_button_previous: "absolute left-1",
              nav_button_next: "absolute right-1",
              table: "w-full border-collapse space-y-1",
              head_row: "flex",
              head_cell:
                "text-gray-400 rounded-md w-8 font-normal text-[0.8rem]",
              row: "flex w-full mt-2",
              cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-pink-500/10 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
              day: "h-8 w-8 p-0 font-normal aria-selected:opacity-100 hover:bg-pink-500/20 text-white",
              day_selected:
                "bg-pink-500 text-white hover:bg-pink-600 hover:text-white focus:bg-pink-500 focus:text-white",
              day_today: "bg-gray-600 text-white",
              day_outside: "text-gray-500 opacity-50",
              day_disabled: "text-gray-500 opacity-50",
              day_range_middle:
                "aria-selected:bg-pink-500/20 aria-selected:text-white",
              day_hidden: "invisible",
            }}
          />
        </div>

        {/* Selected Date Range Display */}
        {dateRange.from && dateRange.to && (
          <div className="px-[16px] mt-4">
            <p className="text-sm text-gray-400 mb-2">선택된 기간:</p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-pink-500 text-white text-sm rounded-full">
                {format(dateRange.from, "MMM dd")} -{" "}
                {format(dateRange.to, "MMM dd")}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="p-4 bg-transparent border-t border-gray-800">
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
