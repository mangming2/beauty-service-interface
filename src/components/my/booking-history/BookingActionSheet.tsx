"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { Icons } from "@/components/common/Icons";

interface BookingActionSheetProps {
  bookingId?: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleteClick: () => void;
}

export function BookingActionSheet({
  isOpen,
  onOpenChange,
  onDeleteClick,
}: BookingActionSheetProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button className="h-8 rounded-0" variant="gray">
          <Icons.dots width={13} height={24} />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="bottom"
        className="bg-gray-container border-none rounded-t-lg p-5 pb-[27px]"
        showCloseButton={false}
      >
        <SheetTitle className="sr-only">Booking Actions</SheetTitle>
        <div className="flex flex-col">
          <div className="w-13 h-1 bg-gray rounded-full mx-auto" />
          <button
            onClick={onDeleteClick}
            className="flex items-center gap-2 pt-6 text-white"
          >
            <Icons.trashcan width={18} height={19} />
            <span className="title-sm">Delete Record</span>
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
