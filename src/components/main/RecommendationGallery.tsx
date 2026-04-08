import Image from "next/image";
import { GapY } from "@/components/ui/gap";
import { StarIcon } from "../common/Icons";
import { getSafeImageSrc } from "@/lib/utils";

interface RecommendationGalleryProps {
  images: string[];
  /** 첫 이미지가 LCP일 때 true (above the fold) */
  priority?: boolean;
  salonInfo: {
    tags: string[];
    name: string;
    originalPrice: number;
    finalPrice: number;
    discountRate: number;
    rating: number;
    reviewCount: number;
    location: string;
  };
  onClick?: () => void;
}

export default function RecommendationGallery({
  images,
  priority = false,
  salonInfo,
  onClick,
}: RecommendationGalleryProps) {
  return (
    <div className="flex flex-col py-4 cursor-pointer" onClick={onClick}>
      <div className="flex gap-3 flex-nowrap overflow-x-auto scrollbar-hide">
        {images.map((imageSrc, index) => {
          const safeSrc = getSafeImageSrc(imageSrc);
          return (
          <div
            key={index}
            className="w-[348px] h-[196px] relative flex-shrink-0"
          >
            <Image
              src={safeSrc}
              alt="recommendation gallery"
              fill
              sizes="(max-width: 412px) 348px, 348px"
              priority={priority && index === 0}
              className="object-cover"
              unoptimized={safeSrc.startsWith("http")}
            />
          </div>
          );
        })}
      </div>

      <GapY size={12} />

      <div>
        <p className="text-gray-400 text-sm mb-1">{salonInfo.location}</p>
        <h3 className="text-white title-sm font-semibold mb-2">
          {salonInfo.name}
        </h3>
      </div>

      <div className="flex justify-between gap-3">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1">
            <div className="flex-center w-[15px] h-[15px]">
              <StarIcon width={14} height={14} color="#FFC700" />
            </div>
            <span className="text-gray-font text-sm">{salonInfo.rating}</span>
            <span className="text-gray-font text-sm">·</span>
            <span className="text-gray-font text-sm">
              review {salonInfo.reviewCount}
            </span>
          </div>
          <div className="flex flex-wrap gap-1">
            {salonInfo.tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-0.5 bg-gray text-white caption-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="flex-shrink-0 text-right">
          <p className="text-gray-400 text-sm mb-0.5 line-through">
            ₩ {salonInfo.originalPrice.toLocaleString()} ~
          </p>
          <div className="flex items-baseline justify-end gap-2">
            <span className="text-pink-400 title-sm">
              {salonInfo.discountRate}%
            </span>
            <span className="text-white title-sm">
              ₩ {salonInfo.finalPrice.toLocaleString()} ~
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
