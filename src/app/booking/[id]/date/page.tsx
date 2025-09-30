"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "@/components/common/Icons";
import DateTimePicker from "@/components/ui/date-time-picker";
import { useTranslation } from "@/hooks/useTranslation";

export default function BookingDatePage() {
  const { t } = useTranslation();
  const [makeOverStartDate, setMakeOverStartDate] = useState(new Date());
  const [makeOverEndDate, setMakeOverEndDate] = useState(new Date());
  const [dokiDebutStartDate, setDokiDebutStartDate] = useState(new Date());
  const [dokiDebutEndDate, setDokiDebutEndDate] = useState(new Date());

  // Toggle states for each picker
  const [makeOverStartOpen, setMakeOverStartOpen] = useState(false);
  const [makeOverEndOpen, setMakeOverEndOpen] = useState(false);
  const [dokiDebutStartOpen, setDokiDebutStartOpen] = useState(false);
  const [dokiDebutEndOpen, setDokiDebutEndOpen] = useState(false);

  const formatDate = (date: Date) => {
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const dayName = dayNames[date.getDay()];
    return `${year}.${month}.${day}(${dayName})`;
  };

  const formatTime = (date: Date) => {
    return `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
  };

  const handleSave = () => {
    // TODO: Implement save functionality
    console.log("Make Over Start:", makeOverStartDate);
    console.log("Make Over End:", makeOverEndDate);
    console.log("Doki Debut Start:", dokiDebutStartDate);
    console.log("Doki Debut End:", dokiDebutEndDate);

    // Close all pickers
    setMakeOverStartOpen(false);
    setMakeOverEndOpen(false);
    setDokiDebutStartOpen(false);
    setDokiDebutEndOpen(false);
  };

  return (
    <div className="min-h-screen p-4">
      {/* Main Card */}
      <div className="mx-auto max-w-md">
        {/* Booking Date Title */}
        <div className="text-white text-lg font-semibold mb-6">
          {t("booking.bookingDate")}
        </div>

        {/* Make Over Date & Time Section */}
        <div className="mb-8">
          <div className="text-white text-base font-semibold mb-4">
            {t("booking.makeOverDateTime")}
          </div>

          {/* Date Display - Start and End side by side */}
          <div className="flex w-full items-center justify-between gap-2 mb-4">
            <div className="text-center">
              <div className="text-white text-sm font-medium mb-1">시작일</div>
              <div
                className="text-center cursor-pointer"
                onClick={() => {
                  setMakeOverStartOpen(!makeOverStartOpen);
                  setMakeOverEndOpen(false);
                  setDokiDebutStartOpen(false);
                  setDokiDebutEndOpen(false);
                }}
              >
                <div className="text-white text-sm font-medium">
                  {formatDate(makeOverStartDate)}
                </div>
                <div className="text-white text-xs opacity-70">
                  {formatTime(makeOverStartDate)}
                </div>
              </div>
            </div>
            <ArrowRightIcon color="white" />
            <div className="text-center">
              <div className="text-white text-sm font-medium mb-1">종료일</div>
              <div
                className="text-center cursor-pointer"
                onClick={() => {
                  setMakeOverEndOpen(!makeOverEndOpen);
                  setMakeOverStartOpen(false);
                  setDokiDebutStartOpen(false);
                  setDokiDebutEndOpen(false);
                }}
              >
                <div className="text-white text-sm font-medium">
                  {formatDate(makeOverEndDate)}
                </div>
                <div className="text-white text-xs opacity-70">
                  {formatTime(makeOverEndDate)}
                </div>
              </div>
            </div>
          </div>

          {/* Date Time Picker - Only show when open */}
          {(makeOverStartOpen || makeOverEndOpen) && (
            <div className="mb-4">
              <DateTimePicker
                value={makeOverStartOpen ? makeOverStartDate : makeOverEndDate}
                onChange={
                  makeOverStartOpen ? setMakeOverStartDate : setMakeOverEndDate
                }
                isOpen={true}
              />
            </div>
          )}

          {/* Divider */}
          <div className="h-px bg-gray-600 mb-4"></div>
        </div>

        {/* Doki Debut Date & Time Section */}
        <div className="mb-8">
          <div className="text-white text-base font-semibold mb-4">
            {t("booking.dokiDebutDateTime")}
          </div>

          {/* Date Display - Start and End side by side */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="text-center">
              <div className="text-white text-sm font-medium mb-1">시작일</div>
              <div
                className="text-center cursor-pointer"
                onClick={() => {
                  setDokiDebutStartOpen(!dokiDebutStartOpen);
                  setMakeOverStartOpen(false);
                  setMakeOverEndOpen(false);
                  setDokiDebutEndOpen(false);
                }}
              >
                <div className="text-white text-sm font-medium">
                  {formatDate(dokiDebutStartDate)}
                </div>
                <div className="text-white text-xs opacity-70">
                  {formatTime(dokiDebutStartDate)}
                </div>
              </div>
            </div>
            <ArrowRightIcon color="white" />
            <div className="text-center">
              <div className="text-white text-sm font-medium mb-1">종료일</div>
              <div
                className="text-center cursor-pointer"
                onClick={() => {
                  setDokiDebutEndOpen(!dokiDebutEndOpen);
                  setMakeOverStartOpen(false);
                  setMakeOverEndOpen(false);
                  setDokiDebutStartOpen(false);
                }}
              >
                <div className="text-white text-sm font-medium">
                  {formatDate(dokiDebutEndDate)}
                </div>
                <div className="text-white text-xs opacity-70">
                  {formatTime(dokiDebutEndDate)}
                </div>
              </div>
            </div>
          </div>

          {/* Date Time Picker - Only show when open */}
          {(dokiDebutStartOpen || dokiDebutEndOpen) && (
            <div className="mb-4">
              <DateTimePicker
                value={
                  dokiDebutStartOpen ? dokiDebutStartDate : dokiDebutEndDate
                }
                onChange={
                  dokiDebutStartOpen
                    ? setDokiDebutStartDate
                    : setDokiDebutEndDate
                }
                isOpen={true}
              />
            </div>
          )}

          {/* Divider */}
          <div className="h-px bg-gray-600 mb-4"></div>
        </div>

        {/* Save Button */}
        <Button
          onClick={handleSave}
          className="w-full bg-pink-500 hover:bg-pink-600 text-white font-medium py-3 rounded-xl"
        >
          {t("booking.save")}
        </Button>
      </div>
    </div>
  );
}
