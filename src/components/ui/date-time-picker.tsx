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
    for (let i = 0; i < 60; i++) {
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
    const itemHeight = 32;
    const visibleItems = 3;
    const containerHeight = itemHeight * visibleItems;

    // 초기 스크롤 위치 계산
    const getInitialScrollPosition = () => {
      const selectedIndex = items.findIndex(item => item === selectedValue);
      if (selectedIndex !== -1) {
        return -(selectedIndex - 1) * itemHeight;
      }
      return 0;
    };

    const [scrollPosition, setScrollPosition] = useState(() =>
      getInitialScrollPosition()
    );
    const [isDragging, setIsDragging] = useState(false);
    const [isInteracting, setIsInteracting] = useState(false);
    const [lastSelectedValue, setLastSelectedValue] = useState(selectedValue);
    const interactionTimerRef = React.useRef<NodeJS.Timeout | null>(null);

    // 초기 마운트 시 스크롤 위치 설정
    useEffect(() => {
      const selectedIndex = items.findIndex(item => item === selectedValue);
      if (selectedIndex !== -1) {
        setScrollPosition(-(selectedIndex - 1) * itemHeight);
      }
      setLastSelectedValue(selectedValue);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // cleanup 타이머
    useEffect(() => {
      return () => {
        if (interactionTimerRef.current) {
          clearTimeout(interactionTimerRef.current);
        }
      };
    }, []);

    useEffect(() => {
      // 사용자가 직접 조작 중이 아니고, 실제로 값이 변경되었을 때만 재설정
      if (
        !isInteracting &&
        !isDragging &&
        selectedValue !== lastSelectedValue
      ) {
        const selectedIndex = items.findIndex(item => item === selectedValue);
        if (selectedIndex !== -1) {
          setScrollPosition(-(selectedIndex - 1) * itemHeight);
        }
        setLastSelectedValue(selectedValue);
      }
    }, [
      selectedValue,
      items,
      isInteracting,
      isDragging,
      lastSelectedValue,
      itemHeight,
    ]);

    const handleWheel = (e: React.WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();
      e.nativeEvent.stopImmediatePropagation();
      e.nativeEvent.preventDefault();

      if (isDragging) return;

      setIsInteracting(true);

      // 기존 타이머 취소
      if (interactionTimerRef.current) {
        clearTimeout(interactionTimerRef.current);
      }

      // 더 부드러운 스크롤을 위해 델타값을 조정
      const delta = e.deltaY > 0 ? itemHeight * 0.8 : -itemHeight * 0.8;
      const newPosition = Math.max(
        -(items.length - 1) * itemHeight, // 중앙 정렬을 위해 조정
        Math.min(2 * itemHeight, scrollPosition + delta) // 상단 여백 고려
      );
      setScrollPosition(newPosition);

      const selectedIndex = Math.round(
        -(newPosition - 1 * itemHeight) / itemHeight
      );
      if (selectedIndex >= 0 && selectedIndex < items.length) {
        onSelect(items[selectedIndex]);
      }

      // 짧은 딜레이 후 상호작용 상태 해제
      interactionTimerRef.current = setTimeout(() => {
        setIsInteracting(false);
        interactionTimerRef.current = null;
      }, 150);
    };

    const handleMouseDown = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      e.nativeEvent.stopImmediatePropagation();
      e.nativeEvent.preventDefault();

      setIsDragging(true);
      setIsInteracting(true);

      // 기존 타이머 취소
      if (interactionTimerRef.current) {
        clearTimeout(interactionTimerRef.current);
      }

      const startY = e.clientY;
      const startScroll = scrollPosition;

      const handleMouseMove = (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const deltaY = (e.clientY - startY) * 0.8; // 더 부드러운 드래그를 위해 감속
        const newPosition = Math.max(
          -(items.length - 1) * itemHeight, // 중앙 정렬을 위해 조정
          Math.min(2 * itemHeight, startScroll + deltaY) // 상단 여백 고려
        );
        setScrollPosition(newPosition);

        const selectedIndex = Math.round(
          -(newPosition - 1 * itemHeight) / itemHeight
        );
        if (selectedIndex >= 0 && selectedIndex < items.length) {
          onSelect(items[selectedIndex]);
        }
      };

      const handleMouseUp = () => {
        setIsDragging(false);
        // 드래그 종료 후 짧은 딜레이를 두고 상호작용 상태 해제
        interactionTimerRef.current = setTimeout(() => {
          setIsInteracting(false);
          interactionTimerRef.current = null;
        }, 150);
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    };

    const handleClick = (item: string | number) => {
      setIsInteracting(true);

      // 기존 타이머 취소
      if (interactionTimerRef.current) {
        clearTimeout(interactionTimerRef.current);
      }

      onSelect(item);
      // 클릭 후 짧은 딜레이를 두고 상호작용 상태 해제
      interactionTimerRef.current = setTimeout(() => {
        setIsInteracting(false);
        interactionTimerRef.current = null;
      }, 150);
    };

    return (
      <div className="flex flex-col items-center">
        <div className="text-xs text-white/50 mb-1">{label}</div>
        <div
          className="relative overflow-hidden select-none"
          style={{
            height: containerHeight,
            scrollBehavior: "smooth",
          }}
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onTouchStart={e => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onTouchMove={e => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onContextMenu={e => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onDragStart={e => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <div
            className="flex flex-col transition-transform duration-300 ease-out"
            style={{
              transform: `translateY(${scrollPosition}px)`,
              height: items.length * itemHeight,
            }}
          >
            {items.map((item, index) => (
              <div
                key={index}
                className={cn(
                  "flex items-center justify-center h-8 text-sm transition-all duration-300 ease-out cursor-pointer",
                  item === selectedValue
                    ? "text-white font-semibold text-base scale-110"
                    : "text-white/30 text-sm scale-100"
                )}
                style={{ height: itemHeight }}
                onClick={() => handleClick(item)}
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
            <div
              className="wheel-container"
              data-wheel="year"
              onWheel={e => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onMouseDown={e => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <WheelPicker
                items={years}
                selectedValue={selectedDate.getFullYear()}
                onSelect={year => handleYearChange(year as number)}
                label="Year"
              />
            </div>
            <div
              className="wheel-container"
              data-wheel="month"
              onWheel={e => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onMouseDown={e => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <WheelPicker
                items={months}
                selectedValue={months[selectedDate.getMonth()]}
                onSelect={month =>
                  handleMonthChange(months.indexOf(month as string))
                }
                label="Month"
              />
            </div>
            <div
              className="wheel-container"
              data-wheel="day"
              onWheel={e => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onMouseDown={e => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <WheelPicker
                items={days}
                selectedValue={selectedDate.getDate()}
                onSelect={day => handleDayChange(day as number)}
                label="Day"
              />
            </div>
            <div
              className="wheel-container"
              data-wheel="hour"
              onWheel={e => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onMouseDown={e => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <WheelPicker
                items={hours.map(h => h.toString().padStart(2, "0"))}
                selectedValue={selectedDate
                  .getHours()
                  .toString()
                  .padStart(2, "0")}
                onSelect={hour => handleHourChange(parseInt(hour as string))}
                label="Hour"
              />
            </div>
            <div
              className="wheel-container"
              data-wheel="minute"
              onWheel={e => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onMouseDown={e => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
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
            </div>
            <div
              className="wheel-container"
              data-wheel="period"
              onWheel={e => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onMouseDown={e => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <WheelPicker
                items={["AM", "PM"]}
                selectedValue={selectedDate.getHours() >= 12 ? "PM" : "AM"}
                onSelect={period => handlePeriodChange(period as "AM" | "PM")}
                label="AM/PM"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateTimePicker;
