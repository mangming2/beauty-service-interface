"use client";

import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/useTranslation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { GapY } from "../../../../components/ui/gap";
import { ArrowRightIcon, LocationIcon } from "@/components/common/Icons";

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
  makeOverDateTime: Date;
  dokiDebutDateTime: Date;
}

const getBookingData = (packageId: string): BookingData => {
  const makeOverDate = new Date(2025, 6, 21, 10, 0); // July 21, 2025, 10:00 AM
  const dokiDebutDate = new Date(2025, 6, 21, 14, 0); // July 21, 2025, 2:00 PM

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
    makeOverDateTime: makeOverDate,
    dokiDebutDateTime: dokiDebutDate,
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
    router.push(`/booking/${packageId}/done`);
  };

  const handleOrderLink = () => {
    router.push(`/booking/${packageId}/booking-link`);
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
    <div className="min-h-screen bg-gray-container text-white">
      {/* Main Content */}
      <div>
        {/* Reservation Status */}
        <div className="flex flex-col gap-[27px] p-5 bg-background">
          <div>
            <span className="title-lg font-bold">Booking Status</span>
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
        <div className="flex flex-col gap-3 p-5 bg-background">
          <div className="flex flex-col gap-1">
            <span className="title-lg font-bold">
              {t("booking.orderStatus")}
            </span>
            <p className="text-gray-300 text-md">
              Please proceed with reservations by vendor.
            </p>
            <p className="text-gray-300 text-md">
              You can modify your reservation status anytime later.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            {bookingData.components.map(component => {
              const imageSrc =
                component.id === "debut"
                  ? "/dummy-profile.png"
                  : "/dummy-profile.png";
              const guideTitle = "Booking Guide";
              const guideDetail =
                component.id === "debut"
                  ? "· Reserve through the official website"
                  : "· 1:1 Inquiry via WeChat";
              const vendor = component.location.split(" (")[0];
              return (
                <div
                  key={component.id}
                  className="flex items-center gap-3 bg-gray-container rounded-lg p-3"
                >
                  <div className="relative w-24 h-24 overflow-hidden rounded-md flex-shrink-0">
                    <Image
                      src={imageSrc}
                      alt={component.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white text-[18px] leading-6 truncate">
                      {component.title}
                    </h3>
                    <div className="mt-1 flex items-center text-sm text-gray-400 gap-2">
                      <span className="inline-flex items-center gap-1">
                        <LocationIcon width={14} height={14} color="#9CA3AF" />
                        <span className="truncate">{vendor}</span>
                      </span>
                      <span className="opacity-60">·</span>
                      <span className="text-pink-400">PreBook</span>
                    </div>
                    <div className="mt-3">
                      <p className="text-gray-300 text-sm">{guideTitle}</p>
                      <p className="text-gray-300 text-sm">{guideDetail}</p>
                    </div>
                  </div>
                  <ArrowRightIcon color="white" onClick={handleOrderLink} />
                </div>
              );
            })}
          </div>
        </div>
        <GapY size={8} />
        {/* Package Details */}
        <div className="flex flex-col gap-3 p-5 bg-background">
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
