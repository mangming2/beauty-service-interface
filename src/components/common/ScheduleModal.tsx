"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DateTimePicker from "@/components/ui/date-time-picker";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Divider } from "../ui/divider";

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (title: string, date: Date) => void;
  bookingId: string;
}

export default function ScheduleModal({
  isOpen,
  onClose,
  onSave,
}: ScheduleModalProps) {
  const [title, setTitle] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isDateTimePickerOpen, setIsDateTimePickerOpen] = useState(false);

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
    onSave(title, selectedDate);
    handleClose();
  };

  const handleClose = () => {
    setTitle("");
    setSelectedDate(new Date());
    setIsDateTimePickerOpen(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && handleClose()}>
      <DialogContent
        className="bg-background border-none text-white max-w-md"
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
        <div className="mb-6">
          <div className="text-white title-sm font-medium mb-3">
            Date & Time
          </div>

          {/* Date Display */}
          <div
            className="p-4 cursor-pointer transition-colors"
            onClick={() => setIsDateTimePickerOpen(!isDateTimePickerOpen)}
          >
            <div className="text-white text-lg font-medium">
              {formatDate(selectedDate)}
            </div>
            <div className="text-white title-lg">
              {formatTime(selectedDate)}
            </div>
          </div>

          <div className="mt-4">
            <DateTimePicker
              value={selectedDate}
              onChange={setSelectedDate}
              isOpen={true}
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
