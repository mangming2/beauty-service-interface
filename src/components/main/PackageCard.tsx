import { Card, CardContent } from "@/components/ui/card";
import { GapY } from "@/components/ui/gap";
import Image from "next/image";

interface PackageCardProps {
  packageId: string;
  imageSrc: string;
  imageAlt: string;
  artist: string;
  location: string;
  title: string;
  onClick: (packageId: string) => void;
}

export default function PackageCard({
  packageId,
  imageSrc,
  imageAlt,
  artist,
  location,
  title,
  onClick,
}: PackageCardProps) {
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
              className="object-cover rounded-t-lg"
            />
          </div>
          <div className="px-2 py-1">
            <p className="text-xs gap-1 flex items-center text-gray-400">
              <span className="max-w-[121px] overflow-hidden text-ellipsis whitespace-nowrap">
                🎵 {artist} · {location}
              </span>
            </p>
            <GapY size={4} />
            <h3 className="font-medium text-white text-lg h-7 overflow-hidden text-ellipsis whitespace-nowrap">
              {title}
            </h3>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
