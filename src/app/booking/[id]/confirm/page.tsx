"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Divider } from "@/components/ui/divider";
import Image from "next/image";
import { GapY } from "@/components/ui/gap";
import {
  useProductDetail,
  useProductOptions,
  useProducts,
} from "@/queries/useProductQueries";
import { useOptionDetail } from "@/queries/useOptionQueries";
import { useCreateReservation } from "@/queries/useReservationQueries";
import { LocationIcon, ArrowRightIcon } from "@/components/common/Icons";
import { notFound } from "next/navigation";
import Link from "next/link";
import { useTranslation } from "@/hooks/useTranslation";
import { getSafeImageSrc } from "@/lib/utils";

export default function BookingConfirmPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { t } = useTranslation();
  const reservationCreated = useRef(false);
  const packageId = Number(params.id);
  const optionIdFromQuery = Number(searchParams.get("optionId"));
  const optionId =
    Number.isFinite(optionIdFromQuery) && optionIdFromQuery > 0
      ? optionIdFromQuery
      : undefined;

  const [savedDate, setSavedDate] = useState<string>("");
  const [savedTime, setSavedTime] = useState<string>("");
  const [savedSlotId, setSavedSlotId] = useState<number | null>(null);

  const isValidId = !isNaN(packageId) && packageId > 0;
  const { data: productDetail, isLoading } = useProductDetail(
    isValidId ? packageId : undefined
  );
  const { data: options = [] } = useProductOptions(
    isValidId ? packageId : undefined
  );
  const resolvedOptionId = optionId ?? options[0]?.id ?? undefined;
  const { data: optionDetail } = useOptionDetail(resolvedOptionId);
  const { data: allProducts = [] } = useProducts({ is_random: true, size: 8 });
  const createReservationMutation = useCreateReservation();

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
    const slotId = localStorage.getItem("selectedReservationSlotId");
    if (slotId) {
      const parsed = parseInt(slotId, 10);
      if (Number.isFinite(parsed) && parsed > 0) setSavedSlotId(parsed);
    }
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

  const optionImageUrl = getSafeImageSrc(currentOption.imageUrls?.[0]);
  const packageImageUrl = getSafeImageSrc(productDetail.imageUrls?.[0]);

  const dateTimeDisplay =
    savedDate && savedTime ? `${savedDate} ${savedTime}` : "—";

  const otherOptions = options.filter(opt => opt.id !== resolvedOptionId);
  const recommendedProducts = allProducts
    .filter(p => p.id !== packageId)
    .slice(0, 6);

  return (
    <div className="bg-background text-white flex flex-col flex-1">
      <section className="px-5 pt-6 pb-6">
        <h1 className="title-lg text-white">{t("bookingPage.orderStatus")}</h1>
        <GapY size={8} />
        <p className="text-md text-gray-font">
          {t("bookingPage.proceedByVendor")}
        </p>
        <p className="text-md text-gray-font">
          {t("bookingPage.modifyAnytime")}
        </p>
        <GapY size={20} />

        {/* 현재 예약 옵션 카드 */}
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
            <h2 className="text-lg text-white">{currentOption.name}</h2>
            <div className="flex items-center gap-1 mt-1">
              <LocationIcon width={14} height={14} color="#ABA9A9" />
              <p className="text-[#A9A9AA] text-xs truncate">
                {currentOption.address}
              </p>
            </div>
            <p className="text-pink-font text-md mt-1">
              {currentOption.discountRate > 0
                ? `${currentOption.discountRate}% `
                : ""}
            </p>
            <p className="text-md text-white mt-1 ">
              ₩{currentOption.price.toLocaleString()}
            </p>
          </div>
          <div className="relative w-[92px] h-[92px] flex-shrink-0 rounded-[4px] overflow-hidden">
            <Image
              src={optionImageUrl}
              alt={currentOption.name}
              fill
              className="object-cover"
              unoptimized={optionImageUrl.startsWith("http")}
            />
          </div>
        </div>
      </section>

      <Divider height={8} className="bg-gray-container" />

      <section className="px-5 pt-6 pb-6">
        {/* 패키지 상세 */}
        <h2 className="title-md text-white">{t("package.packageDetails")}</h2>
        {productDetail.description && (
          <p className="text-md text-gray-font mt-1">
            {productDetail.description}
          </p>
        )}
        <GapY size={12} />
        <Link
          href={`/package/${packageId}${resolvedOptionId ? `/${resolvedOptionId}` : ""}`}
          className="block rounded-[12px] bg-gray-container border border-[#2E3033] overflow-hidden"
        >
          <div className="flex items-center gap-3 p-3">
            <div className="relative w-[80px] h-[80px] flex-shrink-0 rounded-lg overflow-hidden">
              <Image
                src={packageImageUrl}
                alt={productDetail.name}
                fill
                className="object-cover"
                unoptimized={packageImageUrl.startsWith("http")}
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-bold text-lg truncate">
                {productDetail.name}
              </h3>
              <div className="flex items-center gap-1 mt-1">
                <LocationIcon width={14} height={14} color="#A9A9AA" />
                <p className="text-gray-400 text-sm truncate">
                  {currentOption.address || productDetail.address}
                </p>
              </div>
            </div>
            <ArrowRightIcon
              color="#B9BBC2"
              width={8}
              height={16}
              className="flex-shrink-0"
            />
          </div>
        </Link>
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
      </section>

      {(otherOptions.length > 0 || recommendedProducts.length > 0) && (
        <Divider height={8} className="bg-gray-container" />
      )}

      {/* 다른 옵션 예약 */}
      {otherOptions.length > 0 && (
        <section className="px-5 pt-6 pb-6">
          <h2 className="title-md text-white">
            {t("bookingPage.bookOtherOptions")}
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            {t("bookingPage.bookOtherOptionsSubtitle")}
          </p>
          <GapY size={12} />
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-5 px-5 scrollbar-hide">
            {otherOptions.map(opt => {
              const imgSrc = getSafeImageSrc(opt.imageUrl);
              return (
                <Link
                  key={opt.id}
                  href={`/package/${packageId}/${opt.id}`}
                  className="flex-shrink-0 w-[168px]"
                >
                  <div className="relative size-[168px] overflow-hidden rounded-t-xl">
                    <Image
                      src={imgSrc}
                      alt={opt.name}
                      fill
                      className="object-cover"
                      unoptimized={imgSrc.startsWith("http")}
                    />
                  </div>
                  <div className="pt-2">
                    {opt.optionTags?.length ? (
                      <p className="text-gray-400 text-xs truncate mb-0.5">
                        {opt.optionTags
                          .slice(0, 2)
                          .map(tag => `#${tag}`)
                          .join(" ")}
                      </p>
                    ) : null}
                    <p className="text-white font-bold text-md truncate">
                      {opt.name}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {otherOptions.length > 0 && recommendedProducts.length > 0 && (
        <Divider height={8} className="bg-gray-container" />
      )}

      {/* 추천 패키지 */}
      {recommendedProducts.length > 0 && (
        <section className="px-5 pt-6 pb-6">
          <h2 className="title-md text-white">
            {t("bookingPage.recommendedForYou")}
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            {t("bookingPage.recommendedForYouSubtitle")}
          </p>
          <GapY size={12} />
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-5 px-5 scrollbar-hide">
            {recommendedProducts.map(product => {
              const imgSrc = getSafeImageSrc(
                product.imageUrls?.[0] ??
                  product.representOption?.imageUrls?.[0]
              );
              const tags = product.representOption?.tags ?? [];
              return (
                <Link
                  key={product.id}
                  href={`/package/${product.id}`}
                  className="flex-shrink-0 w-[168px]"
                >
                  <div className="relative size-[168px] overflow-hidden rounded-t-xl">
                    <Image
                      src={imgSrc}
                      alt={product.name}
                      fill
                      className="object-cover"
                      unoptimized={imgSrc.startsWith("http")}
                    />
                  </div>
                  <div className="pt-2">
                    {tags.length > 0 ? (
                      <p className="text-gray-400 text-xs truncate mb-0.5">
                        {tags
                          .slice(0, 2)
                          .map(tag => `#${tag}`)
                          .join(" ")}
                      </p>
                    ) : null}
                    <p className="text-white font-bold text-md truncate">
                      {product.name}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* 플로팅 확인 버튼 */}
      <div
        className="sticky bottom-0 py-4 px-5 bg-background"
        style={{ boxShadow: "inset 0 6px 6px -6px rgba(255, 255, 255, 0.12)" }}
      >
        <Button
          className="w-full h-[52px] bg-primary"
          disabled={createReservationMutation.isPending}
          onClick={async () => {
            if (reservationCreated.current) {
              router.push("/my");
              return;
            }
            if (savedSlotId ?? resolvedOptionId) {
              try {
                await createReservationMutation.mutateAsync({
                  productId: packageId,
                  request: {
                    reservationSlotId: savedSlotId ?? resolvedOptionId!,
                    totalPrice: currentOption.price,
                  },
                });
                reservationCreated.current = true;
              } catch (error) {
                console.error("예약 생성 실패:", error);
              }
            }
            router.push("/my");
          }}
        >
          <span className="text-lg">
            {createReservationMutation.isPending
              ? t("bookingPage.loading")
              : t("bookingPage.confirm")}
          </span>
        </Button>
      </div>
    </div>
  );
}
