"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function TourQuizButton() {
  return (
    <Button
      asChild
      variant="gray"
      className="h-auto w-full justify-between rounded-[20px] border border-pink-300/20 bg-[linear-gradient(180deg,_rgba(249,37,149,0.16),_rgba(35,38,45,0.98))] px-5 py-4 text-left text-white hover:bg-[linear-gradient(180deg,_rgba(249,37,149,0.2),_rgba(44,48,56,0.98))]"
    >
      <Link href="/tour/mv-trip">
        <span className="flex flex-col items-start">
          <span className="text-[11px] uppercase tracking-[0.26em] text-pink-200/90">
            New Interactive Trip
          </span>
          <span className="mt-2 break-keep text-sm font-semibold sm:text-base">
            BTS MV 촬영지 기반 로컬 여행 추천
          </span>
        </span>
        <Sparkles className="h-5 w-5 shrink-0 text-pink-100" />
      </Link>
    </Button>
  );
}
