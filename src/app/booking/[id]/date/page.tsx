"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { format, addDays, startOfWeek, addWeeks, subWeeks } from "date-fns";

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

export default function BookingDatePage() {
  const params = useParams();
  const router = useRouter();
  const packageId = params.id as string;

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [currentWeek, setCurrentWeek] = useState<Date>(new Date(2025, 6, 20)); // July 21, 2025 (Monday)

  const handleConfirm = () => {
    console.log("handleConfirm");
    router.push(`/booking/${packageId}/pay`);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const goToPreviousWeek = () => {
    setCurrentWeek(subWeeks(currentWeek, 1));
  };

  const goToNextWeek = () => {
    setCurrentWeek(addWeeks(currentWeek, 1));
  };

  // Generate the week's dates
  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 0 }); // Sunday start
  const weekDates = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  return (
    <div className="min-h-screen text-white bg-black">
      {/* Header */}

      <div className="px-4 py-6">
        {/* Choose your date */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Choose your date.</h2>
          <div className="bg-gray-900 rounded-lg p-4">
            {/* Year/Month display with navigation */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={goToPreviousWeek}
                className="text-gray-400 hover:text-white"
              >
                ‹
              </button>
              <span className="text-gray-400 text-sm">
                {format(currentWeek, "yyyy.MM")}
              </span>
              <button
                onClick={goToNextWeek}
                className="text-gray-400 hover:text-white"
              >
                ›
              </button>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                <div
                  key={day}
                  className="text-center text-xs text-gray-400 py-2"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Weekly Calendar grid */}
            <div className="grid grid-cols-7 gap-1">
              {weekDates.map((date, index) => {
                const dayNumber = format(date, "d");
                const isSelected =
                  selectedDate &&
                  format(selectedDate, "yyyy-MM-dd") ===
                    format(date, "yyyy-MM-dd");
                const isDisabled = dayNumber === "19"; // Keep the 19th disabled as in original

                return (
                  <button
                    key={index}
                    className={`h-10 w-10 flex items-center justify-center rounded text-sm ${
                      isDisabled
                        ? "text-gray-500 cursor-not-allowed"
                        : isSelected
                          ? "bg-pink-500 text-white"
                          : "text-white hover:bg-gray-700"
                    }`}
                    onClick={() => !isDisabled && setSelectedDate(date)}
                    disabled={isDisabled}
                  >
                    {dayNumber}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Choose your time slot */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Choose your time slot.</h2>
          <div className="grid grid-cols-4 gap-3">
            {timeSlots.map(slot => (
              <Button
                key={slot.time}
                variant="ghost"
                className={`h-12 border rounded-lg ${
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
      </div>

      {/* Checkout Button */}
      <div className="px-4 py-4 bg-black border-t border-gray-800">
        <Button
          className="w-full bg-pink-500 hover:bg-pink-600 h-[52px]"
          onClick={handleConfirm}
        >
          <span className="font-medium">Checkout</span>
        </Button>
      </div>
    </div>
  );
}
