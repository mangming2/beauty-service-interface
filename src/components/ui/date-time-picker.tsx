"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface DateTimePickerProps {
  value: Date;
  onChange: (date: Date) => void;
  className?: string;
  isOpen: boolean;
}

const DateTimePicker: React.FC<DateTimePickerProps> = ({
  value,
  onChange,
  className,
  isOpen,
}) => {
  const [selectedDate, setSelectedDate] = useState(value);

  useEffect(() => {
    setSelectedDate(value);
  }, [value]);

  const handleDateChange = (newDate: Date) => {
    setSelectedDate(newDate);
    onChange(newDate);
  };

  const generateYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear; i <= currentYear + 5; i++) {
      years.push(i);
    }
    return years;
  };

  const generateMonths = () => {
    return [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
  };

  const generateDays = (year: number, month: number) => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  const generateHours = () => {
    const hours = [];
    for (let i = 0; i < 24; i++) {
      hours.push(i);
    }
    return hours;
  };

  const generateMinutes = () => {
    const minutes = [];
    for (let i = 0; i < 60; i += 5) {
      minutes.push(i);
    }
    return minutes;
  };

  const years = generateYears();
  const months = generateMonths();
  const days = generateDays(
    selectedDate.getFullYear(),
    selectedDate.getMonth()
  );
  const hours = generateHours();
  const minutes = generateMinutes();

  const handleYearChange = (year: number) => {
    const newDate = new Date(selectedDate);
    newDate.setFullYear(year);
    handleDateChange(newDate);
  };

  const handleMonthChange = (month: number) => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(month);
    handleDateChange(newDate);
  };

  const handleDayChange = (day: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(day);
    handleDateChange(newDate);
  };

  const handleHourChange = (hour: number) => {
    const newDate = new Date(selectedDate);
    newDate.setHours(hour);
    handleDateChange(newDate);
  };

  const handleMinuteChange = (minute: number) => {
    const newDate = new Date(selectedDate);
    newDate.setMinutes(minute);
    handleDateChange(newDate);
  };

  const handlePeriodChange = (period: "AM" | "PM") => {
    const newDate = new Date(selectedDate);
    const currentHour = newDate.getHours();
    if (period === "AM" && currentHour >= 12) {
      newDate.setHours(currentHour - 12);
    } else if (period === "PM" && currentHour < 12) {
      newDate.setHours(currentHour + 12);
    }
    handleDateChange(newDate);
  };

  const WheelPicker = ({
    items,
    selectedValue,
    onSelect,
    label,
  }: {
    items: (string | number)[];
    selectedValue: string | number;
    onSelect: (value: string | number) => void;
    label: string;
  }) => {
    const [scrollPosition, setScrollPosition] = useState(0);
    const itemHeight = 32;
    const visibleItems = 3;
    const containerHeight = itemHeight * visibleItems;

    useEffect(() => {
      const selectedIndex = items.findIndex(item => item === selectedValue);
      if (selectedIndex !== -1) {
        setScrollPosition(-selectedIndex * itemHeight);
      }
    }, [selectedValue, items]);

    const handleWheel = (e: React.WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? itemHeight : -itemHeight;
      const newPosition = Math.max(
        -(items.length - 1) * itemHeight,
        Math.min(0, scrollPosition + delta)
      );
      setScrollPosition(newPosition);

      const selectedIndex = Math.round(-newPosition / itemHeight);
      if (selectedIndex >= 0 && selectedIndex < items.length) {
        onSelect(items[selectedIndex]);
      }
    };

    const handleMouseDown = (e: React.MouseEvent) => {
      const startY = e.clientY;
      const startScroll = scrollPosition;

      const handleMouseMove = (e: MouseEvent) => {
        const deltaY = e.clientY - startY;
        const newPosition = Math.max(
          -(items.length - 1) * itemHeight,
          Math.min(0, startScroll + deltaY)
        );
        setScrollPosition(newPosition);

        const selectedIndex = Math.round(-newPosition / itemHeight);
        if (selectedIndex >= 0 && selectedIndex < items.length) {
          onSelect(items[selectedIndex]);
        }
      };

      const handleMouseUp = () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    };

    return (
      <div className="flex flex-col items-center">
        <div className="text-xs text-white/50 mb-1">{label}</div>
        <div
          className="relative overflow-hidden"
          style={{ height: containerHeight }}
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
        >
          <div
            className="flex flex-col transition-transform duration-200 ease-out"
            style={{
              transform: `translateY(${scrollPosition}px)`,
              height: items.length * itemHeight,
            }}
          >
            {items.map((item, index) => (
              <div
                key={index}
                className={cn(
                  "flex items-center justify-center h-8 text-sm transition-all duration-200 cursor-pointer",
                  item === selectedValue
                    ? "text-white font-semibold text-base"
                    : "text-white/30 text-sm"
                )}
                style={{ height: itemHeight }}
                onClick={() => onSelect(item)}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={cn("flex flex-col", className)}>
      {/* Picker - Only show when open */}
      {isOpen && (
        <div className="relative">
          <div className="flex items-center justify-center gap-4 text-white">
            <WheelPicker
              items={years}
              selectedValue={selectedDate.getFullYear()}
              onSelect={year => handleYearChange(year as number)}
              label="Year"
            />
            <WheelPicker
              items={months}
              selectedValue={months[selectedDate.getMonth()]}
              onSelect={month =>
                handleMonthChange(months.indexOf(month as string))
              }
              label="Month"
            />
            <WheelPicker
              items={days}
              selectedValue={selectedDate.getDate()}
              onSelect={day => handleDayChange(day as number)}
              label="Day"
            />
            <WheelPicker
              items={hours.map(h => h.toString().padStart(2, "0"))}
              selectedValue={selectedDate
                .getHours()
                .toString()
                .padStart(2, "0")}
              onSelect={hour => handleHourChange(parseInt(hour as string))}
              label="Hour"
            />
            <WheelPicker
              items={minutes.map(m => m.toString().padStart(2, "0"))}
              selectedValue={selectedDate
                .getMinutes()
                .toString()
                .padStart(2, "0")}
              onSelect={minute =>
                handleMinuteChange(parseInt(minute as string))
              }
              label="Min"
            />
            <WheelPicker
              items={["AM", "PM"]}
              selectedValue={selectedDate.getHours() >= 12 ? "PM" : "AM"}
              onSelect={period => handlePeriodChange(period as "AM" | "PM")}
              label="AM/PM"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DateTimePicker;
