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
      {
        id: "3",
        packageTitle: "Elegant Glam Photo Shoot",
        date: "2026.09.20",
        time: "16:00",
        status: "confirmed",
        imageSrc: "/dummy-profile.png",
        price: 150000,
        location: "Gangnam, Seoul",
        guests: 1,
      },
      {
        id: "4",
        packageTitle: "Girl Crush Concept",
        date: "2026.10.05",
        time: "13:00",
        status: "confirmed",
        imageSrc: "/dummy-profile.png",
        price: 180000,
        location: "Hongdae, Seoul",
        guests: 3,
      },
      {
        id: "5",
        packageTitle: "Futuristic Chic Idol Debut",
        date: "2025.07.14",
        time: "14:00",
        status: "completed",
        imageSrc: "/dummy-profile.png",
        price: 170000,
        location: "Songdo, Incheon",
        guests: 2,
      },
      {
        id: "6",
        packageTitle: "Lovely Fresh Style",
        date: "2025.05.22",
        time: "11:00",
        status: "completed",
        imageSrc: "/dummy-profile.png",
        price: 140000,
        location: "Myeongdong, Seoul",
        guests: 2,
      },
      {
        id: "7",
        packageTitle: "Highteen Concept",
        date: "2025.03.10",
        time: "15:30",
        status: "completed",
        imageSrc: "/dummy-profile.png",
        price: 160000,
        location: "Itaewon, Seoul",
        guests: 1,
      },
    ];

    setBookingHistory([newBooking, ...additionalBookings]);
  }, []);

  const handleScheduleAdd = (bookingId: string) => {
    setSelectedBookingId(bookingId);
    setIsScheduleModalOpen(true);
  };

  const handleScheduleSave = (title: string, date: Date) => {
    console.log("새 일정 저장:", { bookingId: selectedBookingId, title, date });
    // TODO: 실제 API 호출로 일정 저장
    alert(`일정이 저장되었습니다: ${title} - ${date.toLocaleString()}`);
  };

  return (
    <div className="space-y-4">
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
                    className={`border-gray-700 mb-3 cursor-pointer transition-all duration-200 ${
                      selectedBooking === booking.id
                        ? "bg-gray-800 border-pink-500"
                        : "bg-gray-900"
                    } hover:bg-gray-800`}
                    onClick={() => setSelectedBooking(booking.id)}
                  >
                    <CardContent className="p-4">
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
                  className="bg-gray-900 border-gray-700 text-white rounded-t-2xl h-[70vh]"
                  onInteractOutside={e => {
                    // 모달이 열려있으면 바텀시트 닫기 방지
                    if (isScheduleModalOpen) {
                      e.preventDefault();
                    }
                  }}
                >
                  <SheetHeader className="pb-4">
                    <SheetTitle className="text-white text-lg font-bold">
                      Futuristic Chic Idol Debut
                    </SheetTitle>
                  </SheetHeader>

                  <div className="space-y-4 overflow-y-auto h-full pb-6 relative">
                    <div className="border-l-4 border-pink-500 pl-4">
                      <div className="text-gray-400 text-sm">07.15</div>
                      <div className="text-white font-semibold">Tri-bowl</div>
                      <div className="text-gray-400 text-sm">2 p.m.</div>
                    </div>

                    <div className="border-l-4 border-pink-500 pl-4">
                      <div className="text-white font-semibold">
                        Incheon Bridge Observatory
                      </div>
                      <div className="text-gray-400 text-sm">4 p.m.</div>
                    </div>

                    <div className="border-l-4 border-gray-600 pl-4">
                      <div className="text-gray-400 text-sm">07.16</div>
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
