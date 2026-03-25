"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { addMonths, format } from "date-fns";
import { ChevronLeftIcon, ChevronRightIcon, Check } from "lucide-react";
import { dummyLink } from "@/constants";
import Image from "next/image";
import { Divider } from "@/components/ui/divider";
import { useOptionDetail } from "@/queries/useOptionQueries";
import { useCreateSchedule } from "@/queries/useScheduleQueries";
import { notFound } from "next/navigation";
import { useTranslation } from "@/hooks/useTranslation";

const PLACEHOLDER_IMAGE = "/dummy-profile.png";

function toDateOnly(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export default function PackageOptionBookingPage() {
  const params = useParams();
  const router = useRouter();
  const { t } = useTranslation();
  const packageId = Number(params.id);
  const optionIdParam = params.optionId;
  const optionId = Number(optionIdParam);
  const isValidPackageId = !isNaN(packageId) && packageId > 0;
  const isValidOptionId = !isNaN(optionId) && optionId > 0;

  const resolvedOptionId = isValidOptionId ? optionId : undefined;

  const { data: optionDetail, isLoading: isOptionLoading } =
    useOptionDetail(resolvedOptionId);
  const createScheduleMutation = useCreateSchedule();

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);
  const [isAddressOpen, setIsAddressOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [externalBookingAgreed, setExternalBookingAgreed] = useState(false);

  useEffect(() => {
    const startDate = optionDetail?.slotStartDate
      ? toDateOnly(new Date(optionDetail.slotStartDate))
      : undefined;
    const endDate = optionDetail?.slotEndDate
      ? toDateOnly(new Date(optionDetail.slotEndDate))
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
  }, [optionDetail?.slotStartDate, optionDetail?.slotEndDate]);

  if (!isValidPackageId || !isValidOptionId) {
    notFound();
  }

  if (isOptionLoading) {
    return (
      <div className="bg-black text-white flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-pink-500" />
      </div>
    );
  }

  if (!optionDetail) {
    notFound();
  }

  if (optionDetail === null) {
    notFound();
  }

  const currentOption = optionDetail;

  const optionImageUrl = currentOption.imageUrls?.[0] ?? PLACEHOLDER_IMAGE;

  const slotStartDate = currentOption.slotStartDate
    ? toDateOnly(new Date(currentOption.slotStartDate))
    : undefined;
  const slotEndDate = currentOption.slotEndDate
    ? toDateOnly(new Date(currentOption.slotEndDate))
    : undefined;

  const startHour = Number(currentOption.slotStartTime?.slice(0, 2));
  const endHour = Number(currentOption.slotEndTime?.slice(0, 2));
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
      alert(t("option.selectDateTimeFirst"));
      return;
    }

    const [hour, minute = 0] = selectedTime.split(":").map(Number);
    if (!Number.isFinite(hour) || !Number.isFinite(minute)) {
      alert(t("option.invalidTimeFormat"));
      return;
    }

    const startAt = new Date(selectedDate);
    startAt.setHours(hour, minute, 0, 0);

    const slotCount =
      Number.isFinite(currentOption.reservationSlotCount) &&
      (currentOption.reservationSlotCount ?? 0) > 0
        ? currentOption.reservationSlotCount!
        : 1;
    const endAt = new Date(startAt);
    endAt.setHours(endAt.getHours() + slotCount);

    try {
      await createScheduleMutation.mutateAsync({
        productId: packageId,
        title: currentOption.name,
        startAt: startAt.toISOString(),
        endAt: endAt.toISOString(),
      });
    } catch (error) {
      console.error("일정 생성 실패:", error);
      alert(t("option.scheduleCreateFailed"));
      return;
    }

    if (selectedDate) {
      localStorage.setItem("selectedBookingDate", selectedDate.toISOString());
    }
    if (selectedTime) {
      localStorage.setItem("selectedBookingTime", selectedTime);
    }
    router.push(`/booking/${packageId}/done?optionId=${resolvedOptionId}`);
  };

  const renderAccordion = (
    label: string,
    isOpen: boolean,
    onToggle: () => void,
    content: string
  ) => (
    <div className="bg-gray-container border border-[#2E3033] rounded-[8px] overflow-hidden">
      <button
        type="button"
        className="w-full px-3 py-[10px] flex items-center justify-between text-left"
        onClick={onToggle}
      >
        <span className="text-white text-lg font-medium">{label}</span>
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
      {isOpen && <p className="px-3 pb-3 text-md text-white">{content}</p>}
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-white">
      <div className="px-4">
        <div className="flex flex-col  items-center gap-4">
          <div className="relative w-[412px] h-[412px]">
            <Image
              src={optionImageUrl}
              alt={currentOption.name}
              fill
              className="object-cover"
              unoptimized={optionImageUrl.startsWith("http")}
            />
          </div>

          <div className="flex w-full flex-col px-3 py-3">
            <h2 className="text-[34px] leading-tight font-semibold">
              {currentOption.name}
            </h2>
            <p className="text-[11px] text-gray-400 mt-1 uppercase">
              {currentOption.name}
            </p>

            <div className="flex items-center justify-between mt-3">
              <p className="text-lg text-white">이거 제목인가요?</p>
              <p className="text-lg text-white">
                {currentOption.discountRate > 0
                  ? `${currentOption.discountRate}% `
                  : "더미%"}
                <span className="text-pink-font">
                  ₩{currentOption.price.toLocaleString()}
                </span>
              </p>
            </div>

            <div className="roun mt-3 space-y-5">
              {renderAccordion(
                t("option.description"),
                isDescriptionOpen,
                () => setIsDescriptionOpen(prev => !prev),
                currentOption.description
              )}
              {renderAccordion(
                t("option.fullAddress"),
                isAddressOpen,
                () => setIsAddressOpen(prev => !prev),
                currentOption.address
              )}
              {renderAccordion(
                t("option.bookingGuide"),
                isGuideOpen,
                () => setIsGuideOpen(prev => !prev),
                currentOption.bookingGuide ||
                  t("bookingPage.reserveThroughWebsite")
              )}
            </div>
          </div>
        </div>

        <Divider height={8} className="bg-[#2E3033] mt-4 mb-4" />

        <div className="bg-[#2E3033] rounded-[8px] p-4 mb-4">
          <h3 className="text-lg font-bold text-white mb-3">
            {t("option.beforeContinue")}
          </h3>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setExternalBookingAgreed(prev => !prev)}
              className="flex gap-2 text-left"
            >
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                  externalBookingAgreed ? "bg-[#BCBCBC]" : "bg-[#4A4B52]"
                }`}
              >
                {externalBookingAgreed && (
                  <Check className="w-3 h-3 text-white stroke-[3]" />
                )}
              </span>
            </button>
            <div>
              <span className="text-white text-lg">
                {t("option.externalBookingTitle")}
              </span>
              <p className="text-md text-gray-font">
                {t("option.externalBookingNotice")}
              </p>
            </div>
          </div>
        </div>

        <Divider height={8} className="bg-[#2E3033] mt-4 mb-4" />

        <div className="py-3">
          <h3 className="title-sm mb-4">{t("option.chooseDate")}</h3>

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
          <h3 className="text-lg font-semibold mb-3">{t("option.chooseTimeSlot")}</h3>
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
                {t("option.noTimeSlots")}
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
            {t("option.complete")}
          </Button>
          <Button
            className="flex-1 h-[52px] text-lg"
            onClick={handleBookLink}
            disabled={!externalBookingAgreed || !selectedDate || !selectedTime}
          >
            {t("option.bookLink")}
          </Button>
        </div>
      </div>
    </div>
  );
}
