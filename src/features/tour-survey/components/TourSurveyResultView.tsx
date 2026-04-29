"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Camera,
  Copy,
  ExternalLink,
  MapPin,
  Package,
  Route,
  Share2,
  Sparkles,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type {
  TourSurveyRecommendation,
  TourSurveyRecommendedProduct,
  TourSurveySharePayload,
} from "@/api/tourSurvey";

interface TourSurveyResultViewProps {
  recommendation: TourSurveyRecommendation;
  sharePayload?: TourSurveySharePayload;
  onRestart?: () => void;
  showBackLink?: boolean;
}

function formatPrice(value: number) {
  return `₩${value.toLocaleString("ko-KR")}`;
}

function normalizeProductPath(product: TourSurveyRecommendedProduct) {
  const productPathMatch = product.deepLinkPath.match(/^\/products\/(\d+)$/);
  if (productPathMatch) {
    return `/package/${productPathMatch[1]}`;
  }

  return product.deepLinkPath || `/package/${product.productId}`;
}

function absoluteUrl(path: string) {
  if (typeof window === "undefined") {
    return path;
  }

  try {
    return new URL(path, window.location.origin).toString();
  } catch {
    return window.location.href;
  }
}

function buildShareText(
  recommendation: TourSurveyRecommendation,
  sharePayload?: TourSurveySharePayload
) {
  if (sharePayload?.shareText) {
    return sharePayload.shareText;
  }

  const hashtags = recommendation.hashtags.join(" ");
  return [recommendation.title, recommendation.shareCaption, hashtags]
    .filter(Boolean)
    .join("\n");
}

