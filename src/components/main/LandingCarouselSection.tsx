"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { useLandingCarousels } from "@/queries/useCarouselQueries";
import { getSafeImageSrc } from "@/lib/utils";
import type { LandingCarouselItem, CarouselLinkType } from "@/api/carousel";

function resolveHref(linkType: CarouselLinkType, linkId: number): string {
  if (linkType === "PRODUCT") return `/package/${linkId}`;
  return `/board/notice/${linkId}`;
}

function LandingCarousel({ items }: { items: LandingCarouselItem[] }) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => setCurrent(api.selectedScrollSnap()));
  }, [api]);

  return (
    <div className="w-full">
      <Carousel
        setApi={setApi}
        opts={{ align: "center", loop: true, slidesToScroll: 1 }}
        className="w-full"
      >
        <CarouselContent className="-ml-0">
          {items.map((item, index) => {
            const isSelected = index === current;
            return (
              <CarouselItem
                key={item.id}
                className="basis-[382px] shrink-0 pl-[4px] pr-[4px]"
              >
                <div className="w-full h-full flex items-center justify-center">
                  <Link
                    href={resolveHref(item.linkType, item.linkId)}
                    className="relative w-full overflow-hidden rounded-[8px] border border-card-border transition-transform duration-300 ease-in-out block"
                    style={{
                      transform: `scale(${isSelected ? 1 : 0.97})`,
                      transformOrigin: "center center",
                    }}
                  >
                    <div className="relative h-[456px] w-full">
                      <Image
                        src={getSafeImageSrc(item.imageUrl)}
                        alt={item.hashtag}
                        className="object-cover"
                        fill
                        sizes="372px"
                        priority={index === 0}
                        unoptimized
                      />
                      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex flex-col gap-1 bg-gradient-to-t from-black/80 via-black/45 to-transparent px-3 pb-4 pt-20">
                        <p className="caption-sm font-medium text-primary">
                          {item.hashtag}
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>
    </div>
  );
}

export function LandingCarouselSection() {
  const { data: items = [], isLoading } = useLandingCarousels();

  if (isLoading || items.length === 0) return null;

  return <LandingCarousel items={items} />;
}
