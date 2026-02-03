"use client";

import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { UpcomingBookings } from "./UpcomingBookings";
import { CompletedBookings } from "./CompletedBookings";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";
import { useMyBookings } from "@/queries/useMyPageQueries";
import { useMyReviews } from "@/queries/useMyPageQueries";
import type { Booking } from "@/api/my-page";
import type { BookingHistory, CompletedBooking } from "./types";

const PLACEHOLDER_IMAGE = "/dummy-profile.png";

function formatVisitDate(dateStr: string): string {
  try {
    return format(new Date(dateStr), "yyyy.MM.dd");
  } catch {
    return dateStr;
  }
}

function mapApiStatusToUi(
  status: Booking["status"]
): "confirmed" | "completed" | "cancelled" {
  switch (status) {
    case "PREBOOK":
    case "CONFIRMED":
      return "confirmed";
    case "COMPLETED":
      return "completed";
    case "CANCELLED":
      return "cancelled";
    default:
      return "confirmed";
  }
}

function bookingToHistory(b: Booking): BookingHistory {
  return {
    id: String(b.reservationId),
    packageTitle: b.packageName,
    date: formatVisitDate(b.visitDate),
    time: b.visitStartTime,
    status: mapApiStatusToUi(b.status),
    imageSrc: PLACEHOLDER_IMAGE,
    price: b.totalPrice,
    location: b.attractions?.[0] ?? "",
    guests: 1,
  };
}

function bookingToCompleted(
  b: Booking,
  reviewedProductIds: Set<number>,
  reviewByProductId: Map<number, { rating: number; content: string }>
): CompletedBooking {
  const review = reviewByProductId.get(b.packageId);
  return {
    id: String(b.reservationId),
    packageId: String(b.packageId),
    packageTitle: b.packageName,
    date: formatVisitDate(b.visitDate),
    rating: review?.rating ?? 0,
    comment: review?.content ?? "",
    imageSrc: PLACEHOLDER_IMAGE,
    location: b.attractions?.[0] ?? "",
    reviewed: reviewedProductIds.has(b.packageId),
  };
}

export default function BookingHistory() {
  const [openSheetId, setOpenSheetId] = useState<string | null>(null);
  const [deleteDialogOpenId, setDeleteDialogOpenId] = useState<string | null>(
    null
  );
  const [deletedIds, setDeletedIds] = useState<Set<string>>(new Set());

  const { data: bookings = [], isLoading: bookingsLoading } = useMyBookings();
  const { data: reviews = [] } = useMyReviews();

  const reviewedProductIds = useMemo(
    () => new Set(reviews.map(r => r.productId)),
    [reviews]
  );

  const reviewByProductId = useMemo(() => {
    const map = new Map<number, { rating: number; content: string }>();
    reviews.forEach(r =>
      map.set(r.productId, { rating: r.rating, content: r.content })
    );
    return map;
  }, [reviews]);

  const { upcomingBookings, completedBookings, years } = useMemo(() => {
    const history = bookings.map(bookingToHistory);
    const upcoming = history.filter(b => b.status === "confirmed");
    const completed = bookings
      .filter(b => b.status === "COMPLETED")
      .map(b => bookingToCompleted(b, reviewedProductIds, reviewByProductId))
      .filter(b => !deletedIds.has(b.id));

    const yrs = Array.from(
      new Set(completed.map(b => b.date.split(".")[0]))
    ).sort((a, b) => b.localeCompare(a));

    return {
      upcomingBookings: upcoming,
      completedBookings: completed,
      years: yrs,
    };
  }, [bookings, reviewedProductIds, reviewByProductId, deletedIds]);

  const hasAnyBookings =
    upcomingBookings.length > 0 || completedBookings.length > 0;

  const handleDeleteClick = (bookingId: string) => {
    setOpenSheetId(null);
    setDeleteDialogOpenId(bookingId);
  };

  const handleDeleteConfirm = () => {
    if (deleteDialogOpenId) {
      setDeletedIds(prev => new Set(prev).add(deleteDialogOpenId));
      setDeleteDialogOpenId(null);
    }
  };

  if (bookingsLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {hasAnyBookings ? (
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
            <p className="text-gray-400 mb-2">No bookings yet</p>
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
