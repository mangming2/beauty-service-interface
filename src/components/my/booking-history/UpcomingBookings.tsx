import { Card, CardContent } from "@/components/ui/card";
import { Icons } from "@/components/common/Icons";
import Link from "next/link";
import { getDDayLabel } from "./utils";
import type { BookingHistory } from "./types";

interface UpcomingBookingsProps {
  bookings: BookingHistory[];
}

export function UpcomingBookings({ bookings }: UpcomingBookingsProps) {
  if (bookings.length === 0) return null;

  return (
    <div>
      <h2 className="text-lg font-bold mb-4">Upcoming Bookings</h2>
      <div className="flex flex-col gap-1">
        {bookings.map(booking => (
          <Link href={`/my/booking/${booking.id}`} key={booking.id}>
            <Card className="bg-gray-container border-none rounded-1 p-0">
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
  );
}
