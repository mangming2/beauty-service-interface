"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { BookingActionSheet } from "./BookingActionSheet";
import type { CompletedBooking } from "./types";

interface CompletedBookingsProps {
  bookings: CompletedBooking[];
  years: string[];
  openSheetId: string | null;
  onSheetOpenChange: (bookingId: string | null) => void;
  onDeleteClick: (bookingId: string) => void;
}

export function CompletedBookings({
  bookings,
  years,
  openSheetId,
  onSheetOpenChange,
  onDeleteClick,
}: CompletedBookingsProps) {
  if (bookings.length === 0) return null;

  return (
    <div>
      <h2 className="text-lg font-bold mb-4">Completed</h2>
      {years.map(year => {
        const yearBookings = bookings.filter(booking =>
          booking.date.includes(year)
        );

        if (yearBookings.length === 0) return null;

        return (
          <div key={year} className="mb-6">
            <h3 className="text-white font-bold mb-3">{year}</h3>
            {yearBookings.map(booking => (
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
                      <p className="text-gray-400 text-sm">{booking.date}</p>
                    </div>
                  </div>
                  <div className="flex items-end gap-3 w-full">
                    <Button
                      className="flex-1 py-2 px-8 h-8 rounded-0 min-w-[154px]"
                      variant="gray"
                    >
                      Booking Details
                    </Button>
                    {!booking.reviewed && (
                      <Link href={`/my/reviews/${booking.packageId}`}>
                        <Button
                          className="flex-1 py-2 px-8 h-8 rounded-0 min-w-[154px]"
                          variant="gray"
                        >
                          Review
                        </Button>
                      </Link>
                    )}
                    <BookingActionSheet
                      bookingId={booking.id}
                      isOpen={openSheetId === booking.id}
                      onOpenChange={open =>
                        onSheetOpenChange(open ? booking.id : null)
                      }
                      onDeleteClick={() => onDeleteClick(booking.id)}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        );
      })}
    </div>
  );
}
