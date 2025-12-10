"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DateTimePicker from "@/components/ui/date-time-picker";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Divider } from "../ui/divider";
import { ArrowRightIcon } from "@/components/common/Icons";

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (title: string, startDate: Date, endDate: Date) => void;
  bookingId: string;
}

export default function ScheduleModal({
  isOpen,
  onClose,
  onSave,
}: ScheduleModalProps) {
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [isDateTimePickerOpen, setIsDateTimePickerOpen] = useState(false);
  const [editingDate, setEditingDate] = useState<"start" | "end">("start");

  // Initialize dates after component mounts to avoid hydration mismatch
  useEffect(() => {
    const now = new Date();
    const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
    setStartDate(now);
    setEndDate(oneHourLater);
  }, []);

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
    if (!title.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }
    if (!startDate || !endDate) {
      alert("날짜를 설정해주세요.");
      return;
    }
    if (startDate >= endDate) {
      alert("종료일은 시작일보다 늦어야 합니다.");
      return;
    }
    onSave(title, startDate, endDate);
    handleClose();
  };

  const handleClose = () => {
    setTitle("");
    const now = new Date();
    const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
    setStartDate(now);
    setEndDate(oneHourLater);
    setIsDateTimePickerOpen(false);
    setEditingDate("start");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && handleClose()}>
      <DialogContent
        className="py-5 px-3 bg-background border-none text-white w-[380px] min-h-[503px] max-w-md overflow-x-hidden"
        showCloseButton={false}
      >
        <div className="flex flex-col gap-6">
          <DialogTitle className="sr-only">Schedule Appointment</DialogTitle>
          {/* Title Input */}
          <div>
            <Input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="title"
              className="h-13 w-full title-md bg-transparent border-none text-white placeholder-gray-400"
            />
            <Divider />
          </div>

          {/* Date & Time Section */}
          <div>
            <div className="text-white title-sm font-medium mb-3">
              Date & Time
            </div>

            <div>
              <div className="flex gap-4 py-4.5 px-5.5 justify-between items-center">
                {/* Start Date Display */}
                <div
                  className={`cursor-pointer text-start`}
                  onClick={() => {
                    setEditingDate("start");
                    setIsDateTimePickerOpen(!isDateTimePickerOpen);
                  }}
                >
                  <div className="text-white text-lg font-medium">
                    {startDate ? formatDate(startDate) : "--"}
                  </div>
                  <div className="text-white title-lg">
                    {startDate ? formatTime(startDate) : "--"}
                  </div>
                </div>

                {/* Arrow */}
                <div className="flex w-7 items-center justify-center">
                  <ArrowRightIcon width={7} height={16} color="#B7B7B7" />
                </div>

                {/* End Date Display */}
                <div
                  className={`cursor-pointer text-start`}
                  onClick={() => {
                    setEditingDate("end");
                    setIsDateTimePickerOpen(!isDateTimePickerOpen);
                  }}
                >
                  <div className="text-white text-lg font-medium">
                    {endDate ? formatDate(endDate) : "--"}
                  </div>
                  <div className="text-white title-lg">
                    {endDate ? formatTime(endDate) : "--"}
                  </div>
                </div>
              </div>
              <Divider />
            </div>

            <div className="mt-4">
              <DateTimePicker
                value={
                  editingDate === "start"
                    ? startDate || new Date()
                    : endDate || new Date()
                }
                onChange={date => {
                  if (editingDate === "start") {
                    setStartDate(date);
                  } else {
                    setEndDate(date);
                  }
                }}
                isOpen={isDateTimePickerOpen}
              />
            </div>
          </div>
        </div>
        {/* Action Buttons */}
        <div className="flex mt-auto">
          <Button
            onClick={handleSave}
            className="flex-1 h-13 text-lg bg-pink-500 hover:bg-pink-600 text-white font-medium py-3 rounded-xl"
          >
            저장
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
