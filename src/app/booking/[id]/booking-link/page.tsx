"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
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
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
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
            {/* Custom Calendar Header */}
            <div className="flex items-center justify-center gap-[120px] mb-4 px-2">
              <button
                onClick={goToPreviousMonth}
                className="text-gray-300 hover:text-white transition-colors"
              >
                <ChevronLeftIcon className="h-5 w-5" />
              </button>
              <span className="text-[20px] font-normal leading-[125%]">
                {format(currentMonth, "yyyy.MM")}
              </span>
              <button
                onClick={goToNextMonth}
                className="text-gray-300 hover:text-white transition-colors"
              >
                <ChevronRightIcon className="h-5 w-5" />
              </button>
            </div>

            {/* Monthly Calendar */}
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              month={currentMonth}
              onMonthChange={setCurrentMonth}
              todayClassName="text-pink-font"
              disabled={date => {
                // Disable the 19th of any month
                return format(date, "d") === "19";
              }}
              className="rounded-md bg-transparent w-full"
              classNames={{
                month_caption: "hidden !hidden",
                nav: "hidden !hidden",
                cell: "text-center text-sm p-0 relative focus-within:relative focus-within:z-20 flex-1 bg-transparent",
                day: "h-full w-full p-0 font-normal aria-selected:opacity-100 hover:bg-secondary/20 text-white flex items-center justify-center bg-transparent rounded-full data-[selected-single=true]:rounded-full data-[selected-single=true]:bg-pink-500 data-[selected-single=true]:text-white",
                day_selected:
                  "bg-pink-500 text-white hover:bg-pink-600 hover:text-white focus:bg-pink-500 focus:text-white rounded-full !rounded-full",
                today: selectedDate
                  ? "bg-transparent text-white"
                  : "bg-secondary text-pink-font rounded-md",
                day_disabled: "text-gray-500 opacity-50 line-through",
              }}
            />
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
