"use client";

import Link from "next/link";
import { ArrowRightIcon } from "@/components/common/Icons";
import { TrendCard } from "@/components/main/TrendCard";
import { TranslatedText } from "@/components/main/TranslatedText";
import { Divider } from "@/components/ui/divider";
import { GapY } from "@/components/ui/gap";
import { useProducts } from "@/queries/useProductQueries";

const TRENDS_SIZE = 3;

export function LatestTrendsSection() {
  const { data: products = [] } = useProducts({ size: TRENDS_SIZE });
  const trends = products.slice(0, TRENDS_SIZE);

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
        {trends.map((product, index, array) => (
          <div key={product.id}>
            <TrendCard
              id={String(product.id)}
              title={product.name}
              artist={product.tagNames?.[0] ?? "-"}
              location="-"
              description={product.description}
              imageSrc="/dummy-profile.png"
            />
            {index < array.length - 1 && <Divider />}
          </div>
        ))}
      </div>
      <GapY size={44} />
    </div>
  );
}
