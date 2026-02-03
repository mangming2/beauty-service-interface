"use client";

import { useParams, useRouter } from "next/navigation";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/useTranslation";
import { useState } from "react";
import Image from "next/image";
import { GapY } from "../../../../components/ui/gap";
import { ArrowRightIcon, LocationIcon } from "@/components/common/Icons";
import Link from "next/link";
import { Divider } from "@/components/ui/divider";
import { useBookingDetail } from "@/queries/useMyPageQueries";
import { useProductDetail } from "@/queries/useProductQueries";

const PLACEHOLDER_IMAGE = "/dummy-profile.png";
const platformFee = 20000;

export default function MyBookingPage() {
  const params = useParams();
  const { t } = useTranslation();
  const router = useRouter();
  const reservationId = Number(params.id);
  const isValidId = !isNaN(reservationId) && reservationId > 0;

  const { data: booking, isLoading: bookingLoading } = useBookingDetail(
    isValidId ? reservationId : undefined
  );
  const { data: productDetail } = useProductDetail(booking?.packageId);

  const [currentStep] = useState(2); // Sending, Processing, Accepted

  const components =
    productDetail?.options.map(opt => ({
      id: String(opt.id),
      title: opt.name,
      location: opt.location,
      price: opt.price,
      status: "pending" as const,
    })) ?? [];

  const handleSave = () => {
    if (booking) {
      router.push(`/my/reviews/${booking.packageId}`);
    }
  };

  if (!isValidId || bookingLoading) {
    return (
      <div className="bg-black text-white flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-500 mx-auto mb-4" />
          <p className="text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background text-white">
      <div>
        <div className="flex flex-col p-5 gap-4">
          <div className="title-lg">예약 상세</div>

          <div className="flex justify-between items-center">
            <div className="title-sm text-gray-font">
              Package: {booking.packageName}
            </div>
            <div className="w-6 flex justify-center items-center">
              <ArrowRightIcon color="white" width={7} height={16} />
            </div>
          </div>

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
                className="bg-gradient-to-r from-pink-font to-pink-font h-[6px] rounded-full"
                style={{ width: `${(currentStep / 3) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <GapY size={16} />
        <Divider height={8} className="bg-gray-container" />

        <div className="flex flex-col p-5">
          <div className="flex flex-col gap-1">
            <div className="h-8 title-lg font-bold">Order Status</div>
            <div className="flex flex-col h-10">
              <p className="text-gray-300 text-md">
                Please proceed with reservations by vendor.
              </p>
              <p className="text-gray-300 text-md">You can modify later.</p>
            </div>
          </div>

          <GapY size={12} />

          <div className="flex flex-col gap-3">
            {components.map(component => {
              const vendor =
                component.location.split(" (")[0] || component.location;
              return (
                <Link
                  href={`/booking/${booking.packageId}/booking-link`}
                  key={component.id}
                >
                  <div className="flex items-center gap-3 bg-gray-container rounded-[4px] p-3 cursor-pointer">
                    <div className="relative w-24 h-24 overflow-hidden rounded-md flex-shrink-0">
                      <Image
                        src={PLACEHOLDER_IMAGE}
                        alt={component.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white text-[18px] leading-6 truncate">
                        {component.title}
                      </h3>
                      <div className="mt-1 flex items-center text-sm text-gray-400 gap-3">
                        <span className="inline-flex items-center gap-1">
                          <LocationIcon
                            width={11}
                            height={13}
                            color="#ABA9A9"
                          />
                          <p className="text-gray-400 text-sm">{vendor}</p>
                        </span>
                        <span className="opacity-60">·</span>
                        <span className="text-pink-font">PreBook</span>
                      </div>
                      <div className="mt-3">
                        <p className="text-white text-sm">Booking Guide</p>
                        <p className="text-white text-sm">
                          · Reserve through the official website
                        </p>
                      </div>
                    </div>
                    <ArrowRightIcon width={7} height={16} color="white" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        <Divider height={8} className="bg-gray-container" />

        <div className="flex flex-col gap-3 p-5 bg-background">
          <div className="flex justify-between items-center cursor-pointer">
            <h2 className="text-xl font-bold">{t("booking.packageDetails")}</h2>
          </div>

          <div>
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">
                {t("booking.package")}: {booking.packageName}
              </h3>
              <ArrowRightIcon color="white" />
            </div>

            <GapY size={17} />

            <div className="space-y-3">
              {components.map(component => (
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
                  <span>₩{booking.totalPrice.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="mt-auto p-5"
        style={{ boxShadow: "inset 0 6px 6px -6px rgba(255, 255, 255, 0.12)" }}
      >
        <Button className="w-full h-[52px] bg-primary" onClick={handleSave}>
          <span className="text-lg">Go to Review</span>
        </Button>
      </div>
    </div>
  );
}
