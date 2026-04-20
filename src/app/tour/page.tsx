"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useProducts } from "@/queries/useProductQueries";
import { useProductTourAttractions } from "@/queries/useAttractionQueries";
import { Button } from "@/components/ui/button";
import { PageLoading } from "@/components/common";

const CATEGORY_OPTIONS = ["", "쇼핑", "문화관광", "숙박", "음식", "레포츠"];

function AttractionResultCard({
  attraction,
}: {
  attraction: {
    attractionCode: string;
    name: string;
    areaName: string | null;
    signguName: string | null;
    categoryLarge: string | null;
    categoryMiddle: string | null;
    rank: number;
    mapX: number | null;
    mapY: number | null;
    score: number;
    reason: string;
  };
}) {
  const categories = Array.from(
    new Set(
      [attraction.categoryLarge, attraction.categoryMiddle].filter(
        (category): category is string => Boolean(category)
      )
    )
  );

  const mapHref =
    attraction.mapX != null && attraction.mapY != null
      ? `https://map.kakao.com/link/map/${encodeURIComponent(attraction.name)},${attraction.mapY},${attraction.mapX}`
      : null;

  return (
    <article className="rounded-[26px] border border-white/10 bg-[linear-gradient(180deg,_rgba(33,37,46,0.98),_rgba(27,30,37,0.98))] p-5 shadow-[0_18px_48px_rgba(0,0,0,0.22)]">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-xs uppercase tracking-[0.24em] text-emerald-400">
            Rank {attraction.rank}
          </p>
          <h3 className="mt-3 break-keep text-[29px] text-lg font-semibold leading-snug text-white sm:text-xl">
            {attraction.name}
          </h3>
          <p className="mt-2 break-keep text-sm leading-6 text-gray-400">
            {[attraction.areaName, attraction.signguName]
              .filter(Boolean)
              .join(" · ") || "서울"}
          </p>
        </div>
        <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-full border border-emerald-400/30 bg-emerald-500/10 text-center text-emerald-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
          <span className="text-2xl font-semibold leading-none">
            {attraction.score}
          </span>
          <span className="mt-1 text-xs font-medium uppercase tracking-[0.12em]">
            pt
          </span>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {categories.map(category => (
          <span
            key={category}
            className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-xs font-medium text-gray-300"
          >
            {category}
          </span>
        ))}
      </div>

      <p className="mt-5 break-keep text-sm leading-7 text-gray-200">
        {attraction.reason}
      </p>

      {mapHref && (
        <a
          href={mapHref}
          target="_blank"
          rel="noreferrer"
          className="mt-6 inline-flex items-center rounded-full border border-pink-400/20 bg-pink-500/8 px-3 py-2 text-sm font-medium text-pink-300 transition-colors hover:border-pink-300/30 hover:text-pink-200"
        >
          지도에서 보기
        </a>
      )}
    </article>
  );
}