export function TourSurveyResultView({
  recommendation,
  sharePayload,
  onRestart,
  showBackLink = false,
}: TourSurveyResultViewProps) {
  const [shareMessage, setShareMessage] = useState("");

  const shareText = useMemo(
    () => buildShareText(recommendation, sharePayload),
    [recommendation, sharePayload]
  );
  const shareUrl =
    sharePayload?.deepLinkPath !== undefined
      ? absoluteUrl(sharePayload.deepLinkPath)
      : typeof window !== "undefined"
        ? window.location.href
        : "";

  const copyShareText = async () => {
    try {
      await navigator.clipboard.writeText(
        [shareText, shareUrl].filter(Boolean).join("\n")
      );
      setShareMessage("공유 문구를 복사했어요.");
      window.setTimeout(() => setShareMessage(""), 2200);
    } catch {
      setShareMessage("복사에 실패했어요.");
      window.setTimeout(() => setShareMessage(""), 2200);
    }
  };

  const shareResult = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: recommendation.title,
          text: shareText,
          url: shareUrl,
        });
        setShareMessage("공유 화면을 열었어요.");
      } else {
        await copyShareText();
        return;
      }
      window.setTimeout(() => setShareMessage(""), 2200);
    } catch {
      setShareMessage("공유를 취소했어요.");
      window.setTimeout(() => setShareMessage(""), 2200);
    }
  };

  return (
    <section className="min-h-screen bg-[#101319] px-4 pb-16 pt-4 text-white">
      <div className="mx-auto max-w-[412px]">
        <div className="flex items-center justify-between gap-3">
          {showBackLink ? (
            <Link
              href="/tour/mv-trip"
              className="inline-flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              설문으로 돌아가기
            </Link>
          ) : (
            <p className="text-xs uppercase tracking-[0.28em] text-pink-200">
              DOKI Result
            </p>
          )}

          <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] text-gray-300">
            {recommendation.llmEnhanced ? "LLM on" : "Rule based"}
          </span>
        </div>

        <div className="mt-5 overflow-hidden rounded-[28px] border border-pink-300/20 bg-[linear-gradient(180deg,_rgba(39,42,51,0.98),_rgba(18,20,27,0.98))] shadow-[0_24px_70px_rgba(0,0,0,0.32)]">
          <div className="border-b border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(249,37,149,0.22),_transparent_36%),radial-gradient(circle_at_bottom_right,_rgba(45,212,191,0.14),_transparent_32%)] px-5 py-6">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-pink-200">
              <Sparkles className="h-4 w-4" />
              Trip Finder
            </div>
            <h1 className="mt-4 break-keep text-[2rem] font-semibold leading-tight text-white">
              {recommendation.title}
            </h1>
            <p className="mt-3 break-keep text-sm leading-7 text-gray-200">
              {recommendation.subtitle}
            </p>
          </div>

          <div className="space-y-4 px-4 py-5">
            <div className="rounded-[22px] border border-white/10 bg-white/[0.04] p-4">
              <p className="text-[11px] uppercase tracking-[0.22em] text-gray-400">
                Story
              </p>
              <p className="mt-3 break-keep text-sm leading-7 text-gray-100">
                {recommendation.narrative}
              </p>
            </div>

            <div className="rounded-[22px] border border-pink-200/20 bg-pink-400/10 p-4">
              <p className="text-[11px] uppercase tracking-[0.22em] text-pink-100">
                Styling Tip
              </p>
              <p className="mt-3 break-keep text-sm leading-7 text-white">
                {recommendation.stylingTip}
              </p>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <Camera className="h-4 w-4 text-cyan-200" />
                <h2 className="text-base font-semibold">선택한 답변</h2>
              </div>
              <div className="mt-3 grid gap-3">
                {recommendation.selectedAnswerCards.map(card => (
                  <article
                    key={`${card.title}-${card.description}`}
                    className="flex gap-3 rounded-[20px] border border-white/10 bg-white/[0.04] p-3"
                  >
                    {card.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={card.imageUrl}
                        alt=""
                        className="h-16 w-16 shrink-0 rounded-[16px] object-cover"
                      />
                    ) : (
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[16px] bg-[linear-gradient(135deg,_rgba(249,37,149,0.28),_rgba(45,212,191,0.18))]">
                        <Sparkles className="h-5 w-5 text-white" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="break-keep text-sm font-semibold text-white">
                        {card.title}
                      </p>
                      <p className="mt-1 break-keep text-sm leading-6 text-gray-300">
                        {card.description}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {recommendation.route.length > 0 && (
              <div>
                <div className="flex items-center gap-2">
                  <Route className="h-4 w-4 text-emerald-200" />
                  <h2 className="text-base font-semibold">추천 동선</h2>
                </div>
                <div className="relative mt-3 space-y-3 pl-4">
                  <div className="absolute bottom-4 left-2 top-4 w-px bg-[linear-gradient(180deg,_rgba(249,37,149,0.5),_rgba(45,212,191,0.5))]" />
                  {recommendation.route.map((item, index) => (
                    <div
                      key={`${item}-${index}`}
                      className="relative rounded-[18px] border border-white/10 bg-white/[0.04] px-4 py-3"
                    >
                      <span className="absolute -left-[1.18rem] top-4 h-3 w-3 rounded-full border border-pink-200/40 bg-[#f92595]" />
                      <p className="break-keep text-sm leading-6 text-gray-100">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {recommendation.attractions.length > 0 && (
              <div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-pink-200" />
                  <h2 className="text-base font-semibold">추천 관광지</h2>
                </div>
                <div className="mt-3 grid gap-3">
                  {recommendation.attractions.map(attraction => (
                    <article
                      key={attraction.attractionCode}
                      className="rounded-[20px] border border-white/10 bg-white/[0.04] p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-[11px] uppercase tracking-[0.18em] text-emerald-200">
                            Rank {attraction.rank}
                          </p>
                          <h3 className="mt-2 break-keep text-base font-semibold text-white">
                            {attraction.name}
                          </h3>
                          <p className="mt-1 break-keep text-xs leading-5 text-gray-400">
                            {[attraction.areaName, attraction.signguName]
                              .filter(Boolean)
                              .join(" · ")}
                          </p>
                        </div>
                        <span className="rounded-full border border-white/10 bg-white/[0.06] px-2.5 py-1 text-xs text-gray-200">
                          {attraction.categoryMiddle ??
                            attraction.categoryLarge ??
                            "Spot"}
                        </span>
                      </div>
                      <p className="mt-3 break-keep text-sm leading-6 text-gray-200">
                        {attraction.reason}
                      </p>
                    </article>
                  ))}
                </div>
              </div>
            )}

            {recommendation.recommendedProducts.length > 0 && (
              <div>
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-cyan-200" />
                  <h2 className="text-base font-semibold">DOKI 추천 상품</h2>
                </div>
                <div className="mt-3 grid gap-3">
                  {recommendation.recommendedProducts.map(product => (
                    <Link
                      key={product.productId}
                      href={normalizeProductPath(product)}
                      className="group block rounded-[20px] border border-white/10 bg-white/[0.04] p-3 transition-colors hover:bg-white/[0.07]"
                    >
                      <div className="flex gap-3">
                        {product.imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={product.imageUrl}
                            alt=""
                            className="h-20 w-20 shrink-0 rounded-[16px] object-cover"
                          />
                        ) : (
                          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[16px] bg-[#23262d]">
                            <Package className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <h3 className="truncate text-base font-semibold text-white">
                                {product.name}
                              </h3>
                              <p className="mt-1 text-xs text-gray-400">
                                {product.location}
                              </p>
                            </div>
                            <ExternalLink className="mt-1 h-4 w-4 shrink-0 text-gray-500 group-hover:text-white" />
                          </div>
                          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-300">
                            <span className="font-semibold text-pink-200">
                              {formatPrice(product.finalPrice)}
                            </span>
                            {product.discountRate > 0 && (
                              <span className="text-emerald-200">
                                {product.discountRate}% off
                              </span>
                            )}
                            <span className="inline-flex items-center gap-1">
                              <Star className="h-3 w-3 fill-current text-amber-200" />
                              {product.rating.toFixed(1)}
                            </span>
                          </div>
                          <p className="mt-2 line-clamp-2 break-keep text-xs leading-5 text-gray-300">
                            {product.reason}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              {recommendation.hashtags.map(tag => (
                <span
                  key={tag}
                  className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-gray-200"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="grid gap-3">
              <Button
                type="button"
                className="h-12 rounded-full"
                onClick={shareResult}
              >
                <Share2 className="h-4 w-4" />
                공유하기
              </Button>
              <Button
                type="button"
                variant="gray"
                className="h-12 rounded-full border border-white/10 bg-[#23262d] text-white hover:bg-[#2c3038]"
                onClick={copyShareText}
              >
                <Copy className="h-4 w-4" />
                결과 문구 복사
              </Button>
              {onRestart && (
                <Button
                  type="button"
                  variant="ghost"
                  className="h-11 rounded-full border border-white/10 bg-white/[0.03] text-gray-100 hover:bg-white/[0.06]"
                  onClick={onRestart}
                >
                  다시 설문하기
                </Button>
              )}
            </div>

            {shareMessage && (
              <p className="text-center text-xs text-pink-200">
                {shareMessage}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
