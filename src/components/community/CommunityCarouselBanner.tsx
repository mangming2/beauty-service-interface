"use client";

import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { useCommunityCarousels } from "@/queries/useCarouselQueries";
import { getSafeImageSrc } from "@/lib/utils";

export function CommunityCarouselBanner() {
  const { data: items = [], isLoading } = useCommunityCarousels();

  if (isLoading || items.length === 0) return null;

  if (items.length === 1) {
    return (
      <>
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
      </>
    );
  }

  return (
    <div className="w-full">
      <Carousel
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
    </div>
  );
}
