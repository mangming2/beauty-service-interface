"use client";

import { useState, useEffect } from "react";
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
  }, []);

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
                  className={`bg-background border-none text-white rounded-t-2xl transition-all duration-300 ${
                    fullscreenSheets[booking.id]
                      ? "h-[calc(100vh-64px)]"
                      : "h-[70vh]"
                  }`}
                  onInteractOutside={e => {
                    // 모달이 열려있으면 바텀시트 닫기 방지
                    if (isScheduleModalOpen) {
                      e.preventDefault();
                    }
                  }}
                >
                  {/* Drag Handle Bar */}
                  <div
                    onClick={() => toggleFullscreen(booking.id)}
                    className="flex justify-center pt-2 pb-3 cursor-pointer touch-none"
                  >
                    <div className="w-13 h-1 bg-gray rounded-fulltransition-colors" />
                  </div>

                  <SheetHeader className="pb-4">
                    <SheetTitle className="text-white text-lg font-bold">
                      Futuristic Chic Idol Debut
                    </SheetTitle>
                  </SheetHeader>

                  <div className="space-y-4 overflow-y-auto h-full px-5 pb-6 relative">
                    <div className="text-gray-400 text-sm">07.15</div>
                    <div className="border-l-4 border-pink-500 pl-4">
                      <div className="text-white font-semibold">Tri-bowl</div>
                      <div className="text-gray-400 text-sm">2 p.m.</div>
                    </div>

                    <div className="border-l-4 border-pink-500 pl-4">
                      <div className="text-white font-semibold">
                        Incheon Bridge Observatory
                      </div>
                      <div className="text-gray-400 text-sm">4 p.m.</div>
                    </div>

                    <div className="text-gray-400 text-sm">07.16</div>
                    <div className="border-l-4 border-gray-600 pl-4">
                      <div className="text-white font-semibold">Salon DOKI</div>
                      <div className="text-gray-400 text-sm">10 a.m.</div>
                    </div>

                    <div className="border-l-4 border-gray-600 pl-4">
                      <div className="text-white font-semibold">
                        Studio HYPE
                      </div>
                      <div className="text-gray-400 text-sm">1 p.m.</div>
                    </div>

                    <div className="border-l-4 border-gray-600 pl-4">
                      <div className="text-white font-semibold">
                        Urban History Museum
                      </div>
                      <div className="text-gray-400 text-sm">5 p.m.</div>
                    </div>

                    {/* Plus Button - Fixed Position */}
                    <Button
                      onClick={() => handleScheduleAdd(booking.id)}
                      className="absolute bottom-4 right-4 w-12 h-12 rounded-full bg-pink-500 hover:bg-pink-600 p-0 shadow-lg"
                    >
                      <Icons.plus className="w-6 h-6 text-white" />
                    </Button>
                  </div>
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
