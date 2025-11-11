import Image from "next/image";
import { GapY } from "@/components/ui/gap";

interface RecommendationGalleryProps {
  images: string[];
  salonInfo: {
    tags: string[];
    name: string;
    price: string;
    rating: number;
    reviewCount: number;
    distance: string;
    location: string;
    languages: string;
  };
  onClick?: () => void;
}

export default function RecommendationGallery({
  images,
  salonInfo,
  onClick,
}: RecommendationGalleryProps) {
  return (
    <div className="flex flex-col py-4 cursor-pointer" onClick={onClick}>
      <div className="flex gap-3 flex-nowrap overflow-x-auto pb-2 scrollbar-hide">
        {images.map((imageSrc, index) => (
          <div
            key={index}
            className="w-[348px] h-[196px] relative flex-shrink-0"
          >
            <Image
              src={imageSrc}
              alt="recommendation gallery"
              fill
              className="object-cover"
            />
          </div>
        ))}
      </div>

      <GapY size={12} />

      {/* Salon Recommendation Cards */}
      <div className="flex gap-3 flex-nowrap overflow-x-auto">
        <div className="w-[372px]">
          <div>
            <div className="flex gap-2 mb-2">
              {salonInfo.tags.map((tag, index) => (
                <span key={index} className="text-pink-400 text-sm">
                  #{tag}
                </span>
              ))}
            </div>

            <div className="flex justify-between items-center">
              <h3 className="text-white title-sm font-semibold mb-2">
                {salonInfo.name}
              </h3>
              <span className="text-pink-400 title-sm font-semibold">
                {salonInfo.price}
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1">
                <span className="text-pink-400">★</span>
                <span className="text-gray-font text-sm">
                  {salonInfo.rating}
                </span>
                <span className="text-gray-font text-sm">·</span>
                <span className="text-gray-font text-sm">
                  review {salonInfo.reviewCount}
                </span>
                <span className="text-gray-font text-sm">·</span>
                <span className="text-gray-font text-sm">
                  {salonInfo.distance}
                </span>
              </div>
              <div className="text-gray-font text-sm">
                {salonInfo.languages}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
