"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { GapY } from "@/components/ui/gap";
import { useProductDetail } from "@/queries/useProductQueries";
import { useOptionDetail } from "@/queries/useOptionQueries";
import { LocationIcon } from "@/components/common/Icons";
import { notFound } from "next/navigation";

const PLACEHOLDER_IMAGE = "/dummy-profile.png";

export default function BookingConfirmPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
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
  const resolvedOptionId =
    optionId ?? productDetail?.options[0]?.id ?? undefined;
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

  const currentOption = optionDetail ?? {
    id: productDetail.options[0]?.id ?? 0,
    name: productDetail.options[0]?.name ?? productDetail.name,
    price: productDetail.options[0]?.price ?? productDetail.minPrice,
    location: productDetail.options[0]?.location ?? "",
  };

  const handleSave = () => {
    router.push("/my");
  };

  const dateTimeDisplay =
    savedDate && savedTime ? `${savedDate} ${savedTime}` : "—";

  return (
    <div className="min-h-screen bg-background text-white px-5 pt-6 pb-8 flex flex-col">
      <h1 className="title-lg text-white">Order Status</h1>
      <GapY size={8} />
      <p className="text-sm text-gray-400">
        Please proceed with reservations by vendor.
      </p>
      <p className="text-sm text-gray-400">
        You can modify your reservation status anytime later.
      </p>
      <GapY size={20} />

      <div className="rounded-[12px] bg-gray-container border border-[#2E3033] p-3 flex gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-xs font-medium bg-pink-500/20 text-pink-font">
              Featured
            </span>
            {productDetail.tagNames?.length ? (
              <span className="text-white text-xs truncate">
                {(productDetail.tagNames ?? [])
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
              {currentOption.location}
            </p>
          </div>
          <p className="text-pink-font text-base font-semibold mt-2">
            20% ₩{currentOption.price.toLocaleString()}
          </p>
        </div>
        <div className="relative w-[108px] h-[108px] flex-shrink-0 rounded-[4px] overflow-hidden">
          <Image
            src={PLACEHOLDER_IMAGE}
            alt={currentOption.name}
            fill
            className="object-cover"
          />
        </div>
      </div>

      <GapY size={24} />

      <h2 className="title-md text-white">Package Details</h2>
      <GapY size={12} />
      <div className="rounded-[12px] bg-gray-container border border-[#2E3033] p-4 space-y-3">
        <div className="flex justify-between items-center text-sm">
          <span className="text-white">Date & Time</span>
          <span className="text-gray-300">{dateTimeDisplay}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-white">Total Fee</span>
          <span className="text-white font-medium">
            ₩{currentOption.price.toLocaleString()}
          </span>
        </div>
      </div>

      <div className="mt-auto pt-8">
        <Button
          className="w-full h-[52px] text-lg font-semibold bg-pink-font hover:bg-pink-600"
          onClick={handleSave}
        >
          Save
        </Button>
      </div>
    </div>
  );
}
