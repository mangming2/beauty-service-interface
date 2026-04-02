"use client";

import { useParams, useRouter } from "next/navigation";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/useTranslation";
import { useState } from "react";
import Image from "next/image";
import { ArrowRightIcon, LocationIcon } from "@/components/common/Icons";
import Link from "next/link";
import { Divider } from "@/components/ui/divider";
import { useBookingDetail } from "@/queries/useMyPageQueries";
import { useProductOptions } from "@/queries/useProductQueries";

const PLACEHOLDER_IMAGE = "/dummy-logo.png";
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
  const { data: options = [] } = useProductOptions(booking?.product?.id);

  const [currentStep] = useState(2); // 1=PreBook, 2=Booking, 3=Completed

  const components = options.map(opt => ({
    id: String(opt.id),
    title: opt.name,
    location: opt.address,
    price: opt.price,
    imageSrc: opt.imageUrl ?? PLACEHOLDER_IMAGE,
  }));

  const handleSave = () => {
    if (booking) {
      router.push(`/my/reviews/${booking.product.id}`);
    }
  };

  if (!isValidId || bookingLoading) {
    return (
      <div className="bg-black text-white flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-500 mx-auto mb-4" />
          <p className="text-gray-300">{t("bookingPage.loading")}</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    notFound();
  }

  const steps = [
    t("booking.stepPreBook"),
    t("booking.stepBooking"),
    t("booking.stepCompleted"),
  ];

  const totalPrice =
    components.reduce((sum, c) => sum + c.price, 0) + platformFee;

  return (
    <div className="min-h-screen bg-background text-white pb-24">
      <div>
        {/* 헤더 영역 */}
        <div className="flex flex-col p-5 gap-4">
          <div className="title-lg">{t("bookingPage.bookingDetail")}</div>

          <Link
            href={`/package/${booking.product.id}`}
            className="flex justify-between items-center"
          >
            <div className="title-sm text-white">
              Package: {booking.product.name}
            </div>
            <div className="w-6 flex justify-center items-center">
              <ArrowRightIcon color="white" width={7} height={16} />
            </div>
          </Link>

          {/* 진행 상태 바 */}
          <div>
            <div className="flex justify-between text-xs mb-2">
              {steps.map((label, i) => (
                <span
                  key={label}
                  className={
                    i + 1 === currentStep
                      ? "text-white font-semibold"
                      : i + 1 < currentStep
                        ? "text-white"
                        : "text-gray-500"
                  }
                >
                  {label}
                </span>
              ))}
            </div>
            <div className="relative w-full h-[6px] rounded-full bg-gray-700 overflow-hidden">
              <div
                className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-pink-500 to-pink-300"
                style={{
                  width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>

        <Divider height={8} className="bg-gray-container" />

        {/* Order Status */}
        <div className="flex flex-col p-5">
          <div className="flex flex-col gap-1 mb-3">
            <div className="title-lg font-bold">
              {t("bookingPage.orderStatus")}
            </div>
            <p className="text-gray-300 text-md">
              {t("bookingPage.proceedByVendor")}
            </p>
            <p className="text-gray-300 text-md">
              {t("bookingPage.modifyAnytime")}
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {components.map(component => {
              const vendor =
                component.location.split(" (")[0] || component.location;
              return (
                <Link
                  href={`/package/${booking.product.id}/${component.id}`}
                  key={component.id}
                >
                  <div className="flex items-center gap-3 bg-gray-container border border-[#2E3033] rounded-[8px] p-3 cursor-pointer">
                    <div className="relative w-24 h-24 overflow-hidden rounded-md flex-shrink-0">
                      <Image
                        src={component.imageSrc}
                        alt={component.title}
                        fill
                        className="object-cover"
                        unoptimized={component.imageSrc.startsWith("http")}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white text-[18px] leading-6 truncate">
                        {component.title}
                      </h3>
                      <div className="mt-1 flex items-center text-sm text-gray-400 gap-2">
                        <span className="inline-flex items-center gap-1">
                          <LocationIcon
                            width={11}
                            height={13}
                            color="#ABA9A9"
                          />
                          <p className="text-gray-400 text-sm truncate max-w-[100px]">
                            {vendor}
                          </p>
                        </span>
                        <span className="opacity-60">·</span>
                        <span className="text-pink-font text-sm">
                          {t("bookingPage.preBook")}
                        </span>
                      </div>
                      <div className="mt-2">
                        <p className="text-white text-sm">
                          {t("bookingPage.bookingGuide")}
                        </p>
                        <p className="text-gray-400 text-sm">
                          · {t("bookingPage.reserveThroughWebsite")}
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

        {/* 결제 정보 */}
        <div className="flex flex-col gap-3 p-5 bg-background">
          <h2 className="text-xl font-bold">{t("bookingPage.paymentInfo")}</h2>

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
              <span className="text-gray-300">{t("booking.platformFee")}</span>
              <span className="text-white font-medium">
                ₩{platformFee.toLocaleString()}
              </span>
            </div>

            <div className="border-t border-gray-700 pt-3">
              <div className="flex justify-between font-bold text-lg">
                <span>{t("booking.total")}</span>
                <span>₩{totalPrice.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="sticky bottom-0 py-4 px-5 bg-background"
        style={{ boxShadow: "inset 0 6px 6px -6px rgba(255, 255, 255, 0.12)" }}
      >
        <Button className="w-full h-[52px] bg-primary" onClick={handleSave}>
          <span className="text-lg">{t("bookingPage.goToReview")}</span>
        </Button>
      </div>
    </div>
  );
}
