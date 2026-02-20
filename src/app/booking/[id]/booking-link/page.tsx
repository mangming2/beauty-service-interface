"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { addMonths, format } from "date-fns";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { dummyLink } from "@/constants";
import Image from "next/image";
import { Divider } from "../../../../components/ui/divider";
import { useProductDetail } from "@/queries/useProductQueries";
import { useOptionDetail } from "@/queries/useOptionQueries";
import { useCreateSchedule } from "@/queries/useScheduleQueries";
import { notFound } from "next/navigation";

const PLACEHOLDER_IMAGE = "/dummy-profile.png";

function toDateOnly(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export default function BookingLinkPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const packageId = Number(params.id);
  const isValidId = !isNaN(packageId) && packageId > 0;

  const { data: productDetail, isLoading } = useProductDetail(
    isValidId ? packageId : undefined
  );

  const optionIdFromQuery = Number(searchParams.get("optionId"));
  const optionId =
    Number.isFinite(optionIdFromQuery) && optionIdFromQuery > 0
      ? optionIdFromQuery
      : (productDetail?.options[0]?.id ?? undefined);

  const { data: optionDetail } = useOptionDetail(optionId);
  const createScheduleMutation = useCreateSchedule();

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);
  const [isAddressOpen, setIsAddressOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  useEffect(() => {
    const startDate = productDetail?.slotStartDate
      ? toDateOnly(new Date(productDetail.slotStartDate))
      : undefined;
    const endDate = productDetail?.slotEndDate
      ? toDateOnly(new Date(productDetail.slotEndDate))
      : undefined;
    if (!startDate) return;

    setCurrentMonth(prev => {
      const prevMonth = new Date(prev.getFullYear(), prev.getMonth(), 1);
      const startMonth = new Date(
        startDate.getFullYear(),
        startDate.getMonth(),
        1
      );
      const endMonth = endDate
        ? new Date(endDate.getFullYear(), endDate.getMonth(), 1)
        : undefined;

      if (prevMonth < startMonth) return startMonth;
      if (endMonth && prevMonth > endMonth) return startMonth;
      return prev;
    });
  }, [productDetail?.slotStartDate, productDetail?.slotEndDate]);

  if (!isValidId) {
    notFound();
  }

  if (isLoading) {
    return (
      <div className="bg-black text-white flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-pink-500" />
      </div>
    );
  }

  if (!productDetail) {
    notFound();
  }

  const currentOption = optionDetail ?? {
    id: productDetail.options[0]?.id ?? 0,
    name: productDetail.options[0]?.name ?? productDetail.name,
    description:
      productDetail.options[0]?.description ?? productDetail.description,
    price: productDetail.options[0]?.price ?? productDetail.minPrice,
    location: productDetail.options[0]?.location ?? "",
  };

  const slotStartDate = productDetail.slotStartDate
    ? toDateOnly(new Date(productDetail.slotStartDate))
    : undefined;
  const slotEndDate = productDetail.slotEndDate
    ? toDateOnly(new Date(productDetail.slotEndDate))
    : undefined;

  const startHour = Number(productDetail.slotStartTime?.slice(0, 2));
  const endHour = Number(productDetail.slotEndTime?.slice(0, 2));
  const timeSlots =
    Number.isFinite(startHour) && Number.isFinite(endHour)
      ? Array.from({ length: Math.max(endHour - startHour, 0) }, (_, i) => {
          const hour = startHour + i;
          return `${String(hour).padStart(2, "0")}:00`;
        })
      : [];

  const handleBookLink = () => {
    if (selectedDate) {
      localStorage.setItem("selectedBookingDate", selectedDate.toISOString());
    }
    if (selectedTime) {
      localStorage.setItem("selectedBookingTime", selectedTime);
    }
    window.open(dummyLink, "_blank");
  };

  const handleComplete = async () => {
    if (!selectedDate || !selectedTime) {
      alert("날짜와 시간을 먼저 선택해 주세요.");
      return;
    }

    const [hour, minute = 0] = selectedTime.split(":").map(Number);
    if (!Number.isFinite(hour) || !Number.isFinite(minute)) {
      alert("선택한 시간 형식이 올바르지 않습니다.");
      return;
    }

    const startAt = new Date(selectedDate);
    startAt.setHours(hour, minute, 0, 0);

    const slotCount =
      Number.isFinite(productDetail.reservationSlotCount) &&
      productDetail.reservationSlotCount > 0
        ? productDetail.reservationSlotCount
        : 1;
    const endAt = new Date(startAt);
    endAt.setHours(endAt.getHours() + slotCount);

    try {
      await createScheduleMutation.mutateAsync({
        productId: packageId,
        title: currentOption.name || productDetail.name,
        startAt: startAt.toISOString(),
        endAt: endAt.toISOString(),
      });
    } catch (error) {
      console.error("일정 생성 실패:", error);
      alert("일정 생성에 실패했습니다. 잠시 후 다시 시도해 주세요.");
      return;
    }

    if (selectedDate) {
      localStorage.setItem("selectedBookingDate", selectedDate.toISOString());
    }
    if (selectedTime) {
      localStorage.setItem("selectedBookingTime", selectedTime);
    }
    router.push(`/booking/${packageId}/done`);
  };

  const renderAccordion = (
    label: string,
    isOpen: boolean,
    onToggle: () => void,
    content: string
  ) => (
    <div className="rounded-[4px] bg-gray-container border border-[#2E3033]">
      <button
        type="button"
        className="w-full px-3 py-[10px] flex items-center justify-between text-left"
        onClick={onToggle}
      >
        <span className="text-white text-sm font-medium">{label}</span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
        >
          <path
            d="M6 9L12 15L18 9"
            stroke="#B9BBC2"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      {isOpen && <p className="px-3 pb-3 text-xs text-gray-300">{content}</p>}
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-white">
      <div className="px-4">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-[412px] h-[412px]">
            <Image
              src={PLACEHOLDER_IMAGE}
              alt={currentOption.name}
              fill
              className="object-cover"
            />
          </div>

          <div className="px-3 py-3">
            <h2 className="text-[34px] leading-tight font-semibold">
              {currentOption.name}
            </h2>
            <p className="text-[11px] text-gray-400 mt-1 uppercase">
              {productDetail.name}
            </p>

            <div className="flex items-center justify-between mt-3">
              <p className="text-sm text-white">Make-up & Hair</p>
              <p className="text-sm text-white">
                20%{" "}
                <span className="text-pink-font">
                  ₩{currentOption.price.toLocaleString()}
                </span>
              </p>
            </div>

            <div className="mt-3 space-y-2">
              {renderAccordion(
                "Description",
                isDescriptionOpen,
                () => setIsDescriptionOpen(prev => !prev),
                currentOption.description
              )}
              {renderAccordion(
                "Full Address",
                isAddressOpen,
                () => setIsAddressOpen(prev => !prev),
                currentOption.location
              )}
              {renderAccordion(
                "Booking Guide",
                isGuideOpen,
                () => setIsGuideOpen(prev => !prev),
                "Reserve through the official website and complete payment to confirm your booking."
              )}
            </div>

            <div className="px-4">
              <Divider height={8} className="bg-gray-container" />

              <div className="rounded-[4px] bg-[#1E2024] p-3">
                <p className="text-sm text-gray-200 font-medium mb-1">
                  Before you continue.
                </p>
                <p className="text-sm text-gray-200">External Booking Notice</p>
                <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                  I understand that my reservation is not completed here and
                  must be finalized on the booking page.
                </p>
              </div>
            </div>
          </div>
        </div>

        <Divider height={1} className="bg-[#2E3033] mt-4 mb-4" />

        <div className="py-4">
          <h3 className="text-lg font-semibold mb-3">Choose your date.</h3>

          <div className="flex items-center justify-between mb-3 px-2">
            <button
              type="button"
              onClick={() => setCurrentMonth(prev => addMonths(prev, -1))}
              className="text-gray-300 hover:text-white"
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </button>
            <span className="text-[20px] leading-[125%]">
              {format(currentMonth, "yyyy.MM")}
            </span>
            <button
              type="button"
              onClick={() => setCurrentMonth(prev => addMonths(prev, 1))}
              className="text-gray-300 hover:text-white"
            >
              <ChevronRightIcon className="h-5 w-5" />
            </button>
          </div>

          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            month={currentMonth}
            onMonthChange={setCurrentMonth}
            className="rounded-md bg-transparent w-full"
            fromMonth={slotStartDate}
            toMonth={slotEndDate}
            disabled={date => {
              const target = toDateOnly(date);
              if (slotStartDate && target < slotStartDate) return true;
              if (slotEndDate && target > slotEndDate) return true;
              return false;
            }}
            classNames={{
              month_caption: "hidden !hidden",
              nav: "hidden !hidden",
              cell: "text-center text-sm p-0 relative focus-within:relative focus-within:z-20 flex-1 bg-transparent",
              day: "h-full w-full p-0 font-normal aria-selected:opacity-100 hover:bg-secondary/20 text-white flex items-center justify-center bg-transparent rounded-full data-[selected-single=true]:rounded-full data-[selected-single=true]:bg-pink-500 data-[selected-single=true]:text-white",
              day_selected:
                "bg-pink-500 text-white hover:bg-pink-600 hover:text-white focus:bg-pink-500 focus:text-white rounded-full !rounded-full",
              day_disabled: "text-gray-500 opacity-50",
            }}
          />
        </div>

        <Divider height={8} className="bg-gray-container" />

        <div className="py-4">
          <h3 className="text-lg font-semibold mb-3">Choose your time slot.</h3>
          <div className="grid grid-cols-4 gap-x-2 gap-y-3">
            {timeSlots.map(slot => {
              const isSelected = selectedTime === slot;
              return (
                <Button
                  key={slot}
                  type="button"
                  variant="ghost"
                  className={`text-base h-10 border-none rounded-[4px] ${
                    isSelected
                      ? "bg-pink-font text-white hover:text-white"
                      : "bg-gray-container text-white hover:text-white"
                  }`}
                  onClick={() => setSelectedTime(slot)}
                >
                  {slot}
                </Button>
              );
            })}
            {timeSlots.length === 0 && (
              <p className="col-span-4 text-sm text-gray-400">
                Available time slots are not configured.
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="px-4 py-4 mt-auto">
        <div className="flex gap-2">
          <Button
            variant="gray"
            className="w-[120px] h-[52px] text-lg"
            onClick={handleComplete}
            disabled={createScheduleMutation.isPending}
          >
            Complete
          </Button>
          <Button className="flex-1 h-[52px] text-lg" onClick={handleBookLink}>
            Book Link
          </Button>
        </div>
      </div>
    </div>
  );
}
