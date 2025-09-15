import { Card, CardContent } from "@/components/ui/card";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { ReactNode } from "react";

interface TrendCardProps {
  title: ReactNode;
  artist: ReactNode;
  location: ReactNode;
  description: ReactNode;
  imageSrc: string | StaticImageData;
  id: string;
}

export function TrendCard({
  title,
  artist,
  location,
  description,
  imageSrc,
  id,
}: TrendCardProps) {
  return (
    <Link href={`/package/${id}`}>
      <Card className="flex py-[8px] bg-transparent border-0 cursor-pointer hover:bg-gray-800/20 transition-colors">
        <CardContent className="py-4 px-0">
          <div className="flex gap-3">
            <div className="relative w-[92px] h-[92px] bg-gray rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
              <Image
                src={imageSrc}
                alt={typeof title === "string" ? title : "Trend"}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex flex-col flex-1 gap-y-[8px]">
              <h3 className="font-medium text-white title-sm">{title}</h3>
              <p className="text-xs text-gray-400">
                ♫ {artist} · {location}
              </p>
              <p className="text-md text-white">{description}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
