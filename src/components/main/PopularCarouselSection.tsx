"use client";

import { useAdminPickedRecommendations } from "@/queries/useRecommendationQueries";
import { PopularCarousel } from "@/components/main/PopularCarousel";
import { getSafeImageSrc } from "@/lib/utils";

export function PopularCarouselSection() {
  const { data: picks = [], isLoading } = useAdminPickedRecommendations({ size: 20 });

  if (isLoading || picks.length === 0) return null;

  const items = picks.map(p => ({
    imageSrc: getSafeImageSrc(p.imageUrls?.[0]),
    alt: p.name,
    tags: p.representOption?.tags?.map(t => `#${t}`).join(" ") ?? "",
    location: p.representOption?.location ?? "",
    href: `/package/${p.id}`,
  }));

  return <PopularCarousel items={items} />;
}
