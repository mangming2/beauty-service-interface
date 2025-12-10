"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function DeleteConfirmDialog({
  isOpen,
  onOpenChange,
  onConfirm,
}: DeleteConfirmDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-container border-none rounded-lg p-6 max-w-[calc(100%-2rem)]">
        <DialogHeader>
          <DialogTitle className="text-white font-bold text-lg text-left">
            Delete this record now?
          </DialogTitle>
          <DialogDescription className="text-white text-left mt-2">
            Deleting this record will also remove all linked schedules
            you&apos;ve created, and this action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-row gap-3 justify-end mt-6 sm:justify-end">
          <Button
            variant="gray"
            onClick={() => onOpenChange(false)}
            className="flex-1 sm:flex-initial"
          >
            Cancel
          </Button>
          <Button
            className="flex-1 sm:flex-initial bg-pink-500 hover:bg-pink-600 text-white"
            onClick={onConfirm}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
