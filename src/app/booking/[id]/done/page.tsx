import { Button } from "../../../../components/ui/button";
import Link from "next/link";
export default function BookingDonePage() {
  return (
    <div className="text-white bg-transparent flex flex-col flex-1 ">
      <div className="flex flex-col title-lg text-white ">
        <span>All done!</span>
        <span>Rate your booking experience wth DOKI</span>
      </div>

      <div className="self-center text-center my-auto">앙 로띠</div>

      <div className="mt-auto py-4">
        <Link href="/my">
          <Button className="w-full h-[52px]">
            <span className="font-medium">Check your booking</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
