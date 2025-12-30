"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Icons } from "@/components/common/Icons";
import ScheduleModal from "@/components/common/ScheduleModal";
import Image from "next/image";
import { format } from "date-fns";

interface BookingHistory {
  id: string;
  packageTitle: string;
  date: string;
  time: string;
  status: "confirmed" | "completed" | "cancelled";
  imageSrc: string;
  price: number;
  location?: string;
  guests?: number;
}

interface ScheduleItem {
  id: string;
  date: string;
  title: string;
  time: string;
  color: string; // border color
}

// Schedule 컴포넌트는 props가 필요 없음

export default function Schedule() {
  const [bookingHistory, setBookingHistory] = useState<BookingHistory[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<string | null>(null);

  // Schedule Modal state
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string>("");

  // Fullscreen state for each sheet (keyed by booking id)
  const [fullscreenSheets, setFullscreenSheets] = useState<
    Record<string, boolean>
  >({});

  // Edit mode state for each booking (keyed by booking id)
  const [editModes, setEditModes] = useState<Record<string, boolean>>({});

  // Deleted schedule items (keyed by booking id, then schedule item id)
  const [deletedScheduleItems, setDeletedScheduleItems] = useState<
    Record<string, Set<string>>
  >({});

  // Drag state for each sheet (keyed by booking id)
  const dragStartY = useRef<Record<string, number>>({});
  const isDragging = useRef<Record<string, boolean>>({});
  const dragStartHeight = useRef<Record<string, number>>({});
  const hasDragged = useRef<Record<string, boolean>>({});
  const [dragHeights, setDragHeights] = useState<Record<string, number>>({});

  // Schedule items for each booking (keyed by booking id)
  const [scheduleItems, setScheduleItems] = useState<
    Record<string, ScheduleItem[]>
  >({
    "1": [
      {
        id: "s1-1",
        date: "07.15",
        title: "Tri-bowl",
        time: "2 p.m.",
        color: "border-pink-500",
      },
      {
        id: "s1-2",
        date: "07.15",
        title: "Incheon Bridge Observatory",
        time: "4 p.m.",
        color: "border-pink-500",
      },
      {
        id: "s1-3",
        date: "07.16",
        title: "Studio HYPE",
        time: "1 p.m.",
        color: "border-gray-600",
      },
      {
        id: "s1-4",
        date: "07.16",
        title: "Urban History Museum",
        time: "5 p.m.",
        color: "border-gray-600",
      },
    ],
    "2": [
      {
        id: "s2-1",
        date: "08.15",
        title: "Tri-bowl",
        time: "2 p.m.",
        color: "border-pink-500",
      },
      {
        id: "s2-2",
        date: "08.15",
        title: "Incheon Bridge Observatory",
        time: "4 p.m.",
        color: "border-pink-500",
      },
    ],
  });

  useEffect(() => {
    const newBooking: BookingHistory = {
      id: "1",
      packageTitle: "Futuristic Chic Idol Debut",
      date: format(new Date(), "yyyy.MM.dd"),
      time: format(new Date(), "HH:mm"),
      status: "confirmed",
      imageSrc: "/dummy-profile.png",
      price: 170000,
      location: "Songdo, Incheon",
      guests: 2,
    };

    // Add multiple booking history entries for demonstration
    const additionalBookings: BookingHistory[] = [
      {
        id: "2",
        packageTitle: "Futuristic Chic Idol Debut",
        date: "2026.08.15",
        time: "14:00",
        status: "confirmed",
        imageSrc: "/dummy-profile.png",
        price: 170000,
        location: "Songdo, Incheon",
        guests: 2,
      },
    ];

    setBookingHistory([newBooking, ...additionalBookings]);
    // scheduleItems는 useState 초기값으로 이미 설정되어 있으므로 여기서는 제거
  }, []);

  // 드래그 핸들러 함수들
  const handleDragMove = (bookingId: string, clientY: number) => {
    if (!isDragging.current[bookingId]) return;

    const startY = dragStartY.current[bookingId];
    const startHeight = dragStartHeight.current[bookingId];
    const deltaY = startY - clientY; // 위로 드래그하면 양수

    // 드래그가 발생했는지 추적 (5px 이상 움직이면 드래그로 간주)
    if (Math.abs(deltaY) > 5) {
      hasDragged.current[bookingId] = true;
    }

    const viewportHeight = window.innerHeight;
    const minHeight = viewportHeight * 0.7; // 70vh
    const maxHeight = viewportHeight - 64; // 100vh - 64px

    // 드래그 거리에 따라 높이 계산 (위로 드래그하면 높이 증가)
    const newHeight = Math.max(
      minHeight,
      Math.min(maxHeight, startHeight + deltaY)
    );

    setDragHeights(prev => ({
      ...prev,
      [bookingId]: newHeight,
    }));
  };

  const handleDragEnd = (bookingId: string, lastClientY?: number) => {
    if (!isDragging.current[bookingId]) return;

    const viewportHeight = window.innerHeight;
    const minHeight = viewportHeight * 0.7;
    const maxHeight = viewportHeight - 64;

    // 마지막 위치를 기반으로 최종 높이 계산
    let finalHeight: number;
    if (lastClientY !== undefined) {
      const startY = dragStartY.current[bookingId];
      const startHeight = dragStartHeight.current[bookingId];
      const deltaY = startY - lastClientY;
      finalHeight = Math.max(
        minHeight,
        Math.min(maxHeight, startHeight + deltaY)
      );
    } else {
      // fallback: state에서 가져오기
      finalHeight =
        dragHeights[bookingId] || dragStartHeight.current[bookingId];
    }

    // 중간 지점을 기준으로 전체 화면 또는 원래 크기 결정
    const threshold = (minHeight + maxHeight) / 2;
    const shouldBeFullscreen = finalHeight > threshold;

    setFullscreenSheets(prev => ({
      ...prev,
      [bookingId]: shouldBeFullscreen,
    }));

    // 드래그 높이 초기화
    setDragHeights(prev => {
      const next = { ...prev };
      delete next[bookingId];
      return next;
    });

    isDragging.current[bookingId] = false;
    dragStartY.current[bookingId] = 0;
    dragStartHeight.current[bookingId] = 0;
    hasDragged.current[bookingId] = false;
  };

  const handleScheduleAdd = (bookingId: string) => {
    setSelectedBookingId(bookingId);
    setIsScheduleModalOpen(true);
  };

  const handleScheduleSave = (
    title: string,
    startDate: Date,
    endDate: Date
  ) => {
    console.log("새 일정 저장:", {
      bookingId: selectedBookingId,
      title,
      startDate,
      endDate,
    });
    // TODO: 실제 API 호출로 일정 저장
    alert(
      `일정이 저장되었습니다: ${title} - ${startDate.toLocaleString()} ~ ${endDate.toLocaleString()}`
    );
  };

  const toggleFullscreen = (bookingId: string) => {
    setFullscreenSheets(prev => ({
      ...prev,
      [bookingId]: !prev[bookingId],
    }));
  };

  const handleDragStart = (bookingId: string, clientY: number) => {
    dragStartY.current[bookingId] = clientY;
    isDragging.current[bookingId] = true;
    hasDragged.current[bookingId] = false;

    // 현재 시트 높이 저장 (70vh 또는 100vh-64px)
    const viewportHeight = window.innerHeight;
    const currentHeight = fullscreenSheets[bookingId]
      ? viewportHeight - 64
      : viewportHeight * 0.7;
    dragStartHeight.current[bookingId] = currentHeight;

    // 전역 이벤트 리스너 추가 (드래그 시작 시에만)
    let lastClientY = clientY;

    const handleMouseMove = (e: MouseEvent) => {
      lastClientY = e.clientY;
      handleDragMove(bookingId, e.clientY);
    };

    const handleMouseUp = () => {
      handleDragEnd(bookingId, lastClientY);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        e.preventDefault();
        lastClientY = e.touches[0].clientY;
        handleDragMove(bookingId, e.touches[0].clientY);
      }
    };

    const handleTouchEnd = () => {
      handleDragEnd(bookingId, lastClientY);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("touchend", handleTouchEnd);
  };

  const toggleEditMode = (bookingId: string) => {
    setEditModes(prev => ({
      ...prev,
      [bookingId]: !prev[bookingId],
    }));
    // Reset deleted items when canceling edit mode
    if (editModes[bookingId]) {
      setDeletedScheduleItems(prev => ({
        ...prev,
        [bookingId]: new Set(),
      }));
    }
  };

  const handleDeleteScheduleItem = (
    bookingId: string,
    scheduleItemId: string
  ) => {
    setDeletedScheduleItems(prev => ({
      ...prev,
      [bookingId]: new Set(prev[bookingId] || []).add(scheduleItemId),
    }));
  };

  const handleSaveSchedule = (bookingId: string) => {
    const deletedIds = deletedScheduleItems[bookingId];
    if (deletedIds && deletedIds.size > 0) {
      console.log("Deleting schedule items:", Array.from(deletedIds));
      // TODO: 실제 삭제 API 호출

      // Remove deleted items from scheduleItems
      setScheduleItems(prev => ({
        ...prev,
        [bookingId]: (prev[bookingId] || []).filter(
          item => !deletedIds.has(item.id)
        ),
      }));
    }

    // Reset edit mode and deleted items
    setEditModes(prev => ({
      ...prev,
      [bookingId]: false,
    }));
    setDeletedScheduleItems(prev => ({
      ...prev,
      [bookingId]: new Set(),
    }));
  };

  return (
    <div className="flex flex-col w-full space-y-4">
      {/* Booking History List */}
      {["2026", "2025"].map(year => (
        <div key={year} className="mb-6">
          <h3 className="text-white font-bold mb-3">{year}</h3>
          {bookingHistory
            .filter(booking => booking.date.includes(year))
            .map(booking => (
              <Sheet key={booking.id}>
                <SheetTrigger asChild>
                  <Card
                    className={`flex w-full bg-transparent py-0 border-none mb-3 cursor-pointer transition-all duration-200 ${
                      selectedBooking === booking.id
                        ? "bg-gray"
                        : "bg-transparent"
                    } hover:bg-gray`}
                    onClick={() => setSelectedBooking(booking.id)}
                  >
                    <CardContent className="p-2 w-full">
                      <div className="flex gap-3">
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={booking.imageSrc}
                            alt={booking.packageTitle}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-white mb-1">
                            {booking.packageTitle}
                          </h4>
                          <p className="text-gray-400 text-sm mb-1">
                            {booking.location}
                          </p>
                          <p className="text-gray-400 text-sm">
                            {booking.date}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </SheetTrigger>
                <SheetContent
                  side="bottom"
                  showCloseButton={false}
                  className="bg-background border-none text-white rounded-t-2xl flex flex-col"
                  style={{
                    height:
                      isDragging.current[booking.id] && dragHeights[booking.id]
                        ? `${dragHeights[booking.id]}px`
                        : fullscreenSheets[booking.id]
                          ? "calc(100vh - 64px)"
                          : "70vh",
                    transition: isDragging.current[booking.id]
                      ? "none"
                      : "all 0.3s",
                  }}
                  onInteractOutside={e => {
                    // 모달이 열려있으면 바텀시트 닫기 방지
                    if (isScheduleModalOpen) {
                      e.preventDefault();
                    }
                  }}
                >
                  {/* Drag Handle Bar */}
                  <div
                    onTouchStart={e => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleDragStart(booking.id, e.touches[0].clientY);
                    }}
                    onMouseDown={e => {
                      e.stopPropagation();
                      handleDragStart(booking.id, e.clientY);
                    }}
                    onClick={() => {
                      // 드래그가 발생하지 않은 경우에만 토글
                      if (!hasDragged.current[booking.id]) {
                        toggleFullscreen(booking.id);
                      }
                      // 클릭 후 초기화
                      hasDragged.current[booking.id] = false;
                    }}
                    className="flex justify-center pt-2 pb-3 cursor-grab active:cursor-grabbing touch-none flex-shrink-0 select-none"
                  >
                    <div className="w-13 h-1 bg-gray rounded-full transition-colors" />
                  </div>

                  <SheetHeader className="pb-4 flex flex-row items-center justify-between flex-shrink-0">
                    <SheetTitle className="text-white text-lg font-bold">
                      {booking.packageTitle}
                    </SheetTitle>
                    {!editModes[booking.id] ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleEditMode(booking.id)}
                        className="text-disabled text-lg p-0 h-auto"
                      >
                        Edit
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleEditMode(booking.id)}
                        className="text-disabled text-lg p-0 h-auto"
                      >
                        Cancel
                      </Button>
                    )}
                  </SheetHeader>

                  <div className="flex-1 overflow-y-auto px-5 relative">
                    <div className="space-y-4 pb-6">
                      {(() => {
                        const items = scheduleItems[booking.id] || [];
                        const deletedIds =
                          deletedScheduleItems[booking.id] || new Set();
                        const visibleItems = items.filter(
                          item => !deletedIds.has(item.id)
                        );

                        if (visibleItems.length === 0) {
                          return (
                            <div className="text-center py-12">
                              <div className="text-gray-400">
                                일정이 없습니다.
                              </div>
                            </div>
                          );
                        }

                        // Group items by date
                        const groupedByDate: Record<string, ScheduleItem[]> =
                          {};
                        visibleItems.forEach(item => {
                          if (!groupedByDate[item.date]) {
                            groupedByDate[item.date] = [];
                          }
                          groupedByDate[item.date].push(item);
                        });

                        const dates = Object.keys(groupedByDate).sort();

                        return dates.map(date => (
                          <div key={date}>
                            <div className="text-gray-400 text-sm mb-2">
                              {date}
                            </div>
                            {groupedByDate[date].map(item => (
                              <div
                                key={item.id}
                                className={`border-l-4 ${item.color} pl-4 flex items-start justify-between gap-3`}
                              >
                                <div className="flex-1">
                                  <div className="text-white font-semibold">
                                    {item.title}
                                  </div>
                                  <div className="text-gray-400 text-sm">
                                    {item.time}
                                  </div>
                                </div>
                                {editModes[booking.id] && (
                                  <button
                                    onClick={() =>
                                      handleDeleteScheduleItem(
                                        booking.id,
                                        item.id
                                      )
                                    }
                                    className="cursor-pointer flex-shrink-0 mt-1"
                                  >
                                    <Icons.delete />
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>
                        ));
                      })()}
                    </div>

                    {/* Plus Button - Fixed Position (only show when not in edit mode) */}
                    {!editModes[booking.id] && (
                      <Button
                        onClick={() => handleScheduleAdd(booking.id)}
                        className="absolute bottom-4 right-4 w-12 h-12 rounded-full bg-pink-500 hover:bg-pink-600 p-0 shadow-lg z-10"
                      >
                        <Icons.plus className="w-6 h-6 text-white" />
                      </Button>
                    )}
                  </div>

                  {/* Save Button (only show in edit mode) */}
                  {editModes[booking.id] && (
                    <div
                      className="flex-shrink-0 py-4 px-5"
                      style={{
                        boxShadow:
                          "inset 0 6px 6px -6px rgba(255, 255, 255, 0.12)",
                      }}
                    >
                      <Button
                        className="w-full h-[52px] text-lg bg-pink-500 hover:bg-pink-600"
                        onClick={() => handleSaveSchedule(booking.id)}
                        disabled={
                          !deletedScheduleItems[booking.id] ||
                          deletedScheduleItems[booking.id].size === 0
                        }
                      >
                        Save
                      </Button>
                    </div>
                  )}
                </SheetContent>
              </Sheet>
            ))}
        </div>
      ))}

      {/* Schedule Modal - Portal로 렌더링 */}
      {isScheduleModalOpen && (
        <ScheduleModal
          isOpen={isScheduleModalOpen}
          onClose={() => setIsScheduleModalOpen(false)}
          onSave={handleScheduleSave}
          bookingId={selectedBookingId}
        />
      )}
    </div>
  );
}
