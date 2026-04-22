"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BedDouble,
  Camera,
  Copy,
  CupSoda,
  MapPinned,
  Navigation,
  Palette,
  Share2,
  Utensils,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { QuizResult } from "@/features/tour-quiz/types";

type ResultCardProps = {
  result: QuizResult;
};

export function ResultCard({ result }: ResultCardProps) {
  const [shareMessage, setShareMessage] = useState("");
  const itinerary = [
    {
      label: "지역",
      title: result.region,
      icon: MapPinned,
      tone: "from-pink-400/18 to-pink-300/6",
    },
    {
      label: "MV 촬영지",
      title: result.mvLocation,
      icon: Navigation,
      tone: "from-fuchsia-400/18 to-fuchsia-300/6",
    },
    {
      label: "연관 관광지",
      title: result.relatedSpots.join(" · "),
      icon: Camera,
      tone: "from-sky-400/18 to-sky-300/6",
    },
    {
      label: "추천 식당",
      title: result.restaurant,
      icon: Utensils,
      tone: "from-orange-400/18 to-orange-300/6",
    },
    {
      label: "디저트",
      title: result.dessert,
      icon: CupSoda,
      tone: "from-amber-300/18 to-amber-200/6",
    },
    {
      label: "숙소",
      title: result.stay,
      icon: BedDouble,
      tone: "from-emerald-400/18 to-emerald-300/6",
    },
    {
      label: "DOKI 스타일링 패키지",
      title: result.stylingPackage,
      icon: Palette,
      tone: "from-cyan-400/18 to-cyan-300/6",
    },
  ];

  const shareText = (url: string) =>
    `${result.shareTitle}\n${result.copy}\n${url}`.trim();

  const handleShare = async () => {
    const shareUrl = typeof window !== "undefined" ? window.location.href : "";

    try {
      if (navigator.share) {
        await navigator.share({
          title: result.shareTitle,
          text: result.copy,
          url: shareUrl,
        });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareText(shareUrl));
      }

      setShareMessage("공유용 문구를 준비했어요.");
      window.setTimeout(() => setShareMessage(""), 2200);
    } catch {
      setShareMessage("공유를 취소했어요.");
      window.setTimeout(() => setShareMessage(""), 2200);
    }
  };

  const handleCopy = async () => {
    const shareUrl = typeof window !== "undefined" ? window.location.href : "";

    try {
      await navigator.clipboard.writeText(shareText(shareUrl));
      setShareMessage("결과 문구를 복사했어요.");
      window.setTimeout(() => setShareMessage(""), 2200);
    } catch {
      setShareMessage("복사에 실패했어요.");
      window.setTimeout(() => setShareMessage(""), 2200);
    }
  };

  return (
    <section className="-mx-2 w-[calc(100%+1rem)] overflow-hidden rounded-[24px] border border-pink-300/20 bg-[radial-gradient(circle_at_top_left,_rgba(249,37,149,0.16),_transparent_30%),linear-gradient(180deg,_rgba(26,29,36,0.98),_rgba(16,18,24,0.98))] shadow-[0_24px_70px_rgba(0,0,0,0.3)]">
      <div className="border-b border-white/10 px-4 py-5 sm:px-5">
        <p className="text-xs uppercase tracking-[0.32em] text-pink-300">
          DOKI Result
        </p>
        <h2 className="mt-3 break-keep text-[1.9rem] font-semibold leading-tight text-white">
          DOKI가 추천하는 당신의 BTS MV TRIP
        </h2>
        <p className="mt-4 break-keep text-sm leading-7 text-gray-200">
          {result.copy}
        </p>

        {result.introLine && (
          <p className="mt-4 break-keep text-sm leading-7 text-pink-100">
            {result.introLine}
          </p>
        )}

        <div className="mt-5 flex flex-wrap gap-2">
          <span className="rounded-full border border-pink-300/20 bg-pink-400/10 px-3 py-1.5 text-[11px] uppercase tracking-[0.14em] text-pink-100">
            MV Route
          </span>
          <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[11px] uppercase tracking-[0.14em] text-gray-200">
            1 Day Schedule
          </span>
          <span className="rounded-full border border-cyan-200/20 bg-cyan-200/10 px-3 py-1.5 text-[11px] uppercase tracking-[0.14em] text-cyan-50">
            Capture Ready
          </span>
        </div>
      </div>

      <div className="grid gap-4 px-3 py-4 sm:px-4">
        <div className="rounded-[20px] border border-white/10 bg-[linear-gradient(180deg,_rgba(255,255,255,0.05),_rgba(255,255,255,0.02))] p-3.5">
          <div className="flex flex-col gap-3">
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-gray-400">
                Day 1 Schedule
              </p>
              <h3 className="mt-2 text-lg font-semibold text-white">
                {result.mvTitle} 무드로 완성한 하루
              </h3>
            </div>
            <div className="w-fit rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[11px] uppercase tracking-[0.18em] text-gray-200">
              DOKI TRIP
            </div>
          </div>

          <div className="relative mt-5">
            <div className="absolute left-2.5 top-3 bottom-3 w-px bg-[linear-gradient(180deg,_rgba(249,37,149,0.45),_rgba(125,211,252,0.45),_rgba(255,255,255,0.08))]" />

            <div className="space-y-4">
              {itinerary.map((item, index) => {
                const Icon = item.icon;

                return (
                  <article
                    key={item.label}
                    className="result-stop relative rounded-[20px] border border-white/10 bg-[linear-gradient(180deg,_rgba(255,255,255,0.05),_rgba(255,255,255,0.025))] p-3 pl-9.5 shadow-[0_12px_32px_rgba(0,0,0,0.18)]"
                    style={{
                      animationDelay: `${index * 90}ms`,
                    }}
                  >
                    <div className="absolute left-0 top-4 flex h-5 w-5 items-center justify-center rounded-full border border-pink-200/30 bg-[#1b1e26] shadow-[0_0_0_3px_rgba(16,18,24,1)]">
                      <div className="h-2.5 w-2.5 rounded-full bg-[linear-gradient(180deg,_rgba(249,37,149,0.95),_rgba(125,211,252,0.9))]" />
                    </div>

                    <div
                      className={`absolute inset-0 rounded-[20px] bg-gradient-to-br ${item.tone} opacity-100`}
                    />

                    <div className="relative">
                      <div className="flex items-start gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[18px] border border-white/10 bg-white/[0.05] text-white">
                          <Icon className="h-4 w-4" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-[10px] uppercase tracking-[0.16em] text-gray-400">
                              {item.label}
                            </p>
                            <span className="pt-0.5 text-[10px] font-medium text-gray-500">
                              {String(index + 1).padStart(2, "0")}
                            </span>
                          </div>
                          <p className="mt-1.5 break-keep text-[15px] font-medium leading-6 text-white">
                            {item.title}
                          </p>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>

        <div className="rounded-[20px] border border-white/10 bg-white/[0.04] p-4">
          <div className="rounded-[20px] border border-white/10 bg-[linear-gradient(180deg,_rgba(255,255,255,0.08),_rgba(255,255,255,0.03))] p-4">
            <p className="text-[11px] uppercase tracking-[0.24em] text-gray-400">
              Highlight Mood
            </p>
            <h3 className="mt-3 break-keep text-lg font-semibold text-white">
              {result.mvTitle}
            </h3>
            <p className="mt-3 break-keep text-sm leading-7 text-gray-200">
              {result.highlight}
            </p>
          </div>

          <div className="mt-4 rounded-[20px] border border-white/10 bg-[linear-gradient(180deg,_rgba(255,255,255,0.05),_rgba(255,255,255,0.02))] p-4">
            <p className="text-[11px] uppercase tracking-[0.2em] text-gray-400">
              Story
            </p>
            <div className="mt-3 space-y-3">
              {result.narrative.map(paragraph => (
                <p
                  key={paragraph}
                  className="break-keep text-sm leading-7 text-gray-200"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          <div className="mt-4 rounded-[18px] border border-dashed border-white/15 bg-black/10 p-4">
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <Camera className="h-4 w-4" />
              캡쳐하기 좋은 카드 레이아웃
            </div>
            <p className="mt-2 break-keep text-sm leading-6 text-gray-400">
              결과 전체를 한 장으로 공유할 수 있도록 여백과 정보 밀도를
              정리해두었어요.
            </p>
          </div>

          <div className="mt-5 flex flex-col gap-3">
            <Button
              asChild
              className="h-12 w-full rounded-full text-sm font-semibold"
            >
              <Link href="/recommend?tags=Dreamy">
                패키지 소개 페이지로 이동
              </Link>
            </Button>

            <div className="rounded-[18px] border border-pink-300/20 bg-pink-400/8 p-4">
              <p className="text-[11px] uppercase tracking-[0.18em] text-pink-200">
                Package Focus
              </p>
              <p className="mt-2 break-keep text-base font-semibold text-white">
                {result.packageCtaTitle}
              </p>
              <p className="mt-2 break-keep text-sm leading-6 text-gray-200">
                {result.packageCtaDescription}
              </p>
            </div>

            <Button
              type="button"
              variant="gray"
              className="h-12 w-full rounded-full border border-white/10 bg-[#23262d] text-white hover:bg-[#2c3038]"
              onClick={handleShare}
            >
              <Share2 className="h-4 w-4" />
              공유하기
            </Button>

            <Button
              type="button"
              variant="ghost"
              className="h-11 w-full rounded-full border border-white/10 bg-white/[0.03] text-gray-100 hover:bg-white/[0.06]"
              onClick={handleCopy}
            >
              <Copy className="h-4 w-4" />
              결과 문구 복사
            </Button>
          </div>

          {shareMessage && (
            <p className="mt-3 text-center text-xs text-pink-200">
              {shareMessage}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
