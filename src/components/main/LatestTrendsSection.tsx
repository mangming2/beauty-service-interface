"use client";

import Link from "next/link";
import { ArrowRightIcon } from "@/components/common/Icons";
import { TrendCard } from "@/components/main/TrendCard";
import { TranslatedText } from "@/components/main/TranslatedText";
import { Divider } from "@/components/ui/divider";
import { GapY } from "@/components/ui/gap";
import type { Product } from "@/api/product";
import { useLatestInKoreaRecommendations } from "@/queries/useRecommendationQueries";

const TRENDS_SIZE = 3;

export function LatestTrendsSection() {
  const { data: trends = [] } = useLatestInKoreaRecommendations({
    size: TRENDS_SIZE,
  });

  return (
    <div>
      <div className="flex justify-between items-center">
        <h2 className="title-md">
          <TranslatedText translationKey="latestTrends" />
        </h2>
        <div className="flex items-baseline gap-[4px]">
          <Link href="/recommend" className="text-gray_1 caption-md">
            <TranslatedText translationKey="more" />
          </Link>
          <ArrowRightIcon
            color="#BCBCBC"
            width={3}
            height={7}
            className="size-auto"
          />
        </div>
      </div>

      <GapY size={12} />

      <div className="flex flex-col">
        {trends.map((product: Product, index: number, array: Product[]) => (
          <div key={product.id}>
            <TrendCard
              id={String(product.id)}
              title={product.name}
              location={product.representOption?.location ?? "-"}
              description={product.description ?? ""}
              imageSrc={
                product.imageUrls?.[0] ??
                product.representOption?.imageUrls?.[0] ??
                "/dummy-profile.png"
              }
            />
            {index < array.length - 1 && <Divider />}
          </div>
        ))}
      </div>
      <GapY size={44} />
    </div>
  );
}
