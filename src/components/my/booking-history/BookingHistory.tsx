"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { UpcomingBookings } from "./UpcomingBookings";
import { CompletedBookings } from "./CompletedBookings";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";
import type { BookingHistory, CompletedBooking } from "./types";

export default function BookingHistory() {
  const [bookingHistory, setBookingHistory] = useState<BookingHistory[]>([]);
  const [completedBookings, setCompletedBookings] = useState<
    CompletedBooking[]
  >([]);
  const [openSheetId, setOpenSheetId] = useState<string | null>(null);
  const [deleteDialogOpenId, setDeleteDialogOpenId] = useState<string | null>(
    null
  );

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

  const upcomingBookings = bookingHistory.filter(
    booking => booking.status === "confirmed"
  );

  const handleDeleteClick = (bookingId: string) => {
    setOpenSheetId(null);
    setDeleteDialogOpenId(bookingId);
  };

  const handleDeleteConfirm = () => {
    if (deleteDialogOpenId) {
      console.log("Delete booking:", deleteDialogOpenId);
      setCompletedBookings(prev =>
        prev.filter(b => b.id !== deleteDialogOpenId)
      );
      setDeleteDialogOpenId(null);
    }
  };

  // Extract unique years from completed bookings
  const years = Array.from(
    new Set(completedBookings.map(b => b.date.split(".")[0]))
  ).sort((a, b) => b.localeCompare(a));

  return (
    <div className="space-y-4">
      {bookingHistory.length > 0 ? (
        <>
          <UpcomingBookings bookings={upcomingBookings} />
          <CompletedBookings
            bookings={completedBookings}
            years={years}
            openSheetId={openSheetId}
            onSheetOpenChange={setOpenSheetId}
            onDeleteClick={handleDeleteClick}
          />
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
      <DeleteConfirmDialog
        isOpen={deleteDialogOpenId !== null}
        onOpenChange={open => {
          if (!open) setDeleteDialogOpenId(null);
        }}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
