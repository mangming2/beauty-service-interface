export interface BookingHistory {
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

export interface CompletedBooking {
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