export default function TourPage() {
  const [selectedProductId, setSelectedProductId] = useState<number>();
  const [size, setSize] = useState(10);
  const [category, setCategory] = useState("");
  const [llm, setLlm] = useState(true);
  const { data: products = [], isLoading: productsLoading } = useProducts({
    size: 20,
    sort: "RECOMMENDED",
  });

  useEffect(() => {
    if (!selectedProductId && products.length > 0) {
      setSelectedProductId(products[0].id);
    }
  }, [products, selectedProductId]);

  const selectedProduct = useMemo(
    () => products.find(product => product.id === selectedProductId) ?? null,
    [products, selectedProductId]
  );

  const {
    data: attractionData,
    isLoading: attractionsLoading,
    error,
  } = useProductTourAttractions(selectedProductId, {
    size,
    ...(category ? { category } : {}),
    llm,
  });

  if (productsLoading) {
    return <PageLoading message="추천 패키지를 불러오는 중..." />;
  }

  return (
    <div className="min-h-screen bg-[#12141a] px-5 pb-16 pt-6 text-white">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/"
          className="text-sm font-medium text-gray-400 transition-colors hover:text-white"
        >
          ← Back to home
        </Link>

        <section className="mt-5 rounded-[28px] border border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(236,72,153,0.22),_transparent_28%),linear-gradient(180deg,_rgba(29,32,38,0.96),_rgba(20,22,28,0.96))] p-6">
          <p className="text-xs uppercase tracking-[0.32em] text-emerald-300">
            Product Attraction
          </p>
          <h1 className="mt-3 text-3xl font-semibold leading-tight">
            패키지와 잘 어울리는
            <br />
            주변 관광지를 찾아보세요
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-gray-300">
            선택한 상품의 대표 지역구를 기준으로 공공 관광 데이터를 모은 뒤,
            우리 상품 정보와 비교해서 어울리는 스팟을 추천합니다.
          </p>
        </section>

        <section className="mt-8">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">1. 패키지 선택</h2>
            <span className="text-xs text-gray-500">
              추천순 상위 상품 20개 기준
            </span>
          </div>

          <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
            {products.map(product => {
              const active = product.id === selectedProductId;
              return (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => setSelectedProductId(product.id)}
                  className={`min-w-[230px] rounded-2xl border p-4 text-left transition-colors ${
                    active
                      ? "border-pink-400/70 bg-pink-500/10"
                      : "border-white/10 bg-[#1b1e25] hover:bg-[#21252d]"
                  }`}
                >
                  <p className="text-xs text-gray-400">#{product.id}</p>
                  <h3 className="mt-2 text-base font-semibold text-white">
                    {product.name}
                  </h3>
                  <p className="mt-2 text-sm text-gray-400">
                    {product.representOption?.location ?? "서울"}
                  </p>
                  <p className="mt-3 text-sm text-pink-300">
                    ₩
                    {(
                      product.representOption?.finalPrice ??
                      product.totalPrice ??
                      product.minPrice ??
                      0
                    ).toLocaleString()}
                  </p>
                </button>
              );
            })}
          </div>
        </section>

        <section className="mt-8 rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,_rgba(26,29,36,0.96),_rgba(21,24,30,0.96))] p-6 shadow-[0_18px_44px_rgba(0,0,0,0.18)]">
          <div className="flex flex-col gap-5">
            <div>
              <h2 className="text-2xl font-semibold">2. 추천 조건</h2>
              <p className="mt-2 max-w-sm text-sm leading-6 text-gray-400">
                카테고리 필터와 LLM 사유 사용 여부를 조정할 수 있어요.
              </p>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <label className="flex min-w-0 flex-col gap-2 text-sm text-gray-300">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">
                  개수
                </span>
                <select
                  value={size}
                  onChange={e => setSize(Number(e.target.value))}
                  className="h-12 rounded-2xl border border-white/10 bg-[#23262d] px-4 text-base text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] outline-none transition-colors focus:border-emerald-400/40"
                >
                  {[5, 10, 20, 30].map(option => (
                    <option key={option} value={option}>
                      {option}개
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex min-w-0 flex-col gap-2 text-sm text-gray-300">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">
                  카테고리
                </span>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="h-12 rounded-2xl border border-white/10 bg-[#23262d] px-4 text-base text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] outline-none transition-colors focus:border-emerald-400/40"
                >
                  {CATEGORY_OPTIONS.map(option => (
                    <option key={option || "all"} value={option}>
                      {option || "전체"}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex min-h-12 items-center gap-3 rounded-2xl border border-white/10 bg-[#23262d] px-4 py-3 text-sm text-gray-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] md:col-span-2">
                <input
                  type="checkbox"
                  checked={llm}
                  onChange={e => setLlm(e.target.checked)}
                  className="h-4 w-4 shrink-0 accent-pink-500"
                />
                <span className="break-keep leading-6">LLM 추천 사유 사용</span>
              </label>
            </div>
          </div>
        </section>

        <section className="mt-8">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="text-lg font-semibold">3. 주변 관광지 추천</h2>
              {selectedProduct && (
                <p className="mt-2 break-keep text-sm leading-6 text-gray-400">
                  <span className="text-white">{selectedProduct.name}</span>
                  {" · "}
                  {selectedProduct.representOption?.location ?? "서울"} 기준
                </p>
              )}
            </div>

            {attractionData && (
              <div className="flex flex-wrap gap-2 text-sm text-gray-300">
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5">
                  {attractionData.district}
                </span>
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5">
                  기준연월 {attractionData.baseYm}
                </span>
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5">
                  {attractionData.llmEnhanced
                    ? "LLM reason on"
                    : "Rule-based reason"}
                </span>
              </div>
            )}
          </div>

          {attractionsLoading ? (
            <div className="mt-6 rounded-3xl border border-white/10 bg-[#171a20] px-5 py-12 text-center text-gray-400">
              관광지 추천을 불러오는 중...
            </div>
          ) : error ? (
            <div className="mt-6 rounded-3xl border border-red-400/20 bg-red-500/10 px-5 py-12 text-center text-sm text-red-200">
              관광지 추천을 불러오지 못했습니다. 상품을 다시 선택하거나 잠시 후
              다시 시도해 주세요.
            </div>
          ) : attractionData?.attractions.length ? (
            <div className="mt-6 grid gap-5">
              {attractionData.attractions.map(attraction => (
                <AttractionResultCard
                  key={attraction.attractionCode}
                  attraction={attraction}
                />
              ))}
            </div>
          ) : (
            <div className="mt-6 rounded-3xl border border-white/10 bg-[#171a20] px-5 py-12 text-center text-gray-400">
              추천 결과가 없습니다.
            </div>
          )}
        </section>

        <div className="mt-10">
          <Button asChild className="w-full sm:w-auto">
            <Link href="/recommend">추천 패키지 보러 가기</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
