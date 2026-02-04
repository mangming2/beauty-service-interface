import { Card, CardContent } from "@/components/ui/card";
import { GapY } from "@/components/ui/gap";
import Image from "next/image";

interface PackageCardProps {
  packageId: number; // ✏️ string → number
  imageSrc: string;
  imageAlt: string;
  title: string; // name을 받아서 title로 표시
  tags: string[]; // ✏️ artist → tags (tagNames)
  minPrice: number; // ✏️ location → minPrice
  onClick: (packageId: number) => void; // ✏️ string → number
  /** LCP 이미지일 때 true */
  priority?: boolean;
}

export default function PackageCard({
  packageId,
  imageSrc,
  imageAlt,
  title,
  tags,
  minPrice,
  onClick,
  priority = false,
}: PackageCardProps) {
  // 가격 포맷팅 (예: 100000 → ₩100,000)
  const formattedPrice = `₩${minPrice.toLocaleString()}~`;

  return (
    <Card
      className="bg-transparent border-0 cursor-pointer w-[168px] pt-0 pb-2"
      onClick={() => onClick(packageId)}
    >
      <CardContent className="p-0 bg-gray-container rounded-[8px]">
        <div className="flex flex-col">
          <div className="relative w-[168px] h-[168px] bg-gray rounded-t-lg overflow-hidden">
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              sizes="168px"
              priority={priority}
              className="object-cover rounded-t-lg"
            />
          </div>
          <div className="px-2 py-1">
            <p className="text-xs gap-1 flex items-center text-gray-400">
              <span className="max-w-[121px] overflow-hidden text-ellipsis whitespace-nowrap">
                🏷️ {tags.slice(0, 2).join(" · ") || "No tags"}
              </span>
            </p>
            <GapY size={4} />
            <h3 className="font-medium text-white text-lg h-7 overflow-hidden text-ellipsis whitespace-nowrap">
              {title}
            </h3>
            <p className="text-sm text-pink-400 font-medium">
              {formattedPrice}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
