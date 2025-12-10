"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { format, addDays, startOfWeek, addWeeks, subWeeks } from "date-fns";
import { dummyLink } from "@/constants";
import Image from "next/image";
import { Divider } from "../../../../components/ui/divider";

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

export default function BookingLinkPage() {
  const params = useParams();
  const router = useRouter();
  const packageId = params.id as string;

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [currentWeek, setCurrentWeek] = useState<Date>(new Date(2025, 6, 20)); // July 21, 2025 (Monday)

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

  const handleBookLink = () => {
    window.open(dummyLink, "_blank");
  };

  const handleConfirm = () => {
    console.log("handleConfirm");
    router.push(`/booking/${packageId}/check`);
  };

  return (
    <div className=" text-white">
      {/* Header */}

      <div>
        {/*패키지 설명 */}

        <Image
          src="/dummy-profile.png"
          alt="package"
          width={0}
          height={200}
          sizes="100vw"
          className="w-full h-[200px] object-cover"
        />

        <div className="flex flex-col gap-2 pt-5 px-5 pb-3">
          <div>
            <h2 className="title-lg">Make Over</h2>
            <p className="flex items-center h-7 text-md text-gray-font">
              Salon Doki
            </p>
          </div>
          <div className="flex justify-between items-center text-lg text-white">
            <span>Make-ip & Hair</span>
            <span>₩ 70,000</span>
          </div>
          <div className="flex items-center h-10 text-md text-white">
            <span>설명란</span>
          </div>
        </div>

        <Divider height={8} className="bg-gray-container" />

        {/* Choose your date */}
        <div className="flex flex-col gap-4 py-3 px-5">
          <h2 className="title-sm">Choose your date.</h2>

          <div>
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
                    className={`h-10 w-10 flex items-center justify-center rounded-full text-sm ${
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

        <Divider height={8} className="bg-gray-container" />

        {/* Choose your time slot */}
        <div className="flex flex-col gap-4 py-3 px-5">
          <h2 className="title-sm">Choose your time slot.</h2>
          <div className="grid grid-cols-4 gap-x-3 gap-y-4">
            {timeSlots.map(slot => (
              <Button
                key={slot.time}
                variant="ghost"
                className={`text-lg h-10 text-white border-none rounded-1 ${
                  slot.available
                    ? selectedTime === slot.time
                      ? "bg-pink-font hover:text-white"
                      : "bg-gray-container hover:text-white"
                    : "bg-disabled cursor-not-allowed text-gray-500 hover:text-gray-500"
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
      <div
        className="flex justify-between mt-auto p-5"
        style={{ boxShadow: "inset 0 6px 6px -6px rgba(255, 255, 255, 0.12)" }}
      >
        <Button
          variant="gray"
          className="text-lg w-[128px] h-[52px]"
          onClick={handleBookLink}
        >
          Complete
        </Button>
        <Button
          className="text-lg w-[236px] bg-pink-500 hover:bg-pink-600 h-[52px]"
          onClick={handleConfirm}
        >
          Book Link
        </Button>
      </div>
    </div>
  );
}
