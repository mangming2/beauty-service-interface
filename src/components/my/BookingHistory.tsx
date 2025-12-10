"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/common/Icons";
import Image from "next/image";
import { format, parse, differenceInCalendarDays } from "date-fns";
import Link from "next/link";

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

interface CompletedBooking {
  id: string;
  packageId: string;
  packageTitle: string;
  date: string;
  rating: number;
  comment: string;
  imageSrc: string;
  location: string;
  reviewed: boolean;
}

export default function BookingHistory() {
  const [bookingHistory, setBookingHistory] = useState<BookingHistory[]>([]);
  const [completedBookings, setCompletedBookings] = useState<
    CompletedBooking[]
  >([]);

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

    // Add reviews
    const completedBookingData: CompletedBooking[] = [
      {
        id: "1",
        packageId: "aespa-futuristic",
        packageTitle: "Futuristic Chic Idol Debut",
        date: "2025.07.14",
        rating: 5,
        comment: "Amazing experience! The styling was perfect.",
        imageSrc: "/dummy-profile.png",
        location: "Songdo, Incheon",
        reviewed: true,
      },
      {
        id: "2",
        packageId: "aespa-futuristic",
        packageTitle: "Futuristic Chic Idol Debut",
        date: "2024.07.14",
        rating: 5,
        comment: "Loved the futuristic concept!",
        imageSrc: "/dummy-profile.png",
        location: "Songdo, Incheon",
        reviewed: false,
      },
    ];

    setCompletedBookings(completedBookingData);
  }, []);

  const getDDayLabel = (dateString: string) => {
    try {
      const date = parse(dateString, "yyyy.MM.dd", new Date());
      const diff = differenceInCalendarDays(date, new Date());
      if (diff > 0) return `D-${diff}`;
      if (diff === 0) return "D-DAY";
      return `D+${Math.abs(diff)}`;
    } catch {
      return "";
    }
  };

  return (
    <div className="space-y-4">
      {bookingHistory.length > 0 ? (
        <>
          {/* Upcoming Bookings */}
          <div>
            <h2 className="text-lg font-bold mb-4">Upcoming Bookings</h2>
            <div className="flex flex-col gap-1">
              {bookingHistory
                .filter(booking => booking.status === "confirmed")
                .map(booking => (
                  <Link href={`/my/booking/${booking.id}`} key={booking.id}>
                    <Card
                      key={booking.id}
                      className="bg-gray-container border-none rounded-1 p-0"
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center">
                          <div className="flex justify-between w-full">
                            <div className="flex flex-col items-start justify-between">
                              <h3 className="font-bold text-white text-lg">
                                DOKI MAKE SALON
                              </h3>
                              <p className="text-sm text-gray-400">
                                <span>
                                  {booking.date} • {booking.time}
                                </span>{" "}
                                <span>({booking.location?.split(",")[0]})</span>{" "}
                                <span>• {booking.guests} Guests</span>
                              </p>
                            </div>

                            <div className="flex items-center px-3 gap-3">
                              <span className="text-pink-500 font-bold title-lg truncate">
                                {getDDayLabel(booking.date)}
                              </span>
                              <Icons.arrowRight width={6} height={12} />
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
            </div>
          </div>

          {/* Completed Bookings */}
          <div>
            <h2 className="text-lg font-bold mb-4">Completed</h2>
            {["2025", "2024"].map(year => (
              <div key={year} className="mb-6">
                <h3 className="text-white font-bold mb-3">{year}</h3>
                {completedBookings
                  .filter(booking => booking.date.includes(year))
                  .map(booking => (
                    <Card
                      key={booking.id}
                      className="bg-transparent border-none mb-3"
                    >
                      <CardContent className="p-0">
                        <div className="flex gap-3 p-2">
                          <div className="relative w-[91px] h-[91px] rounded-lg overflow-hidden flex-shrink-0">
                            <Image
                              src={booking.imageSrc}
                              alt={booking.packageTitle}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex flex-col justify-between">
                            <div className="flex flex-col">
                              <h4 className="font-semibold text-white mb-1">
                                {booking.packageTitle}
                              </h4>
                              <p className="text-gray-400 text-sm mb-2">
                                {booking.location}
                              </p>
                            </div>
                            <p className="text-gray-400 text-sm">
                              {booking.date}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-end gap-4 w-full max-w-xs">
                          <Button className="flex-1 h-10" variant="gray">
                            Booking Details
                          </Button>
                          <Link href={`/my/reviews/${booking.packageId}`}>
                            <Button
                              className={`${booking.reviewed ? "flex-1 h-10 bg-gray-700 text-gray-300 cursor-not-allowed hover:bg-gray-700" : "flex-1 h-10 bg-pink-500 hover:bg-pink-600"}`}
                              disabled={booking.reviewed}
                            >
                              Review
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            ))}
          </div>
        </>
      ) : (
        <Card className="bg-gray-900 border-gray-700">
          <CardContent className="p-6 text-center">
            <p className="text-gray-400 mb-2">No reviews yet</p>
            <Button className="bg-pink-500 hover:bg-pink-600">
              Book Your First Package
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
