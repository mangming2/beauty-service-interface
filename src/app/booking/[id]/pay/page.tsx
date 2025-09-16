"use client";

import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/hooks/useTranslation";
import { useEffect, useState } from "react";
import Image from "next/image";

interface BookingData {
  packageId: string;
  packageTitle: string;
  components: {
    id: string;
    title: string;
    location: string;
    price: number;
    status: "pending" | "accepted";
  }[];
  totalPrice: number;
  selectedDate: string;
  selectedTime: string;
}

const getBookingData = (packageId: string): BookingData => {
  return {
    packageId,
    packageTitle: "Futuristic Chic Idol Debut",
    components: [
      {
        id: "makeover",
        title: "Make Over",
        location: "Salon DOKI (Songdo, Incheon)",
        price: 70000,
        status: "pending",
      },
      {
        id: "debut",
        title: "Doki Debut",
        location: "Studio HYPE (Songdo, Incheon)",
        price: 80000,
        status: "accepted",
      },
    ],
    totalPrice: 170000,
    selectedDate: "2025.07.21",
    selectedTime: "10:00",
  };
};

export default function BookingPayPage() {
  const params = useParams();
  const { t } = useTranslation();
  const router = useRouter();
  const packageId = params.id as string;

  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [currentStep, setCurrentStep] = useState(2); // Sending, Processing, Accepted

  useEffect(() => {
    const data = getBookingData(packageId);
    setBookingData(data);

    // Simulate progress animation
    const timer1 = setTimeout(() => setCurrentStep(3), 2000);

    return () => {
      clearTimeout(timer1);
    };
  }, [packageId]);

  const handlePayNow = () => {
    // Handle payment logic here
    console.log("Processing payment...");
    router.push(`/package/${packageId}`);
  };

  const platformFee = 20000;

  if (!bookingData) {
    return (
      <div className="bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Main Content */}
      <div className="px-4">
        {/* Reservation Status */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">
            {t("booking.paymentTitle")}
          </h1>
          <p className="text-gray-300 text-sm mb-1">
            {t("booking.delayNotice")}
          </p>
          <p className="text-gray-300 text-sm mb-6">
            {t("booking.realTimeUpdate")}
          </p>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-xs text-gray-400 mb-2">
              <span className={currentStep >= 1 ? "text-pink-400" : ""}>
                {t("booking.sending")}
              </span>
              <span className={currentStep >= 2 ? "text-pink-400" : ""}>
                {t("booking.processing")}
              </span>
              <span className={currentStep >= 3 ? "text-pink-400" : ""}>
                {t("booking.accepted")}
              </span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-1">
              <div
                className="bg-gradient-to-r from-pink-500 to-pink-400 h-1 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${(currentStep / 3) * 100}%` }}
              ></div>
            </div>
          </div>

          <p className="text-sm text-gray-300 mb-4">
            {t("booking.updateWithin")}
          </p>
        </div>

        {/* Order Status */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">{t("booking.orderStatus")}</h2>
          <div className="space-y-4">
            {bookingData.components.map(component => (
              <div key={component.id} className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Image
                    src="/dummy-profile.png"
                    alt={component.title}
                    width={40}
                    height={40}
                    className="rounded-lg object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white">
                    {component.title}
                  </h3>
                  <p className="text-sm text-gray-400">{component.location}</p>
                </div>
                <Badge
                  variant={
                    component.status === "accepted" ? "default" : "secondary"
                  }
                  className={
                    component.status === "accepted"
                      ? "bg-pink-500 text-white"
                      : "bg-gray-700 text-gray-300"
                  }
                >
                  {component.status === "accepted"
                    ? t("booking.accepted")
                    : t("booking.pending")}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Package Details */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4 cursor-pointer">
            <h2 className="text-xl font-bold">{t("booking.packageDetails")}</h2>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M4 6L8 10L12 6"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div className="bg-gray-900 rounded-lg p-4">
            <div className="mb-4">
              <h3 className="font-semibold mb-3">
                {t("booking.package")}: {bookingData.packageTitle}
              </h3>
            </div>

            <div className="space-y-3">
              {bookingData.components.map(component => (
                <div key={component.id} className="flex justify-between">
                  <span className="text-gray-300">{component.title}</span>
                  <span className="text-white font-medium">
                    ₩{component.price.toLocaleString()}
                  </span>
                </div>
              ))}
              <div className="flex justify-between">
                <span className="text-gray-300">
                  {t("booking.platformFee")}
                </span>
                <span className="text-white font-medium">
                  ₩{platformFee.toLocaleString()}
                </span>
              </div>

              <div className="border-t border-gray-700 pt-3">
                <div className="flex justify-between font-bold text-lg">
                  <span>{t("booking.total")}</span>
                  <span>₩{bookingData.totalPrice.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Date */}
        <div>
          <h2 className="text-xl font-bold mb-4">{t("booking.bookingDate")}</h2>
          <div className="bg-gray-900 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-white font-medium">{t("booking.date")}</p>
                <p className="text-gray-400 text-sm">
                  {bookingData.selectedDate}
                </p>
              </div>
              <div>
                <p className="text-white font-medium">{t("booking.time")}</p>
                <p className="text-gray-400 text-sm">
                  {bookingData.selectedTime}
                </p>
              </div>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M6 3L10 8L6 13"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Pay Now Button */}
      <div className="px-4 py-4 bg-black border-t border-gray-800">
        <Button
          className="w-full bg-pink-500 hover:bg-pink-600 h-[52px]"
          onClick={handlePayNow}
        >
          <span className="font-medium">{t("booking.payNow")}</span>
        </Button>
      </div>
    </div>
  );
}
