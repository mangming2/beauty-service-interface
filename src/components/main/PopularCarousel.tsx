"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import Link from "next/link";

type CarouselItemType = {
  imageSrc: string;
  alt: string;
  tags: string;
  location: string;
  href?: string;
};

type PopularCarouselProps = {
  items: CarouselItemType[];
};

export function PopularCarousel({ items }: PopularCarouselProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <div className="w-full">
      <Carousel
        setApi={setApi}
        opts={{
          align: "center",
          loop: true,
          slidesToScroll: 1,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-0">
          {items.map((item, index) => {
            const isSelected = index === current;
            const scale = isSelected ? 1 : 0.97;

            return (
              <CarouselItem
                key={index}
                className="basis-[382px] shrink-0 pl-[4px] pr-[4px]"
              >
                <div className="w-full h-full flex items-center justify-center">
                  <Link
                    href={item.href ?? "#"}
                    className="relative w-full overflow-hidden rounded-[8px] border border-card-border transition-transform duration-300 ease-in-out block"
                    style={{
                      transform: `scale(${scale})`,
                      transformOrigin: "center center",
                    }}
                  >
                    <div className="relative h-[456px] w-full">
                      <Image
                        src={item.imageSrc}
                        alt={item.alt}
                        className="object-cover"
                        fill
                        sizes="372px"
                        priority={index === 0}
                      />
                      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex flex-col gap-1 bg-gradient-to-t from-black/80 via-black/45 to-transparent px-3 pb-4 pt-20">
                        <p className="caption-sm font-medium text-primary">
                          {item.tags}
                        </p>
                        <p className="title-lg font-semibold leading-tight text-white">
                          {item.location}
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
