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
import { GapY } from "../../ui/gap";

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
      <DialogContent
        showCloseButton={false}
        className="gap-0 px-5 pt-9 pb-6 bg-background border-none rounded-2 max-w-[380px] sm:max-w-[380px]"
      >
        <DialogHeader className="gap-0">
          <DialogTitle className="text-white title-md text-[20px]">
            Delete this record now?
          </DialogTitle>
          <GapY size={20} />
          <DialogDescription className="text-gray-font text-lg">
            Deleting this record will also remove all linked schedules
            you&apos;ve created, and this action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <GapY size={36} />
        <DialogFooter className="gap-3 w-full flex-row">
          <Button
            variant="gray"
            className="h-13 text-lg flex-1"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            className="h-13 text-lg bg-pink-500 hover:bg-pink-600 text-white flex-1"
            onClick={onConfirm}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
