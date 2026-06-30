"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { useCommunityCarousels } from "@/queries/useCarouselQueries";
import { getSafeImageSrc } from "@/lib/utils";

const DOT_COLORS = ["#FFFFFF", "#D2D3D3", "#A5A6A8", "#797A7C", "#4C4D51"];
const MAX_DOTS = 5;

function CarouselDots({ total, current }: { total: number; current: number }) {
  const count = Math.min(total, MAX_DOTS);

  // 아이템이 5개 초과면 슬라이딩 윈도우로 active가 중앙에 오도록 조정
  let activeDotIndex = current;
  if (total > MAX_DOTS) {
    const windowStart = Math.max(
      0,
      Math.min(current - Math.floor(MAX_DOTS / 2), total - MAX_DOTS)
    );
    activeDotIndex = current - windowStart;
  }

  return (
    <div className="flex items-center justify-center" style={{ gap: "4px" }}>
      {Array.from({ length: count }, (_, i) => {
        const distance = Math.abs(i - activeDotIndex);
        const color = DOT_COLORS[Math.min(distance, DOT_COLORS.length - 1)];
        return (
          <div
            key={i}
            style={{
              width: "4px",
              height: "4px",
              borderRadius: "50%",
              backgroundColor: color,
              flexShrink: 0,
            }}
          />
        );
      })}
    </div>
  );
}

export function CommunityCarouselBanner() {
  const { data: items = [], isLoading } = useCommunityCarousels();
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => setCurrent(api.selectedScrollSnap()));
  }, [api]);

  if (isLoading || items.length === 0) return null;

  if (items.length === 1) {
    return (
      <div className="relative w-full aspect-[3/1] overflow-hidden rounded">
        <Image
          src={getSafeImageSrc(items[0].imageUrl)}
          alt="커뮤니티 배너"
          fill
          className="object-cover"
          sizes="100vw"
          unoptimized
        />
      </div>
    );
  }

  return (
    <div className="relative w-full">
      <Carousel
        setApi={setApi}
        opts={{ align: "start", loop: true, slidesToScroll: 1 }}
        className="w-full"
      >
        <CarouselContent className="-ml-0">
          {items.map((item, index) => (
            <CarouselItem key={item.id} className="pl-0">
              <div className="relative w-full aspect-[3/1] overflow-hidden rounded">
                <Image
                  src={getSafeImageSrc(item.imageUrl)}
                  alt={`커뮤니티 배너 ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="100vw"
                  priority={index === 0}
                  unoptimized
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      <div className="absolute bottom-2 left-0 right-0 flex items-center justify-center pointer-events-none">
        <CarouselDots total={items.length} current={current} />
      </div>
    </div>
  );
}
