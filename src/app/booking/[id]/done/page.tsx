"use client";

import { useParams, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { GapY } from "@/components/ui/gap";
import LottieAnimation from "@/components/common/LottieAnimation";
import { useTranslation } from "@/hooks/useTranslation";

export default function BookingDonePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const { t } = useTranslation();
  const packageId = params.id as string;
  const optionId = searchParams.get("optionId");
  const confirmHref =
    optionId && packageId
      ? `/booking/${packageId}/confirm?optionId=${optionId}`
      : "/my";

  return (
    <div className="px-5 text-white bg-transparent flex flex-col flex-1 ">
      <GapY size={40} />
      <div className="flex flex-col title-lg text-white ">
        {t("bookingPage.reservationCompleted")}
      </div>
      <GapY size={13} />
      <div className="title-sm">{t("bookingPage.needHelp")}</div>

      <div className="self-center my-auto flex flex-col items-center justify-center">
        <LottieAnimation
          src="/check.lottie"
          width={177}
          height={177}
          loop={false}
        />
      </div>

      <div className="w-[364px] px-4 py-5 rounded-[4px] bg-white/5 text-center">
        <p className="text-lg ">{t("bookingPage.issueWithBooking")}</p>
        <p className="mt-2 text-sm ">{t("bookingPage.noLocalPhone")}</p>
      </div>

      <div className="mt-[33px] py-4">
        <Link href={confirmHref}>
          <Button className="w-full h-[52px]">
            <span className="text-lg">{t("bookingPage.next")}</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
