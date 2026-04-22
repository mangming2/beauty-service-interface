"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,_rgba(26,29,37,0.9),_rgba(14,16,22,0.96))] px-4 py-5 shadow-[0_28px_80px_rgba(0,0,0,0.32)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(249,37,149,0.2),_transparent_28%),radial-gradient(circle_at_80%_20%,_rgba(255,255,255,0.08),_transparent_22%),radial-gradient(circle_at_bottom,_rgba(56,189,248,0.18),_transparent_36%)]" />

      <div className="relative z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-300 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          홈으로 돌아가기
        </Link>

        <div className="mt-5">
          <p className="text-[11px] uppercase tracking-[0.28em] text-pink-300">
            DOKI MV Trip
          </p>
          <h1 className="mt-4 break-keep text-[2rem] font-semibold leading-tight text-white">
            BTS의 MV 촬영지를 따라 떠나는
            <br />
            한국 로컬 여행
          </h1>
          <p className="mt-5 break-keep text-sm leading-7 text-gray-300">
            BTS의 실제 뮤비 촬영지와 관광 코스, 차원이 다른 몰입감을 만들어줄
            DOKI의 스타일링까지 함께 알아볼까요?
          </p>

          <div className="mt-6 flex flex-wrap gap-2 text-[11px] text-gray-200">
            {["Flowchart Interaction", "Dummy Data MVP", "Mobile Ready"].map(
              item => (
                <span
                  key={item}
                  className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-2 tracking-[0.08em]"
                >
                  {item}
                </span>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
