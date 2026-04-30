"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { PageLoading } from "@/components/common";
import { useTourSurveyForms } from "@/queries/useTourSurveyQueries";

export function TourSurveyListView() {
  const { data: forms = [], isLoading, error } = useTourSurveyForms();

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") {
      return;
    }

    console.info("[tour-surveys] list state", {
      isLoading,
      count: forms.length,
      forms,
      error,
    });
  }, [error, forms, isLoading]);

  if (isLoading) {
    return <PageLoading message="설문 목록을 불러오는 중..." />;
  }

  return (
    <main className="min-h-screen bg-[#101319] px-4 pb-16 pt-4 text-white">
      <div className="mx-auto max-w-[412px]">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          홈으로
        </Link>

        <section className="mt-5 rounded-[28px] border border-pink-300/20 bg-[radial-gradient(circle_at_top_left,_rgba(249,37,149,0.24),_transparent_34%),linear-gradient(180deg,_rgba(33,36,45,0.98),_rgba(17,19,26,0.98))] p-5 shadow-[0_24px_70px_rgba(0,0,0,0.26)]">
          <p className="text-xs uppercase tracking-[0.28em] text-pink-200">
            Trip Finder
          </p>
          <h1 className="mt-4 break-keep text-[2rem] font-semibold leading-tight">
            어떤 여행을 찾고 계신가요?
          </h1>
          <p className="mt-3 break-keep text-sm leading-7 text-gray-300">
            설문을 선택하면 취향에 맞는 한국 로컬 여행지와 DOKI 추천 상품을
            만들어드려요.
          </p>
          <div className="mt-5 flex items-center gap-2 rounded-[18px] border border-white/10 bg-white/[0.04] px-3 py-3">
            <Sparkles className="h-4 w-4 shrink-0 text-pink-100" />
            <p className="break-keep text-sm leading-6 text-gray-200">
              공공 관광지 데이터 + AI 분석으로 나만의 코스를 만들어드려요.
            </p>
          </div>
        </section>

        <section className="mt-5 space-y-3">
          {error && (
            <div className="rounded-[20px] border border-red-300/20 bg-red-500/10 p-4">
              <p className="text-sm text-red-100">
                설문 목록을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.
              </p>
            </div>
          )}

          {!error && forms.length === 0 && (
            <div className="rounded-[20px] border border-white/10 bg-white/[0.03] p-5 text-center">
              <p className="text-sm text-gray-400">
                준비된 설문이 없어요. 곧 추가될 예정이에요.
              </p>
            </div>
          )}

          {forms.map(form => (
            <Link
              key={form.id}
              href={`/tour/mv-trip/${form.id}`}
              className="group flex items-center gap-4 rounded-[22px] border border-white/10 bg-white/[0.03] p-4 transition-colors hover:border-pink-300/30 hover:bg-pink-400/[0.06]"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[16px] bg-[linear-gradient(135deg,_rgba(249,37,149,0.3),_rgba(45,212,191,0.18))]">
                <Sparkles className="h-5 w-5 text-pink-200" />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="break-keep text-base font-semibold leading-6 text-white group-hover:text-pink-100">
                  {form.name}
                </h2>
                {form.description && (
                  <p className="mt-0.5 line-clamp-2 break-keep text-sm leading-5 text-gray-400">
                    {form.description}
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  질문 {form.questions.length}개
                </p>
              </div>
              <ArrowRight className="h-4 w-4 shrink-0 text-gray-500 transition-colors group-hover:text-pink-300" />
            </Link>
          ))}
        </section>
      </div>
    </main>
  );
}
