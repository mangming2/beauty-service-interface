import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function BookingComplete() {
  return (
    <div className="min-h-screen text-white bg-black">
      <div className="flex items-center justify-between px-4 py-3 bg-gray-900">
        <h1 className="text-lg font-semibold">
          All done! Rate your booking experience wth DOKI
        </h1>
      </div>

      <Link href="/my">
        <div className="px-4 py-4 bg-black border-t border-gray-800">
          <Button className="w-full bg-pink-500 hover:bg-pink-600 h-[52px]">
            <span className="font-medium">Check your booking</span>
          </Button>
        </div>
      </Link>
    </div>
  );
}
