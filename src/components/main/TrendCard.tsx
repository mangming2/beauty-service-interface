import { Card, CardContent } from "@/components/ui/card";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { ReactNode } from "react";
import { getSafeImageSrc } from "@/lib/utils";

const DESCRIPTION_MAX_CHARS = 80;

function truncateDescriptionText(text: string, maxLen: number): string {
  const trimmed = text.trim();
  if (trimmed.length <= maxLen) return trimmed;
  return `${trimmed.slice(0, maxLen).replace(/\s+$/, "")}...`;
}

function formatDescription(description: ReactNode): ReactNode {
  if (typeof description !== "string") return description;
  return truncateDescriptionText(description, DESCRIPTION_MAX_CHARS);
}

interface TrendCardProps {
  title: ReactNode;
  location: ReactNode;
  description: ReactNode;
  imageSrc: string | StaticImageData;
  id: string;
}

export function TrendCard({
  title,
  location,
  description,
  imageSrc,
  id,
}: TrendCardProps) {
  const displayDescription = formatDescription(description);
  const safeSrc =
    typeof imageSrc === "string" ? getSafeImageSrc(imageSrc) : imageSrc;

  return (
    <Link href={`/package/${id}`}>
      <Card className="flex py-3 bg-transparent border-0 cursor-pointer hover:bg-gray-800/20 transition-colors rounded-none">
        <CardContent className="px-0 w-full">
          <div className="flex items-start gap-4">
            <div className="relative size-[100px] shrink-0 overflow-hidden rounded-lg bg-gray">
              <Image
                src={safeSrc}
                alt={typeof title === "string" ? title : "Trend"}
                fill
                className="object-cover"
                sizes="100px"
                unoptimized={
                  typeof safeSrc === "string" && safeSrc.startsWith("http")
                }
              />
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-1.5 text-left">
              <h3 className="title-md font-semibold uppercase tracking-wide text-white">
                {title}
              </h3>
              <p className="text-sm font-medium text-gray-400">{location}</p>
              <p className="text-sm font-medium leading-snug text-white">
                {displayDescription}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
