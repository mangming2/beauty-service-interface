"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { TranslatedText } from "@/components/main/TranslatedText";

type CarouselItemType = {
  imageSrc: string;
  alt: string;
  tags: string;
  location: string;
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
                className="basis-[372px] shrink-0 pl-[4px] pr-[4px]"
              >
                <div className="w-full h-full flex items-center justify-center">
                  <div
                    className="relative rounded-[8px] border border-card-border transition-transform duration-300 ease-in-out w-full"
                    style={{
                      transform: `scale(${scale})`,
                      transformOrigin: "center center",
                    }}
                  >
                    <div className="absolute top-0 left-0 z-10 bg-black bg-opacity-50 border-solid border-1 border-card-border text-white px-2 py-1 rounded caption-sm">
                      <TranslatedText translationKey="mostPopular" />
                    </div>
                    <div className="w-full">
                      <div className="relative w-full h-[381px]">
                        <Image
                          src={item.imageSrc}
                          alt={item.alt}
                          className="object-cover w-full h-full rounded-t-[8px]"
                          fill
                          priority={index === 0}
                        />
                      </div>
                      <div className="flex flex-col gap-[4px] p-[12px]">
                        <div className="caption-sm text-primary">
                          {item.tags}
                        </div>
                        <div className="text-md">{item.location}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>
    </div>
  );
}
