"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function TourAttractionButton() {
  return (
    <Link href="/tour">
      <Button
        variant="gray"
        className="w-full h-[52px] border border-white/10 bg-[#23262d] text-white hover:bg-[#2c3038]"
      >
        Nearby K-Beauty Spots
      </Button>
    </Link>
  );
}
