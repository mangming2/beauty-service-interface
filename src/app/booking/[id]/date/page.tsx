"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

const timeSlots = [
  { time: "09:00", available: true },
  { time: "10:00", available: true },
  { time: "11:00", available: true },
  { time: "12:00", available: true },
  { time: "13:00", available: true },
  { time: "14:00", available: true },
  { time: "15:00", available: false },
  { time: "16:00", available: false },
];

export default function DateSelectionPage() {
  const params = useParams();
  const router = useRouter();
  const packageId = params.id as string;

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>("");

  const handleBack = () => {
    router.push(`/booking/${packageId}`);
  };

  const handleConfirm = () => {
    if (selectedDate && selectedTime) {
      // 선택된 날짜와 시간을 localStorage에 저장
      localStorage.setItem("selectedBookingDate", selectedDate.toISOString());
      localStorage.setItem("selectedBookingTime", selectedTime);

      // 예약 페이지로 돌아가기
      router.push(`/booking/${packageId}`);
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  return (
    <div className="min-h-screen text-white bg-black">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-900">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBack}
          className="p-0 h-auto"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10.5 12.5L5.5 8L10.5 3.5"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Button>
        <h1 className="text-lg font-semibold">Checkout</h1>
        <div className="w-6"></div>
      </div>

      <div className="px-4 py-6">
        {/* Choose your date */}
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-4">Choose your date</h2>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            className="rounded-md border border-gray-600 bg-gray-800"
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

        {/* Choose your time slot */}
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-4">Choose your time slot</h2>
          <div className="grid grid-cols-3 gap-3">
            {timeSlots.map(slot => (
              <Button
                key={slot.time}
                variant="ghost"
                className={`h-12 border ${
                  slot.available
                    ? selectedTime === slot.time
                      ? "bg-pink-500 border-pink-500 text-white"
                      : "border-gray-600 text-white hover:bg-gray-800"
                    : "border-gray-700 text-gray-500 bg-gray-800 cursor-not-allowed"
                }`}
                onClick={() => slot.available && handleTimeSelect(slot.time)}
                disabled={!slot.available}
              >
                {slot.time}
              </Button>
            ))}
          </div>
        </div>

        {/* Selected Date and Time Display */}
        {(selectedDate || selectedTime) && (
          <div className="mb-6 p-4 bg-gray-900 rounded-lg">
            <h3 className="font-semibold mb-2">Selected:</h3>
            {selectedDate && (
              <p className="text-gray-300 mb-1">
                Date: {format(selectedDate, "yyyy.MM.dd")}
              </p>
            )}
            {selectedTime && (
              <p className="text-gray-300">Time: {selectedTime}</p>
            )}
          </div>
        )}
      </div>

      {/* Confirm Button */}
      <div className="px-4 py-4 bg-black border-t border-gray-800">
        <Button
          className={`w-full h-[52px] ${
            selectedDate && selectedTime
              ? "bg-pink-500 hover:bg-pink-600"
              : "bg-gray-600 cursor-not-allowed"
          }`}
          onClick={handleConfirm}
          disabled={!selectedDate || !selectedTime}
        >
          <span className="font-medium">Confirm</span>
        </Button>
      </div>
    </div>
  );
}
