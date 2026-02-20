import { Button } from "../../../../components/ui/button";
import Link from "next/link";
import { GapY } from "../../../../components/ui/gap";
import LottieAnimation from "@/components/common/LottieAnimation";

export default function BookingDonePage() {
  return (
    <div className="px-5 text-white bg-transparent flex flex-col flex-1 ">
      <GapY size={40} />
      <div className="flex flex-col title-lg text-white ">
        Reservation completed?
      </div>
      <GapY size={13} />
      <div className="title-sm">
        If you encountered any issues,
        <br />
        DOKI will be happy to assist you.
      </div>

      <div className="self-center my-auto flex flex-col items-center justify-center">
        <LottieAnimation
          src="/check.lottie"
          width={177}
          height={177}
          loop={false}
        />
      </div>

      <div className="px-4 py-5 rounded-[4px] bg-white/5 text-center">
        <p className="text-lg ">Is there an issue with your booking?</p>
        <p className="mt-2 text-sm ">
          No local phone number or unsure what to choose? We can help.
        </p>
      </div>

      <div className="mt-[33px] py-4">
        <Link href="/my">
          <Button className="w-full h-[52px]">
            <span className="font-medium">Next</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
