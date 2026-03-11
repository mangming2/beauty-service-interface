"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { GapY } from "@/components/ui/gap";
import {
  useProductDetail,
  useProductOptions,
} from "@/queries/useProductQueries";
import { useOptionDetail } from "@/queries/useOptionQueries";
import { LocationIcon } from "@/components/common/Icons";
import { notFound } from "next/navigation";
import Link from "next/link";
import { useTranslation } from "@/hooks/useTranslation";

const PLACEHOLDER_IMAGE = "/dummy-profile.png";

export default function BookingConfirmPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const { t } = useTranslation();
  const packageId = Number(params.id);
  const optionIdFromQuery = Number(searchParams.get("optionId"));
  const optionId =
    Number.isFinite(optionIdFromQuery) && optionIdFromQuery > 0
      ? optionIdFromQuery
      : undefined;

  const [savedDate, setSavedDate] = useState<string>("");
  const [savedTime, setSavedTime] = useState<string>("");

  const isValidId = !isNaN(packageId) && packageId > 0;
  const { data: productDetail, isLoading } = useProductDetail(
    isValidId ? packageId : undefined
  );
  const { data: options = [] } = useProductOptions(
    isValidId ? packageId : undefined
  );
  const resolvedOptionId = optionId ?? options[0]?.id ?? undefined;
  const { data: optionDetail } = useOptionDetail(resolvedOptionId);

  useEffect(() => {
    const date = localStorage.getItem("selectedBookingDate");
    const time = localStorage.getItem("selectedBookingTime");
    if (date) {
      try {
        const d = new Date(date);
        setSavedDate(
          `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`
        );
      } catch {
        setSavedDate("");
      }
    }
    if (time) setSavedTime(time);
  }, []);

  if (!isValidId) {
    notFound();
  }

  if (isLoading) {
    return (
      <div className="bg-black text-white flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-pink-500" />
      </div>
    );
  }

  if (!productDetail) {
    notFound();
  }

  const firstOption = options[0];
  const currentOption = optionDetail ?? {
    id: firstOption?.id ?? 0,
    name: firstOption?.name ?? productDetail.name,
    description: firstOption?.description ?? "",
    price: firstOption?.price ?? 0,
    address: firstOption?.address ?? "",
    discountRate: firstOption?.discountRate ?? 0,
    bookingGuide: "",
    regularClosingDay: null,
    imageUrls: firstOption?.imageUrl ? [firstOption.imageUrl] : [],
  };

  const optionImageUrl = currentOption.imageUrls?.[0] ?? PLACEHOLDER_IMAGE;

  const dateTimeDisplay =
    savedDate && savedTime ? `${savedDate} ${savedTime}` : "—";

  return (
    <div className="bg-background text-white px-5 pt-6 pb-5 flex flex-col flex-1">
      <h1 className="title-lg text-white">{t("bookingPage.orderStatus")}</h1>
      <GapY size={8} />
      <p className="text-md text-gray-font">
        {t("bookingPage.proceedByVendor")}
      </p>
      <p className="text-md text-gray-font">{t("bookingPage.modifyAnytime")}</p>
      <GapY size={20} />

      <div className="rounded-[12px] bg-gray-container border border-[#2E3033] p-3 flex gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded caption-sm bg-primary text-white">
              {t("bookingPage.featured")}
            </span>
            {firstOption?.optionTags?.length ? (
              <span className="text-white text-xs truncate">
                {(firstOption.optionTags ?? [])
                  .slice(0, 2)
                  .map(tag => `#${tag}`)
                  .join(" ")}
              </span>
            ) : null}
          </div>
          <h2 className="text-lg font-semibold text-white leading-tight truncate">
            {currentOption.name}
          </h2>
          <div className="flex items-center gap-1 mt-1">
            <LocationIcon width={14} height={14} color="#ABA9A9" />
            <p className="text-[#A9A9AA] text-xs truncate">
              {currentOption.address}
            </p>
          </div>
          <p className="text-pink-font text-base font-semibold mt-2">
            {currentOption.discountRate > 0
              ? `${currentOption.discountRate}% `
              : ""}
            ₩{currentOption.price.toLocaleString()}
          </p>
        </div>
        <div className="relative w-[108px] h-[108px] flex-shrink-0 rounded-[4px] overflow-hidden">
          <Image
            src={optionImageUrl}
            alt={currentOption.name}
            fill
            className="object-cover"
            unoptimized={optionImageUrl.startsWith("http")}
          />
        </div>
      </div>

      <GapY size={24} />

      <h2 className="title-md text-white">{t("package.packageDetails")}</h2>
      <GapY size={12} />
      <div className="rounded-[12px] p-4 space-y-3">
        <div className="flex justify-between items-center text-md text-gray-font">
          <span>{t("bookingPage.dateTime")}</span>
          <span>{dateTimeDisplay}</span>
        </div>
        <div className="flex justify-between items-center text-md text-gray-font">
          <span>{t("bookingPage.totalFee")}</span>
          <span>₩{currentOption.price.toLocaleString()}</span>
        </div>
      </div>

      <div className="mt-auto">
        <Link href="/my">
          <Button className="w-full h-[52px] bg-primary">
            <span className="text-lg">{t("bookingPage.save")}</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
