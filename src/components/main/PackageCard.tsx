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
      className="bg-transparent border-0 cursor-pointer flex-1"
      onClick={() => onClick(packageId)}
    >
      <CardContent className="p-0 bg-white/10 rounded-[8px]">
        <div className="flex flex-col">
          <div className="relative w-full h-[200px] bg-gray rounded-t-lg overflow-hidden">
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              className="object-cover"
            />
          </div>
          <div className="p-2">
            <p className="text-xs gap-1 flex items-center text-gray-400">
              <span className="text-black">♫</span>
              <span>{artist}</span>
              <span>·</span>
              <span>{location}</span>
            </p>
            <GapY size={4} />
            <h3 className="font-medium text-white text-sm leading-tight">
              {title}
            </h3>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
