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
        className="bg-black border-none text-white max-w-md"
        showCloseButton={false}
      >
        <DialogTitle className="sr-only">Schedule Appointment</DialogTitle>
        {/* Title Input */}
        <Input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Title"
          className="w-full bg-transparent border-none text-white placeholder-gray-400"
        />

        <Divider />

        {/* Date & Time Section */}
        <div className=" mb-6">
          <div className="text-white title-sm font-medium mb-3">
            Date & Time
          </div>

          <div className="flex gap-10 justify-center items-center">
            {/* Start Date Display */}
            <div
              className={`p-4 cursor-pointer w-24 text-center`}
              onClick={() => {
                setEditingDate("start");
                setIsDateTimePickerOpen(!isDateTimePickerOpen);
              }}
            >
              <div className="text-white text-sm font-medium mb-1">시작일</div>
              <div className="text-white text-lg font-medium">
                {startDate ? formatDate(startDate) : "--"}
              </div>
              <div className="text-white title-lg">
                {startDate ? formatTime(startDate) : "--"}
              </div>
            </div>

            {/* Arrow */}
            <ArrowRightIcon />

            {/* End Date Display */}
            <div
              className={`p-4 cursor-pointer w-24 text-center`}
              onClick={() => {
                setEditingDate("end");
                setIsDateTimePickerOpen(!isDateTimePickerOpen);
              }}
            >
              <div className="text-white text-sm font-medium mb-1">종료일</div>
              <div className="text-white text-lg font-medium">
                {endDate ? formatDate(endDate) : "--"}
              </div>
              <div className="text-white title-lg">
                {endDate ? formatTime(endDate) : "--"}
              </div>
            </div>
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

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={handleClose}
            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 rounded-xl"
          >
            취소
          </Button>
          <Button
            onClick={handleSave}
            className="flex-1 bg-pink-500 hover:bg-pink-600 text-white font-medium py-3 rounded-xl"
          >
            저장
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
