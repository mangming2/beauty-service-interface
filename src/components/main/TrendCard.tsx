import { Card, CardContent } from "@/components/ui/card";
import Image, { StaticImageData } from "next/image";
import { ReactNode } from "react";

interface TrendCardProps {
  title: ReactNode;
  artist: ReactNode;
  location: ReactNode;
  description: ReactNode;
  imageSrc: string | StaticImageData;
}

export function TrendCard({
  title,
  artist,
  location,
  description,
  imageSrc,
}: TrendCardProps) {
  return (
    <Card className="flex py-[8px] bg-transparent border-0">
      <CardContent className="p-4">
        <div className="flex gap-3">
          <div className="relative w-[91px] h-[91px] bg-gray rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
            <Image
              src={imageSrc}
              alt={typeof title === "string" ? title : "Trend"}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-white text-sm">{title}</h3>
            <p className="text-xs text-gray-400">
              ♫ {artist} · {location}
            </p>
            <p className="text-xs text-gray-300 mt-1">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
