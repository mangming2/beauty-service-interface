import { format } from "date-fns";
import type { Booking } from "@/api/my-page";

export function formatVisitDate(dateStr: string): string {
  try {
    return format(new Date(dateStr), "yyyy.MM.dd");
  } catch {
    return dateStr;
  }
}

export function mapApiStatusToUi(
  status: Booking["status"]
): "confirmed" | "completed" | "cancelled" {
  switch (status) {
    case "PREBOOK":
    case "PENDING":
    case "BOOKED":
      return "confirmed";
    case "COMPLETED":
      return "completed";
    case "CANCELED":
      return "cancelled";
    default:
      return "confirmed";
  }
}
