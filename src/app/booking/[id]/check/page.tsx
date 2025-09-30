"use client";

import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/hooks/useTranslation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { GapY } from "../../../../components/ui/gap";
import DokiDebut from "@/assets/3d-images/doki-debut.png";
import MakeOver from "@/assets/3d-images/make-over.png";
import { ArrowRightIcon } from "@/components/common/Icons";

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

  const handleSave = () => {
    router.push(`/booking/${packageId}/complete`);
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
    <div className="min-h-screen text-white">
      {/* Main Content */}
      <div>
        {/* Reservation Status */}
        <div className="flex flex-col gap-[27px] p-5 bg-gray-container">
          <div>
            <span className="title-lg font-bold">
              {t("booking.paymentTitle")}
            </span>
            <p className="text-gray-300 text-md">{t("booking.delayNotice")}</p>
            <p className="text-gray-300 text-md">
              {t("booking.realTimeUpdate")}
            </p>
          </div>

          {/* Progress Bar */}
          <div>
            <div className="flex justify-between text-xs text-gray-400">
              <span className={currentStep >= 1 ? "text-white" : ""}>
                {t("booking.sending")}
              </span>
              <span className={currentStep >= 2 ? "text-white" : ""}>
                {t("booking.processing")}
              </span>
              <span className={currentStep >= 3 ? "text-white" : ""}>
                {t("booking.accepted")}
              </span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-1">
              <div
                className="bg-gradient-to-r from-pink-500 to-pink-400 h-[6px] rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${(currentStep / 3) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        <GapY size={8} />

        {/* Order Status */}
        <div className="flex flex-col gap-3 py-3 px-5 bg-gray-container">
          <span className="title-lg font-bold">{t("booking.orderStatus")}</span>
          <p className="text-gray-300 text-md">
            Please proceed with reservations by vendor.
          </p>
          <p className="text-gray-300 text-md">
            You can modify your reservation status anytime later.
          </p>

          <div className="flex flex-col gap-1">
            {bookingData.components.map(component => (
              <div key={component.id} className="flex items-center gap-2">
                <div className="w-12 h-12 bg-gray rounded-full flex items-center justify-center flex-shrink-0">
                  <Image
                    src={component.id === "debut" ? DokiDebut : MakeOver}
                    alt={component.title}
                    width={component.id === "debut" ? 11 : 24}
                    height={component.id === "debut" ? 24 : 22}
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white">
                    {component.title}
                  </h3>
                  <p className="text-sm text-gray-400">{component.location}</p>
                </div>
                <Badge disabled={component.status === "accepted"}>
                  {component.status === "accepted"
                    ? t("booking.accepted")
                    : t("booking.pending")}
                </Badge>
              </div>
            ))}
          </div>
        </div>
        <GapY size={8} />

        {/* Booking Date */}
        <div className="flex flex-col gap-3 py-3 px-5 bg-gray-container">
          <div className="flex flex-col gap-1">
            <span className="title-md font-bold">
              {t("booking.bookingDate")}
            </span>
            <p className="text-gray-300 text-md">
              You can tap to edit the date and time.
            </p>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex gap-3 items-center">
              <div className="flex gap-2 items-center">
                <span className="text-white font-medium">
                  {t("booking.date")}
                </span>
                <span className="text-gray-400 text-sm">
                  {bookingData.selectedDate}
                </span>
              </div>
              <div className="flex gap-2 items-center">
                <span className="text-white font-medium">
                  {t("booking.time")}
                </span>
                <span className="text-gray-400 text-sm">
                  {bookingData.selectedTime}
                </span>
              </div>
            </div>
            <ArrowRightIcon color="white" />
          </div>
        </div>

        <GapY size={8} />

        {/* Package Details */}
        <div className="flex flex-col gap-3 py-3 px-5 bg-gray-container">
          <div className="flex items-center justify-between cursor-pointer">
            <h2 className="text-xl font-bold">{t("booking.packageDetails")}</h2>
          </div>

          <div>
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">
                {t("booking.package")}: {bookingData.packageTitle}
              </h3>
              <ArrowRightIcon color="white" />
            </div>

            <GapY size={17} />

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
      </div>

      {/* Save Button */}
      <div className="px-4 py-4">
        <Button className="w-full h-[52px]" onClick={handleSave}>
          <span className="font-medium">Save</span>
        </Button>
      </div>
    </div>
  );
}
