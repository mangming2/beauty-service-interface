import { Card, CardContent } from "@/components/ui/card";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { ReactNode } from "react";
import { MusicIcon } from "../common/Icons";

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
      <Card className="flex py-2 bg-transparent border-0 cursor-pointer hover:bg-gray-800/20 transition-colors">
        <CardContent className="px-0">
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
              <div className="flex text-sm text-gray-400">
                <MusicIcon color="#ABA9A9" />
                <span className="ml-1">{artist} 아티스트?</span>
                <span className="mx-1">·</span>
                <span>{location} 장소?</span>
              </div>
              <p className="text-md text-white">{description}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
