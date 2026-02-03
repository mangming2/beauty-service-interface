"use client";

import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/useTranslation";
import Image from "next/image";
import { GapY } from "../../../../components/ui/gap";
import { ArrowRightIcon, LocationIcon } from "@/components/common/Icons";
import Link from "next/link";
import { Divider } from "@/components/ui/divider";
import { useProductDetail } from "@/queries/useProductQueries";
import { notFound } from "next/navigation";

const PLACEHOLDER_IMAGE = "/dummy-profile.png";
const platformFee = 20000;

export default function BookingCheckPage() {
  const params = useParams();
  const { t } = useTranslation();
  const router = useRouter();
  const packageId = Number(params.id);
  const isValidId = !isNaN(packageId) && packageId > 0;

  const { data: productDetail, isLoading: productLoading } = useProductDetail(
    isValidId ? packageId : undefined
  );

  const currentStep = 1;

  const components =
    productDetail?.options.map(opt => ({
      id: String(opt.id),
      title: opt.name,
      location: opt.location,
      price: opt.price,
    })) ?? [];

  const handleSave = () => {
    router.push(`/booking/${packageId}/done`);
  };

  if (!isValidId) {
    notFound();
  }

  if (productLoading) {
    return (
      <div className="bg-black text-white flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-500 mx-auto mb-4" />
          <p className="text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  if (!productDetail) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background text-white">
      <div>
        <div className="flex flex-col p-5">
          <div className="flex flex-col gap-1">
            <div className="title-lg font-bold">Booking Status</div>
            <div className="flex flex-col h-10">
              <p className="text-gray-300 text-md">
                {t("booking.delayNotice")}
              </p>
              <p className="text-gray-300 text-md">
                {t("booking.realTimeUpdate")}
              </p>
            </div>
          </div>

          <GapY size={16} />

          <div>
            <div className="flex px-9 justify-between caption-sm text-white">
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
            <div className="w-full bg-gray-font rounded-full my-1 h-[6px]">
              <div
                className="bg-gradient-to-r from-pink-500 to-pink-400 h-[6px] rounded-full"
                style={{ width: `${(currentStep / 3) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <Divider height={8} className="bg-gray-container" />

        <div className="flex flex-col p-5">
          <div className="flex flex-col gap-1">
            <div className="h-8 title-sm">Order Status</div>
            <div className="flex flex-col h-10">
              <p className="text-gray-font text-md">
                Please proceed with reservations by vendor.
              </p>
              <p className="text-gray-font text-md">You can modify later.</p>
            </div>
          </div>

          <GapY size={12} />

          <div className="flex flex-col gap-3">
            {components.map(component => {
              const vendor =
                component.location.split(" (")[0] || component.location;
              return (
                <Link
                  href={`/booking/${packageId}/booking-link`}
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
            <h2 className="title-sm">{t("booking.packageDetails")}</h2>
          </div>

          <div>
            <div className="flex justify-between items-center">
              <h3 className="text-lg text-gray-font">
                {t("booking.package")}: {productDetail.name}
              </h3>
              <div className="flex w-7 items-center justify-center">
                <Link href={`/booking/${packageId}/package-details`}>
                  <ArrowRightIcon
                    className="cursor-pointer"
                    width={7}
                    height={16}
                    color="#D2D3D3"
                  />
                </Link>
              </div>
            </div>

            <GapY size={17} />

            <div className="space-y-3">
              {components.map(component => (
                <div key={component.id} className="flex justify-between">
                  <span className="text-gray-font">{component.title}</span>
                  <span className="text-gray-font font-medium">
                    ₩{component.price.toLocaleString()}
                  </span>
                </div>
              ))}
              <div className="flex justify-between">
                <span className="text-gray-font">
                  {t("booking.platformFee")}
                </span>
                <span className="text-gray-font font-medium">
                  ₩{platformFee.toLocaleString()}
                </span>
              </div>

              <div className="border-t border-gray-700 pt-3">
                <div className="flex justify-between font-bold text-lg">
                  <span>{t("booking.total")}</span>
                  <span>₩{productDetail.totalPrice.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-4 bg-transparent">
        <Button className="w-full h-[52px] bg-primary" onClick={handleSave}>
          <span className="text-lg">Save</span>
        </Button>
      </div>
    </div>
  );
}
